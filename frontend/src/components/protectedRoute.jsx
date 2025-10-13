import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role, allowAdmins = false }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role) {
    if (user.role !== role) {
      if (role === "citizen" && allowAdmins && user.role === "admin") {
        return children;
      }
      return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
    }
  }
  return children;
}
