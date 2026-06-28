import { apiFetch } from "./client";
import { Endpoints } from "./config";

export async function getSignalsHistory(userId: string) {
  const url =
    Endpoints.GET_SIGNALS_HISTORY + "?user_id=" + encodeURIComponent(userId);
  return apiFetch(url, { method: "GET" });
}