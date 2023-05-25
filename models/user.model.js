import mongoose from "mongoose";

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    birthDate: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    picture: {
      type: String,
      required: false,
    },
    weight: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    rank: {
      type: Number,
      required: false,
    },
  },
  {
    collection: "user",
  }
);

export default mongoose.model("User", userSchema);
