import Activity from "../models/activity.model.js";
import User from "../models/user.model.js"
import { cloudinaryUploadCard } from "../utils/upload.js";

export const postActivities = async (req, res) => {

  let image = "https://res.cloudinary.com/dtcqqdjua/image/upload/v1684829449/orangecat/dafaultIMG/og_nermoe.jpg";
  if (req.file) {
    image = await cloudinaryUploadCard(req.file)
  }
  
  try {
      const newActivity = new Activity({
        title: req.body.title,
        date: req.body.date,
        type: req.body.type,
        timeStart: req.body.timeStart,
        timeEnd: req.body.timeEnd,
        duration: req.body.duration,
        task: req.body.task,
        caption: req.body.caption,
        img: image,
        exp: req.body.exp,
        userID: req.body.userID,
      });
      console.log(`this is ${newActivity}`);

      const user = await User.findById(newActivity.userID)
      console.log(user)
      
      const nextRank = user.rank + newActivity.exp;
      console.log(user)
      user.rank = nextRank;
      console.log(user)
      await newActivity.save();
      await user.save()

      return res.status(200).json({message: "activity card created successfully", rank: nextRank});
    } catch (err) {
      console.log(err);
      res.status(500).send("Creating activity card failed");
    }
};

export const getActivity = async (req, res) => {
  const { page, limit } = req.query;
  // console.log(req.user.info._id);
  try {
    const user_ID = req.user.info._id;
    const activities = await Activity.find({ userID: user_ID })
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .exec();

    // find total document of activity
    const totalDocs = await Activity.find({ userID: user_ID }).countDocuments();

    if (!activities) {
      return res.status(404).send("Activity not found");
    }

    return res.json({ data: activities, totalDocs: totalDocs });
  } catch (err) {
    console.log(err);
    res.status(500).send("Failed to get activity");
  }
};


export const getSingleActivity = async (req, res) => {
  console.log(req.params)
  try {
    const { id } = req.params;
    console.log(`This is : ${id}`);
    

    const singleActivity = await Activity.findById(id);

    console.log(`single activity: ${singleActivity}`)

    if (!singleActivity) {
      return res.status(404).send("Activity not found")
    }

    return res.json(singleActivity)
  } catch (err) {
    console.log(err)
    res.status(500).send("failed to fetch activity")
  }
};

export const updateActivity = async (req, res) => {
  const { id } = req.params;

  if (req.file) {
    try {
      const uploadedImage = await cloudinaryUploadCard(req.file);
      console.log(uploadedImage);

      const updatedActivity = {
        title: req.body.title,
        date: req.body.date,
        type: req.body.type,
        timeStart: req.body.timeStart,
        timeEnd: req.body.timeEnd,
        duration: req.body.duration,
        task: req.body.task,
        caption: req.body.caption,
        img: uploadedImage,
        userID: req.body.userID,
      };

      await Activity.findByIdAndUpdate(id, updatedActivity);
      return res.status(200).send("Activity card updated successfully");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Updating activity card failed");
    }
  } else {
    try {
      const updatedActivity = {
        title: req.body.title,
        date: req.body.date,
        type: req.body.type,
        timeStart: req.body.timeStart,
        timeEnd: req.body.timeEnd,
        duration: req.body.duration,
        task: req.body.task,
        caption: req.body.caption,
        img: req.body.img,
        userID: req.body.userID,
      };

      await Activity.findByIdAndUpdate(id, updatedActivity);
      return res.status(200).send("Activity card updated successfully");
    } catch (err) {
      console.log(err);
      return res.status(500).json("Can't update activity card");
    }
  }
};




export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteActivity = await Activity.findByIdAndRemove(id);

    if (!deleteActivity) {
      return res.status(404).send("Activity not found");
    }

    res.status(200).send("Activity deleted successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Deleting activity failed");
  }
};



export const countActivity = async (req, res) => {
  try {
    const userID = req.user.info._id;

    const counts = await Activity.aggregate([
      {
        '$match': {
          'userID': userID
        }
      }, {
        '$group': {
          '_id': '$type', 
          'count': {
            '$sum': 1
          }
        }
      }
    ]);
    // console.log(counts)

    const result = {};
    counts.forEach((count)=> {
      result[count._id] = count.count;
    })

    res.json(result);
  }
  catch (err) {
    console.log(err)
    res.status(500).send("Cannot count activity")
  }
}