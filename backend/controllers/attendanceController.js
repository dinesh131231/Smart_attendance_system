import Attendance from "../models/Attendance.js"
import Student from "../models/Student.js"

// Mark attendance
export const markAttendance = async (req, res) => {
  try {
    const { name } = req.body;

    const student = await Student.findOne({
      name,
      rollNumber
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.attendance.status = "Present";
    await student.save();

    student.attendance = {
      date: new Date(),
      status: "Present"
    };

    await student.save();

    res.json({ message: "Attendance marked" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ✅ clear attendance
export const clearAttendance = async (req, res) => {
  try {
    await Student.updateMany(
      {},
      { $set: { "attendance.status": "Absent" } }
    );
    res.json({ message: "Attendance cleared successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all attendance
export const getAttendance = async (req, res) => {

  const data = await Attendance.find()

  res.json(data)
}