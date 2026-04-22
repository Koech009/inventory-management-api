import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ role, allowedRoles, children }) {
  const { user, loading, hasRole, hasAnyRole } = useAuth();

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  if (role && !hasRole(role)) return <Navigate to="/" replace />;
  if (allowedRoles && !hasAnyRole(allowedRoles))
    return <Navigate to="/" replace />;

  return children;
}
