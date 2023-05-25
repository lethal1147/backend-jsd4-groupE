import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.js";

const authRouter = Router();

authRouter.post("/register", upload.single("picture"), register);

authRouter.post("/login", login);

export default authRouter;
