import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";

interface RequireRoleProps {
  allowedRoles: string[];
}

export default function RequireRole({ allowedRoles }: RequireRoleProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Checking permissions...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasPermission = user.roles.some((role) => allowedRoles.includes(role));

  if (!hasPermission) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
