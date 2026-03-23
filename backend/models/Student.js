import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    rollNumber: {
      type: String,
      required: true,
      unique: true
    },

    department: {
      type: String
    },

    image: {
      type: String
    }
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;