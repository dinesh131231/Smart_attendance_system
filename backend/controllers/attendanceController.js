import Attendance from "../models/Attendance.js"
import Student from "../models/Student.js"

// Mark attendance
export const markAttendance = async (req, res) => {
  try {
    console.log("API HIT");              
    console.log("BODY:", req.body);
    const { name, rollNumber } = req.body;

    console.log("Incoming:", name, rollNumber); // debug

    const student = await Student.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
      rollNumber: rollNumber
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found ❌" });
    }

    student.attendance = {
      status: "Present",
      time: new Date()
    };

    await student.save();

    res.json({ message: "Attendance marked ✅", student });

  } catch (err) {
    console.error("Mark Error:", err);
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