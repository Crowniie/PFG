import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ComposedChart,
  Bar,
} from "recharts";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import type { ChartIndicator, Recommendation } from "../types";
import { getChartData } from "../api/chart";
import { getSignalsHistory } from "../api/signals";
import { decideRecommendation } from "../api/decide";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/navbar";
import Alert from "../components/alert";

type Timeframe = "1M" | "3M" | "6M" | "YTD" | "1Y" | "ALL";

const TIMEFRAMES: { value: Timeframe; label: string }[] = [
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "6M", label: "6M" },
  { value: "YTD", label: "YTD" },
  { value: "1Y", label: "1Y" },
  { value: "ALL", label: "All" },
];

export default function AssetChart() {
  const { symbol = "" } = useParams<{ symbol: string }>();
  const [searchParams] = useSearchParams();
  const recommendationId = searchParams.get("recommendation");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [indicators, setIndicators] = useState<ChartIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>("6M");
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null
  );
  const [deciding, setDeciding] = useState<null | "EXECUTE" | "IGNORE">(null);
  const [decisionMessage, setDecisionMessage] = useState<string | null>(null);

  // Load chart data
  useEffect(() => {
    if (!symbol) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getChartData(symbol);
        if (!cancelled) {
          setIndicators(response.indicators || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Could not load chart data. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [symbol]);

  // Load recommendation if id is in URL
  useEffect(() => {
    if (!recommendationId || !user) return;
    let cancelled = false;

    const load = async () => {
      try {
        const response = await getSignalsHistory(user.user_id);
        if (cancelled) return;
        const found = (response.recommendations || []).find(
          (r) => r.id === recommendationId
        );
        if (found) setRecommendation(found);
      } catch (err) {
        // silent - not critical
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [recommendationId, user?.user_id]);

  const handleDecide = async (action: "EXECUTE" | "IGNORE") => {
    if (!recommendation || !user) return;
    setDeciding(action);
    setDecisionMessage(null);
    try {
      const response = await decideRecommendation(
        recommendation.id,
        action,
        user.user_id
      );
      if (response.success) {
        setDecisionMessage(
          action === "EXECUTE"
            ? "Recommendation executed. Your portfolio has been updated."
            : "Recommendation ignored."
        );
        // Update local state so the panel reflects the new status
        setRecommendation({
          ...recommendation,
          action_taken: action === "EXECUTE" ? "EXECUTED" : "IGNORED",
        });
      } else {
        setDecisionMessage(
          response.error || "Could not record your decision. Please try again."
        );
      }
    } catch (err) {
      setDecisionMessage("Could not record your decision. Please try again.");
    } finally {
      setDeciding(null);
    }
  };

  const filtered = useMemo(() => {
    if (indicators.length === 0) return [];
    const now = new Date();
    let cutoff: Date | null = null;
    switch (timeframe) {
      case "1M":
        cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "3M":
        cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "6M":
        cutoff = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case "YTD":
        cutoff = new Date(now.getFullYear(), 0, 1);
        break;
      case "1Y":
        cutoff = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case "ALL":
      default:
        cutoff = null;
    }
    if (!cutoff) return indicators;
    return indicators.filter((p) => new Date(p.time) >= cutoff!);
  }, [indicators, timeframe]);

  const latest = indicators.length > 0 ? indicators[indicators.length - 1] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <button
          onClick={() => navigate(recommendation ? "/history" : "/dashboard")}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors mb-4 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {recommendation ? "Back to history" : "Back to portfolio"}
        </button>

        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-semibold">{symbol}</h1>
            <p className="text-slate-400 mt-1">
              {recommendation
                ? "Review the recommendation and decide"
                : "Price history and indicators"}
            </p>
          </div>
          <TimeframeSelector value={timeframe} onChange={setTimeframe} />
        </header>

        {/* Decision panel */}
        {recommendation && (
          <DecisionPanel
            recommendation={recommendation}
            onExecute={() => handleDecide("EXECUTE")}
            onIgnore={() => handleDecide("IGNORE")}
            deciding={deciding}
            message={decisionMessage}
          />
        )}

        {error && (
          <div className="mb-6">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-slate-400">
            Loading chart data…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            No data available for this timeframe.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 flex flex-col gap-6">
              <PriceChart data={filtered} />
              <MacdChart data={filtered} />
            </div>
            <aside className="lg:col-span-1">
              <LatestIndicators latest={latest} />
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

// Decision Panel ---------------------------------------------------------

interface DecisionPanelProps {
  recommendation: Recommendation;
  onExecute: () => void;
  onIgnore: () => void;
  deciding: null | "EXECUTE" | "IGNORE";
  message: string | null;
}

function DecisionPanel({
  recommendation,
  onExecute,
  onIgnore,
  deciding,
  message,
}: DecisionPanelProps) {
  const isPending = recommendation.action_taken === "PENDING";
  const isExecuted = recommendation.action_taken === "EXECUTED";
  const isIgnored = recommendation.action_taken === "IGNORED";

  return (
    <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
              {isPending
                ? "Pending recommendation"
                : isExecuted
                ? "Recommendation executed"
                : isIgnored
                ? "Recommendation ignored"
                : "Recommendation"}
            </span>
            <SignalChip signal={recommendation.signal_type} />
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {recommendation.explanation}
          </p>
          <div className="text-xs text-slate-500 mt-1">
            Price at recommendation:{" "}
            <span className="font-mono text-slate-300">
              ${recommendation.price_at_recommendation?.toFixed(2) ?? "--"}
            </span>
          </div>
        </div>

        {isPending && (
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={onExecute}
              disabled={deciding !== null}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 rounded-lg transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              {deciding === "EXECUTE" ? "Executing…" : "Execute"}
            </button>
            <button
              onClick={onIgnore}
              disabled={deciding !== null}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <XCircle className="w-4 h-4" />
              {deciding === "IGNORE" ? "Ignoring…" : "Ignore"}
            </button>
          </div>
        )}
      </div>

      {message && (
        <div className="text-sm text-teal-300 mt-2 pt-3 border-t border-slate-800">
          {message}
        </div>
      )}
    </div>
  );
}

function SignalChip({ signal }: { signal: Recommendation["signal_type"] }) {
  const styles: Record<string, string> = {
    BUY_50: "bg-teal-500/10 text-teal-300 border-teal-500/20",
    BUY_100: "bg-teal-500/20 text-teal-200 border-teal-500/30",
    SELL_50: "bg-red-500/10 text-red-300 border-red-500/20",
    SELL_100: "bg-red-500/20 text-red-200 border-red-500/30",
    HOLD: "bg-slate-800 text-slate-400 border-slate-700",
  };
  const labels: Record<string, string> = {
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

// Subcomponents (chart) -----------------------------------------------------

function TimeframeSelector({
  value,
  onChange,
}: {
  value: Timeframe;
  onChange: (v: Timeframe) => void;
}) {
  return (
    <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf.value}
          onClick={() => onChange(tf.value)}
          className={
            value === tf.value
              ? "px-3 py-1.5 text-xs font-medium bg-teal-500/20 text-teal-300 rounded"
              : "px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-100 transition-colors"
          }
        >
          {tf.label}
        </button>
      ))}
    </div>
  );
}

function PriceChart({ data }: { data: ChartIndicator[] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
        Price &amp; MA200
      </h2>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
            <XAxis dataKey="time" tickFormatter={formatDateTick} stroke="#475569" tick={{ fontSize: 11 }} />
            <YAxis stroke="#475569" tick={{ fontSize: 11 }} domain={["auto", "auto"]} tickFormatter={(v) => `$${v.toFixed(0)}`} />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", color: "#f1f5f9" }}
              labelFormatter={formatDateTick}
              formatter={(value: any, name: any) => [
                value != null ? `$${Number(value).toFixed(2)}` : "—",
                name === "close" ? "Price" : name === "ma200" ? "MA200" : String(name ?? ""),
              ]}
            />
            <Line type="monotone" dataKey="close" stroke="#5eead4" strokeWidth={2} dot={false} name="close" isAnimationActive={false} />
            <Line type="monotone" dataKey="ma200" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="ma200" connectNulls isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function MacdChart({ data }: { data: ChartIndicator[] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">MACD</h2>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <ComposedChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
            <XAxis dataKey="time" tickFormatter={formatDateTick} stroke="#475569" tick={{ fontSize: 11 }} />
            <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickFormatter={(v) => v.toFixed(1)} />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", color: "#f1f5f9" }}
              labelFormatter={formatDateTick}
              formatter={(value: any, name: any) => [
                value != null ? Number(value).toFixed(3) : "—",
                name === "macd" ? "MACD" : name === "signal" ? "Signal" : name === "histogram" ? "Histogram" : String(name ?? ""),
              ]}
            />
            <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />
            <Bar dataKey="histogram" fill="#3b82f6" opacity={0.4} name="histogram" isAnimationActive={false} />
            <Line type="monotone" dataKey="macd" stroke="#5eead4" strokeWidth={1.5} dot={false} name="macd" connectNulls isAnimationActive={false} />
            <Line type="monotone" dataKey="signal" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="signal" connectNulls isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LatestIndicators({ latest }: { latest: ChartIndicator | null }) {
  if (!latest) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <p className="text-sm text-slate-400">No data yet.</p>
      </div>
    );
  }
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Latest values</h2>
      <dl className="flex flex-col gap-3">
        <Stat label="Date" value={formatDateFull(latest.time)} />
        <Stat label="Price" value={latest.close != null ? `$${latest.close.toFixed(2)}` : "—"} highlight />
        <Stat label="MA200" value={latest.ma200 != null ? `$${latest.ma200.toFixed(2)}` : "—"} />
        <Stat label="MACD" value={latest.macd != null ? latest.macd.toFixed(3) : "—"} />
        <Stat label="Signal" value={latest.signal != null ? latest.signal.toFixed(3) : "—"} />
        <Stat label="Histogram" value={latest.histogram != null ? latest.histogram.toFixed(3) : "—"} />
      </dl>
    </div>
  );
}

function Stat({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <dt className="text-xs text-slate-500 uppercase tracking-wider">{label}</dt>
      <dd className={`font-mono text-sm ${highlight ? "text-teal-300 font-medium" : "text-slate-200"}`}>
        {value}
      </dd>
    </div>
  );
}

function formatDateTick(iso: any): string {
  if (typeof iso !== "string") return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

function formatDateFull(iso: any): string {
  if (typeof iso !== "string") return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}