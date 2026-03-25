import { Link } from "react-router-dom";
import { FaUserPlus, FaCamera, FaChartBar, FaSignOutAlt, FaSignInAlt, FaUserShield } from "react-icons/fa";

function Dashboard() {
  const role = localStorage.getItem("role");




  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">

      {/* Header */}
      <h1 className="text-4xl font-extrabold text-center mb-10 tracking-wide">
        🎯 Smart Attendance Dashboard
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* 👨‍💼 ADMIN ONLY */}
        
          <Link to="/AddStudent">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl hover:scale-105 hover:bg-gray-700 transition duration-300">
              <FaUserPlus className="text-3xl text-green-400 mb-4" />
              <h2 className="text-xl font-semibold">Add Student</h2>
              <p className="text-gray-400">Register new student with face data</p>
            </div>
          </Link>
        

        {/* 👨‍💼 + 👨‍🎓 BOTH */}
        {/* <Link to="/attendance">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl hover:scale-105 hover:bg-gray-700 transition duration-300">
            <FaCamera className="text-3xl text-blue-400 mb-4" />
            <h2 className="text-xl font-semibold">Take Attendance</h2>
            <p className="text-gray-400">Start face recognition</p>
          </div>
        </Link> */}

        {/* 👨‍💼 ADMIN ONLY */}
        
          <Link to="/AttendanceReport">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl hover:scale-105 hover:bg-gray-700 transition duration-300">
              <FaChartBar className="text-3xl text-yellow-400 mb-4" />
              <h2 className="text-xl font-semibold">Attendance Reports</h2>
              <p className="text-gray-400">View attendance records</p>
            </div>
          </Link>
        

        {/* 👨‍🎓 STUDENT ONLY */}
       
          <Link to="/student">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl hover:scale-105 hover:bg-gray-700 transition duration-300">
              <FaChartBar className="text-3xl text-green-400 mb-4" />
              <h2 className="text-xl font-semibold">Attendance</h2>
              <p className="text-gray-400">Add Attendance</p>
            </div>
          </Link>
        

      </div>

      {/* Logout */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/login";
          }}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl shadow-lg transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

    </div>
  );
}

export default Dashboard;