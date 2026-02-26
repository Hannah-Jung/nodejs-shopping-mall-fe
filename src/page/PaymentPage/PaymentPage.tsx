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
import ConfirmModal from "@/common/component/ConfirmModal";
import {
  deleteCartItem,
  getCartList,
  updateQty,
} from "@/features/cart/cartSlice";
import QtyStepper from "@/common/component/QtyStepper";
import { Trash2 } from "lucide-react";
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
  const [showStockModal, setShowStockModal] = useState(false);
  const [invalidItems, setInvalidItems] = useState<any[]>([]);
  const [tempQtys, setTempQtys] = useState<Record<string, number>>({});

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
    const newErrors: Record<string, boolean> = {};

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

    if (firstName.trim().length < 2) newErrors.firstName = true;
    if (lastName.trim().length < 2) newErrors.lastName = true;
    if (addressLine1.trim().length < 5) newErrors.addressLine1 = true;
    if (city.trim().length < 2) newErrors.city = true;
    if (!state) newErrors.state = true;

    if (contact.length < 12) newErrors.contact = true;

    if (zipCode.length < 5) newErrors.zipCode = true;

    const { number, name, expiry, cvc } = cardValue;

    if (number.replace(/\s/g, "").length < 16) newErrors.number = true;

    if (name.trim().length < 2) newErrors.name = true;

    if (expiry.length < 5) newErrors.expiry = true;

    if (cvc.length < 3) newErrors.cvc = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      const orderNum = await dispatch(
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
      if (orderNum) {
        navigate("/payment/success", { replace: true, state: { orderNum } });
      }
    } catch (error: any) {
      console.error("Check Error Data:", error);
      if (error.errorType === "INSUFFICIENT_STOCK" || error.invalidItems) {
        setInvalidItems(error.invalidItems || []);
        const initialQtys: Record<string, number> = {};
        error.invalidItems.forEach((item: any) => {
          initialQtys[item.productId] = item.actualStock;
        });
        setTempQtys(initialQtys);
        setShowStockModal(true);
      }
    }
  };

  const handleStockConfirm = async () => {
    try {
      await Promise.all(
        invalidItems.map((item) => {
          const cartItem = cartList.find(
            (c: any) =>
              c.productId._id === item.productId && c.size === item.size,
          );

          if (cartItem && cartItem._id) {
            return dispatch(
              updateQty({
                id: cartItem._id as string,
                value: tempQtys[item.productId],
              }),
            ).unwrap();
          }
          return Promise.resolve();
        }),
      );

      await dispatch(getCartList()).unwrap();
      setShowStockModal(false);
    } catch (e) {
      console.error("Update failed", e);
    }
  };

  const handleDeleteItem = async (productId: string) => {
    try {
      const cartItem = cartList.find((c: any) => c.productId._id === productId);
      if (cartItem && cartItem._id) {
        await dispatch(deleteCartItem(cartItem._id as string)).unwrap();
        const updatedCart = await dispatch(getCartList()).unwrap();

        const remainingInvalid = invalidItems.filter(
          (item) => item.productId !== productId,
        );
        setInvalidItems(remainingInvalid);

        if (remainingInvalid.length === 0) {
          setShowStockModal(false);
        } else if (updatedCart.length === 0) {
          setShowStockModal(false);
          navigate("/", { replace: true });
        }
      }
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const allOutOfStock =
    cartList.length > 0 &&
    cartList.every((cartItem: any) =>
      invalidItems.some(
        (invalid) =>
          invalid.productId ===
            (cartItem.productId?._id || cartItem.productId) &&
          invalid.actualStock === 0,
      ),
    );

  const handleContinueShopping = async () => {
    try {
      await Promise.all(
        cartList.map((item: any) =>
          dispatch(deleteCartItem(item._id)).unwrap(),
        ),
      );
      await dispatch(getCartList()).unwrap();

      setShowStockModal(false);
      navigate("/", { replace: true });
    } catch (e) {
      console.error("Failed to clear cart", e);
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
      cleanedValue = value.replace(
        /[0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~]/g,
        "",
      );

      cleanedValue = cleanedValue.toUpperCase();
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

  const ErrorField = ({ message }: { message: string }) => (
    <p className="text-[10px] text-red-500 font-semibold uppercase pl-1 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
      {message}
    </p>
  );
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
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
              <div className="flex flex-col">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  onChange={handleFormChange}
                  required
                  className={cn(inputClass, getBorderClass("firstName"))}
                  value={shipInfo.firstName}
                />
                {errors.firstName && (
                  <ErrorField message="First name must be at least 2 characters" />
                )}
              </div>

              <div className="flex flex-col">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  onChange={handleFormChange}
                  required
                  className={cn(inputClass, getBorderClass("lastName"))}
                  value={shipInfo.lastName}
                />
                {errors.lastName && (
                  <ErrorField message="Last name must be at least 2 characters" />
                )}
              </div>

              <div className="flex flex-col">
                <input
                  type="text"
                  name="addressLine1"
                  placeholder="Address Line 1"
                  onChange={handleFormChange}
                  required
                  className={cn(inputClass, getBorderClass("addressLine1"))}
                  value={shipInfo.addressLine1}
                />
                {errors.addressLine1 && (
                  <ErrorField message="Address must be at least 5 characters" />
                )}
              </div>

              <div className="flex flex-col">
                <input
                  type="text"
                  name="addressLine2"
                  placeholder="Address Line 2 (optional)"
                  onChange={handleFormChange}
                  className={inputClass}
                  value={shipInfo.addressLine2}
                />
              </div>

              <div className="flex flex-col">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  onChange={handleFormChange}
                  required
                  className={cn(inputClass, getBorderClass("city"))}
                  value={shipInfo.city}
                />
                {errors.city && (
                  <ErrorField message="City must be at least 2 characters" />
                )}
              </div>

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
                      "h-auto min-h-[48px]",
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
                    className="bg-white border border-zinc-200 shadow-xl overflow-y-auto max-h-[300px]"
                    position="popper"
                    sideOffset={5}
                  >
                    {US_STATES.map((state) => (
                      <SelectItem
                        key={state.code}
                        value={state.code}
                        className="cursor-pointer text-xs font-black uppercase py-3"
                      >
                        {state.code} — {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && (
                  <ErrorField message="Please select your state" />
                )}
              </div>

              <div className="flex flex-col">
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
                {errors.zipCode && (
                  <ErrorField message="Zip code must be 5 digits" />
                )}
              </div>

              <div className="flex flex-col">
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
                {errors.contact && (
                  <ErrorField message="Enter a valid phone number (12 digits)" />
                )}
              </div>
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
          <OrderReceipt
            key={totalPrice}
            cartList={cartList}
            totalPrice={totalPrice}
          />
        </aside>
      </form>
      <ConfirmModal
        isOpen={showStockModal}
        title={
          allOutOfStock ? "ALL ITEMS OUT OF STOCK" : "STOCK UPDATE REQUIRED"
        }
        confirmText={allOutOfStock ? "CONTINUE SHOPPING" : "UPDATE"}
        cancelText={allOutOfStock ? "" : "CANCEL"}
        variant="danger"
        confirmButtonDisabled={
          !allOutOfStock && invalidItems.some((i) => i.actualStock === 0)
        }
        onConfirm={allOutOfStock ? handleContinueShopping : handleStockConfirm}
        onClose={() => !allOutOfStock && setShowStockModal(false)}
        description={
          <div className="w-full space-y-6">
            <p className="text-xs text-zinc-500 text-center leading-relaxed">
              {allOutOfStock
                ? "We're sorry, all items in your cart are sold out. Please explore our other products."
                : "Some items are low on stock. Please adjust quantities or remove items."}
            </p>

            <div className="space-y-4 border-zinc-100 pt-2 max-h-[400px] overflow-y-auto pr-1">
              {invalidItems.map((item, index) => {
                const productId = item.productId;
                const isItemOutOfStock = item.actualStock === 0;

                const currentCartItem = cartList.find(
                  (c: any) =>
                    (c.productId?._id || c.productId) === productId &&
                    c.size === item.size,
                );
                const requestedQty = currentCartItem?.qty || "?";

                return (
                  <div
                    key={index}
                    className="flex gap-2 p-2 bg-zinc-100/50 rounded-sm mb-4"
                  >
                    <div className="size-18 bg-white border border-zinc-200 shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col flex-1 text-left justify-center min-w-0">
                      <h3 className="text-[11px] font-black text-zinc-800 uppercase leading-tight line-clamp-2">
                        {item.productName}
                      </h3>
                      <div className="mt-1 space-y-0.5">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">
                          SIZE: {item.size}
                        </p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">
                          QTY: {requestedQty}
                        </p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">
                          STOCK:{" "}
                          <span className="text-red-600">
                            {isItemOutOfStock ? "SOLD OUT" : item.actualStock}
                          </span>
                        </p>
                      </div>

                      {!allOutOfStock && (
                        <div className="flex items-center gap-3 mt-3">
                          {isItemOutOfStock ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-red-600 leading-tight uppercase">
                                Item Unavailable
                              </span>
                              <span className="text-[9px] font-bold text-zinc-500 leading-tight uppercase">
                                Please remove to proceed
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(productId)}
                                className="text-red-500 hover:bg-zinc-500 p-1 rounded-full"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center border border-zinc-200 bg-white px-2 py-1">
                                <button
                                  type="button"
                                  disabled={tempQtys[productId] <= 1}
                                  onClick={() =>
                                    setTempQtys((p) => ({
                                      ...p,
                                      [productId]: p[productId] - 1,
                                    }))
                                  }
                                  className="px-2 text-zinc-400 disabled:opacity-20"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center text-xs font-black">
                                  {tempQtys[productId]}
                                </span>
                                <button
                                  type="button"
                                  disabled={
                                    tempQtys[productId] >= item.actualStock
                                  }
                                  onClick={() =>
                                    setTempQtys((p) => ({
                                      ...p,
                                      [productId]: p[productId] + 1,
                                    }))
                                  }
                                  className="px-2 text-zinc-400 disabled:opacity-20"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(productId)}
                                className="text-zinc-300 hover:text-red-600 p-1"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {allOutOfStock && (
                <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
                    [ Note ] <br />
                    Clicking below will clear your current cart
                  </p>
                </div>
              )}
            </div>
          </div>
        }
      />
    </div>
  );
};

export default PaymentPage;
