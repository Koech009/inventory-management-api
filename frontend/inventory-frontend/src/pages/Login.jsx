import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.username.trim()) return "Username is required.";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      let user = null;
      let token = null;

      // ✅ Try backend API first
      try {
        const res = await axios.post("http://localhost:5000/auth/login", form);
        user = res.data.user;
        token = res.data.token;
      } catch (apiError) {
        // ✅ Fallback to db.json mock if backend not available
        const res = await axios.get("http://localhost:3001/users");
        user = res.data.find(
          (u) => u.username === form.username && u.password === form.password,
        );
        token = null; // JSON Server doesn’t issue tokens
      }

      if (user) {
        // ✅ Use AuthContext login
        login(user, token);

        // ✅ Clear form after successful login
        setForm({ username: "", password: "" });

        // Redirect based on role
        switch (user.role) {
          case "staff":
            navigate("/dashboard/staff");
            break;
          case "manager":
            navigate("/dashboard/manager");
            break;
          case "admin":
            navigate("/dashboard/admin");
            break;
          default:
            navigate("/");
        }
      } else {
        setError("Invalid username or password.");
      }
    } catch {
      setError("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="bg-gray-100 rounded-2xl p-16 shadow-md w-full max-w-2xl">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Login</h1>
            <p className="text-gray-400 text-sm mt-1">
              Sign in to your account
            </p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 border border-gray-600 focus:border-green-500 focus:outline-none rounded px-3 py-2 text-sm text-white placeholder-gray-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 focus:border-green-500 focus:outline-none rounded px-3 py-2 pr-10 text-sm text-white placeholder-gray-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 text-sm"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 mt-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded transition-colors"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-green-400 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
