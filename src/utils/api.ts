import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiResponse } from "@/types/api";

const LOCAL_BACKEND = import.meta.env.VITE_LOCAL_BACKEND as string | undefined;
const PROD_BACKEND = import.meta.env.VITE_PROD_BACKEND as string | undefined;
const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";
const BASE_URL =
  (isLocal ? LOCAL_BACKEND || PROD_BACKEND : PROD_BACKEND || LOCAL_BACKEND) ??
  "";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    authorization: `Bearer ${sessionStorage.getItem("token") ?? ""}`,
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers.authorization = `Bearer ${sessionStorage.getItem("token") ?? ""}`;
    return config;
  },
  (error) => {
    console.log("REQUEST ERROR", error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    const errorData =
      error?.response?.data ??
      (error?.message
        ? { error: error.message }
        : { error: "An error occurred" });
    console.log("RESPONSE ERROR", errorData);
    return Promise.reject(errorData);
  },
);

export default api;
