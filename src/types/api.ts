import type { User } from "./user";

export interface ApiResponse<T = unknown> {
  status: "success" | "fail" | "error";
  data?: T;
  user?: User;
  token?: string;
  error?: string;
}

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthLoginResponse {
  status: "success";
  user: User;
  token: string;
}

export interface RegisterUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface RegisterUserResponse {
  status: "success";
  data: User;
}

export interface GetMeResponse {
  status: "success";
  user: User;
}
