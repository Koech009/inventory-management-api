import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "staff",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.username.trim()) return "Username is required.";
    if (!form.email.trim()) return "Email is required.";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    if (form.password !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  const resetForm = () => {
    setForm({ username: "", email: "", password: "", role: "staff" });
    setConfirmPassword("");
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
      // ✅ Try backend API first
      try {
        await axios.post("http://localhost:5000/auth/register", form);
        resetForm(); // clear form after success
        navigate("/login");
      } catch {
        // ✅ Fallback to db.json mock if backend not available
        await axios.post("http://localhost:3001/users", form);
        resetForm(); // clear form after success
        navigate("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="bg-gray-100 rounded-2xl p-16 shadow-md w-full max-w-2xl">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-gray-400 text-sm mt-1">
              Register to access the dashboard
            </p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Enter username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 border border-gray-600 focus:border-green-500 focus:outline-none rounded px-3 py-2 text-sm text-white placeholder-gray-500 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 border border-gray-600 focus:border-green-500 focus:outline-none rounded px-3 py-2 text-sm text-white placeholder-gray-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter password"
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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setError("");
                    setConfirmPassword(e.target.value);
                  }}
                  required
                  className={`w-full bg-gray-700 border focus:outline-none rounded px-3 py-2 pr-10 text-sm text-white placeholder-gray-500 transition-colors ${
                    confirmPassword && form.password !== confirmPassword
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-600 focus:border-green-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 text-sm"
                >
                  {showConfirm ? "🙈" : "👁"}
                </button>
              </div>
              {confirmPassword && form.password !== confirmPassword && (
                <p className="text-red-400 text-xs mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 focus:border-green-500 focus:outline-none rounded px-3 py-2 text-sm text-white transition-colors"
              >
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 mt-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded transition-colors"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-green-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
