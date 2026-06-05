import { Pencil, Trash2 } from "lucide-react";
import type { PortfolioAsset, PositionState } from "../types";

interface PortfolioCardProps {
  asset: PortfolioAsset;
  onEdit: (asset: PortfolioAsset) => void;
  onRemove: (asset: PortfolioAsset) => void;
}

export default function PortfolioCard({
  asset,
  onEdit,
  onRemove,
}: PortfolioCardProps) {
  const progress =
    asset.target_quantity > 0
      ? Math.min(100, (asset.current_quantity / asset.target_quantity) * 100)
      : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold text-slate-100">
            {asset.asset_symbol}
          </h2>
        </div>
        <PositionBadge state={asset.position_state} />
      </div>

      <div className="border-b border-slate-800" />

      {/* Stats */}
      <div className="flex flex-col gap-3">
        <Row label="Target Qty" value={`${asset.target_quantity} units`} />
        <Row label="Current Qty" value={`${asset.current_quantity} units`} />
        <ProgressBar progress={progress} state={asset.position_state} />

        {asset.position_state !== "NONE" && (
          <Row
            label="Entry Price"
            value={
              asset.entry_price !== null && asset.entry_price !== undefined
                ? `$${asset.entry_price.toFixed(2)}`
                : "--"
            }
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => onEdit(asset)}
          className="flex-1 py-2 border border-slate-700 rounded-lg text-slate-400 hover:text-teal-400 hover:border-teal-400 transition-colors flex items-center justify-center gap-1.5 text-xs font-medium"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => onRemove(asset)}
          className="flex-1 py-2 border border-slate-700 rounded-lg text-slate-400 hover:text-red-400 hover:border-red-400 transition-colors flex items-center justify-center gap-1.5 text-xs font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Remove
        </button>
      </div>
    </div>
  );
}

// Helpers ---------------------------------------------------------------

function PositionBadge({ state }: { state: PositionState }) {
  const styles: Record<PositionState, string> = {
    NONE: "bg-slate-800 text-slate-400 border-slate-700",
    HALF_LONG: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    FULL_LONG: "bg-teal-500/10 text-teal-300 border-teal-500/20",
  };
  const labels: Record<PositionState, string> = {
    NONE: "NONE",
    HALF_LONG: "HALF LONG",
    FULL_LONG: "FULL LONG",
  };
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium tracking-wider border ${styles[state]}`}
    >
      {labels[state]}
    </span>
  );
}

interface RowProps {
  label: string;
  value: string;
  valueClass?: string;
}

function Row({ label, value, valueClass = "text-slate-100" }: RowProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={`font-mono text-sm ${valueClass}`}>{value}</span>
    </div>
  );
}

interface ProgressBarProps {
  progress: number;
  state: PositionState;
}

function ProgressBar({ progress, state }: ProgressBarProps) {
  const barColor =
    state === "FULL_LONG"
      ? "bg-teal-400"
      : state === "HALF_LONG"
      ? "bg-amber-400"
      : "bg-slate-700";

  return (
    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${barColor}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}