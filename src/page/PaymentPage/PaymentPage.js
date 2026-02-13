import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import OrderReceipt from "./component/OrderReceipt";
import PaymentForm from "./component/PaymentForm";
import "./style/paymentPage.style.css";
import { cc_expires_format } from "../../utils/number";
import { createOrder } from "../../features/order/orderSlice";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const { orderNum } = useSelector((state) => state.order);
  const [cardValue, setCardValue] = useState({
    cvc: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  });
  const navigate = useNavigate();
  const [firstLoading, setFirstLoading] = useState(true);
  const [shipInfo, setShipInfo] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
  });

  useEffect(() => {
    // 오더번호를 받으면 어디로 갈까?
  }, [orderNum]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // 오더 생성하기
  };

  const handleFormChange = (event) => {
    //shipInfo에 값 넣어주기
  };

  const handlePaymentInfoChange = (event) => {
    //카드정보 넣어주기
  };

  const handleInputFocus = (e) => {
    setCardValue({ ...cardValue, focus: e.target.name });
  };
  // if (cartList?.length === 0) {
  //   navigate("/cart");
  // }// 주문할 아이템이 없다면 주문하기로 안넘어가게 막음
  return (
    <Container>
      <Row>
        <Col lg={7}>
          <div>
            <h2 className="mb-2">Shipping Address</h2>
            <div>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="lastName"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="firstName"
                    />
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formGridAddress1">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="(123) 456-7890"
                    onChange={handleFormChange}
                    required
                    name="contact"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="addressLine1">
                  <Form.Label>Address Line 1</Form.Label>
                  <Form.Control
                    placeholder="Street address"
                    onChange={handleFormChange}
                    required
                    name="addressLine1"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="addressLine2">
                  <Form.Label>
                    Address Line 2{" "}
                    <span className="text-muted">(optional)</span>
                  </Form.Label>
                  <Form.Control
                    placeholder="Apartment, suite, unit, building, floor"
                    onChange={handleFormChange}
                    name="addressLine2"
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      onChange={handleFormChange}
                      required
                      name="city"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridState">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      onChange={handleFormChange}
                      required
                      name="state"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridZip">
                    <Form.Label>ZIP Code</Form.Label>
                    <Form.Control
                      onChange={handleFormChange}
                      required
                      name="zipCode"
                    />
                  </Form.Group>
                </Row>
                <div className="mobile-receipt-area">
                  {/* <OrderReceipt /> */}
                </div>
                <div>
                  <h2 className="payment-title">Payment Information</h2>
                </div>

                <Button
                  variant="dark"
                  className="payment-button pay-button"
                  type="submit"
                >
                  Place Order
                </Button>
              </Form>
            </div>
          </div>
        </Col>
        <Col lg={5} className="receipt-area">
          {/* <OrderReceipt  /> */}
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
