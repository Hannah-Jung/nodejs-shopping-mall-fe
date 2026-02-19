import { useEffect } from "react";
import CartProductCard from "./component/CartProductCard";
import OrderReceipt from "../PaymentPage/component/OrderReceipt";
import "./style/cart.style.css";
import { getCartList } from "../../features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import type { CartProductCardItem } from "./component/CartProductCard";

const CartPage = () => {
  const dispatch = useAppDispatch();
  const { cartList } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCartList());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-7">
          {cartList.length > 0 ? (
            cartList.map((item, index) => (
              <CartProductCard
                item={item as unknown as CartProductCardItem}
                key={item._id ?? index}
              />
            ))
          ) : (
            <div className="text-align-center empty-bag">
              <h2>The cart is empty.</h2>
              <div>Please add items.</div>
            </div>
          )}
        </div>
        <div className="md:col-span-5">
          <OrderReceipt />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
