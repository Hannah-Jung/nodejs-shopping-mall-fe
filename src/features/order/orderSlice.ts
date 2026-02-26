import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import api from "@/utils/api";
import { showToastMessage } from "../common/uiSlice";
import { getCartQty } from "../cart/cartSlice";

export interface OrderItem {
  productId: string;
  price: number;
  size: string;
  qty: number;
}

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
  string,
  Record<string, unknown>,
  { rejectValue: string; dispatch: AppDispatch }
>("order/createOrder", async (payload, { dispatch, rejectWithValue }) => {
  try {
    const response = await api.post("/order", payload);

    return response.data.orderNum;
  } catch (error: any) {
    return rejectWithValue(error);
  }
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
    resetOrderNum(state) {
      state.orderNum = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.orderNum = action.payload;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "An error occurred";
    });
  },
});

export const { setSelectedOrder, resetOrderNum } = orderSlice.actions;
export default orderSlice.reducer;
