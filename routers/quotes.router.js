import { Router } from "express";
import { protect } from "../middlewares/protect.js";
import { upload } from "../middlewares/multer.js";
import { quoteUpdate, getQuote } from "../controllers/quotes.controller.js";

const quoteRouter = Router();

quoteRouter.put("/update", protect, upload.single("cover"), quoteUpdate);

quoteRouter.get("/", protect, getQuote);

export default quoteRouter;
