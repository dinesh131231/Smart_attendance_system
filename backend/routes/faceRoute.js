import express from "express";
import { recognizeFace, trainModel } from "../controllers/faceController.js";

const router = express.Router();

// recognize face from webcam image
router.post("/recognize", recognizeFace);

// train model after adding new students
router.post("/train", trainModel);

export default router;