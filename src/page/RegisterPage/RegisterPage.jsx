import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import "./style/register.style.css";

import { registerUser, clearErrors } from "../../features/user/userSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    policy: false,
  });
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");
  const [policyError, setPolicyError] = useState(false);
  const { registrationError } = useSelector((state) => state.user);

  const register = (event) => {
    event.preventDefault();
    const { email, firstName, lastName, password, confirmPassword, policy } =
      formData;

    const form = event.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (
      !trimmedEmail ||
      !trimmedFirstName ||
      !trimmedLastName ||
      !password ||
      !confirmPassword.trim()
    ) {
      return;
    }

    const checkConfirmPassword = password === confirmPassword;
    if (!checkConfirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (!policy) {
      setPolicyError(true);
      return;
    }
    setPasswordError("");
    setPolicyError(false);
    dispatch(
      registerUser({
        email: trimmedEmail,
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        password,
        navigate,
      }),
    );
  };

  const handleChange = (event) => {
    event.preventDefault();
    const { id, value, type, checked } = event.target;
    if (id === "confirmPassword" && passwordError) setPasswordError("");
    if (id === "email" && registrationError) {
      dispatch(clearErrors());
    }
    if (id === "password" && registrationError && value.length >= 3) {
      dispatch(clearErrors());
    }
    if (type === "checkbox") {
      if (policyError) setPolicyError(false);
      setFormData((prev) => ({ ...prev, [id]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  return (
    <Container className="register-area">
      {registrationError && (
        <Alert variant="danger" className="error-message">
          {registrationError}
        </Alert>
      )}
      <Form onSubmit={register}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            id="email"
            placeholder="Enter email"
            onChange={handleChange}
            value={formData.email}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            id="firstName"
            placeholder="First Name"
            onChange={handleChange}
            value={formData.firstName}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            id="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            value={formData.lastName}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            id="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            value={formData.confirmPassword}
            required
            isInvalid={!!passwordError}
          />
          <Form.Control.Feedback type="invalid">
            {passwordError}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Accept Terms & Conditions"
            id="policy"
            onChange={handleChange}
            isInvalid={policyError}
            checked={formData.policy}
          />
          {policyError && (
            <Form.Text className="text-danger d-block mt-1">
              Please agree to the Terms and Conditions.
            </Form.Text>
          )}
        </Form.Group>
        <Button variant="danger" type="submit">
          Sign Up
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterPage;
