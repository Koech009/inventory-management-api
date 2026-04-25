import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useAuthContext } from "../contexts/AuthContext";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

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
      const res = await API.post("/auth/login", form);
      const { user, token } = res.data;
      login(user, token);
      setForm({ username: "", password: "" });

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
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-md border border-emerald-100 w-full max-w-md p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Welcome back</h1>
            <p className="text-gray-400 text-sm mt-1">
              Sign in to your account
            </p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="flex flex-col gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                autoComplete="new-password"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:outline-none rounded-lg px-3 py-2 pr-10 text-sm text-gray-800 placeholder-gray-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-emerald-600 hover:underline font-medium"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
