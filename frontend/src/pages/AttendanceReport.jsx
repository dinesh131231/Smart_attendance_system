import { useEffect, useState } from "react";
import axios from "axios";

const PORT = import.meta.env.VITE_PORT || "http://localhost:3000";
const API = `${PORT}/api/students`;

function AttendanceReport() {
  const [students, setStudents] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [clearing, setClearing] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(API);
      setStudents(res.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
    const interval = setInterval(fetchStudents, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Calls backend to reset all attendance to Absent
  const clearAttendance = async () => {
    setClearing(true);
    try {
      await axios.post(`${PORT}/api/attendance/clear`);
      await fetchStudents(); // ✅ fetch fresh data immediately after clear
      setConfirmClear(false);
    } catch (err) {
      console.error("Clear error:", err);
    }
    setClearing(false);
  };

  const presentCount = students.filter(s => s.attendance?.status === "Present").length;
  const absentCount = students.length - presentCount;


  // delete function
  const deleteStudent = async (id) => {
    try {
      await axios.delete(`${PORT}/api/students/${id}`);

      // 🔥 update UI instantly
      setStudents(prev => prev.filter(s => s._id !== id));

    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  //delete all

  const deleteAllStudents = async () => {
    if (!window.confirm("⚠️ Delete ALL students?")) return;

    try {
      await axios.delete(`${PORT}/api/students/delete-all`);

      setStudents([]); // 🔥 clear UI instantly

    } catch (err) {
      console.error("Delete all error:", err);
    }
  };
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              Attendance Report
            </h1>
            {lastUpdated && (
              <p className="text-gray-500 text-sm mt-1">
                Last updated: {lastUpdated}
              </p>
            )}
          </div>

          {/* Right side — badges + buttons */}
          <div className="flex items-center gap-3 flex-wrap">

            <div className="bg-gray-800 border border-gray-700 rounded-xl px-5 py-3 text-center">
              <p className="text-2xl font-bold text-white">{students.length}</p>
              <p className="text-xs text-gray-400 mt-1">Total</p>
            </div>
            <div className="bg-green-900/40 border border-green-700 rounded-xl px-5 py-3 text-center">
              <p className="text-2xl font-bold text-green-400">{presentCount}</p>
              <p className="text-xs text-green-500 mt-1">Present</p>
            </div>
            <div className="bg-red-900/40 border border-red-700 rounded-xl px-5 py-3 text-center">
              <p className="text-2xl font-bold text-red-400">{absentCount}</p>
              <p className="text-xs text-red-500 mt-1">Absent</p>
            </div>

            {/* Refresh */}
            <button
              onClick={fetchStudents}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-semibold transition"
            >
              🔄 Refresh
            </button>

            {/* Clear with confirm */}
            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                className="bg-gray-700 hover:bg-red-700 border border-gray-600 hover:border-red-500 px-4 py-2 rounded-xl text-sm font-semibold transition"
              >
                🗑️ Clear
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-red-900/40 border border-red-600 px-4 py-2 rounded-xl">
                <span className="text-sm text-red-300 font-medium">Sure?</span>
                <button
                  onClick={clearAttendance}
                  disabled={clearing}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-xs font-bold transition disabled:opacity-50"
                >
                  {clearing ? "Clearing..." : "Yes"}
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded-lg text-xs font-bold transition"
                >
                  No
                </button>
              </div>
            )}
            <button
              onClick={deleteAllStudents}
              className="bg-red-600 hover:bg-red-700 border border-red-500 px-4 py-2 rounded-xl text-sm font-semibold transition"
            >
              ⚠️ Delete All Students
            </button>

          </div>
        </div>

        {/* Student Cards */}
        {students.length === 0 ? (
          <div className="text-center text-gray-500 py-20 text-lg">
            No students found
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {students.map((student, index) => {
              const isPresent = student.attendance?.status === "Present";
              return (
                <div
                  key={student._id}
                  className={`flex items-center justify-between px-6 py-4 rounded-xl border transition-all
                    ${isPresent
                      ? "bg-gray-900 border-gray-700 hover:border-green-600"
                      : "bg-gray-900 border-gray-700 hover:border-red-600"
                    }`}
                >
                  {/* Left */}
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-sm font-bold text-gray-400">
                      {index + 1}
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                      ${isPresent ? "bg-green-800 text-green-300" : "bg-red-900 text-red-300"}`}>
                      {student.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-base leading-tight">
                        {student.name}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Roll No: {student.rollNumber}
                      </p>
                    </div>
                  </div>

                  {/* Right — status */}
                  <div className="flex items-center gap-3">

                    {/* Status */}
                    {isPresent ? (
                      <span className="flex items-center gap-2 bg-green-500/20 text-green-400 border border-green-600 px-4 py-1.5 rounded-full text-sm font-semibold">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
                        Present
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 bg-red-500/20 text-red-400 border border-red-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                        <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                        Absent
                      </span>
                    )}

                    {/* 🔥 Delete Button */}
                    <button
                      onClick={() => deleteStudent(student._id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-xs font-bold transition"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default AttendanceReport;



