import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
// import api from "../../utils/api";
// import { showToastMessage } from "../common/uiSlice";

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
  unknown,
  { id: string; size: string },
  { rejectValue: string; dispatch: AppDispatch }
>("cart/addToCart", async (_arg, { rejectWithValue, dispatch }) => {
  void dispatch;
  void rejectWithValue;
  return undefined;
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
  unknown,
  void,
  { rejectValue: string; dispatch: AppDispatch }
>("cart/getCartQty", async (_, { rejectWithValue, dispatch }) => {
  void dispatch;
  void rejectWithValue;
  return undefined;
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initialCart(state) {
      state.cartItemCount = 0;
    },
  },
  extraReducers: () => {},
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
