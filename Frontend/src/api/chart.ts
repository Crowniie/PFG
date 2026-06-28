import { apiFetch } from "./client";
import { Endpoints } from "./config";

export async function getChartData(symbol: string) {
  const url =
    Endpoints.GET_CHART_DATA + "?symbol=" + encodeURIComponent(symbol);
  return apiFetch(url, { method: "GET" });
}