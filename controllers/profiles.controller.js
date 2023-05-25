import User from "../models/user.model.js";
import { cloudinaryUploadProfile } from "../utils/upload.js";
import Activity from "../models/activity.model.js";

// delete user account
export const deleteUserAccount = async (req, res) => {
  try {
    const { email, password } = req.body;
    // assign req.user to variable userid
    const userid = req.user.info._id;
    // Find the user by ID and delete
    const deleteAccount = await User.findByIdAndRemove({ _id: userid });

    const deleteActivity = await Activity.deleteMany({ userID: userid });

    // // Check account for deleting

    if (!deleteAccount) {
      return res.status(404).send({ message: "There is no this account" });
    }
    res.status(200).send({ message: "User account deleted" });
  } catch (err) {
    res
      .status(500)
      .send({ message: err.message + "Failed to delete user account" });
  }
};

export const getUser = async (req, res) => {
  const userid = req.user.info._id;
  try {
    // assign req.user to variable userid
    // Find the user by ID
    const account = await User.findById({ _id: userid });
    // Check account exists
    if (!account) {
      return res.status(404).send({ message: "User not found" });
    }
    return res.json({ data: account });
  } catch (err) {
    res
      .status(500)
      .send({ message: err.message + "Failed to get user account" });
  }
};

// Edit profile
export const editProfile = async (req, res) => {
  if (req.file) {
    try {
      // console.log(req.body)
      const { email, password } = req.body;

      // assign req.user to variable userid
      const userid = req.user.info._id;
      // Find the user by ID
      const account = await User.findById({ _id: userid });

      // Check if the user exists
      if (!account) {
        return res.status(404).send({ message: "User not found" });
      }

      // Check if the email is already registered by another user
      if (email !== account.email) {
        //find user email in database
        const isUniqueEmail = await User.findOne({ email });
        //if find email in database and found response
        if (isUniqueEmail) {
          return res
            .status(400)
            .send({ message: "This email is already registered" });
        }
      }

      //upload picture profile
      const uploadedImage = await cloudinaryUploadProfile(req.file);
      // Update other profile fields
      account.password = req.body.password;
      account.email = email || account.email;
      account.firstName = req.body.firstName || account.firstName;
      account.lastName = req.body.lastName || account.lastName;
      account.birthDate = req.body.birthDate || account.birthDate;
      account.gender = req.body.gender || account.gender;
      account.picture = uploadedImage;
      account.weight = req.body.weight || account.weight;
      account.height = req.body.height || account.height;
      account.rank = req.body.rank

      await account.save();

      const data = {
        firstName: account.firstName,
        lastName: account.lastName,
        weight: account.weight,
        height: account.height,
        email: account.email,
        picture: account.picture,
        rank: account.rank,
      };

      res.status(200).send({ message: "Profile updated successfully", data });
    } catch (err) {
      res
        .status(500)
        .send({ message: err.message + "Failed to update user account" });
    }
  } else {
    try {
      // console.log(req.body)
      const { email, password } = req.body;

      // assign req.user to variable userid
      const userid = req.user.info._id;
      // Find the user by ID
      const account = await User.findById({ _id: userid });

      // Check if the user exists
      if (!account) {
        return res.status(404).send({ message: "User not found" });
      }

      // Check if the email is already registered by another user
      if (email !== account.email) {
        //find user email in database
        const isUniqueEmail = await User.findOne({ email });
        //if find email in database and found response
        if (isUniqueEmail) {
          return res
            .status(400)
            .send({ message: "This email is already registered" });
        }
      }

      // Update other profile fields
      account.password = req.body.password;
      account.email = email || account.email;
      account.firstName = req.body.firstName || account.firstName;
      account.lastName = req.body.lastName || account.lastName;
      account.birthDate = req.body.birthDate || account.birthDate;
      account.gender = req.body.gender || account.gender;
      account.picture = account.picture;
      account.weight = req.body.weight || account.weight;
      account.height = req.body.height || account.height;
      account.rank = req.body.rank

      await account.save();

      const data = {
        firstName: account.firstName,
        lastName: account.lastName,
        weight: account.weight,
        height: account.height,
        email: account.email,
        picture: account.picture,
        rank: account.rank,
      };

      res.status(200).send({ message: "Profile updated successfully", data });
    } catch (err) {
      res
        .status(500)
        .send({ message: err.message + "Failed to update user account" });
    }
  }
};
