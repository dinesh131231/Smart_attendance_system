import Student from "../models/Student.js";
import { trainModel, sendToML } from "../services/mlService.js";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const ML_PORT = process.env.ML_PORT || "http://localhost:5000";

// Add student
export const addStudent = async (req, res) => {
  try {
    const { name, rollNumber, images } = req.body;
    console.log(req.body);

    if (!name || !rollNumber || !images || images.length === 0) {
      return res.status(400).json({ message: "Missing data" });
    }

    // ✅ Send images directly to ML (no local saving)
    const mlResponse = await sendToML(name, rollNumber, images);

    if (!mlResponse) {
      return res.status(500).json({ message: "ML service failed" });
    }

    // 💾 Save only metadata in DB
    // const student = await Student.create({
    //   name,
    //   rollNumber,
    //   imageCount: images.length, // optional
    // });
    const student = await Student.findOneAndUpdate(
      { rollNumber: rollNumber },
      {
        $set: { name: name },
        $push: { images: { $each: images } }, // 🔥 append images
        $inc: { imageCount: images.length }
      },
      {
        returnDocument: "after", // 🔥 new replacement
        upsert: true
      }
    );
    console.log({ name, rollNumber, imagesLength: images.length });

    // 🔥 Train model after adding student
    await trainModel(name, rollNumber, images);

    res.status(201).json({
      message: "Student added & model trained",
      student,
    });

  } catch (error) {
    console.error(error);

    // ✅ Handle duplicate rollNumber error
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Roll number already exists",
      });
    }

    res.status(500).json({ error: error.message });
  }
};


// Get all students
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);





    if (!student) {
      return res.status(404).json({ message: "Student not found ❌" });
    }

    // 🔥 call ML service from backend ONLY
    await fetch(`${ML_PORT}/delete-student/${student.name}_${student.rollNumber}`, {
      method: "DELETE",
    });

    // 🔥 delete from DB
    await Student.findByIdAndDelete(req.params.id);

    await fetch(`${ML_PORT}/train`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}) // send empty JSON
    });

    res.json({ message: "Student deleted ✅" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete all students

export const deleteAllStudent = async (req, res) => {
  try {
    console.log("🔥 Delete All API hit");

    await Student.deleteMany({});
    console.log("✅ DB cleared");

    try {
      console.log("👉 Calling ML delete-all...");
      const mlRes = await fetch(`${ML_PORT}/delete-all`, {
        methods: "DELETE",
      });
      console.log("ML response status:", mlRes.status);
    } catch (mlError) {
      console.error("ML delete-all failed:", mlError.message);
    }

    try {
      console.log("👉 Calling ML train...");
      const trainRes = await fetch(`${ML_PORT}/train`, { method: "POST" });
      console.log("Train status:", trainRes.status);
    } catch (trainError) {
      console.error("ML train failed:", trainError.message);
    }

    res.json({ message: "All students deleted ✅" });

  } catch (error) {
    console.error("❌ DeleteAll Error:", error);
    res.status(500).json({ error: error.message });
  }
};