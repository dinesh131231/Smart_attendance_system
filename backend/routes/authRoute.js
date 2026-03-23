import express from "express";
import { registerUser, loginUser, getProfile } from "../controllers/authController.js";

import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();
// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);
 router.get("/profile",(req,res)=>{
  res.send("this is profile")
 });

// Get logged user profile
router.get("/profile", authMiddleware, getProfile);

export default router;