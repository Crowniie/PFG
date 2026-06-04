import { apiFetch } from "./client";
import { Endpoints } from "./config";
import type {LoginRequest,LoginResponse,RegisterRequest,User,} from "../types";

//Calls the login endpoint with credentials in the LoginRequest format and returns a LoginResponse(success status, user info, and message)
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>(Endpoints.LOGIN, {
    method: "POST",
    body: credentials,
  });
}
//Calls the register endpoint with user details and returns a success status and user info if registration is successful. The payload is in the RegisterRequest format.
//If the request is not successful, or data alredy exists it will throw an error with the message from the API.
export async function register(
  payload: RegisterRequest
): Promise<{ success: boolean; user: User }> {
  return apiFetch(Endpoints.REGISTER, {
    method: "POST",
    body: payload,
  });
}