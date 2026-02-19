import React, { useEffect } from "react";
import { useLocation } from "react-router";
import Sidebar from "../common/component/Sidebar";
import Navbar from "../common/component/Navbar";
import ToastMessage from "../common/component/ToastMessage";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { loginWithToken } from "../features/user/userSlice";
import { getCartQty } from "../features/cart/cartSlice";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      dispatch(loginWithToken());
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(getCartQty());
    }
  }, [user, dispatch]);

  return (
    <div>
      <ToastMessage />
      {location.pathname.includes("admin") ? (
        <>
          <Navbar user={user} />
          <div className="flex min-h-screen flex-col md:flex-row">
            <div className="w-full md:w-1/4 md:min-w-[200px] sidebar mobile-sidebar">
              <Sidebar />
            </div>
            <div className="flex-1 w-full md:w-3/4">
              <main key={location.pathname} className="page-transition">
                {children}
              </main>
            </div>
          </div>
        </>
      ) : (
        <>
          <Navbar user={user} />
          <main key={location.pathname} className="page-transition">
            {children}
          </main>
        </>
      )}
    </div>
  );
};

export default AppLayout;
