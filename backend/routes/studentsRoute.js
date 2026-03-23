import express from "express";
import {
  addStudent,
  getStudents,
  deleteAllStudent,
  deleteStudent
} from "../controllers/studentController.js";
import allowRoles from "../middleware/roleMiddleware.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// add student
router.post("/", authMiddleware,allowRoles("admin"),addStudent);

// get all students
router.get("/",authMiddleware,allowRoles("admin") ,getStudents);

// delete student
router.delete("/:id", authMiddleware,allowRoles("admin"),deleteStudent);

// delete all students
router.delete("/delete-all", authMiddleware,allowRoles("admin"),deleteAllStudent);


export default router;