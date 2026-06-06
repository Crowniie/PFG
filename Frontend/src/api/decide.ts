import { apiFetch } from "./client";
import { Endpoints } from "./config";

export type DecisionAction = "EXECUTE" | "IGNORE";

export interface DecideResponse {
  success: boolean;
  action?: "EXECUTED" | "IGNORED";
  error?: string;
}

export async function decideRecommendation(
  recommendationId: string,
  action: DecisionAction,
  userId: string
): Promise<DecideResponse> {
  return apiFetch(Endpoints.DECIDE_RECOMMENDATION, {
    method: "POST",
    body: JSON.stringify({
      recommendation_id: recommendationId,
      action,
      user_id: userId,
    }),
  });
}