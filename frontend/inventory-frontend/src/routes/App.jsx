import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

// Admin pages
import AdminHome from "../pages/admin/AdminHome.jsx";
import AdminUsers from "../pages/admin/AdminUsers.jsx";
import AdminProducts from "../pages/admin/AdminProducts.jsx";
import AdminCategories from "../pages/admin/AdminCategories.jsx";
import AdminSuppliers from "../pages/admin/AdminSuppliers.jsx";
import AdminInventory from "../pages/admin/AdminInventory.jsx";

// Manager pages
import ManagerHome from "../pages/manager/ManagerHome.jsx";
import ManagerProducts from "../pages/manager/ManagerProducts.jsx";
import ManagerCategories from "../pages/manager/ManagerCategories.jsx";
import ManagerSuppliers from "../pages/manager/ManagerSuppliers.jsx";
import ManagerInventory from "../pages/manager/ManagerInventory.jsx";

// Staff pages
import StaffHome from "../pages/staff/StaffHome.jsx";
import StaffProducts from "../pages/staff/StaffProducts.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/users"
          element={
            <ProtectedRoute role="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/products"
          element={
            <ProtectedRoute role="admin">
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/categories"
          element={
            <ProtectedRoute role="admin">
              <AdminCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/suppliers"
          element={
            <ProtectedRoute role="admin">
              <AdminSuppliers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/inventory"
          element={
            <ProtectedRoute role="admin">
              <AdminInventory />
            </ProtectedRoute>
          }
        />

        {/* Manager routes */}
        <Route
          path="/dashboard/manager"
          element={
            <ProtectedRoute role="manager">
              <ManagerHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/manager/products"
          element={
            <ProtectedRoute role="manager">
              <ManagerProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/manager/categories"
          element={
            <ProtectedRoute role="manager">
              <ManagerCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/manager/suppliers"
          element={
            <ProtectedRoute role="manager">
              <ManagerSuppliers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/manager/inventory"
          element={
            <ProtectedRoute role="manager">
              <ManagerInventory />
            </ProtectedRoute>
          }
        />

        {/* Staff routes */}
        <Route
          path="/dashboard/staff"
          element={
            <ProtectedRoute role="staff">
              <StaffHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/staff/products"
          element={
            <ProtectedRoute role="staff">
              <StaffProducts />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
