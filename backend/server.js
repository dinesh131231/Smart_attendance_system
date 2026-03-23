import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoute.js";
import studentRoutes from "./routes/studentsRoute.js";
import attendanceRoutes from "./routes/attendanceRoute.js";
import faceRoutes from "./routes/faceRoute.js";

import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/face", faceRoutes);

// home route
app.get("/", (req, res) => {
  res.send("this is home");
});

// login test route
app.get("/login", (req, res) => {
  res.send("this is login");
});

// connect database
connectDB();

// start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// error handler
server.on("error", (err) => {
  console.error("Server failed to start:", err.message);
});