// import React from "react";
// import { Col, Form, Row } from "react-bootstrap";
// import Cards from "react-credit-cards-2";
// import "react-credit-cards-2/dist/es/styles-compiled.css";

// const PaymentForm = ({
//   handleInputFocus,
//   cardValue,
//   handlePaymentInfoChange,
// }) => {
//   return (
//     <Row className="display-flex">
//       <Col md={6} xs={12}>
//         <Cards
//           cvc={cardValue.cvc}
//           expiry={cardValue.expiry}
//           focused={cardValue.focus}
//           name={cardValue.name}
//           number={cardValue.number}
//         />
//       </Col>
//       <Col md={6} xs={12}>
//         <div className="form-area">
//           <Form.Control
//             type="tel"
//             name="number"
//             placeholder="Card Number"
//             onChange={handlePaymentInfoChange}
//             onFocus={handleInputFocus}
//             required
//             maxLength={16}
//             minLength={16}
//             value={cardValue.number}
//           />

//           <Form.Control
//             type="text"
//             name="name"
//             placeholder="Name"
//             onChange={handlePaymentInfoChange}
//             onFocus={handleInputFocus}
//             required
//             value={cardValue.name}
//           />
//           <Row>
//             <Col>
//               <Form.Control
//                 type="text"
//                 name="expiry"
//                 placeholder="MM/DD"
//                 onChange={handlePaymentInfoChange}
//                 onFocus={handleInputFocus}
//                 required
//                 value={cardValue.expiry}
//                 maxLength={7}
//               />
//             </Col>
//             <Col>
//               <Form.Control
//                 type="text"
//                 name="cvc"
//                 placeholder="CVC"
//                 onChange={handlePaymentInfoChange}
//                 onFocus={handleInputFocus}
//                 required
//                 maxLength={3}
//                 value={cardValue.cvc}
//               />
//             </Col>
//           </Row>
//         </div>
//       </Col>
//     </Row>
//   );
// };

// export default PaymentForm;
import { Col, Form, Row } from "react-bootstrap";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

/** react-credit-cards-2 Cards 컴포넌트의 focused 값 */
export type CardFocused = "number" | "name" | "expiry" | "cvc";

export interface PaymentCardValue {
  cvc: string;
  expiry: string;
  focus: CardFocused | "";
  name: string;
  number: string;
}

interface PaymentFormProps {
  handleInputFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  cardValue: PaymentCardValue;
  handlePaymentInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PaymentForm = ({
  handleInputFocus,
  cardValue,
  handlePaymentInfoChange,
}: PaymentFormProps) => {
  return (
    <Row className="display-flex">
      <Col md={6} xs={12}>
        <Cards
          cvc={cardValue.cvc}
          expiry={cardValue.expiry}
          focused={cardValue.focus || undefined}
          name={cardValue.name}
          number={cardValue.number}
        />
      </Col>
      <Col md={6} xs={12}>
        <div className="form-area">
          <Form.Control
            type="tel"
            name="number"
            placeholder="Card Number"
            onChange={handlePaymentInfoChange}
            onFocus={handleInputFocus}
            required
            maxLength={16}
            minLength={16}
            value={cardValue.number}
          />
          <Form.Control
            type="text"
            name="name"
            placeholder="Name"
            onChange={handlePaymentInfoChange}
            onFocus={handleInputFocus}
            required
            value={cardValue.name}
          />
          <Row>
            <Col>
              <Form.Control
                type="text"
                name="expiry"
                placeholder="MM/DD"
                onChange={handlePaymentInfoChange}
                onFocus={handleInputFocus}
                required
                value={cardValue.expiry}
                maxLength={7}
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                name="cvc"
                placeholder="CVC"
                onChange={handlePaymentInfoChange}
                onFocus={handleInputFocus}
                required
                maxLength={3}
                value={cardValue.cvc}
              />
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
};

export default PaymentForm;
