import { apiFetch } from "./client";
import { Endpoints } from "./config";
import type { AddPortfolioRequest } from "../types";

export async function getPortfolio(userId: string) {
  const url =
    Endpoints.GET_PORTFOLIO + "?user_id=" + encodeURIComponent(userId);
  return apiFetch(url, { method: "GET" });
}

export async function addPortfolioAsset(payload: AddPortfolioRequest) {
  return apiFetch(Endpoints.ADD_PORTFOLIO, {
    method: "POST",
    body: payload,
  });
}

export async function removePortfolioAsset(
  userId: string,
  assetSymbol: string
) {
  return apiFetch(Endpoints.REMOVE_PORTFOLIO, {
    method: "POST",
    body: { user_id: userId, asset_symbol: assetSymbol },
  });
}

export async function updateTarget(
  userId: string,
  assetSymbol: string,
  targetQuantity: number
) {
  return apiFetch(Endpoints.UPDATE_TARGET, {
    method: "POST",
    body: {
      user_id: userId,
      asset_symbol: assetSymbol,
      target_quantity: targetQuantity,
    },
  });
}

export async function getAssets() {
  return apiFetch(Endpoints.GET_ASSETS, { method: "GET" });
}