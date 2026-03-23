import express from "express";
import {
  markAttendance,
  getAttendance,
  clearAttendance
} from "../controllers/attendanceController.js";
import ipRestriction from "../middleware/ipRestriction.js";
import authMiddleware from "../middleware/authmiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// mark attendance
router.post("/mark", ipRestriction, authMiddleware, allowRoles("student"),markAttendance);

// get attendance
router.get("/", ipRestriction, getAttendance);

//clear attendance
router.post("/clear", clearAttendance);

export default router;