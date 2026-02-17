import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";

/** 주문 한 줄 아이템 */
export interface OrderItem {
  productId: string;
  price: number;
  size: string;
  qty: number;
}

/** 주문 (API 응답 / 목록·상세 공용) */
export interface Order {
  _id: string;
  userId: string;
  status: string;
  totalPrice: number;
  shipTo: Record<string, unknown>;
  contact: Record<string, unknown>;
  orderNum?: string;
  items: OrderItem[];
  createdAt?: string;
}

export interface OrderState {
  orderList: Order[];
  orderNum: string;
  selectedOrder: Order | Record<string, unknown>;
  error: string;
  loading: boolean;
  totalPageNum: number;
}

const initialState: OrderState = {
  orderList: [],
  orderNum: "",
  selectedOrder: {},
  error: "",
  loading: false,
  totalPageNum: 1,
};

export const createOrder = createAsyncThunk<
  unknown,
  Record<string, unknown>,
  { rejectValue: string; dispatch: AppDispatch }
>("order/createOrder", async (_payload, { dispatch, rejectWithValue }) => {
  void dispatch;
  void rejectWithValue;
  return undefined;
});

export const getOrder = createAsyncThunk<
  unknown,
  void,
  { rejectValue: string; dispatch: AppDispatch }
>("order/getOrder", async (_, { rejectWithValue, dispatch }) => {
  void dispatch;
  void rejectWithValue;
  return undefined;
});

export const getOrderList = createAsyncThunk<
  unknown,
  string | Record<string, unknown> | undefined,
  { rejectValue: string; dispatch: AppDispatch }
>("order/getOrderList", async (_query, { rejectWithValue, dispatch }) => {
  void dispatch;
  void rejectWithValue;
  return undefined;
});

export interface UpdateOrderArg {
  id: string;
  status: string;
}

export const updateOrder = createAsyncThunk<
  unknown,
  UpdateOrderArg,
  { rejectValue: string; dispatch: AppDispatch }
>("order/updateOrder", async (_arg, { dispatch, rejectWithValue }) => {
  void dispatch;
  void rejectWithValue;
  return undefined;
});

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedOrder(
      state,
      action: { payload: Order | Record<string, unknown> },
    ) {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: () => {},
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
