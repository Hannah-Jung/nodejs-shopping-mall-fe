import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import type { User } from "@/types/user";
import type {
  AuthLoginResponse,
  ApiResponse,
  GetMeResponse,
} from "@/types/api";

export interface UserState {
  user: User | null;
  loading: boolean;
  loginError: string | null;
  registrationError: string | null;
  success: boolean;
}

const initialState: UserState = {
  user: null,
  loading: !!sessionStorage.getItem("token"),
  loginError: null,
  registrationError: null,
  success: false,
};

export const loginWithEmail = createAsyncThunk<
  AuthLoginResponse,
  { email: string; password: string },
  { rejectValue: string }
>("user/loginWithEmail", async (arg, { rejectWithValue }) => {
  try {
    const { data } = await api.post<AuthLoginResponse>("/auth/login", arg);
    sessionStorage.setItem("token", data.token ?? "");
    return data;
  } catch (err: unknown) {
    const e = err as {
      response?: { data?: { message?: string; error?: string } };
      message?: string;
    };
    const msg =
      e?.response?.data?.message ??
      e?.response?.data?.error ??
      e?.message ??
      "Invalid email or password. Please try again.";
    return rejectWithValue(msg);
  }
});

export const loginWithGoogle = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("user/loginWithGoogle", async (_token, { rejectWithValue }) => {
  void rejectWithValue;
});

export interface RegisterUserArg {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  navigate: (path: string) => void;
}

export const checkEmailAvailability = createAsyncThunk<
  { available: boolean; message?: string },
  string,
  { rejectValue: { available: boolean; message: string } }
>("user/checkEmailAvailability", async (email, { rejectWithValue }) => {
  try {
    const { data } = await api.get<{
      status: string;
      available: boolean;
      message?: string;
    }>("/user/check-email", { params: { email: email.trim() } });
    const available = data?.available ?? true;
    const message = data?.message ?? "This email is already registered";
    if (!available) {
      return rejectWithValue({ available: false, message });
    }
    return { available: true };
  } catch (err: unknown) {
    const e = err as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    const msg =
      e?.response?.data?.message ??
      e?.message ??
      "This email is already registered";
    return rejectWithValue({ available: false, message: msg });
  }
});

export const registerUser = createAsyncThunk<
  User,
  RegisterUserArg,
  { rejectValue: string; dispatch: AppDispatch }
>(
  "user/registerUser",
  async (
    { email, firstName, lastName, password, navigate },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const { data } = await api.post<ApiResponse<User>>("/user", {
        email,
        firstName,
        lastName,
        password,
      });
      dispatch(
        showToastMessage({ message: "Welcome aboard!", status: "success" }),
      );
      navigate("/login");
      if (!data.data) throw new Error("No user data");
      return data.data;
    } catch (err: unknown) {
      const e = err as { error?: string; message?: string };
      return rejectWithValue(
        e?.error ?? e?.message ?? "Unable to create account",
      );
    }
  },
);

export const loginWithToken = createAsyncThunk<
  GetMeResponse,
  void,
  { rejectValue: string }
>("user/loginWithToken", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get<GetMeResponse>("/user/me");
    return data;
  } catch (err: unknown) {
    const e = err as { error?: string; message?: string };
    return rejectWithValue(e?.error ?? "Failed to fetch user");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearErrors(state) {
      state.loginError = null;
      state.registrationError = null;
    },
    logout(state) {
      state.user = null;
      state.loginError = null;
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
        state.registrationError = action.payload ?? null;
      })
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.loginError = null;
        if (action.payload.token) {
          sessionStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload ?? null;
      })
      .addCase(loginWithToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
      })
      .addCase(loginWithToken.rejected, (state) => {
        state.loading = false;
        state.user = null;
      });
  },
});

export const { clearErrors, logout } = userSlice.actions;
export default userSlice.reducer;

export const logoutThunk =
  (): ((dispatch: AppDispatch) => void) => (dispatch: AppDispatch) => {
    sessionStorage.removeItem("token");
    dispatch(userSlice.actions.logout());
  };
