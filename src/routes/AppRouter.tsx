import { Route, Routes } from "react-router";
import AdminOrderPage from "../page/AdminOrderPage/AdminOrderPage";
import AdminDashboardPage from "../page/AdminDashboardPage/AdminDashboardPage";
import AdminProductPage from "../page/AdminProductPage/AdminProductPage";
import CartPage from "../page/CartPage/CartPage";
import Login from "../page/LoginPage/LoginPage";
import MyPage from "../page/MyPage/MyPage";
import OrderCompletePage from "../page/OrderCompletePage/OrderCompletePage";
import PaymentPage from "../page/PaymentPage/PaymentPage";
import ProductAll from "../page/LandingPage/LandingPage";
import ProductDetail from "../page/ProductDetailPage/ProductDetailPage";
import RegisterPage from "../page/RegisterPage/RegisterPage";
import PrivateRoute from "./PrivateRoute";
import { useNavigate } from "react-router-dom";
import { TriangleAlert } from "lucide-react";

const AppRouter = () => {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route path="/" element={<ProductAll />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route element={<PrivateRoute permissionLevel="customer" />}>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/success" element={<OrderCompletePage />} />
        <Route path="/account/purchase" element={<MyPage />} />
      </Route>
      <Route element={<PrivateRoute permissionLevel="admin" />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/product" element={<AdminProductPage />} />
        <Route path="/admin/order" element={<AdminOrderPage />} />
      </Route>
      <Route
        path="*"
        element={
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
            <TriangleAlert
              size={78}
              strokeWidth={1.5}
              className="text-zinc-900 mb-6"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
            <h1 className="text-6xl font-black text-zinc-400 mb-4 uppercase">
              404
            </h1>
            <h2 className="text-xl font-bold text-zinc-900 mb-2 uppercase">
              Page Not Found
            </h2>
            <p className="text-zinc-500 mb-8 uppercase text-sm font-medium">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-zinc-900 text-white font-bold uppercase text-xs hover:bg-primary transition-colors"
            >
              Back to Home
            </button>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRouter;
