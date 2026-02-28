import { useEffect } from "react";
import CartProductCard from "./component/CartProductCard";
import OrderReceipt from "../PaymentPage/component/OrderReceipt";
import "./style/cart.style.css";
import { getCartList } from "../../features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import type { CartProductCardItem } from "./component/CartProductCard";
import { ShoppingCart, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import Spinner from "@/components/ui/spinner";

const CartPage = () => {
  const dispatch = useAppDispatch();
  const { cartList, totalPrice, loading, error } = useAppSelector(
    (state) => state.cart,
  );

  useEffect(() => {
    dispatch(getCartList());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(getCartList());
  };

  return (
    <div className="max-w-6xl lg:max-w-5xl mx-auto lg:px-16 px-4 py-12">
      <h1 className="text-2xl font-black mb-10 tracking-tight uppercase">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
              <Spinner />
              <p className="mt-4 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] animate-pulse">
                Loading your items
              </p>
            </div>
          ) : error && cartList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16  rounded-2xl border ">
              <TriangleAlert size={64} className="text-zinc-900 mb-6" />
              <h2 className="text-lg font-bold text-zinc-900 mb-2 uppercase">
                Connection Error
              </h2>
              <p className="text-zinc-500 text-[11px] font-medium mb-8 uppercase text-center px-6">
                {error}
              </p>
              <button
                onClick={handleRetry}
                className="min-w-[160px] h-12 bg-zinc-900 text-white px-6 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-primary transition-all active:scale-95 cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : cartList.length > 0 ? (
            cartList.map((item, index) => (
              <CartProductCard item={item} key={item._id ?? index} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-zinc-50 rounded-2xl border border-zinc-200">
              <div className="bg-white p-5 rounded-full shadow-sm mb-6 border border-zinc-100">
                <ShoppingCart className="size-8 text-zinc-300" />
              </div>
              <p className="uppercase text-sm text-zinc-500 mb-8 font-bold tracking-tight">
                Looks like your cart is empty
              </p>
              <Link
                to="/"
                className="inline-flex items-center justify-center min-w-[200px] h-12 bg-zinc-900 text-white px-8 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-primary transition-all duration-500"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>

        <aside className="lg:col-span-4 sticky top-24">
          <OrderReceipt cartList={cartList} totalPrice={totalPrice} />
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
