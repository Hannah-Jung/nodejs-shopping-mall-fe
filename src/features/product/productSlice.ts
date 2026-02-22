import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import api from "@/utils/api";
import { showToastMessage } from "../common/uiSlice";

export interface Product {
  _id: string;
  sku: string;
  name: string;
  image: string[];
  category: string[];
  description: string;
  price: number;
  stock: Record<string, number>;
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
  totalCount: number;
  success: boolean;
}

const initialState: ProductState = {
  productList: [],
  selectedProduct: null,
  loading: false,
  error: "",
  totalPageNum: 1,
  totalCount: 0,
  success: false,
};

interface GetProductListResponse {
  productList: Product[];
  totalPageNum: number;
  totalCount: number;
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
      params: {
        page: params?.page ?? 1,
        name: params?.name ?? "",
        limit: params?.limit,
      },
    });
    return data;
  } catch (e: unknown) {
    const err = e as { error?: string };
    return rejectWithValue(err?.error ?? "Get product list failed");
  }
});

export const getProductDetail = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("products/getProductDetail", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/product/${id}`);
    return data.data;
  } catch (e: unknown) {
    const err = e as { error?: string };
    return rejectWithValue(err?.error ?? "Failed to load product information");
  }
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
    return rejectWithValue(err?.error ?? "Failed to create");
  }
});

export const deleteProduct = createAsyncThunk<
  string,
  string,
  { rejectValue: string; dispatch: AppDispatch }
>("products/deleteProduct", async (id, { dispatch, rejectWithValue }) => {
  try {
    await api.delete(`/product/${id}`);
    dispatch(
      showToastMessage({
        message: "Product deleted successfully!",
        status: "success",
      }),
    );
    return id;
  } catch (e: unknown) {
    const err = e as { error?: string };
    return rejectWithValue(err?.error ?? "Failed to delete");
  }
});
export interface EditProductArg {
  id: string;
  [key: string]: unknown;
}

export const editProduct = createAsyncThunk<
  unknown,
  EditProductArg,
  { rejectValue: string; dispatch: AppDispatch }
>(
  "products/editProduct",
  async ({ id, ...body }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/product/${id}`, body);
      dispatch(
        showToastMessage({
          message: "Product edited successfully!",
          status: "success",
        }),
      );
      return data;
    } catch (e: unknown) {
      const err = e as { error?: string };
      return rejectWithValue(err?.error ?? "Failed to edit");
    }
  },
);

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
      state.success = false;
    });
    builder.addCase(getProductList.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.productList = action.payload?.productList ?? [];
      state.totalPageNum = action.payload?.totalPageNum ?? 1;
      state.totalCount = action.payload?.totalCount ?? 0;
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
    builder.addCase(editProduct.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(editProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = "";
    });
    builder.addCase(editProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Update failed";
      state.success = false;
    });
    builder.addCase(deleteProduct.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
      state.error = "";
    });
    builder.addCase(getProductDetail.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProductDetail.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedProduct = action.payload;
    });
    builder.addCase(getProductDetail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Loading failed";
    });
  },
});

export const { setSelectedProduct, setFilteredList, clearError } =
  productSlice.actions;
export default productSlice.reducer;
