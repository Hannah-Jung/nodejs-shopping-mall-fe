import { useAppSelector } from "../features/hooks";
import { Navigate, Outlet } from "react-router-dom";
import Spinner from "@/components/ui/spinner";

interface PrivateRouteProps {
  permissionLevel: "customer" | "admin";
}

const PrivateRoute = ({ permissionLevel }: PrivateRouteProps) => {
  const { user, loading } = useAppSelector((state) => state.user);
  const hasToken = !!sessionStorage.getItem("token");

  if (loading || (hasToken && !user)) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Spinner />
      </div>
    );
  }

  const isAuthenticated =
    user && (user.role === "admin" || user.role === permissionLevel);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
