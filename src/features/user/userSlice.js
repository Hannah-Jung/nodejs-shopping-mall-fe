import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {},
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {},
);

export const logout = () => (dispatch) => {};
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, firstName, lastName, password, navigate },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const response = await api.post("/user", {
        email,
        firstName,
        lastName,
        password,
      });
      dispatch(
        showToastMessage({ message: "Welcome aboard!", status: "success" }),
      );
      navigate("/login");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.error ?? error?.message ?? "Unable to create account",
      );
    }
  },
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {},
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.registrationError = action.payload;
      });
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
