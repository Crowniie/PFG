import { apiFetch } from "./client";
import { Endpoints } from "./config";
import type { ChartDataResponse } from "../types";
 
export async function getChartData(symbol: string): Promise<ChartDataResponse> {
  const url = `${Endpoints.GET_CHART_DATA}?symbol=${encodeURIComponent(symbol)}`;
  return apiFetch(url, { method: "GET" });
}