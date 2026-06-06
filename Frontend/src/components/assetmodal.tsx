import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Asset, PortfolioAsset } from "../types";
import { getAssets, addPortfolioAsset } from "../api/portfolio";
import { useAuth } from "../context/AuthContext";
import Modal from "./modal";
import Button from "./button";
import Input from "./input";
import Label from "./label";
import Alert from "./alert";

interface AddAssetModalProps {
  open: boolean;
  onClose: () => void;
  /** Assets already in the user's portfolio (to exclude from the dropdown) */
  currentPortfolio: PortfolioAsset[];
  /** Called when an asset is successfully added so the dashboard can refresh */
  onAdded: () => void;
}

export default function AddAssetModal({
  open,
  onClose,
  currentPortfolio,
  onAdded,
}: AddAssetModalProps) {
  const { user } = useAuth();

  // Catalog state
  const [catalog, setCatalog] = useState<Asset[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  // Form state
  const [symbol, setSymbol] = useState("");
  const [target, setTarget] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load catalog whenever the modal opens
  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const load = async () => {
      setLoadingCatalog(true);
      setCatalogError(null);
      try {
        const response = await getAssets();
        if (!cancelled) {
          setCatalog(response.assets || []);
        }
      } catch (err) {
        if (!cancelled) {
          setCatalogError("Could not load the asset catalog. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoadingCatalog(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [open]);

  // Reset form fields whenever the modal opens
  useEffect(() => {
    if (open) {
      setSymbol("");
      setTarget("");
      setSubmitError(null);
    }
  }, [open]);

  // Filter catalog to exclude assets already in the user's portfolio
const ownedSymbols = new Set(
  (currentPortfolio || [])
    .filter((p) => p?.asset_symbol)
    .map((p) => p.asset_symbol.toUpperCase())
);
const available = catalog.filter(
  (a) => a?.symbol && !ownedSymbols.has(a.symbol.toUpperCase())
);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitError(null);

    const targetNum = Number(target);
    if (!Number.isFinite(targetNum) || targetNum <= 0) {
      setSubmitError("Target quantity must be a positive number.");
      return;
    }
    if (!symbol) {
      setSubmitError("Please choose an asset.");
      return;
    }

    setSubmitting(true);
    try {
      await addPortfolioAsset({
        user_id: user.user_id,
        asset_symbol: symbol,
        target_quantity: targetNum,
      });
      onAdded();
      onClose();
    } catch (err: any) {
      if (err.status === 400) {
        const errors = err.data?.errors;
        if (Array.isArray(errors) && errors.length > 0) {
          setSubmitError(errors[0]);
        } else {
          setSubmitError("Please check your inputs and try again.");
        }
      } else {
        setSubmitError("Could not add the asset. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add asset to portfolio">
      {/* Catalog loading */}
      {loadingCatalog && (
        <div className="text-center py-6 text-slate-400 text-sm">
          Loading available assets…
        </div>
      )}

      {/* Catalog error */}
      {!loadingCatalog && catalogError && (
        <Alert variant="error">{catalogError}</Alert>
      )}

      {/* Catalog loaded successfully */}
      {!loadingCatalog && !catalogError && (
        <>
          {available.length === 0 ? (
            <div className="text-center py-4 text-slate-400 text-sm">
              You're already tracking all available assets.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <p className="text-sm text-slate-400">
                Choose an asset to track and set your target quantity.
              </p>

              {/* Asset selector */}
              <div className="space-y-1">
                <Label htmlFor="asset-select">Asset</Label>
                <select
                  id="asset-select"
                  required
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg py-2.5 px-3 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
                >
                  <option value="" disabled>
                    Select an asset…
                  </option>
                  {available.map((a) => (
                    <option key={a.symbol} value={a.symbol}>
                      {a.symbol} — {a.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target quantity */}
              <div className="space-y-1">
                <Label htmlFor="target-quantity">Target Quantity</Label>
                <Input
                  id="target-quantity"
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g. 10"
                />
                <p className="text-xs text-slate-500 mt-1">
                  How many units you want to hold when fully positioned.
                </p>
              </div>

              {/* Error message */}
              {submitError && <Alert variant="error">{submitError}</Alert>}

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Adding…" : "Add to Portfolio"}
                </Button>
              </div>
            </form>
          )}
        </>
      )}
    </Modal>
  );
}