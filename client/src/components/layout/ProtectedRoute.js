import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // stored at login

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/" replace />; // redirect if role not allowed
  }

  return children;
};

export default ProtectedRoute;
