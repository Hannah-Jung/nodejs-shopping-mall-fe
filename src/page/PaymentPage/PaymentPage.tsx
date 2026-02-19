import { useState, useEffect } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import OrderReceipt from "./component/OrderReceipt";
import PaymentForm from "./component/PaymentForm";
import type { PaymentCardValue, CardFocused } from "./component/PaymentForm";
import "./style/paymentPage.style.css";
import { useAppDispatch, useAppSelector } from "../../features/hooks";

interface ShipInfo {
  firstName: string;
  lastName: string;
  contact: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
}

const initialShipInfo: ShipInfo = {
  firstName: "",
  lastName: "",
  contact: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
};

const initialCardValue: PaymentCardValue = {
  cvc: "",
  expiry: "",
  focus: "",
  name: "",
  number: "",
};

const PaymentPage = () => {
  const dispatch = useAppDispatch();
  const { orderNum } = useAppSelector((state) => state.order);
  const [cardValue, setCardValue] =
    useState<PaymentCardValue>(initialCardValue);
  const [shipInfo, setShipInfo] = useState<ShipInfo>(initialShipInfo);

  useEffect(() => {
    void orderNum;
    // 오더번호를 받으면 이동 등 처리
  }, [orderNum]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void dispatch;
    // 오더 생성하기
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setShipInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentInfoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setCardValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.target.name as CardFocused;
    setCardValue((prev) => ({ ...prev, focus: name }));
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <div className="w-full md:w-1/2">
        <Cards
          cvc={cardValue.cvc}
          expiry={cardValue.expiry}
          focused={cardValue.focus || undefined}
          name={cardValue.name}
          number={cardValue.number}
        />
      </div>
      <div className="form-area w-full md:w-1/2">
        <input
          type="tel"
          name="number"
          placeholder="Card Number"
          onChange={handlePaymentInfoChange}
          onFocus={handleInputFocus}
          required
          maxLength={16}
          minLength={16}
          value={cardValue.number}
          className="mb-3 w-full rounded border border-gray-300 px-3 py-2"
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handlePaymentInfoChange}
          onFocus={handleInputFocus}
          required
          value={cardValue.name}
          className="mb-3 w-full rounded border border-gray-300 px-3 py-2"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            name="expiry"
            placeholder="MM/DD"
            onChange={handlePaymentInfoChange}
            onFocus={handleInputFocus}
            required
            value={cardValue.expiry}
            maxLength={7}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
          <input
            type="text"
            name="cvc"
            placeholder="CVC"
            onChange={handlePaymentInfoChange}
            onFocus={handleInputFocus}
            required
            maxLength={3}
            value={cardValue.cvc}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
