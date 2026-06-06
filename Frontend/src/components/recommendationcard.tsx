import type { Recommendation, SignalType, ActionTaken } from "../types";

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export default function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
      {/* Top row: ticker + badges + date */}
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
            ? `$${recommendation.price_at_recommendation.toFixed(2)}`
            : "--"}
        </span>
      </div>

      {/* Explanation */}
      {recommendation.explanation && (
        <p className="text-sm text-slate-300 leading-relaxed border-l-2 border-slate-800 pl-3">
          {recommendation.explanation}
        </p>
      )}
    </div>
  );
}

// Helpers ---------------------------------------------------------------

function SignalBadge({ signal }: { signal: SignalType }) {
  const styles: Record<SignalType, string> = {
    BUY_50: "bg-teal-500/10 text-teal-300 border-teal-500/20",
    BUY_100: "bg-teal-500/20 text-teal-200 border-teal-500/30",
    SELL_50: "bg-red-500/10 text-red-300 border-red-500/20",
    SELL_100: "bg-red-500/20 text-red-200 border-red-500/30",
    HOLD: "bg-slate-800 text-slate-400 border-slate-700",
  };
  const labels: Record<SignalType, string> = {
    BUY_50: "BUY 50%",
    BUY_100: "BUY 100%",
    SELL_50: "SELL 50%",
    SELL_100: "SELL 100%",
    HOLD: "HOLD",
  };
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium tracking-wider border ${styles[signal]}`}
    >
      {labels[signal]}
    </span>
  );
}

function ActionBadge({ action }: { action: ActionTaken }) {
  const styles: Record<ActionTaken, string> = {
    EXECUTED: "border-teal-400/40 text-teal-300",
    IGNORED: "border-slate-600 text-slate-400",
    STOP_LOSS: "border-red-400/40 text-red-300",
    PENDING: "border-amber-400/40 text-amber-300",
  };
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium tracking-wider border bg-transparent ${styles[action]}`}
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
  } catch {
    return iso;
  }
}