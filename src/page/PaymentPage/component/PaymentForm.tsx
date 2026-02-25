import { cn } from "@/lib/utils";
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
  errors: Record<string, boolean>;
}

const PaymentForm = ({
  handleInputFocus,
  cardValue,
  handlePaymentInfoChange,
  errors,
}: PaymentFormProps) => {
  const inputClass =
    "w-full border border-gray-200 px-3 py-3 outline-none " +
    "focus:border-primary transition-colors duration-300 ease-in-out " +
    "text-xs font-bold uppercase placeholder:uppercase tracking-widest text-zinc-800";
  const getBorderClass = (fieldName: string) =>
    errors[fieldName]
      ? "border-red-500 ring-1 ring-red-500"
      : "border-zinc-200";
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
        <Cards
          cvc={cardValue.cvc}
          expiry={cardValue.expiry}
          focused={cardValue.focus || undefined}
          name={cardValue.name}
          number={cardValue.number}
        />
      </div>
      <div className="form-area w-full mt-3 gap-2 md:w-1/2 flex flex-col">
        <input
          type="tel"
          name="number"
          placeholder="Card Number"
          onChange={handlePaymentInfoChange}
          onFocus={handleInputFocus}
          required
          maxLength={19}
          minLength={16}
          value={cardValue.number}
          className={cn(inputClass, getBorderClass("number"))}
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handlePaymentInfoChange}
          onFocus={handleInputFocus}
          required
          value={cardValue.name}
          className={cn(inputClass, getBorderClass("name"))}
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="expiry"
            placeholder="MM/YY"
            onChange={handlePaymentInfoChange}
            onFocus={handleInputFocus}
            required
            value={cardValue.expiry}
            maxLength={7}
            className={cn(inputClass, getBorderClass("expiry"))}
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
            className={cn(inputClass, getBorderClass("cvc"))}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
