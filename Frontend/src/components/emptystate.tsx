import { BarChart3 } from "lucide-react";
import Button from "./button";

interface EmptyStateProps {
  onAddAsset: () => void;
}

export default function EmptyState({ onAddAsset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6">
        <BarChart3 className="w-10 h-10 text-slate-600" />
      </div>
      <h2 className="text-xl font-semibold text-slate-100 mb-2">
        No assets yet
      </h2>
      <p className="text-slate-400 mb-6 max-w-sm">
        Add your first asset to start receiving buy and sell recommendations.
      </p>
      <Button onClick={onAddAsset}>Add your first asset</Button>
    </div>
  );
}