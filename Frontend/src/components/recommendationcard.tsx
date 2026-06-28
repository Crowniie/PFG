import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Recommendation, SignalType, ActionTaken } from "../types";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export default function RecommendationCard(props: RecommendationCardProps) {
  const { recommendation } = props;
  const navigate = useNavigate();

  const isPending = recommendation.action_taken === "PENDING";

  function handleReview() {
    navigate(
      "/asset/" +
        encodeURIComponent(recommendation.asset_symbol) +
        "/decide?recommendation=" +
        encodeURIComponent(recommendation.id)
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
      {/* Top row */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-2xl font-semibold text-slate-100">
            {recommendation.asset_symbol}
          </span>
          <SignalBadge signal={recommendation.signal_type} />
          <ActionBadge action={recommendation.action_taken} />
        </div>
        <span className="text-xs text-slate-500 font-mono">
          {formatDate(recommendation.created_at)}
        </span>
      </div>

      {/* Price */}
      <div className="text-sm text-slate-400">
        Price at recommendation:{" "}
        <span className="font-mono text-slate-200">
          {recommendation.price_at_recommendation !== null &&
          recommendation.price_at_recommendation !== undefined
            ? "$" + recommendation.price_at_recommendation.toFixed(2)
            : "--"}
        </span>
      </div>

      {/* Explanation */}
      {recommendation.explanation && (
        <p className="text-sm text-slate-300 leading-relaxed border-l-2 border-slate-800 pl-3">
          {recommendation.explanation}
        </p>
      )}

      {/* CTA only when pending */}
      {isPending && (
        <button
          onClick={handleReview}
          className="mt-2 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg border border-amber-400/30 hover:border-amber-400/50 transition-colors"
        >
          Review &amp; decide
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function SignalBadge({ signal }: { signal: SignalType }) {
  let style = "bg-slate-800 text-slate-400 border-slate-700";
  let label = "HOLD";

  if (signal === "BUY_50") {
    style = "bg-teal-500/10 text-teal-300 border-teal-500/20";
    label = "BUY 50%";
  } else if (signal === "BUY_100") {
    style = "bg-teal-500/20 text-teal-200 border-teal-500/30";
    label = "BUY 100%";
  } else if (signal === "SELL_50") {
    style = "bg-red-500/10 text-red-300 border-red-500/20";
    label = "SELL 50%";
  } else if (signal === "SELL_100") {
    style = "bg-red-500/20 text-red-200 border-red-500/30";
    label = "SELL 100%";
  }

  return (
    <span
      className={
        "px-2 py-1 rounded text-xs font-medium tracking-wider border " + style
      }
    >
      {label}
    </span>
  );
}

function ActionBadge({ action }: { action: ActionTaken }) {
  // PENDING is the default style
  let style = "border-amber-400/40 text-amber-300";

  if (action === "EXECUTED") {
    style = "border-teal-400/40 text-teal-300";
  } else if (action === "IGNORED") {
    style = "border-slate-600 text-slate-400";
  } else if (action === "STOP_LOSS") {
    style = "border-red-400/40 text-red-300";
  }

  return (
    <span
      className={
        "px-2 py-1 rounded text-xs font-medium tracking-wider border bg-transparent " +
        style
      }
    >
      {action}
    </span>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return iso;
  }
}