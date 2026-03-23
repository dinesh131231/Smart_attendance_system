import jwt from "jsonwebtoken";

const token = jwt.sign(
  { id: user._id, name: user.name ,role: user.role},
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

res.json({ token });