import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getPortfolio,
  removePortfolioAsset,
  updateTarget,
} from "../api/portfolio";
import type { PortfolioAsset } from "../types";
import Navbar from "../components/navbar";
import Button from "../components/button";
import Input from "../components/input";
import Label from "../components/label";
import Alert from "../components/alert";
import Modal from "../components/modal";
import PortfolioCard from "../components/portfoliocard";
import EmptyState from "../components/emptystate";
import AddAssetModal from "../components/assetmodal";

export default function Dashboard() {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<PortfolioAsset | null>(null);
  const [removing, setRemoving] = useState<PortfolioAsset | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getPortfolio(user.user_id);
      setPortfolio(response.portfolio || []);
    } catch (err: any) {
      setError("Could not load your portfolio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id]);

  const handleAddAsset = () => {
    setAdding(true);
  };

  const handleAssetAdded = async () => {
    await fetchPortfolio();
  };

  const handleRemoveConfirm = async () => {
    if (!user || !removing) return;
    setActionError(null);
    try {
      await removePortfolioAsset(user.user_id, removing.asset_symbol);
      setRemoving(null);
      await fetchPortfolio();
    } catch (err: any) {
      setActionError("Could not remove the asset. Please try again.");
    }
  };

  const handleEditSave = async (newTarget: number) => {
    if (!user || !editing) return;
    setActionError(null);
    try {
      await updateTarget(user.user_id, editing.asset_symbol, newTarget);
      setEditing(null);
      await fetchPortfolio();
    } catch (err: any) {
      setActionError("Could not update the target. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-semibold">My Portfolio</h1>
            <p className="text-slate-400 mt-1">
              Tickers you're currently tracking
            </p>
          </div>
          {portfolio.length > 0 && (
            <Button onClick={handleAddAsset}>
              <span className="inline-flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                Add Asset
              </span>
            </Button>
          )}
        </header>

        {/* Error */}
        {error && (
          <div className="mb-6">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-16 text-slate-400">
            Loading portfolio…
          </div>
        ) : portfolio.length === 0 ? (
          <EmptyState onAddAsset={handleAddAsset} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((asset) => (
              <PortfolioCard
                key={asset.id}
                asset={asset}
                onEdit={(a) => setEditing(a)}
                onRemove={(a) => setRemoving(a)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Asset modal */}
      <AddAssetModal
        open={adding}
        onClose={() => setAdding(false)}
        currentPortfolio={portfolio}
        onAdded={handleAssetAdded}
      />

      {/* Edit modal */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={`Edit target — ${editing?.asset_symbol}`}
      >
        {editing && (
          <EditTargetForm
            currentTarget={editing.target_quantity}
            onCancel={() => setEditing(null)}
            onSave={handleEditSave}
            error={actionError}
          />
        )}
      </Modal>

      {/* Remove confirmation modal */}
      <Modal
        open={!!removing}
        onClose={() => setRemoving(null)}
        title="Remove asset"
      >
        {removing && (
          <div className="flex flex-col gap-4">
            <p className="text-slate-300">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-slate-100">
                {removing.asset_symbol}
              </span>{" "}
              from your portfolio? You won't receive new recommendations for
              this asset.
            </p>
            {actionError && <Alert variant="error">{actionError}</Alert>}
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="ghost" onClick={() => setRemoving(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleRemoveConfirm}>
                Remove
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// Edit form ---------------------------------------------------------------

interface EditTargetFormProps {
  currentTarget: number;
  onCancel: () => void;
  onSave: (newTarget: number) => void;
  error: string | null;
}

function EditTargetForm({
  currentTarget,
  onCancel,
  onSave,
  error,
}: EditTargetFormProps) {
  const [value, setValue] = useState<string>(String(currentTarget));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) return;
    onSave(num);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="space-y-1">
        <Label htmlFor="target">New Target Quantity</Label>
        <Input
          id="target"
          type="number"
          step="any"
          min="0.01"
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p className="text-xs text-slate-500 mt-1">
          The number of units you want to hold when fully positioned.
        </p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
