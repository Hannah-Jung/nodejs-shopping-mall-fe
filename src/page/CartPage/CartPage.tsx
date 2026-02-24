import { useEffect } from "react";
import CartProductCard from "./component/CartProductCard";
import OrderReceipt from "../PaymentPage/component/OrderReceipt";
import "./style/cart.style.css";
import { getCartList } from "../../features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import type { CartProductCardItem } from "./component/CartProductCard";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const CartPage = () => {
  const dispatch = useAppDispatch();
  const { cartList, totalPrice } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCartList());
  }, [dispatch]);

  return (
    <div className="max-w-6xl lg:max-w-5xl mx-auto lg:px-16 px-4 py-12">
      <h1 className="text-2xl font-black mb-10 tracking-tight uppercase">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-8 space-y-6">
          {cartList.length > 0 ? (
            cartList.map((item, index) => (
              <CartProductCard
                item={item as unknown as CartProductCardItem}
                key={item._id ?? index}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16.5 bg-zinc-50 rounded-2xl border-1 border border-zinc-200">
              <div className="bg-white p-4 rounded-full shadow-sm mb-6 border border-zinc-100">
                <ShoppingCart className="size-8 text-zinc-400" />
              </div>

              <p className="block sm:hidden text-sm text-zinc-500 mb-8 font-medium">
                Your cart is currently empty.
              </p>

              <p className="hidden sm:block text-sm text-zinc-500 mb-8 font-medium">
                Looks like you haven't added anything to your cart yet.
              </p>

              <Link
                to="/"
                className="relative z-10 inline-flex items-center justify-center min-w-[180px] h-12 bg-zinc-900 text-white px-8 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-primary transition-all active:scale-[0.98] cursor-pointer"
              >
                <span className="relative z-20">Start Shopping</span>
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
