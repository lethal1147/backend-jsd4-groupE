import mongoose from "mongoose";
const { Schema } = mongoose;

//Define Schema
const quoteSchema = new Schema(
  {
    quote: {
      type: "string",
      required: true,
    },
    emoji: {
      type: "string",
      required: true,
    },
    cover: {
      type: "string",
      required: false,
    },
    coverId: {
      type: "string",
      required: false,
    },
    userID: {
      type: "string",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Quote", quoteSchema);
