import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";

/** 상품 (API 응답 / 목록·상세 공용) */
export interface Product {
  _id: string;
  sku: string;
  name: string;
  image: string;
  category: string[];
  description: string;
  price: number;
  stock: Record<string, unknown>;
  status?: string;
  isDeleted?: boolean;
}

export interface ProductState {
  productList: Product[];
  filteredList?: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string;
  totalPageNum: number;
  success: boolean;
}

const initialState: ProductState = {
  productList: [],
  selectedProduct: null,
  loading: false,
  error: "",
  totalPageNum: 1,
  success: false,
};

export const getProductList = createAsyncThunk<
  unknown,
  string | Record<string, unknown> | undefined,
  { rejectValue: string }
>("products/getProductList", async (_query, { rejectWithValue }) => {
  void rejectWithValue;
  return undefined;
});

export const getProductDetail = createAsyncThunk<
  unknown,
  string,
  { rejectValue: string }
>("products/getProductDetail", async (_id, { rejectWithValue }) => {
  void rejectWithValue;
  return undefined;
});

export const createProduct = createAsyncThunk<
  unknown,
  FormData | Record<string, unknown>,
  { rejectValue: string; dispatch: AppDispatch }
>(
  "products/createProduct",
  async (_formData, { dispatch, rejectWithValue }) => {
    void dispatch;
    void rejectWithValue;
    return undefined;
  },
);

export const deleteProduct = createAsyncThunk<
  unknown,
  string,
  { rejectValue: string; dispatch: AppDispatch }
>("products/deleteProduct", async (_id, { dispatch, rejectWithValue }) => {
  void dispatch;
  void rejectWithValue;
  return undefined;
});

export interface EditProductArg {
  id: string;
  [key: string]: unknown;
}

export const editProduct = createAsyncThunk<
  unknown,
  EditProductArg,
  { rejectValue: string; dispatch: AppDispatch }
>("products/editProduct", async (_arg, { dispatch, rejectWithValue }) => {
  void dispatch;
  void rejectWithValue;
  return undefined;
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedProduct(state, action: { payload: Product | null }) {
      state.selectedProduct = action.payload;
    },
    setFilteredList(state, action: { payload: Product[] }) {
      state.filteredList = action.payload;
    },
    clearError(state) {
      state.error = "";
      state.success = false;
    },
  },
  extraReducers: () => {},
});

export const { setSelectedProduct, setFilteredList, clearError } =
  productSlice.actions;
export default productSlice.reducer;
