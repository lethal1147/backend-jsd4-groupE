import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cloudinaryUploadProfile } from "../utils/upload.js";

export const register = async (req, res) => {
  const height = Number(req.body.height);
  const weight = Number(req.body.weight);
  if (req.file) {
    try {
      const uploadedImage = await cloudinaryUploadProfile(req.file);
      // console.log(req.body)
      const { email, password } = req.body;

      // Check that email must be unique
      const isUniqueEmail = await User.findOne({ email });
      if (isUniqueEmail) {
        return res
          .status(400)
          .json({ message: "This email already registered" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        ...req.body,
        password: hashedPassword,
        weight: weight,
        height: height,
        picture: uploadedImage,
        rank: 0,
      });
      await user.save();
      res.status(201).send({ message: "Create user succesfully" });
    } catch (err) {
      res.status(403).send({ message: err.message });
    }
  } else {
    try {
      // console.log(req.body)
      const { email, password } = req.body;

      // Check that email must be unique
      const isUniqueEmail = await User.findOne({ email });
      if (isUniqueEmail) {
        return res
          .status(400)
          .send({ message: "This email already registered" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        ...req.body,
        password: hashedPassword,
        weight: weight,
        height: height,
        picture: "",
        rank: 0,
      });
      await user.save();
      res.status(201).send({ message: "Create user succesfully" });
    } catch (err) {
      res.status(403).send({ message: err.message });
    }
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "Wrong password or email meow!",
      });
    }
    // if(req.body.password === user.password)
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isValidPassword) {
      return res.status(400).json({
        message: "Wrong password or email meow!",
      });
    }

    const { password, birthDate, gender, ...info } = user._doc;

    const token = jwt.sign({ info }, process.env.SECRET_KEY, {
      expiresIn: "3600000",
    });

    return res.json({ message: "login successfully", token });
  } catch (err) {
    return res
      .status(400)
      .json({
        message: "Something went wrong!!",
      })
      .send(err.message);
  }
};
