import { useAppSelector } from "../features/hooks";
import { Navigate, Outlet } from "react-router-dom";

interface PrivateRouteProps {
  permissionLevel: "customer" | "admin";
}

const PrivateRoute = ({ permissionLevel }: PrivateRouteProps) => {
  const user = useAppSelector((state) => state.user.user);
  const isAuthenticated =
    user?.level === permissionLevel || user?.level === "admin";

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
