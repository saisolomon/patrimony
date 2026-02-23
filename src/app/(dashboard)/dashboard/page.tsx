import Link from "next/link";
import {
  TrendingUp,
  Building2,
  ArrowUpRight,
  Brain,
  ChevronRight,
  Layers,
} from "lucide-react";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  type AssetCategory,
} from "@/lib/mock-data";
import { formatCurrency, formatCompact, formatPercent } from "@/lib/utils";
import { requireSubscription, getUserAssets, getUserInsights } from "@/lib/dal";
import { NetWorthChart, AllocationPieChart } from "@/components/dashboard/charts";

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

export default async function DashboardPage() {
  const user = await requireSubscription();
  const [assets, insights] = await Promise.all([
    getUserAssets(user.id),
    getUserInsights(user.id),
  ]);

  // Convert BigInt cents to dollars
  const totalNetWorth = assets.reduce(
    (sum, a) => sum + Number(a.value) / 100,
    0
  );

  // Generate synthetic net worth history
  const netWorthHistory = [
    { month: "Sep", value: Math.round(totalNetWorth * 0.94) },
    { month: "Oct", value: Math.round(totalNetWorth * 0.96) },
    { month: "Nov", value: Math.round(totalNetWorth * 0.97) },
    { month: "Dec", value: Math.round(totalNetWorth * 0.98) },
    { month: "Jan", value: Math.round(totalNetWorth * 0.99) },
    { month: "Feb", value: Math.round(totalNetWorth) },
  ];

  // Group assets by category for allocation chart
  const categoryTotals: Record<string, number> = {};
  for (const asset of assets) {
    const cat = asset.category;
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(asset.value) / 100;
  }

  const pieData = Object.entries(categoryTotals)
    .filter(([, total]) => total > 0)
    .map(([key, total]) => ({
      name: CATEGORY_LABELS[key as AssetCategory] || key,
      value: total,
      color: CATEGORY_COLORS[key as AssetCategory] || "#888",
      percentage: totalNetWorth > 0 ? ((total / totalNetWorth) * 100).toFixed(1) : "0",
    }));

  // Top 5 assets by value
  const topAssets = [...assets]
    .sort((a, b) => Number(b.value) - Number(a.value))
    .slice(0, 5)
    .map((a) => ({
      id: a.id,
      name: a.name,
      entity: a.entity?.name || "Direct",
      value: Number(a.value) / 100,
      change24h: a.change24h ? Number(a.change24h) : 0,
    }));

  // Recent insights
  const recentInsights = insights.slice(0, 3).map((i) => ({
    id: i.id,
    title: i.title,
    summary: i.description,
    category: i.category,
    priority: i.priority,
  }));

  // Compute quick stats
  const totalAssets = assets.length;
  const totalInsights = insights.length;
  const highPriorityInsights = insights.filter((i) => i.priority === "high").length;

  // Get user first name from Clerk-synced data (or fallback)
  const firstName = user.email?.split("@")[0] || "there";

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          {getGreeting()}, {firstName}
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
              {formatCurrency(totalNetWorth)}
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-sm font-medium text-success">
                <TrendingUp className="h-3.5 w-3.5" />
                +2.4% this month
              </span>
              <span className="text-sm text-text-muted">
                +{formatCompact(Math.round(totalNetWorth * 0.024))}
              </span>
            </div>
          </div>
          <div className="h-[140px] w-full lg:w-[380px]">
            <NetWorthChart data={netWorthHistory} />
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Total Assets",
            value: String(totalAssets),
            sub: "Across all entities",
            icon: Layers,
          },
          {
            label: "Active Entities",
            value: `${new Set(assets.map((a) => a.entityId).filter(Boolean)).size} structures`,
            sub: "Trusts, LLCs, & more",
            icon: Building2,
          },
          {
            label: "Monthly Change",
            value: `+${formatCompact(Math.round(totalNetWorth * 0.024))}`,
            sub: "+2.4% from last month",
            icon: ArrowUpRight,
            highlight: true,
          },
          {
            label: "AI Insights",
            value: `${totalInsights} pending`,
            sub: `${highPriorityInsights} high priority`,
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

          <AllocationPieChart data={pieData} />
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
                      INSIGHT_BADGE_COLORS[insight.category] || ""
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
                    {asset.entity}
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
