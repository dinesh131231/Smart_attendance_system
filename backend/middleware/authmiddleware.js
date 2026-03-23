import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()
const secretKey=process.env.JWT_SECRET;


const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization

  if (!header) {
    return res.status(401).json({ message: "Access denied" })
  }

  try {
    const token = header.split(" ")[1]
    const decoded = jwt.verify(token, secretKey)

    req.user = decoded
    next()

  } catch (error) {
    res.status(401).json({ message: "Invalid token" })
  }
}

export default authMiddleware