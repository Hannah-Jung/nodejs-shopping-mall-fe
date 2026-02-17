import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ToastStatus = "success" | "error" | "warning" | "";

export interface UiState {
  toastMessage: {
    message: string;
    status: ToastStatus;
  };
  open?: boolean;
}

const initialState: UiState = {
  toastMessage: { message: "", status: "" },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showToastMessage(
      state,
      action: PayloadAction<{ message: string; status: ToastStatus }>,
    ) {
      state.toastMessage = {
        message: action.payload.message,
        status: action.payload.status,
      };
    },
    hideToastMessage(state) {
      state.open = false;
    },
  },
});

export const { showToastMessage, hideToastMessage } = uiSlice.actions;
export default uiSlice.reducer;
