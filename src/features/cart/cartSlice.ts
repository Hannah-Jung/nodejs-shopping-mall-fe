import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import { showToastMessage } from "../common/uiSlice";
import api from "@/utils/api";
import { act } from "react";

export interface CartItem {
  _id?: string;
  productId?: string;
  size: string;
  qty: number;
}

export interface CartState {
  loading: boolean;
  error: string;
  cartList: CartItem[];
  selectedItem: Record<string, unknown>;
  cartItemCount: number;
  totalPrice: number;
}

const initialState: CartState = {
  loading: false,
  error: "",
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
};

export const addToCart = createAsyncThunk<
  any,
  { id: string; size: string },
  { rejectValue: string; dispatch: AppDispatch }
>("cart/addToCart", async ({ id, size }, { rejectWithValue, dispatch }) => {
  try {
    const response = await api.post("/cart", { productId: id, size, qty: 1 });

    if (response.status !== 200) throw new Error(response.data.error);

    dispatch(
      showToastMessage({
        message: "Added an item to cart successfully!",
        status: "success",
      }),
    );

    return response.data.cartItemQty;
  } catch (error: any) {
    dispatch(
      showToastMessage({
        message: error.error || "Failed to add an item to cart",
        status: "error",
      }),
    );
    return rejectWithValue(error.error);
  }
});

export const getCartList = createAsyncThunk<
  unknown,
  void,
  { rejectValue: string; dispatch: AppDispatch }
>("cart/getCartList", async (_, { rejectWithValue, dispatch }) => {
  void dispatch;
  void rejectWithValue;
  return undefined;
});

export const deleteCartItem = createAsyncThunk<
  unknown,
  string,
  { rejectValue: string; dispatch: AppDispatch }
>("cart/deleteCartItem", async (_id, { rejectWithValue, dispatch }) => {
  void dispatch;
  void rejectWithValue;
  return undefined;
});

export const updateQty = createAsyncThunk<
  unknown,
  { id: string; value: number },
  { rejectValue: string }
>("cart/updateQty", async (_arg, { rejectWithValue }) => {
  void rejectWithValue;
  return undefined;
});

export const getCartQty = createAsyncThunk<
  any,
  void,
  { rejectValue: string; dispatch: AppDispatch }
>("cart/getCartQty", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/cart/qty");
    if (response.status !== 200) throw new Error(response.data.error);
    return response.data.qty;
  } catch (error: any) {
    const errMsg = error.response?.data?.error || error.message;
    return rejectWithValue(errMsg);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    logoutCart(state) {
      state.cartItemCount = 0;
      state.cartList = [];
      state.totalPrice = 0;
      state.error = "";
      state.loading = false;
    },
    initialCart(state) {
      state.cartItemCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addToCart.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.cartItemCount = action.payload;
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "";
    });
    builder.addCase(getCartQty.fulfilled, (state, action) => {
      state.cartItemCount = action.payload;
    });
  },
});

export default cartSlice.reducer;
export const { initialCart, logoutCart } = cartSlice.actions;
