import { Navigate } from "react-router-dom";

export default function RoleHomeRedirect() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

   // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  switch (role) {
    case "admin":
      return <Navigate to="/admin" replace />;

    case "manager":
      return <Navigate to="/manager" replace />;

    case "staff":
      return <Navigate to="/staff" replace />;

    default:
      localStorage.clear();
      return <Navigate to="/login" replace />;
  }
}