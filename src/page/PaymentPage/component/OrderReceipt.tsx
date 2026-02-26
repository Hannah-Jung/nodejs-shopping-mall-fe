import React from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";
import { Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderReceiptProps {
  cartList: any[];
  totalPrice: number;
}

const OrderReceipt = ({
  cartList,
  totalPrice,
}: {
  cartList: any[];
  totalPrice: number;
}) => {
  const FREE_SHIPPING_THRESHOLD = 75;
  const shippingFee =
    totalPrice >= FREE_SHIPPING_THRESHOLD || totalPrice === 0 ? 0 : 9.99;
  const difference = FREE_SHIPPING_THRESHOLD - totalPrice;
  const navigate = useNavigate();
  const location = useLocation();
  const isPaymentPage = location.pathname === "/payment";
  const totalQty = cartList.reduce((acc, item) => acc + item.qty, 0);

  const handleCheckout = () => {
    if (!cartList || cartList.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    navigate("/payment", { state: { fromCheckout: true } });
  };

  return (
    <div className="p-8 rounded-lg border border-zinc-200">
      <h2 className="text-xs font-black tracking-widest uppercase mb-6 text-zinc-700 text-center">
        ORDER DETAILS
      </h2>
      {isPaymentPage && (
        <div className="mb-6 space-y-3 border-b border-zinc-100 pb-6">
          {cartList.map((item) => {
            const product = item.productId;
            if (!product || typeof product === "string") return null;
            const unitPrice = product.price ? product.price[item.size] : 0;
            return (
              <div key={item._id} className="flex gap-3">
                <div className="size-12 bg-zinc-100 shrink-0 rounded overflow-hidden">
                  <img
                    src={item.productId.image[0]}
                    alt={item.productId.name}
                    className="size-full object-cover"
                  />
                </div>

                <div className="flex flex-col justify-between py-0.5 overflow-hidden">
                  <p className="text-[10px] font-black uppercase truncate text-zinc-900">
                    {item.productId.name}
                  </p>
                  <div className="flex gap-2 text-[9px] text-zinc-500 font-bold uppercase">
                    <span className="text-zinc-500">{item.size}</span>
                    <span className="text-zinc-300">|</span>
                    <span>${currencyFormat(unitPrice)}</span>
                    <span className="text-zinc-300">|</span>
                    <span>{item.qty}</span>
                  </div>
                  <p className="text-[10px] font-black text-zinc-900">
                    $
                    {currencyFormat(item.productId.price[item.size] * item.qty)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="space-y-3 text-xs font-bold text-zinc-600">
        <div className="space-y-3">
          <div className="flex justify-between uppercase">
            <span>ITEMS ({totalQty})</span>
            <span>${currencyFormat(totalPrice)}</span>
          </div>
          <div className="flex justify-between uppercase">
            <span>SHIPPING & HANDLING</span>
            <span>
              {shippingFee === 0 ? "FREE" : `$${currencyFormat(shippingFee)}`}
            </span>
          </div>
        </div>

        {totalPrice > 0 && !isPaymentPage && (
          <div className="border border-zinc-300 p-4 rounded-md">
            {shippingFee > 0 ? (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase">
                  <Lock
                    className="size-3 sm:size-3 shrink-0 text-red-600 mb-[1px]"
                    strokeWidth={2.5}
                  />
                  <p>
                    Add{" "}
                    <span className="text-red-600 font-black animate-pulse">
                      ${currencyFormat(difference)}
                    </span>{" "}
                    for free shipping
                  </p>
                </div>
                <button
                  onClick={() => navigate("/")}
                  className="text-[10px] font-black underline underline-offset-4 hover:text-primary transition-all cursor-pointer whitespace-nowrap"
                >
                  SHOP MORE
                </button>
              </div>
            ) : (
              <div className="flex justify-center items-center gap-2 text-[10px] text-green-600 font-black uppercase tracking-widest">
                <Unlock
                  className="size-3 sm:size-3 shrink-0 mb-[1px]"
                  strokeWidth={2.5}
                />
                <p>Free shipping unlocked</p>
              </div>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-zinc-200">
          <div className="flex justify-between text-base font-black text-zinc-900 uppercase tracking-tighter">
            <span>ORDER TOTAL</span>
            <span>${currencyFormat(totalPrice + shippingFee)}</span>
          </div>
        </div>
      </div>

      <button
        type={isPaymentPage ? "submit" : "button"}
        onClick={isPaymentPage ? undefined : handleCheckout}
        disabled={!cartList || cartList.length === 0}
        className={cn(
          "w-full mt-8 py-4 rounded-md font-black text-xs uppercase tracking-widest duration-500 transition-all",
          !cartList || cartList.length === 0
            ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
            : "bg-zinc-900 text-white hover:bg-primary cursor-pointer",
        )}
      >
        {isPaymentPage ? "PLACE ORDER" : "PROCEED TO CHECKOUT"}
      </button>
    </div>
  );
};

export default OrderReceipt;
