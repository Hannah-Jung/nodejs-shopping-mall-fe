import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

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

export default PaymentForm;
