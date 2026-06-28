import { apiFetch } from "./client";
import { Endpoints } from "./config";

export async function decideRecommendation(
  recommendationId: string,
  action: "EXECUTE" | "IGNORE",
  userId: string
) {
  return apiFetch(Endpoints.DECIDE_RECOMMENDATION, {
    method: "POST",
    body: JSON.stringify({
      recommendation_id: recommendationId,
      action,
      user_id: userId,
    }),
  });
}