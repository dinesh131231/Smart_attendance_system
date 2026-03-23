import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const PORT = import.meta.env.VITE_PORT || "http://localhost:3000";

const AddStudent = () => {
    const webcamRef = useRef(null);

    const [name, setName] = useState("");
    const [images, setImages] = useState([]);
    const [message, setMessage] = useState("");
    const [cameraOn, setCameraOn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rollNumber, setRollNumber] = useState("");

    // Start camera
    const startCamera = () => {
        setCameraOn(true);
        setImages([]); // reset previous images
    };

    // Close camera
    const closeCamera = () => {
        setCameraOn(false);
    };

    const capture = () => {
        if (images.length >= 5) {
            setMessage("Maximum 5 images allowed");
            return;
        }

        // ✅ reduce image quality (IMPORTANT)
        const imgSrc = webcamRef.current.getScreenshot({
            width: 640,
            height: 480,
            quality: 0.5, // 🔥 reduce size
        });

        setImages((prev) => [...prev, imgSrc]);
    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || images.length === 0) {
            setMessage("Add name and capture images");
            return;
        }

        setLoading(true); // ✅ start loading
        console.log({ name, rollNumber, images });
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${PORT}/api/students`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${token}`
                },
                body: JSON.stringify({ name, images, rollNumber }), // ✅ send array
            });

            const data = await res.json();

            setMessage(data.message || "Student added");

            setName("");
            setImages([]);
            setCameraOn(false);

        } catch (err) {
            setMessage("Error");
        }

        setLoading(false); // ✅ stop loading
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">

                <h2 className="text-2xl font-bold text-center mb-4">
                    Add Student
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Name */}
                    <input
                        type="text"
                        placeholder="Enter student name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="text"
                        placeholder="Enter Roll Number"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        className="w-full p-3 border rounded-lg"
                    />

                    {/* Start Camera */}
                    {!cameraOn && (
                        <button
                            type="button"
                            onClick={startCamera}
                            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
                        >
                            Start Camera
                        </button>
                    )}

                    {/* Webcam Section */}
                    {cameraOn && (
                        <div className="flex flex-col items-center space-y-3">

                            <Webcam
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                screenshotQuality={0.5} // 🔥 compress here also
                            />


                            <div className="flex gap-3">
                                {/* Capture */}
                                <button
                                    type="button"
                                    onClick={capture}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                >
                                    Capture
                                </button>

                                {/* Close Camera */}
                                <button
                                    type="button"
                                    onClick={closeCamera}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                >
                                    Close Camera
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Preview */}
                    {images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                            {images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt="preview"
                                    className="rounded-lg"
                                />
                            ))}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 flex justify-center items-center"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "Add Student"
                        )}
                    </button>

                    {/* Message */}
                    {message && (
                        <p className="text-center text-sm text-gray-700">
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AddStudent;