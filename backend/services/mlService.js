import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";
import FormData from "form-data";


dotenv.config();
const ML_PORT=process.env.ML_PORT || "http://localhost:6000";

// ✅ Send student data + images to ML
export const sendToML = async (name,roll, images) => {
  
  try {
    const res = await fetch(`${ML_PORT}/add-student`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        roll,
        images, // base64 array
      }),
    });

    if (!res.ok) {
      throw new Error(`ML Error: ${res.status}`);
    }

    const data = await res.json();
    console.log("✅ ML Add Student:", data);

    return data;

  } catch (error) {
    console.error("❌ ML Service Error:", error.message);
    return null;
  }
};



// ✅ OPTIONAL: train model (only if not auto-training)
export const trainModel = async (name, rollNumber, images) => {
  try {
    const res = await fetch(`${ML_PORT}/train`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, rollNumber, images }),
    });

    if (!res.ok) {
      throw new Error(`ML Error: ${res.status}`);
    }

    const data = await res.json();
    console.log("✅ ML Train:", data);

    return data;

  } catch (error) {
    console.error("❌ ML Train Error:", error.message);
    return null;
  }
};