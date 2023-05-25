import { Router } from "express";
import { protect } from "../middlewares/protect.js";
import { upload } from "../middlewares/multer.js";
import {
  postActivities,
  getActivity,
  deleteActivity,
  getSingleActivity,
  updateActivity,
  countActivity
} from "../controllers/activities.controller.js";

const activitiesRouter = Router();

activitiesRouter.post(
  "/createActivityCard",
  protect,
  upload.single("img"),
  postActivities
);
activitiesRouter.get("/", protect, getActivity);
activitiesRouter.get("/:id", getSingleActivity);
activitiesRouter.get("/count/:id",protect, countActivity);
activitiesRouter.put("/updatecard/:id",protect,upload.single("img") , updateActivity);
activitiesRouter.delete("/:id", protect, deleteActivity);

export default activitiesRouter;
