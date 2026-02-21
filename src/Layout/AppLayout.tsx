import React, { useEffect } from "react";
import { useLocation } from "react-router";
import Sidebar from "../common/component/Sidebar";
import Navbar from "../common/component/Navbar";
import ToastMessage from "../common/component/ToastMessage";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { loginWithToken } from "../features/user/userSlice";
import { getCartQty } from "../features/cart/cartSlice";
import Spinner from "@/components/ui/spinner";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.user);
  const token = sessionStorage.getItem("token");
  useEffect(() => {
    if (token) {
      dispatch(loginWithToken());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (user) {
      dispatch(getCartQty());
    }
  }, [user, dispatch]);

  if (token && (!user || loading)) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <ToastMessage />
      <Navbar user={user} />
      <main className="page-transition">{children}</main>
    </div>
  );
};

export default AppLayout;
