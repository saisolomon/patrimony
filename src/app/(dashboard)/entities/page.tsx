"use client";

import { useMemo } from "react";
import { MOCK_ENTITIES, MOCK_ASSETS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  Building2,
  Shield,
  Landmark,
  Heart,
  User,
  Briefcase,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

const TYPE_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: typeof Building2 }
> = {
  trust: {
    label: "Trust",
    color: "text-gold",
    bg: "bg-gold/15",
    icon: Shield,
  },
  llc: {
    label: "LLC",
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    icon: Building2,
  },
  foundation: {
    label: "Foundation",
    color: "text-purple-400",
    bg: "bg-purple-500/15",
    icon: Heart,
  },
  personal: {
    label: "Personal",
    color: "text-text-secondary",
    bg: "bg-bg-card-hover",
    icon: User,
  },
  corporation: {
    label: "Corporation",
    color: "text-green-400",
    bg: "bg-green-500/15",
    icon: Briefcase,
  },
};

interface EntityNode {
  entity: (typeof MOCK_ENTITIES)[number];
  children: EntityNode[];
  assets: (typeof MOCK_ASSETS)[number][];
}

function buildEntityTree(): EntityNode[] {
  const nodeMap = new Map<string, EntityNode>();

  for (const entity of MOCK_ENTITIES) {
    const entityAssets = entity.assets
      .map((aid) => MOCK_ASSETS.find((a) => a.id === aid))
      .filter(Boolean) as (typeof MOCK_ASSETS)[number][];

    nodeMap.set(entity.id, {
      entity,
      children: [],
      assets: entityAssets,
    });
  }

  const roots: EntityNode[] = [];

  for (const entity of MOCK_ENTITIES) {
    const node = nodeMap.get(entity.id)!;
    if (entity.parent) {
      const parentNode = nodeMap.get(entity.parent);
      if (parentNode) {
        parentNode.children.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function EntityCard({
  node,
  depth = 0,
}: {
  node: EntityNode;
  depth?: number;
}) {
  const config = TYPE_CONFIG[node.entity.type] || TYPE_CONFIG.personal;
  const Icon = config.icon;

  return (
    <div className={depth > 0 ? "mt-3" : ""}>
      {/* Connector line for children */}
      {depth > 0 && (
        <div className="flex items-center gap-2 py-1 pl-4">
          <div className="h-px w-6 bg-border" />
          <ChevronDown className="h-3 w-3 -rotate-90 text-text-muted" />
          <span className="text-[10px] uppercase tracking-wider text-text-muted">
            Subsidiary of{" "}
            {
              MOCK_ENTITIES.find((e) => e.id === node.entity.parent)
                ?.name
            }
          </span>
        </div>
      )}

      <div
        className="rounded-2xl border border-border bg-bg-card p-5 transition-all duration-200 hover:border-border-light hover:bg-bg-card-hover"
        style={{ marginLeft: depth > 0 ? `${depth * 24}px` : undefined }}
      >
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${config.bg}`}
            >
              <Icon className={`h-5 w-5 ${config.color}`} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary">
                {node.entity.name}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${config.bg} ${config.color}`}
                >
                  {config.label}
                </span>
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <Landmark className="h-3 w-3" />
                  {node.entity.jurisdiction}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xl font-bold text-text-primary">
              {formatCurrency(node.entity.totalValue)}
            </p>
            <p className="mt-0.5 text-xs text-text-muted">
              {node.assets.length} asset{node.assets.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Assets within entity */}
        {node.assets.length > 0 && (
          <div className="mt-4 space-y-1.5">
            <p className="text-[10px] font-medium uppercase tracking-widest text-text-muted">
              Holdings
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {node.assets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between rounded-lg bg-bg-secondary px-3 py-2"
                >
                  <span className="truncate text-sm text-text-secondary">
                    {asset.name}
                  </span>
                  <span className="ml-2 flex-shrink-0 text-sm font-medium text-text-primary">
                    {formatCurrency(asset.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Render children */}
      {node.children.length > 0 && (
        <div className="pl-2">
          {node.children.map((child) => (
            <EntityCard key={child.entity.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function EntitiesPage() {
  const entityTree = useMemo(() => buildEntityTree(), []);

  const totalValue = MOCK_ENTITIES.reduce(
    (sum, e) => sum + e.totalValue,
    0
  );

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const entity of MOCK_ENTITIES) {
      counts[entity.type] = (counts[entity.type] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          Entity Structure
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          {MOCK_ENTITIES.length} legal entities managing{" "}
          {formatCurrency(totalValue)}
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        {Object.entries(typeCounts).map(([type, count]) => {
          const config = TYPE_CONFIG[type] || TYPE_CONFIG.personal;
          const Icon = config.icon;
          return (
            <div
              key={type}
              className="flex items-center gap-3 rounded-xl border border-border bg-bg-card px-4 py-3"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.bg}`}
              >
                <Icon className={`h-4 w-4 ${config.color}`} />
              </div>
              <div>
                <p className="text-lg font-bold text-text-primary">{count}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                  {config.label}
                  {count !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Entity Tree */}
      <div className="space-y-4">
        {entityTree.map((node) => (
          <EntityCard key={node.entity.id} node={node} />
        ))}
      </div>
    </div>
  );
}
