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
    "w-full border border-zinc-200 px-4 h-12 outline-none " +
    "focus:border-primary transition-colors duration-300 ease-in-out " +
    "text-xs font-black text-zinc-800 placeholder:text-zinc-400 " +
    "uppercase placeholder:uppercase antialiased flex items-center";

  const getBorderClass = (fieldName: string) =>
    errors[fieldName]
      ? "border-red-500 ring-1 ring-red-500"
      : "border-zinc-200";

  const ErrorField = ({ message }: { message: string }) => (
    <p className="text-[10px] text-red-500 font-semibold uppercase pl-1 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
      {message}
    </p>
  );

  return (
    <div className="flex flex-col gap-x-5 md:flex-row items-stretch">
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
        <Cards
          cvc={cardValue.cvc}
          expiry={cardValue.expiry}
          focused={cardValue.focus || undefined}
          name={cardValue.name}
          number={cardValue.number}
        />
      </div>
      <div className="form-area w-full mt-3 gap-4 md:mt-0 md:w-1/2 flex flex-col justify-between">
        <div className="flex flex-col ">
          <input
            type="tel"
            name="number"
            placeholder="Card Number"
            onChange={handlePaymentInfoChange}
            onFocus={handleInputFocus}
            required
            maxLength={19}
            value={cardValue.number}
            className={cn(inputClass, getBorderClass("number"))}
          />
          {errors.number && (
            <ErrorField message="Invalid card number (16 digits)" />
          )}
        </div>

        <div className="flex flex-col">
          <input
            type="text"
            name="name"
            placeholder="Name on Card"
            onChange={handlePaymentInfoChange}
            onFocus={handleInputFocus}
            required
            value={cardValue.name}
            className={cn(inputClass, getBorderClass("name"))}
          />
          {errors.name && (
            <ErrorField message="Name must be at least 2 characters" />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              onChange={handlePaymentInfoChange}
              onFocus={handleInputFocus}
              required
              value={cardValue.expiry}
              maxLength={5}
              className={cn(inputClass, getBorderClass("expiry"))}
            />
            {errors.expiry && <ErrorField message="Invalid expiry" />}
          </div>

          <div className="flex flex-col">
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
            {errors.cvc && <ErrorField message="Invalid CVC" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
