import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PORT = import.meta.env.VITE_PORT || "http://localhost:3000";
const API = `${PORT}/api/auth/register`;

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("student"); // default
  const [adminKey, setAdminKey] = useState("");

  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(API, {
        name,
        email,
        password,
        adminKey,
      });
      setMessage("Registration successful ✅");
      navigate("/login", { replace: true });

    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">

      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-80">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Register
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Name"
            className="p-2 rounded bg-gray-700 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="p-2 rounded bg-gray-700 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="p-2 rounded bg-gray-700 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Admin Key (optional)"
            className="p-2 rounded bg-gray-700 outline-none"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
          />
          <select
            className="p-2 rounded bg-gray-700 outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 p-2 rounded font-semibold"
          >
            Register
          </button>

        </form>

        {message && (
          <p className="mt-4 text-center text-sm">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default Register;