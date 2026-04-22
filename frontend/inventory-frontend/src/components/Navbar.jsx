import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 text-white shadow-md border-b border-gray-700">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-green-400">
          InventoryAPI
        </Link>

        {/* Links */}
        <ul className="flex items-center gap-3">
          {!user ? (
            <>
              <li>
                <Link
                  to="/login"
                  className={`text-sm font-medium px-3 py-1.5 rounded hover:bg-gray-700 transition-colors ${
                    location.pathname === "/login"
                      ? "text-green-400"
                      : "text-gray-300"
                  }`}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-sm font-semibold px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                >
                  Register
                </Link>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={handleLogout}
                className="text-sm font-medium px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
