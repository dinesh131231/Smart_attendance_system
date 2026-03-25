import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const PORT = import.meta.env.VITE_PORT || "http://localhost:3000";
const API = `${PORT}/api/auth/login`;

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");


  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(API, {
        email,
        password,
      });

      setMessage("Login successful ✅");

      // store token (if backend sends it)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "student") {
        navigate("/", { replace: true });
      } else if (res.data.role === "admin") {
        navigate("/", { replace: true });
      } else {

        navigate("/login", { replace: true });
      }
      window.location.reload();

    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">

      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-80">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

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

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 p-2 rounded font-semibold"
          >
            Login
          </button>
          <p className="text-center text-sm mt-4 text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-green-400 hover:underline font-semibold"
            >
              Register
            </Link>
          </p>
          <div className="mt-4 flex justify-center">
            <Link to="/">
              <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm">
                ⬅️ Home
              </button>
            </Link>
          </div>

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

export default Login;