// import React, { useState, useEffect } from "react";
// import { Container, Form, Button, Alert } from "react-bootstrap";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { GoogleLogin } from "@react-oauth/google";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import "./style/login.style.css";
// import { loginWithEmail, loginWithGoogle } from "../../features/user/userSlice";
// import { clearErrors } from "../../features/user/userSlice";
// const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user, loginError } = useSelector((state) => state.user);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   useEffect(() => {
//     if (loginError) {
//       dispatch(clearErrors());
//     }
//   }, [navigate]);
//   const handleLoginWithEmail = (event) => {
//     event.preventDefault();
//     dispatch(loginWithEmail({ email, password }));
//   };

//   const handleGoogleLogin = async (googleData) => {
//     //구글 로그인 하기
//   };

//   // if (user) {
//   //   navigate("/");
//   // }
//   useEffect(() => {
//     if (user) {
//       navigate("/");
//     }
//   }, [user, navigate]);
//   return (
//     <>
//       <Container className="login-area">
//         {loginError && (
//           <div className="error-message">
//             <Alert variant="danger">{loginError}</Alert>
//           </div>
//         )}
//         <Form className="login-form" onSubmit={handleLoginWithEmail}>
//           <Form.Group className="mb-3" controlId="formBasicEmail">
//             <Form.Label>Email address</Form.Label>
//             <Form.Control
//               type="email"
//               placeholder="Enter email"
//               required
//               onChange={(event) => setEmail(event.target.value)}
//             />
//           </Form.Group>

//           <Form.Group className="mb-3" controlId="formBasicPassword">
//             <Form.Label>Password</Form.Label>
//             <Form.Control
//               type="password"
//               placeholder="Password"
//               required
//               onChange={(event) => setPassword(event.target.value)}
//             />
//           </Form.Group>
//           <div className="display-space-between login-button-area">
//             <Button variant="danger" type="submit">
//               LOGIN
//             </Button>
//           </div>

//           <div className="text-align-center mt-2">
//             <p>- OR -</p>
//             <div className="display-center">
//               <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
//                 <GoogleLogin
//                   onSuccess={handleGoogleLogin}
//                   onError={() => {
//                     console.log("Login Failed");
//                   }}
//                 />
//               </GoogleOAuthProvider>
//             </div>
//           </div>
//           <div className="text-align-center mt-2">
//             Don't have an account yet? <Link to="/register">Sign Up</Link>
//           </div>
//         </Form>
//       </Container>
//     </>
//   );
// };

// export default Login;
import { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import "./style/login.style.css";
import { loginWithEmail, clearErrors } from "../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loginError } = useAppSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (loginError) {
      dispatch(clearErrors());
    }
  }, [navigate, loginError, dispatch]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLoginWithEmail = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(loginWithEmail({ email, password }));
  };

  const handleGoogleLogin = async (googleData: unknown) => {
    void googleData;
    // 구글 로그인 구현
  };

  return (
    <>
      <Container className="login-area">
        {loginError && (
          <div className="error-message">
            <Alert variant="danger">{loginError}</Alert>
          </div>
        )}
        <Form className="login-form" onSubmit={handleLoginWithEmail}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <div className="display-space-between login-button-area">
            <Button variant="danger" type="submit">
              LOGIN
            </Button>
          </div>
          <div className="text-align-center mt-2">
            <p>- OR -</p>
            <div className="display-center">
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </GoogleOAuthProvider>
            </div>
          </div>
          <div className="text-align-center mt-2">
            Don't have an account yet? <Link to="/register">Sign Up</Link>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default Login;
