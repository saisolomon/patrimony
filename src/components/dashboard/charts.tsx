"use client";

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
import { formatCurrency, formatCompact } from "@/lib/utils";

interface NetWorthChartProps {
  data: { month: string; value: number }[];
}

export function NetWorthChart({ data }: NetWorthChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
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
          formatter={(value: number | undefined) => [
            formatCurrency(value ?? 0),
            "Net Worth",
          ]}
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
  );
}

interface AllocationPieChartProps {
  data: { name: string; value: number; color: string; percentage: string }[];
}

export function AllocationPieChart({ data }: AllocationPieChartProps) {
  return (
    <div className="mt-6 flex flex-col items-center gap-6 lg:flex-row">
      <div className="h-[260px] w-[260px] flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
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
              formatter={(value: number | undefined) => [
                formatCurrency(value ?? 0),
                "",
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full space-y-2.5">
        {data.map((item) => (
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
  );
}
