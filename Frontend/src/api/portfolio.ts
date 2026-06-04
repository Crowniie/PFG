import { apiFetch } from "./client";
import { Endpoints } from "./config";
import type {AddPortfolioRequest,PortfolioAsset,Asset,} from "../types";

export async function getPortfolio(
  userId: string
): Promise<{ success: boolean; portfolio: PortfolioAsset[] }> {
  const url = `${Endpoints.GET_PORTFOLIO}?user_id=${encodeURIComponent(userId)}`;
  return apiFetch(url, { method: "GET" });
}

export async function addPortfolioAsset(
  payload: AddPortfolioRequest
): Promise<{ success: boolean; portfolio_asset: PortfolioAsset }> {
  return apiFetch(Endpoints.ADD_PORTFOLIO, {
    method: "POST",
    body: payload,
  });
}

export async function removePortfolioAsset(
  userId: string,
  assetSymbol: string
): Promise<{ success: boolean; message: string }> {
  return apiFetch(Endpoints.REMOVE_PORTFOLIO, {
    method: "POST",
    body: { user_id: userId, asset_symbol: assetSymbol },
  });
}

export async function updateTarget(
  userId: string,
  assetSymbol: string,
  targetQuantity: number
): Promise<{ success: boolean }> {
  return apiFetch(Endpoints.UPDATE_TARGET, {
    method: "POST",
    body: {
      user_id: userId,
      asset_symbol: assetSymbol,
      target_quantity: targetQuantity,
    },
  });
}

export async function getAssets(): Promise<{
  success: boolean;
  assets: Asset[];
  count: number;
}> {
  return apiFetch(Endpoints.GET_ASSETS, { method: "GET" });
}