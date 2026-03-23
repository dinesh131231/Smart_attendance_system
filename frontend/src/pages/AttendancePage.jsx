// import { useRef, useState, useCallback } from "react";
// import axios from "axios";

// const PORT = import.meta.env.VITE_PORT || "http://localhost:3000";

// function CaptureFace() {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const imageRef = useRef(null); // ✅ always holds latest captured image

//   const [image, setImage] = useState(null);
//   const [result, setResult] = useState(null);
//   const [status, setStatus] = useState("idle"); // idle | loading | success | error
//   const [cameraOn, setCameraOn] = useState(false);

//   // 🎥 Start camera
//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { width: 640, height: 480 },
//       });
//       videoRef.current.srcObject = stream;
//       setCameraOn(true);
//       setResult(null);
//       setImage(null);
//       setStatus("idle");
//     } catch (err) {
//       console.error("Camera error:", err);
//       setStatus("error");
//     }
//   };

//   // 🛑 Stop camera
//   const stopCamera = () => {
//     const stream = videoRef.current?.srcObject;
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//     }
//     if (videoRef.current) videoRef.current.srcObject = null;
//     setCameraOn(false);
//     setImage(null);
//     setResult(null);
//     setStatus("idle");
//   };

//   // 📸 Capture image
//   const captureImage = useCallback(() => {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;

//     if (!video || !canvas) return;

//     canvas.width = 640;
//     canvas.height = 480;

//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(video, 0, 0, 640, 480);

//     const base64Image = canvas.toDataURL("image/jpeg", 0.8);

//     imageRef.current = base64Image; // ✅ update ref immediately
//     setImage(base64Image);          // ✅ update state for display
//   }, []);

//   // 🚀 Send image to backend
//   const sendImage = useCallback(async (retries = 3) => {
//     if (!imageRef.current) {
//       alert("Please capture an image first");
//       return;
//     }

//     setStatus("loading");
//     setResult(null);

//     try {
//       const res = await axios.post(`${PORT}/api/face/recognize`, {
//         image: imageRef.current, // ✅ always latest image from ref
//       });

//       const data = res.data[0];
//       setResult(data);

//       console.log("Label:", data?.label, "Confidence:", data?.confidence, "Valid:", data?.valid);

//       if (data && data.valid && data.label !== "Unknown") {
//         await axios.post(`${PORT}/api/attendance/mark`, {
//           name: data.label,
//         });
//         setStatus("success");
//         alert(`Attendance marked for ${data.label} ✅`);

//       } else if (retries > 0) {
//         setStatus("loading");
//         setTimeout(() => {
//           captureImage();              // ✅ capture fresh image into ref
//           sendImage(retries - 1);      // ✅ send fresh image
//         }, 1500);

//       } else {
//         setStatus("error");
//         alert("Face not recognized ❌");
//       }

//     } catch (err) {
//       console.error("Recognition error:", err);
//       setStatus("error");
//     }
//   }, [captureImage]);

//   // ⚡ Auto: capture + recognize in one click
//   const autoRecognize = useCallback(() => {
//     captureImage();
//     setTimeout(() => sendImage(3), 300); // ✅ small delay to let captureImage finish
//   }, [captureImage, sendImage]);

//   const statusColor = {
//     idle: "text-gray-400",
//     loading: "text-yellow-400",
//     success: "text-green-400",
//     error: "text-red-400",
//   };

//   const statusText = {
//     idle: "Ready",
//     loading: "Recognizing...",
//     success: "Recognized ✅",
//     error: "Not Recognized ❌",
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white px-4">

//       <h1 className="text-3xl font-bold mb-2 tracking-wide">
//         Smart Face Attendance
//       </h1>

//       <p className={`text-sm mb-6 font-medium ${statusColor[status]}`}>
//         {statusText[status]}
//       </p>

//       <div className="bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4 w-full max-w-lg">

//         {/* Video feed */}
//         <div className="relative w-full rounded-xl overflow-hidden border-4 border-blue-500">
//           <video
//             ref={videoRef}
//             autoPlay
//             playsInline
//             muted
//             className="w-full rounded-lg"
//           />
//           {!cameraOn && (
//             <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-gray-500 text-sm">
//               Camera is off
//             </div>
//           )}
//         </div>

//         {/* Buttons */}
//         <div className="flex flex-wrap gap-3 justify-center w-full">

//           {!cameraOn ? (
//             <button
//               onClick={startCamera}
//               className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg font-semibold transition"
//             >
//               Start Camera
//             </button>
//           ) : (
//             <button
//               onClick={stopCamera}
//               className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg font-semibold transition"
//             >
//               Stop Camera
//             </button>
//           )}

//           <button
//             onClick={captureImage}
//             disabled={!cameraOn}
//             className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-40 px-5 py-2 rounded-lg font-semibold transition"
//           >
//             Capture
//           </button>

//           <button
//             onClick={() => sendImage(3)}
//             disabled={!image || status === "loading"}
//             className="bg-blue-500 hover:bg-blue-600 disabled:opacity-40 px-5 py-2 rounded-lg font-semibold transition"
//           >
//             Recognize
//           </button>

//           <button
//             onClick={autoRecognize}
//             disabled={!cameraOn || status === "loading"}
//             className="bg-purple-500 hover:bg-purple-600 disabled:opacity-40 px-5 py-2 rounded-lg font-semibold transition"
//           >
//             Auto
//           </button>

