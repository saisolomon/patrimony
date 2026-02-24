"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { CATEGORY_LABELS, type AssetCategory } from "@/lib/mock-data";

const CATEGORIES = Object.entries(CATEGORY_LABELS) as [AssetCategory, string][];

interface AssetFormProps {
  entities: { id: string; name: string }[];
  asset?: {
    id: string;
    name: string;
    category: string;
    value: number;
    entityId?: string | null;
    notes?: string | null;
    source?: string;
  };
  onClose: () => void;
}

export function AssetForm({ entities, asset, onClose }: AssetFormProps) {
  const router = useRouter();
  const isEdit = !!asset;
  const isPlaid = asset?.source === "plaid";

  const [name, setName] = useState(asset?.name || "");
  const [category, setCategory] = useState(asset?.category || "equities");
  const [value, setValue] = useState(asset?.value?.toString() || "");
  const [entityId, setEntityId] = useState(asset?.entityId || "");
  const [notes, setNotes] = useState(asset?.notes || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const numericValue = parseFloat(value.replace(/,/g, ""));
    if (isNaN(numericValue) || numericValue < 0) {
      setError("Please enter a valid positive value");
      setSaving(false);
      return;
    }

    try {
      const url = isEdit ? `/api/assets/${asset.id}` : "/api/assets";
      const method = isEdit ? "PATCH" : "POST";

      const body: Record<string, unknown> = isPlaid
        ? { entityId: entityId || null, notes: notes || null }
        : {
            name,
            category,
            value: numericValue,
            entityId: entityId || null,
            notes: notes || null,
          };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save");

      router.refresh();
      onClose();
    } catch {
      setError("Failed to save asset. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-bg-secondary p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-text-primary">
            {isEdit ? "Edit Asset" : "Add Asset"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted hover:bg-bg-card hover:text-text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-danger/10 px-4 py-2 text-sm text-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
              Asset Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPlaid}
              required
              placeholder="e.g., S&P 500 Index Fund"
              className="w-full rounded-xl border border-border bg-bg-card px-4 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isPlaid}
              className="w-full appearance-none rounded-xl border border-border bg-bg-card px-4 py-2.5 text-sm text-text-primary outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 disabled:opacity-50"
            >
              {CATEGORIES.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
              Value (USD)
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={isPlaid}
              required
              placeholder="e.g., 1000000"
              className="w-full rounded-xl border border-border bg-bg-card px-4 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
              Entity (optional)
            </label>
            <select
              value={entityId}
              onChange={(e) => setEntityId(e.target.value)}
              className="w-full appearance-none rounded-xl border border-border bg-bg-card px-4 py-2.5 text-sm text-text-primary outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
            >
              <option value="">No entity</option>
              {entities.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Any additional notes..."
              className="w-full rounded-xl border border-border bg-bg-card px-4 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg-card"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-gradient-to-r from-gold to-gold-dark px-4 py-2.5 text-sm font-semibold text-bg-primary hover:shadow-lg hover:shadow-gold/20 disabled:opacity-50"
            >
              {saving ? "Saving..." : isEdit ? "Update" : "Add Asset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
