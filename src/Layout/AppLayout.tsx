// import React, { useEffect } from "react";
// import { useLocation } from "react-router";
// import { Col, Row } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import Sidebar from "../common/component/Sidebar";
// import Navbar from "../common/component/Navbar";
// import ToastMessage from "../common/component/ToastMessage";
// import { loginWithToken } from "../features/user/userSlice";
// import { getCartQty } from "../features/cart/cartSlice";

// const AppLayout = ({ children }) => {
//   const location = useLocation();
//   const dispatch = useDispatch();

//   const { user } = useSelector((state) => state.user);
//   // useEffect(() => {
//   //   dispatch(loginWithToken());
//   // }, []);
//   useEffect(() => {
//     if (sessionStorage.getItem("token")) {
//       dispatch(loginWithToken());
//     }
//   }, []);
//   useEffect(() => {
//     if (user) {
//       dispatch(getCartQty());
//     }
//   }, [user]);
//   return (
//     <div>
//       <ToastMessage />
//       {location.pathname.includes("admin") ? (
//         <Row className="vh-100">
//           <Col xs={12} md={3} className="sidebar mobile-sidebar">
//             <Sidebar />
//           </Col>
//           <Col xs={12} md={9}>
//             {children}
//           </Col>
//         </Row>
//       ) : (
//         <>
//           <Navbar user={user} />
//           {children}
//         </>
//       )}
//     </div>
//   );
// };

// export default AppLayout;
import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { Col, Row } from "react-bootstrap";
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
        <Row className="vh-100">
          <Col xs={12} md={3} className="sidebar mobile-sidebar">
            <Sidebar />
          </Col>
          <Col xs={12} md={9}>
            {children}
          </Col>
        </Row>
      ) : (
        <>
          <Navbar user={user} />
          {children}
        </>
      )}
    </div>
  );
};

export default AppLayout;