//         </div>

//         {/* Hidden canvas */}
//         <canvas ref={canvasRef} className="hidden" />

//         {/* Captured image preview */}
//         {image && (
//           <div className="w-full text-center">
//             <p className="text-sm text-gray-400 mb-2">Captured Image</p>
//             <img
//               src={image}
//               alt="captured"
//               className="w-48 mx-auto rounded-lg border-2 border-gray-600"
//             />
//           </div>
//         )}

//       </div>

//       {/* Result card */}
//       {result && (
//         <div className="mt-6 bg-gray-800 p-5 rounded-2xl text-center w-full max-w-sm shadow-lg">
//           <h2 className="text-lg font-semibold mb-3">Recognition Result</h2>

//           <div className="flex flex-col gap-2">
//             <p className="text-sm text-gray-400">
//               Name:{" "}
//               <span className={`font-bold text-base ${result.valid ? "text-green-400" : "text-red-400"}`}>
//                 {result.label}
//               </span>
//             </p>

//             <p className="text-sm text-gray-400">
//               Confidence:{" "}
//               <span className="text-blue-400 font-medium">
//                 {result.confidence?.toFixed(2)}
//               </span>
//             </p>

//             <p className="text-sm text-gray-400">
//               Status:{" "}
//               <span className={`font-semibold ${result.valid ? "text-green-400" : "text-red-400"}`}>
//                 {result.valid ? "✅ Valid" : "❌ Unknown"}
//               </span>
//             </p>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

// export default CaptureFace;


import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PORT = import.meta.env.VITE_PORT || "http://localhost:3000";

function CaptureFace() {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  // 🎥 Start camera
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 } // ✅ better resolution
    });
    videoRef.current.srcObject = stream;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };
  // 📸 Capture image (FIXED)
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = 640;
    canvas.height = 480;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, 640, 480);

    // 🔥 reduce size but keep clarity
    const base64Image = canvas.toDataURL("image/jpeg", 0.8);

    setImage(base64Image);
    console.log("Captured image");
  };

  // 🚀 Send image
  const sendImage = async (retries = 3) => {
    try {
      const res = await axios.post(`${PORT}/api/face/recognize`, {
        image: image,
      });

      const data = res.data[0];
      setResult(data);

      if (data && data.valid && data.label !== "Unknown") {
        const [name, roll] = data.label.split("_");

        await axios.post(`${PORT}/api/attendance/mark`, 
         { name,
          rollNumber: roll,
         },

        {headers: {
          Authorization: `Bearer ${token}`
        }
      
      });

      alert(`Attendance marked for ${data.label} ✅`);
      return;

    } else if (retries > 0) {
      setTimeout(() => {
        captureImage();
        sendImage(retries - 1);
      }, 1500);
    } else {
      alert("Face not recognized ❌");
    }

  } catch (err) {
    console.error(err);
  }
};

// const autoRecognize = () => {
//   captureImage();
//   sendImage(3);
// };
// 🛑 Stop camera
const stopCamera = () => {
  const stream = videoRef.current.srcObject;

  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }

  videoRef.current.srcObject = null;
};

const drawBox = (data) => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  const video = videoRef.current;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // draw video frame
  ctx.drawImage(video, 0, 0);

  if (data && data.box) {
    const { x, y, w, h } = data.box;

    // 🎨 color based on confidence
    ctx.strokeStyle = data.valid ? "lime" : "red";
    ctx.lineWidth = 3;

    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = data.valid ? "lime" : "red";
    ctx.font = "18px Arial";

    ctx.fillText(
      `${data.label} (${data.confidence.toFixed(1)})`,
      x,
      y - 10
    );
  }
};

return (
  <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
    <div className="absolute top-5 right-5">
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg shadow-lg"
      >
        Logout
      </button>
    </div>
    <h1 className="text-3xl font-bold mb-6">
      Smart Face Attendance
    </h1>

    <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center">

      <div className="relative">

        <video
          ref={videoRef}
          autoPlay
          // playsInline
          // muted
          className="rounded-lg border-4 border-blue-500 w-[420px]"
        />



      </div>

      <div className="flex gap-4 mt-6">

        <button
          onClick={startCamera}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
        >
          Start Camera
        </button>

        <button
          onClick={captureImage}
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg"
        >
          Capture
        </button>

        <button
          onClick={sendImage}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
        >
          Recognize
        </button>
        <button
          onClick={stopCamera}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
        >
          Stop Camera
        </button>

      </div>

      <canvas ref={canvasRef} className="hidden"></canvas>

      {image && (
        <div className="mt-6 text-center">
          <p className="mb-2 text-lg">Captured Image</p>
          <img
            src={image}
            alt="captured"
            className="w-60 rounded-lg border-2 border-gray-500"
          />
        </div>
      )}

    </div>
    {result && (
      <div className="mt-6 bg-gray-800 p-4 rounded-lg text-center">
        <h2 className="text-xl font-semibold mb-2">
          Recognition Result
        </h2>

        <p>
          Name:{" "}
          <span className="font-bold text-green-400">
            {result.label}
          </span>
        </p>

        <p>
          Confidence:{" "}
          <span className="text-blue-400">
            {result.confidence}
          </span>
        </p>
      </div>
    )}
  </div>
);
}

export default CaptureFace;