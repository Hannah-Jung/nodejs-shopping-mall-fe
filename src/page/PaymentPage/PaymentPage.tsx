import { useState, useEffect } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import OrderReceipt from "./component/OrderReceipt";
import PaymentForm from "./component/PaymentForm";
import type { PaymentCardValue, CardFocused } from "./component/PaymentForm";
import "./style/paymentPage.style.css";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrder, resetOrderNum } from "@/features/order/orderSlice";
import { cc_expires_format, formatPhoneNumber } from "@/utils/number";
import { US_STATES } from "@/constants/us-states.constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Product } from "@/features/product/productSlice";
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
  const navigate = useNavigate();
  const location = useLocation();
  const { orderNum } = useAppSelector((state) => state.order);
  const [cardValue, setCardValue] =
    useState<PaymentCardValue>(initialCardValue);
  const [shipInfo, setShipInfo] = useState<ShipInfo>(initialShipInfo);
  const { cartList, totalPrice } = useAppSelector((state) => state.cart);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    dispatch(resetOrderNum());
  }, [dispatch]);
  useEffect(() => {
    if (!orderNum) {
      if (!location.state?.fromCheckout || cartList.length === 0) {
        navigate("/cart", { replace: true });
      }
    }
  }, [location, navigate, cartList, orderNum]);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requiredFields = [
      "firstName",
      "lastName",
      "contact",
      "addressLine1",
      "city",
      "state",
      "zipCode",
    ];

    const newErrors: Record<string, boolean> = {};
    requiredFields.forEach((field) => {
      if (!shipInfo[field as keyof ShipInfo]?.trim()) {
        newErrors[field] = true;
      }
    });

    ["number", "name", "expiry", "cvc"].forEach((field) => {
      if (!cardValue[field as keyof PaymentCardValue]?.trim()) {
        newErrors[field] = true;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const {
      firstName,
      lastName,
      contact,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
    } = shipInfo;

    try {
      const response = await dispatch(
        createOrder({
          totalPrice,
          shipTo: {
            address: `${addressLine1} ${addressLine2}`.trim(),
            city,
            state,
            zip: zipCode,
          },
          contact: { firstName, lastName, contact },
          items: cartList.map((item: any) => {
            const product = item.productId;
            const selectedSize = item.size as "single" | "double" | "family";

            return {
              productId: product._id,
              price: product.price[selectedSize],
              qty: item.qty,
              size: item.size,
            };
          }),
        }),
      ).unwrap();
      if (response) {
        navigate("/payment/success", { replace: true });
      }
    } catch (error) {
      console.error("Order process error:", error);
    }
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let newValue = value;
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }

    if (name === "contact") {
      newValue = formatPhoneNumber(value);
    } else if (name === "zipCode") {
      newValue = value.replace(/\D/g, "");
    } else if (["firstName", "lastName", "city"].includes(name)) {
      newValue = value.replace(/[0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~]/g, "");
    }

    setShipInfo((prev) => ({ ...prev, [name]: newValue }));
  };

  const handlePaymentInfoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
    let cleanedValue = value;

    if (name === "name") {
      cleanedValue = value.replace(/[^a-zA-Z\s]/g, "").toUpperCase();
    }
    if (name === "number" || name === "cvc") {
      cleanedValue = value.replace(/\D/g, "");
    }

    if (name === "number") {
      cleanedValue = cleanedValue.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    }

    if (name === "expiry") {
      cleanedValue = cc_expires_format(value);
    }

    setCardValue((prev) => ({ ...prev, [name]: cleanedValue }));
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.target.name as CardFocused;
    setCardValue((prev) => ({ ...prev, focus: name }));
  };
  const inputClass =
    "w-full border border-zinc-200 px-4 h-12 outline-none " +
    "focus:border-primary transition-colors duration-300 ease-in-out " +
    "text-xs font-black text-zinc-800 placeholder:text-zinc-400 " +
    "uppercase placeholder:uppercase antialiased flex items-center";

  const getBorderClass = (fieldName: string) =>
    errors[fieldName]
      ? "border-red-500 ring-1 ring-red-500"
      : "border-zinc-200";
  return (
    <div className="mx-auto max-w-6xl lg:px-16 px-4 py-12">
      <h1 className="text-2xl font-black mb-10 tracking-tight uppercase">
        Checkout
      </h1>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start"
      >
        <div className="lg:col-span-8 space-y-12">
          <section>
            <h2 className="text-xl font-bold mb-6 uppercase tracking-tight">
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                onChange={handleFormChange}
                required
                className={cn(inputClass, getBorderClass("firstName"))}
                value={shipInfo.firstName}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                onChange={handleFormChange}
                required
                className={cn(inputClass, getBorderClass("lastName"))}
                value={shipInfo.lastName}
              />
              <input
                type="tel"
                name="contact"
                placeholder="Contact Number"
                maxLength={12}
                onChange={handleFormChange}
                required
                className={cn(inputClass, getBorderClass("contact"))}
                value={shipInfo.contact}
              />
              <input
                type="text"
                name="addressLine1"
                placeholder="Address Line 1"
                onChange={handleFormChange}
                required
                className={cn(inputClass, getBorderClass("addressLine1"))}
              />
              <input
                type="text"
                name="addressLine2"
                placeholder="Address Line 2 (optional)"
                onChange={handleFormChange}
                className={inputClass}
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                onChange={handleFormChange}
                required
                className={cn(inputClass, getBorderClass("city"))}
                value={shipInfo.city}
              />
              <div className="flex flex-col">
                <Select
                  onValueChange={(value) => {
                    setShipInfo((prev) => ({ ...prev, state: value }));
                    setErrors((prev) => ({ ...prev, state: false }));
                  }}
                  value={shipInfo.state}
                  name="state"
                  required
                >
                  <SelectTrigger
                    className={cn(
                      inputClass,
                      "h-auto min-h-[48px] py-0 flex items-center justify-between",
                      getBorderClass("state"),
                    )}
                  >
                    <span
                      className={cn(
                        "uppercase",
                        !shipInfo.state
                          ? "text-zinc-400 font-semi-bold"
                          : "text-zinc-800 font-black",
                      )}
                    >
                      <SelectValue placeholder="STATE" />
                    </span>
                  </SelectTrigger>

                  <SelectContent
                    position="popper"
                    sideOffset={5}
                    className="max-h-[300px] bg-white border border-zinc-200 shadow-xl overflow-y-auto"
                  >
                    {US_STATES.map((state: { code: string; name: string }) => (
                      <SelectItem
                        key={state.code}
                        value={state.code}
                        className="cursor-pointer text-xs font-black uppercase hover:bg-zinc-50 py-3"
                      >
                        {state.code} — {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && (
                  <p className="text-[10px] text-red-500 font-bold uppercase pl-1">
                    Please select your state
                  </p>
                )}
              </div>
              <input
                type="text"
                name="zipCode"
                placeholder="Zip Code"
                maxLength={5}
                onChange={handleFormChange}
                required
                className={cn(inputClass, getBorderClass("zipCode"))}
                value={shipInfo.zipCode}
              />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-6 uppercase tracking-tight">
              Payment Method
            </h2>
            <PaymentForm
              handleInputFocus={handleInputFocus}
              cardValue={cardValue}
              handlePaymentInfoChange={handlePaymentInfoChange}
              errors={errors}
            />
          </section>
        </div>

        <aside className="lg:col-span-4 sticky top-24">
          <div className="hidden lg:block h-[28px] mb-6" aria-hidden="true" />
          <OrderReceipt cartList={cartList} totalPrice={totalPrice} />
        </aside>
      </form>
    </div>
  );
};

export default PaymentPage;
