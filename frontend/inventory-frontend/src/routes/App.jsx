import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import DashboardStaff from "../pages/DashboardStaff.jsx";
import DashboardManager from "../pages/DashboardManager.jsx";
import DashboardAdmin from "../pages/DashboardAdmin.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Role-based dashboards */}
        <Route
          path="/dashboard/staff"
          element={
            <ProtectedRoute role="staff">
              <DashboardStaff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/manager"
          element={
            <ProtectedRoute role="manager">
              <DashboardManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute role="admin">
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />

        {/* Catch-all → home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
