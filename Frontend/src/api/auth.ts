import { apiFetch } from "./client";
import { Endpoints } from "./config";
import type {LoginRequest,LoginResponse,RegisterRequest,User,} from "../types";

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>(Endpoints.LOGIN, {
    method: "POST",
    body: credentials,
  });
}

export async function register(
  payload: RegisterRequest
): Promise<{ success: boolean; user: User }> {
  return apiFetch(Endpoints.REGISTER, {
    method: "POST",
    body: payload,
  });
}