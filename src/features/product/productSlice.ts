import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import api from "@/utils/api";
import { showToastMessage } from "../common/uiSlice";

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

interface GetProductListResponse {
  productList: Product[];
  totalPageNum: number;
}

export const getProductList = createAsyncThunk<
  GetProductListResponse,
  string | Record<string, unknown> | undefined,
  { rejectValue: string }
>("products/getProductList", async (query, { rejectWithValue }) => {
  try {
    const params =
      typeof query === "object" && query !== null
        ? query
        : { page: 1, name: "" };
    const { data } = await api.get<GetProductListResponse>("/product", {
      params: { page: params?.page ?? 1, name: params?.name ?? "" },
    });
    return data;
  } catch (e: unknown) {
    const err = e as { error?: string };
    return rejectWithValue(err?.error ?? "Get product list failed");
  }
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
>("products/createProduct", async (formData, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await api.post("/product", formData);
    dispatch(
      showToastMessage({
        message: "Product added successfully!",
        status: "success",
      }),
    );
    return data;
  } catch (e: unknown) {
    const err = e as { error?: string };
    return rejectWithValue(err?.error ?? "Create failed");
  }
});

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
>("products/editProduct", async ({ id, ...body }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/product/${id}`, body);
    return data;
  } catch (e: unknown) {
    const err = e as { error?: string };
    return rejectWithValue(err?.error ?? "Edit failed");
  }
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
  extraReducers: (builder) => {
    builder.addCase(getProductList.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(getProductList.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.productList = action.payload?.productList ?? [];
      state.totalPageNum = action.payload?.totalPageNum ?? 1;
    });
    builder.addCase(getProductList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Get product list failed";
    });
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(createProduct.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
      state.error = "";
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Create failed";
      state.success = false;
    });
    builder.addCase(editProduct.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(editProduct.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
      state.error = "";
    });
    builder.addCase(editProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Edit failed";
    });
  },
});

export const { setSelectedProduct, setFilteredList, clearError } =
  productSlice.actions;
export default productSlice.reducer;
