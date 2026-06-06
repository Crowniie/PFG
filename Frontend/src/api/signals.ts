import { apiFetch } from "./client";
import { Endpoints } from "./config";
import type { Recommendation } from "../types";
 
export async function getSignalsHistory(
  userId: string
): Promise<{
  success: boolean;
  recommendations: Recommendation[];
  count: number;
}> {
  const url = `${Endpoints.GET_SIGNALS_HISTORY}?user_id=${encodeURIComponent(
    userId
  )}`;
  return apiFetch(url, { method: "GET" });
}
 