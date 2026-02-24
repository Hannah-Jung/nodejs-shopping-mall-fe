import React from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";
import { Lock, Unlock } from "lucide-react";

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

  return (
    <div className=" p-8 rounded-lg border border-zinc-200">
      <h2 className="text-xs font-black tracking-widest uppercase mb-8 text-zinc-700 text-center">
        ORDER DETAILS
      </h2>

      <div className="space-y-4 text-xs font-bold text-zinc-600">
        <div className="flex justify-between uppercase">
          <span>ITEMS ({cartList.length}):</span>
          <span>${currencyFormat(totalPrice)}</span>
        </div>
        <div className="flex flex-col gap-2">
          {" "}
          <div className="flex justify-between uppercase">
            <span>SHIPPING & HANDLING:</span>
            <span>
              {shippingFee === 0 ? "FREE" : `$${currencyFormat(shippingFee)}`}
            </span>
          </div>
          {totalPrice > 0 && (
            <div className="mt-2 text-[11px] font-bold tracking-tight uppercase flex items-center h-5">
              {shippingFee > 0 ? (
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <Lock
                    className="size-4 shrink-0 text-red-600"
                    strokeWidth={2.5}
                  />
                  <p>
                    Add{" "}
                    <span className="text-red-600 font-black">
                      ${currencyFormat(difference)}
                    </span>{" "}
                    more to unlock{" "}
                    <span className="text-zinc-500 font-black">
                      FREE SHIPPING
                    </span>
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-zinc-500 font-black">
                  <Unlock
                    className="size-4 shrink-0 text-green-600"
                    strokeWidth={2.5}
                  />
                  <p>FREE SHIPPING UNLOCKED</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="h-px bg-zinc-200 my-6" />

        <div className="flex justify-between text-base font-black text-zinc-900 uppercase tracking-tight">
          <span>ORDER TOTAL:</span>
          <span>${currencyFormat(totalPrice + shippingFee)}</span>
        </div>
      </div>

      <button className="w-full mt-10 bg-zinc-900 text-white py-4 rounded-md font-black text-xs uppercase tracking-widest hover:bg-primary transition-all active:scale-[0.98] cursor-pointer">
        PROCEED TO CHECKOUT
      </button>
    </div>
  );
};

export default OrderReceipt;
