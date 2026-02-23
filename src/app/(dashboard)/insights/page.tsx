"use client";

import { useState, useMemo } from "react";
import { MOCK_INSIGHTS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  Brain,
  AlertTriangle,
  TrendingUp,
  Receipt,
  RefreshCw,
  ArrowRight,
  CircleDot,
  Filter,
} from "lucide-react";

type InsightCategory = "all" | "opportunity" | "risk" | "tax" | "rebalance";

const CATEGORY_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    icon: typeof Brain;
  }
> = {
  opportunity: {
    label: "Opportunity",
    color: "text-success",
    bg: "bg-success/15",
    icon: TrendingUp,
  },
  risk: {
    label: "Risk",
    color: "text-danger",
    bg: "bg-danger/15",
    icon: AlertTriangle,
  },
  tax: {
    label: "Tax",
    color: "text-gold",
    bg: "bg-gold/15",
    icon: Receipt,
  },
  rebalance: {
    label: "Rebalance",
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    icon: RefreshCw,
  },
};

const PRIORITY_CONFIG: Record<string, { label: string; dot: string }> = {
  high: { label: "High Priority", dot: "bg-danger" },
  medium: { label: "Medium Priority", dot: "bg-warning" },
  low: { label: "Low Priority", dot: "bg-text-muted" },
};

const FILTER_OPTIONS: { key: InsightCategory; label: string }[] = [
  { key: "all", label: "All Insights" },
  { key: "opportunity", label: "Opportunities" },
  { key: "risk", label: "Risks" },
  { key: "tax", label: "Tax" },
  { key: "rebalance", label: "Rebalance" },
];

export default function InsightsPage() {
  const [activeFilter, setActiveFilter] = useState<InsightCategory>("all");

  const filteredInsights = useMemo(() => {
    if (activeFilter === "all") return MOCK_INSIGHTS;
    return MOCK_INSIGHTS.filter((i) => i.category === activeFilter);
  }, [activeFilter]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: MOCK_INSIGHTS.length };
    for (const insight of MOCK_INSIGHTS) {
      counts[insight.category] = (counts[insight.category] || 0) + 1;
    }
    return counts;
  }, []);

  const highPriorityCount = MOCK_INSIGHTS.filter(
    (i) => i.priority === "high"
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15">
              <Brain className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
                AI Wealth Insights
              </h1>
              <p className="mt-0.5 text-sm text-text-muted">
                {MOCK_INSIGHTS.length} insights generated &middot;{" "}
                {highPriorityCount} high priority
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
          const Icon = config.icon;
          const count = categoryCounts[key] || 0;
          return (
            <button
              key={key}
              onClick={() =>
                setActiveFilter(
                  activeFilter === key ? "all" : (key as InsightCategory)
                )
              }
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                activeFilter === key
                  ? "border-gold/30 bg-gold/10"
                  : "border-border bg-bg-card hover:bg-bg-card-hover"
              }`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${config.bg}`}
              >
                <Icon className={`h-4 w-4 ${config.color}`} />
              </div>
              <div>
                <p className="text-lg font-bold text-text-primary">{count}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                  {config.label}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-text-muted" />
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setActiveFilter(opt.key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              activeFilter === opt.key
                ? "bg-gold/15 text-gold"
                : "text-text-muted hover:bg-bg-card hover:text-text-secondary"
            }`}
          >
            {opt.label}
            <span className="ml-1 text-xs opacity-60">
              {categoryCounts[opt.key] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Insight Cards */}
      <div className="space-y-4">
        {filteredInsights.map((insight) => {
          const catConfig = CATEGORY_CONFIG[insight.category];
          const prioConfig = PRIORITY_CONFIG[insight.priority];
          const CatIcon = catConfig.icon;

          return (
            <div
              key={insight.id}
              className="group rounded-2xl border border-border bg-bg-card p-6 transition-all duration-200 hover:border-border-light hover:bg-bg-card-hover"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 space-y-3">
                  {/* Top row: badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${catConfig.bg} ${catConfig.color}`}
                    >
                      <CatIcon className="h-3 w-3" />
                      {catConfig.label}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${prioConfig.dot}`}
                      />
                      {prioConfig.label}
                    </span>
                    <span className="text-xs text-text-muted">
                      &middot; {new Date(insight.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold leading-snug text-text-primary">
                    {insight.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {insight.summary}
                  </p>
                </div>

                {/* Action button */}
                {insight.actionable && (
                  <div className="flex-shrink-0">
                    <button className="inline-flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/10 px-4 py-2.5 text-sm font-medium text-gold transition-all duration-200 hover:bg-gold/20 hover:border-gold/50">
                      Take Action
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredInsights.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-bg-card py-16">
            <CircleDot className="h-8 w-8 text-text-muted" />
            <p className="mt-3 text-sm text-text-muted">
              No insights in this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
