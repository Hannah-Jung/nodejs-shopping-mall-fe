import { useAppSelector } from "../features/hooks";
import { Navigate, Outlet } from "react-router-dom";

interface PrivateRouteProps {
  permissionLevel: "customer" | "admin";
}

const PrivateRoute = ({ permissionLevel }: PrivateRouteProps) => {
  const { user, loading } = useAppSelector((state) => state.user);
  const hasToken = !!sessionStorage.getItem("token");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (loading || (hasToken && !user)) {
    return <div>Loading...</div>;
  }

  const isAuthenticated =
    user && (user.role === "admin" || user.role === permissionLevel);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
