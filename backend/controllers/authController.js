import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();


const secretKey=process.env.JWT_SECRET;
const expiresIn=process.env.JWT_EXPIRES_IN;
// Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password,adminKey } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }
    let role = "student"; // default role
    if (adminKey && adminKey === process.env.ADMIN_KEY) {
      role = "admin";
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    })

    res.json({
      message: "User registered",
      user
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// Login
export const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body; // ✅ removed role

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // ✅ include role inside token payload
    const token = jwt.sign(
      { id: user._id, role: user.role },
      secretKey,
      { expiresIn: expiresIn }
    );

    // ✅ ALSO send role separately
    res.json({
      token,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Profile
export const getProfile = async (req, res) => {

  const user = await User.findById(req.user.id).select("-password")

  res.json(user)
}