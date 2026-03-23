import axios from "axios";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const ML_PORT=process.env.ML_PORT || "http://localhost:5000";

// recognize face
export const recognizeFace = async (req, res) => {
  try {
    const { image } = req.body;

    const response = await fetch(`${ML_PORT}/recognize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image }),
    });

    const data = await response.json();

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Recognition failed" });
  }
};


// train ML model
export const trainModel = async (req, res) => {
  try {

    const response = await axios.post(
      `${ML_PORT}/train`
    );

    res.json(response.data);

  } catch (error) {
    res.status(500).json({ error: "Model training failed" });
  }
};