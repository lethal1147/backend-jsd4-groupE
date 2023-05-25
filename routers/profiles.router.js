import { Router } from "express";
import {
  getUser,
  deleteUserAccount,
  editProfile,
} from "../controllers/profiles.controller.js";
import { upload } from "../middlewares/multer.js";
import { protect } from "../middlewares/protect.js";

const profileRouter = Router();

profileRouter.get("/", protect, getUser);
profileRouter.delete("/delete", protect, deleteUserAccount);
profileRouter.put("/update", protect, upload.single("picture"), editProfile);

export default profileRouter;
