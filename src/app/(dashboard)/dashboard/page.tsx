"use client";

import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Building2,
  ArrowUpRight,
  Brain,
  ChevronRight,
  Layers,
} from "lucide-react";
import {
  TOTAL_NET_WORTH,
  NET_WORTH_HISTORY,
  MOCK_ASSETS,
  MOCK_INSIGHTS,
  getAssetsByCategory,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  type AssetCategory,
} from "@/lib/mock-data";
import { formatCurrency, formatCompact, formatPercent } from "@/lib/utils";

const INSIGHT_BADGE_COLORS: Record<string, string> = {
  opportunity: "bg-success/15 text-success",
  risk: "bg-danger/15 text-danger",
  tax: "bg-gold/15 text-gold",
  rebalance: "bg-blue-500/15 text-blue-400",
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DashboardPage() {
  const categoryData = getAssetsByCategory();
  const pieData = (Object.entries(categoryData) as [AssetCategory, { total: number; assets: typeof MOCK_ASSETS }][])
    .filter(([, data]) => data.total > 0)
    .map(([key, data]) => ({
      name: CATEGORY_LABELS[key],
      value: data.total,
      color: CATEGORY_COLORS[key],
      percentage: ((data.total / TOTAL_NET_WORTH) * 100).toFixed(1),
    }));

  const topAssets = [...MOCK_ASSETS].sort((a, b) => b.value - a.value).slice(0, 5);
  const recentInsights = MOCK_INSIGHTS.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          {getGreeting()}, Alexander
        </h1>
        <p className="mt-1 text-sm text-text-muted">{formatDate()}</p>
      </div>

      {/* Net Worth Hero Card */}
      <div className="rounded-2xl border border-border bg-bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-widest text-text-muted">
              Total Net Worth
            </p>
            <p className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
              {formatCurrency(TOTAL_NET_WORTH)}
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-sm font-medium text-success">
                <TrendingUp className="h-3.5 w-3.5" />
                +2.4% this month
              </span>
              <span className="text-sm text-text-muted">
                +{formatCompact(2_100_000)}
              </span>
            </div>
          </div>
          <div className="h-[140px] w-full lg:w-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={NET_WORTH_HISTORY}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                />
                <YAxis hide domain={["dataMin - 2000000", "dataMax + 2000000"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#16161E",
                    border: "1px solid #2A2A35",
                    borderRadius: "12px",
                    padding: "8px 12px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  }}
                  labelStyle={{ color: "#9CA3AF", fontSize: 12 }}
                  formatter={(value: number | undefined) => [formatCurrency(value ?? 0), "Net Worth"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#D4AF37"
                  strokeWidth={2}
                  fill="url(#goldGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Total Assets",
            value: String(MOCK_ASSETS.length),
            sub: "Across all entities",
            icon: Layers,
          },
          {
            label: "Active Entities",
            value: "9 structures",
            sub: "Trusts, LLCs, & more",
            icon: Building2,
          },
          {
            label: "Monthly Change",
            value: "+$2.1M",
            sub: "+2.4% from last month",
            icon: ArrowUpRight,
            highlight: true,
          },
          {
            label: "AI Insights",
            value: "6 pending",
            sub: "3 high priority",
            icon: Brain,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-bg-card p-5 transition-colors hover:bg-bg-card-hover"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                {stat.label}
              </p>
              <stat.icon
                className={`h-4 w-4 ${
                  stat.highlight ? "text-success" : "text-text-muted"
                }`}
              />
            </div>
            <p
              className={`mt-2 text-2xl font-bold tracking-tight ${
                stat.highlight ? "text-success" : "text-text-primary"
              }`}
            >
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-text-muted">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Asset Allocation & Recent Insights */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Asset Allocation Pie Chart */}
        <div className="rounded-2xl border border-border bg-bg-card p-6 lg:col-span-3">
          <h2 className="text-lg font-semibold text-text-primary">
            Asset Allocation
          </h2>
          <p className="mt-0.5 text-sm text-text-muted">
            Portfolio breakdown by category
          </p>

          <div className="mt-6 flex flex-col items-center gap-6 lg:flex-row">
            <div className="h-[260px] w-[260px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#16161E",
                      border: "1px solid #2A2A35",
                      borderRadius: "12px",
                      padding: "8px 12px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    }}
                    formatter={(value: number | undefined) => [formatCurrency(value ?? 0), ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full space-y-2.5">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-text-secondary">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-text-primary">
                      {formatCompact(item.value)}
                    </span>
                    <span className="w-12 text-right text-xs text-text-muted">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent AI Insights */}
        <div className="rounded-2xl border border-border bg-bg-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                AI Insights
              </h2>
              <p className="mt-0.5 text-sm text-text-muted">
                Recent recommendations
              </p>
            </div>
            <Brain className="h-5 w-5 text-gold" />
          </div>

          <div className="mt-5 space-y-4">
            {recentInsights.map((insight) => (
              <div
                key={insight.id}
                className="rounded-xl border border-border p-4 transition-colors hover:bg-bg-card-hover"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      INSIGHT_BADGE_COLORS[insight.category]
                    }`}
                  >
                    {insight.category}
                  </span>
                  {insight.priority === "high" && (
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-danger" />
                  )}
                </div>
                <h3 className="mt-2 text-sm font-medium leading-snug text-text-primary">
                  {insight.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-muted">
                  {insight.summary}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/insights"
            className="mt-4 flex items-center justify-center gap-1 rounded-xl border border-border py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-card-hover hover:text-gold"
          >
            View All Insights
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Top Holdings */}
      <div className="rounded-2xl border border-border bg-bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Top Holdings
            </h2>
            <p className="mt-0.5 text-sm text-text-muted">
              Largest positions by value
            </p>
          </div>
          <Link
            href="/assets"
            className="flex items-center gap-1 text-sm font-medium text-gold hover:text-gold-light"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5">
          {/* Table header */}
          <div className="hidden grid-cols-12 gap-4 border-b border-border px-4 pb-3 sm:grid">
            <span className="col-span-5 text-xs font-medium uppercase tracking-wider text-text-muted">
              Asset
            </span>
            <span className="col-span-2 text-xs font-medium uppercase tracking-wider text-text-muted">
              Entity
            </span>
            <span className="col-span-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
              Value
            </span>
            <span className="col-span-2 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
              24h
            </span>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-border">
            {topAssets.map((asset, index) => (
              <div
                key={asset.id}
                className="grid grid-cols-1 gap-2 px-4 py-4 transition-colors hover:bg-bg-card-hover sm:grid-cols-12 sm:items-center sm:gap-4"
              >
                <div className="flex items-center gap-3 sm:col-span-5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-bg-secondary text-xs font-semibold text-text-muted">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {asset.name}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-sm text-text-muted">
                    {asset.entity || "Direct"}
                  </span>
                </div>
                <div className="sm:col-span-3 sm:text-right">
                  <span className="text-sm font-semibold text-text-primary">
                    {formatCurrency(asset.value)}
                  </span>
                </div>
                <div className="sm:col-span-2 sm:text-right">
                  <span
                    className={`text-sm font-medium ${
                      asset.change24h >= 0 ? "text-success" : "text-danger"
                    }`}
                  >
                    {formatPercent(asset.change24h)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
