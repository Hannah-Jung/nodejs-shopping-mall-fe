import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import { showToastMessage } from "../common/uiSlice";
import api from "@/utils/api";
import { act } from "react";
import { createOrder } from "../order/orderSlice";

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
  { id: string; size: string; qty: number },
  { rejectValue: string; dispatch: AppDispatch }
>(
  "cart/addToCart",
  async ({ id, size, qty }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/cart", { productId: id, size, qty });

      if (response.status !== 200) throw new Error(response.data.error);

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
  },
);

export const getCartList = createAsyncThunk<any, void, { rejectValue: string }>(
  "cart/getCartList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/cart");

      if (response.status !== 200) throw new Error(response.data.error);

      return response.data.cartList;
    } catch (error: any) {
      const errMsg = error.response?.data?.error || error.message;
      return rejectWithValue(errMsg);
    }
  },
);

const calculateTotal = (list: any[]) => {
  return list.reduce((total, item) => {
    const itemPrice =
      item.sizePrice ||
      (item.productId?.price
        ? item.productId.price[item.size.toLowerCase()]
        : 0);
    return total + itemPrice * item.qty;
  }, 0);
};

export const deleteCartItem = createAsyncThunk<
  any,
  string,
  { rejectValue: string; dispatch: AppDispatch }
>("cart/deleteCartItem", async (id, { rejectWithValue, dispatch }) => {
  try {
    const response = await api.delete(`/cart/${id}`);
    if (response.status !== 200) throw new Error(response.data.error);

    dispatch(showToastMessage({ message: "Item deleted", status: "success" }));
    return response.data.cartList;
  } catch (error: any) {
    return rejectWithValue(error.error || "Failed to delete item");
  }
});

export const updateQty = createAsyncThunk<
  any,
  { id: string; value: number },
  { rejectValue: string }
>("cart/updateQty", async ({ id, value }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/cart/${id}`, { qty: value });
    if (response.status !== 200) throw new Error(response.data.error);
    return response.data.cartList;
  } catch (error: any) {
    return rejectWithValue(error.error || "Failed to update quantity");
  }
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
    builder.addCase(getCartQty.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getCartQty.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.cartItemCount = action.payload || 0;
    });
    builder.addCase(getCartQty.rejected, (state, action) => {
      state.loading = false;
      state.error =
        (action.payload as string) || "Failed to fetch cart quantity";
    });
    builder.addCase(getCartList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCartList.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";

      const list = action.payload || [];
      state.cartList = list;

      state.totalPrice = list.reduce((total: number, item: any) => {
        const itemPrice =
          item.sizePrice ||
          (item.productId?.price
            ? item.productId.price[item.size.toLowerCase()]
            : 0);
        return total + itemPrice * item.qty;
      }, 0);
    });
    builder.addCase(getCartList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(deleteCartItem.fulfilled, (state, action) => {
      state.loading = false;
      state.cartList = action.payload;
      state.totalPrice = calculateTotal(action.payload);
      state.cartItemCount = action.payload.length;
    });

    builder.addCase(updateQty.fulfilled, (state, action) => {
      state.loading = false;
      state.cartList = action.payload;
      state.totalPrice = calculateTotal(action.payload);
    });
    builder.addCase(createOrder.fulfilled, (state) => {
      state.cartList = [];
      state.totalPrice = 0;
      state.cartItemCount = 0;
    });
  },
});

export default cartSlice.reducer;
export const { initialCart, logoutCart } = cartSlice.actions;
