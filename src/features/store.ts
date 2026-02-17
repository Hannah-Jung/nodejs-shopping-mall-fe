import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import uiSlice from "./common/uiSlice";
import productSlice from "./product/productSlice";
import cartSlice from "./cart/cartSlice";
import orderSlice from "./order/orderSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    product: productSlice,
    cart: cartSlice,
    ui: uiSlice,
    order: orderSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
