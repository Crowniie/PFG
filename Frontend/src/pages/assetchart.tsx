import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { ArrowLeft } from "lucide-react";
import type { ChartIndicator } from "../types";
import { getChartData } from "../api/chart";
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
  const navigate = useNavigate();

  const [indicators, setIndicators] = useState<ChartIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>("6M");

  useEffect(() => {
    if (!symbol) return;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await getChartData(symbol);
        setIndicators(response.indicators || []);
      } catch (err) {
        setError("Could not load chart data. Please try again.");
      }
      setLoading(false);
    }

    load();
  }, [symbol]);

  // points inside the selected timeframe
  const filtered = filterByTimeframe(indicators, timeframe);

  // last point, used by the side panel
  const latest =
    indicators.length > 0 ? indicators[indicators.length - 1] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors mb-4 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to portfolio
        </button>

        {/* Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-semibold">{symbol}</h1>
            <p className="text-slate-400 mt-1">Price history and indicators</p>
          </div>
          <TimeframeSelector value={timeframe} onChange={setTimeframe} />
        </header>

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
            {/* Charts (3/4 width) */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <PriceChart data={filtered} />
              <MacdChart data={filtered} />
            </div>

            {/* Side panel (1/4 width) */}
            <aside className="lg:col-span-1">
              <LatestIndicators latest={latest} />
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

// keep only the points newer than the timeframe's cutoff
function filterByTimeframe(indicators: ChartIndicator[], timeframe: Timeframe) {
  if (indicators.length === 0) return [];

  const now = new Date();
  let cutoff: Date | null = null;

  if (timeframe === "1M") {
    cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  } else if (timeframe === "3M") {
    cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  } else if (timeframe === "6M") {
    cutoff = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
  } else if (timeframe === "YTD") {
    cutoff = new Date(now.getFullYear(), 0, 1);
  } else if (timeframe === "1Y") {
    cutoff = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  } else {
    cutoff = null; // ALL
  }

  if (!cutoff) return indicators;
  return indicators.filter((p) => new Date(p.time) >= cutoff!);
}

interface TimeframeSelectorProps {
  value: Timeframe;
  onChange: (v: Timeframe) => void;
}

function TimeframeSelector({ value, onChange }: TimeframeSelectorProps) {
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
            <XAxis
              dataKey="time"
              tickFormatter={formatDateTick}
              stroke="#475569"
              tick={{ fontSize: 11 }}
            />
            <YAxis
              stroke="#475569"
              tick={{ fontSize: 11 }}
              domain={["auto", "auto"]}
              tickFormatter={(v) => "$" + v.toFixed(0)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                color: "#f1f5f9",
              }}
              labelFormatter={formatDateTick}
              formatter={(value: any, name: any) => [
                value != null ? "$" + Number(value).toFixed(2) : "—",
                name === "close" ? "Price" : name === "ma200" ? "MA200" : String(name ?? ""),
              ]}
            />
            <Line
              type="monotone"
              dataKey="close"
              stroke="#5eead4"
              strokeWidth={2}
              dot={false}
              name="close"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="ma200"
              stroke="#f59e0b"
              strokeWidth={1.5}
              dot={false}
              name="ma200"
              connectNulls
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function MacdChart({ data }: { data: ChartIndicator[] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
        MACD
      </h2>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <ComposedChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickFormatter={formatDateTick}
              stroke="#475569"
              tick={{ fontSize: 11 }}
            />
            <YAxis
              stroke="#475569"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => v.toFixed(1)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                color: "#f1f5f9",
              }}
              labelFormatter={formatDateTick}
              formatter={(value: any, name: any) => [
                value != null ? Number(value).toFixed(3) : "—",
                name === "macd"
                  ? "MACD"
                  : name === "signal"
                  ? "Signal"
                  : name === "histogram"
                  ? "Histogram"
                  : name,
              ]}
            />
            <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />
            <Bar
              dataKey="histogram"
              fill="#3b82f6"
              opacity={0.4}
              name="histogram"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="macd"
              stroke="#5eead4"
              strokeWidth={1.5}
              dot={false}
              name="macd"
              connectNulls
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="signal"
              stroke="#f59e0b"
              strokeWidth={1.5}
              dot={false}
              name="signal"
              connectNulls
              isAnimationActive={false}
            />
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
      <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
        Latest values
      </h2>
      <dl className="flex flex-col gap-3">
        <Stat label="Date" value={formatDateFull(latest.time)} />
        <Stat
          label="Price"
          value={latest.close != null ? "$" + latest.close.toFixed(2) : "—"}
          highlight
        />
        <Stat
          label="MA200"
          value={latest.ma200 != null ? "$" + latest.ma200.toFixed(2) : "—"}
        />
        <Stat
          label="MACD"
          value={latest.macd != null ? latest.macd.toFixed(3) : "—"}
        />
        <Stat
          label="Signal"
          value={latest.signal != null ? latest.signal.toFixed(3) : "—"}
        />
        <Stat
          label="Histogram"
          value={latest.histogram != null ? latest.histogram.toFixed(3) : "—"}
        />
      </dl>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <dt className="text-xs text-slate-500 uppercase tracking-wider">{label}</dt>
      <dd
        className={
          "font-mono text-sm " +
          (highlight ? "text-teal-300 font-medium" : "text-slate-200")
        }
      >
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
  } catch (e) {
    return "";
  }
}

function formatDateFull(iso: any): string {
  if (typeof iso !== "string") return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return "";
  }
}