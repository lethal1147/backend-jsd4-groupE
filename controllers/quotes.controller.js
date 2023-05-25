import Quote from "../models/quote.model.js";
import { cloudinaryUploadQuote } from "../utils/upload.js";

export const quoteUpdate = async (req, res) => {
  const user_ID = req.user.info._id;

  if (req.file) {
    try {
      const uploadedImage = await cloudinaryUploadQuote(req.file);
      const quote = await Quote.findOneAndUpdate(
        {
          userID: user_ID,
        },
        {
          quote: req.body.quote,
          emoji: req.body.emoji,
          cover: uploadedImage.url,
          coverId: uploadedImage.publicId,
        },
        {
          upsert: true,
          new: true,
        }
      );

      return res.json("quote updated successfully");
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  } else {
    try {
      const quote = await Quote.findOneAndUpdate(
        {
          userID: user_ID,
        },
        {
          quote: req.body.quote,
          emoji: req.body.emoji,
        },
        {
          upsert: true,
          new: true,
        }
      );

      return res.json("quote updated successfully");
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  }
};

export const getQuote = async (req, res) => {
  const user_ID = req.user.info._id;
  try {
    const quote = await Quote.findOne({ userID: user_ID });

    if (!quote) {
      return res.status(201).send("Quote not found");
    }

    return res.json({ data: quote });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
