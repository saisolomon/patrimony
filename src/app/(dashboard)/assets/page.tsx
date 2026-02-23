"use client";

import { useState, useMemo } from "react";
import {
  MOCK_ASSETS,
  TOTAL_NET_WORTH,
  getAssetsByCategory,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  type AssetCategory,
} from "@/lib/mock-data";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { ArrowUpDown, Search, TrendingUp, TrendingDown } from "lucide-react";

type SortKey = "value" | "name" | "change24h" | "change30d";
type SortDir = "asc" | "desc";

const ALL_CATEGORIES: (AssetCategory | "all")[] = [
  "all",
  "equities",
  "fixed-income",
  "real-estate",
  "private-equity",
  "crypto",
  "cash",
  "alternatives",
  "collectibles",
];

const FILTER_LABELS: Record<string, string> = {
  all: "All",
  ...CATEGORY_LABELS,
};

export default function AssetsPage() {
  const [activeFilter, setActiveFilter] = useState<AssetCategory | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("value");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [search, setSearch] = useState("");

  const categoryData = getAssetsByCategory();

  const filteredAssets = useMemo(() => {
    let assets =
      activeFilter === "all"
        ? [...MOCK_ASSETS]
        : MOCK_ASSETS.filter((a) => a.category === activeFilter);

    if (search.trim()) {
      const q = search.toLowerCase();
      assets = assets.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          (a.entity && a.entity.toLowerCase().includes(q))
      );
    }

    assets.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "value":
          cmp = a.value - b.value;
          break;
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "change24h":
          cmp = a.change24h - b.change24h;
          break;
        case "change30d":
          cmp = a.change30d - b.change30d;
          break;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });

    return assets;
  }, [activeFilter, sortKey, sortDir, search]);

  const filteredTotal = filteredAssets.reduce((sum, a) => sum + a.value, 0);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          Assets
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          {formatCurrency(TOTAL_NET_WORTH)} total across{" "}
          {MOCK_ASSETS.length} positions
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {ALL_CATEGORIES.map((cat) => {
          const isActive = activeFilter === cat;
          const count =
            cat === "all"
              ? MOCK_ASSETS.length
              : categoryData[cat]?.assets.length || 0;
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gold/15 text-gold ring-1 ring-gold/30"
                  : "bg-bg-card text-text-secondary hover:bg-bg-card-hover hover:text-text-primary"
              }`}
            >
              {cat !== "all" && (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                />
              )}
              {FILTER_LABELS[cat]}
              <span
                className={`ml-0.5 text-xs ${
                  isActive ? "text-gold/70" : "text-text-muted"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-bg-card py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">Sort:</span>
          {(
            [
              { key: "value" as SortKey, label: "Value" },
              { key: "name" as SortKey, label: "Name" },
              { key: "change24h" as SortKey, label: "24h" },
              { key: "change30d" as SortKey, label: "30d" },
            ] as const
          ).map((s) => (
            <button
              key={s.key}
              onClick={() => handleSort(s.key)}
              className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                sortKey === s.key
                  ? "bg-gold/15 text-gold"
                  : "bg-bg-card text-text-muted hover:text-text-secondary"
              }`}
            >
              {s.label}
              {sortKey === s.key && (
                <ArrowUpDown className="h-3 w-3" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filtered Total */}
      {activeFilter !== "all" && (
        <div className="rounded-xl border border-border bg-bg-card px-5 py-3">
          <span className="text-sm text-text-muted">
            {FILTER_LABELS[activeFilter]}:{" "}
          </span>
          <span className="text-sm font-semibold text-text-primary">
            {formatCurrency(filteredTotal)}
          </span>
          <span className="ml-2 text-xs text-text-muted">
            ({((filteredTotal / TOTAL_NET_WORTH) * 100).toFixed(1)}% of
            portfolio)
          </span>
        </div>
      )}

      {/* Asset List */}
      <div className="space-y-3">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="group rounded-2xl border border-border bg-bg-card p-5 transition-all duration-200 hover:border-border-light hover:bg-bg-card-hover"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Left: Name & metadata */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-text-primary">
                    {asset.name}
                  </h3>
                  <span
                    className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${CATEGORY_COLORS[asset.category]}15`,
                      color: CATEGORY_COLORS[asset.category],
                    }}
                  >
                    {CATEGORY_LABELS[asset.category]}
                  </span>
                </div>
                {asset.entity && (
                  <p className="text-xs text-text-muted">
                    Held by {asset.entity}
                  </p>
                )}
              </div>

              {/* Right: Value & changes */}
              <div className="flex items-center gap-6 sm:gap-8">
                <div className="text-right">
                  <p className="text-lg font-bold text-text-primary">
                    {formatCurrency(asset.value)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                      24h
                    </p>
                    <p
                      className={`flex items-center gap-0.5 text-sm font-medium ${
                        asset.change24h >= 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      {asset.change24h >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {formatPercent(asset.change24h)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                      30d
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        asset.change30d >= 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      {formatPercent(asset.change30d)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredAssets.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-bg-card py-16">
            <Search className="h-8 w-8 text-text-muted" />
            <p className="mt-3 text-sm text-text-muted">No assets found</p>
            <p className="text-xs text-text-muted">
              Try adjusting your filters or search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
