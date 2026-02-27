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
  totalCount: number;
}

const initialState: OrderState = {
  orderList: [],
  orderNum: "",
  selectedOrder: {},
  error: "",
  loading: false,
  totalPageNum: 1,
  totalCount: 0,
};

interface GetOrderListQuery {
  page?: number | string;
  ordernum?: string;
  limit?: number | string;
}

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
  { data: Order[]; totalPageNum: number },
  { page?: number } | void,
  { rejectValue: string; dispatch: AppDispatch }
>("order/getOrder", async (query, { rejectWithValue }) => {
  try {
    const response = await api.get("/order/me", {
      params: { ...(query as object) },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.error || "Failed to fetch orders");
  }
});

export const getOrderList = createAsyncThunk(
  "order/getOrderList",
  async (query: GetOrderListQuery, { rejectWithValue }) => {
    try {
      const response = await api.get("/order", { params: { ...query } });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.error);
    }
  },
);

export interface UpdateOrderArg {
  id: string;
  status: string;
}

export const updateOrder = createAsyncThunk<
  Order,
  UpdateOrderArg,
  { rejectValue: string; dispatch: AppDispatch }
>(
  "order/updateOrder",
  async ({ id, status }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/order/${id}`, { status });
      dispatch(
        showToastMessage({
          message: "Order status updated",
          status: "success",
        }),
      );
      return response.data.data;
    } catch (error: any) {
      dispatch(showToastMessage({ message: error.error, status: "error" }));
      return rejectWithValue(error.error);
    }
  },
);

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
    builder
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
      .addCase(getOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderList = action.payload.data;
        state.totalPageNum = action.payload.totalPageNum;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getOrderList.fulfilled, (state, action) => {
        state.loading = false;
        state.orderList = action.payload.data;
        state.totalPageNum = action.payload.totalPageNum;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
      });
  },
});

export const { setSelectedOrder, resetOrderNum } = orderSlice.actions;
export default orderSlice.reducer;
