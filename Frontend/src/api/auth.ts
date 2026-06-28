import { apiFetch } from "./client";
import { Endpoints } from "./config";
import type { LoginRequest, RegisterRequest } from "../types";

export async function login(credentials: LoginRequest) {
  return apiFetch(Endpoints.LOGIN, {
    method: "POST",
    body: credentials,
  });
}

export async function register(payload: RegisterRequest) {
  return apiFetch(Endpoints.REGISTER, {
    method: "POST",
    body: payload,
  });
}