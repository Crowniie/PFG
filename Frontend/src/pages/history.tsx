import { useEffect, useState } from "react";
import { History as HistoryIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getSignalsHistory } from "../api/signals";
import type { Recommendation, ActionTaken } from "../types";
import Navbar from "../components/navbar";
import Alert from "../components/alert";
import RecommendationCard from "../components/recommendationcard";

type FilterValue = "ALL" | ActionTaken;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "EXECUTED", label: "Executed" },
  { value: "IGNORED", label: "Ignored" },
];

export default function History() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterValue>("ALL");

  useEffect(() => {
    if (!user) return;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await getSignalsHistory(user.user_id);
        // drop HOLD signals, they aren't actionable
        const list = (response.recommendations || []).filter(
          (r: Recommendation) => r.signal_type !== "HOLD"
        );
        setRecommendations(list);
      } catch (err) {
        setError("Could not load your recommendations. Please try again.");
      }
      setLoading(false);
    }

    load();
  }, [user?.user_id]);

  // recommendations matching the active filter
  let filtered = recommendations;
  if (filter !== "ALL") {
    filtered = recommendations.filter((r) => r.action_taken === filter);
  }

  // count per tab
  const counts: Record<string, number> = { ALL: 0, EXECUTED: 0, IGNORED: 0 };
  for (const r of recommendations) {
    counts.ALL += 1;
    if (r.action_taken === "EXECUTED") counts.EXECUTED += 1;
    if (r.action_taken === "IGNORED") counts.IGNORED += 1;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold">Recommendations History</h1>
          <p className="text-slate-400 mt-1">
            All signals generated for your portfolio
          </p>
        </header>

        {recommendations.length > 0 && (
          <div className="flex gap-2 mb-6 border-b border-slate-800">
            {FILTERS.map((f) => (
              <FilterTab
                key={f.value}
                label={f.label}
                count={counts[f.value] ?? 0}
                active={filter === f.value}
                onClick={() => setFilter(f.value)}
              />
            ))}
          </div>
        )}

        {error && (
          <div className="mb-6">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-slate-400">
            Loading recommendations…
          </div>
        ) : recommendations.length === 0 ? (
          <EmptyHistory />
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No recommendations match this filter.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

interface FilterTabProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

function FilterTab(props: FilterTabProps) {
  const { label, count, active, onClick } = props;

  let className =
    "text-slate-400 hover:text-slate-100 transition-colors text-sm px-4 py-2";
  if (active) {
    className =
      "text-teal-400 font-medium text-sm px-4 py-2 border-b-2 border-teal-400 -mb-px";
  }

  return (
    <button onClick={onClick} className={className}>
      {label}
      <span className="ml-2 text-xs text-slate-500">({count})</span>
    </button>
  );
}

function EmptyHistory() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6">
        <HistoryIcon className="w-10 h-10 text-slate-600" />
      </div>
      <h2 className="text-xl font-semibold text-slate-100 mb-2">
        No recommendations yet
      </h2>
      <p className="text-slate-400 max-w-sm">
        Recommendations will appear here after the market closes and our system
        evaluates your portfolio.
      </p>
    </div>
  );
}