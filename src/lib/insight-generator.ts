import { anthropic } from "./anthropic";
import { prisma } from "./prisma";
import { CATEGORY_LABELS, type AssetCategory } from "./mock-data";

interface PortfolioContext {
  totalNetWorth: number;
  assetCount: number;
  entityCount: number;
  allocation: Record<string, { total: number; percentage: number; count: number }>;
  topHoldings: { name: string; value: number; category: string; entity?: string }[];
  entities: { name: string; type: string; assetCount: number; totalValue: number }[];
}

interface GeneratedInsight {
  title: string;
  description: string;
  category: "opportunity" | "risk" | "tax" | "rebalance";
  priority: "high" | "medium" | "low";
  actionable: boolean;
}

export async function buildPortfolioContext(userId: string): Promise<PortfolioContext> {
  const [assets, entities] = await Promise.all([
    prisma.asset.findMany({
      where: { userId },
      include: { entity: true },
      orderBy: { value: "desc" },
    }),
    prisma.entity.findMany({
      where: { userId },
      include: { assets: true },
    }),
  ]);

  const totalNetWorth = assets.reduce(
    (sum, a) => sum + Number(a.value) / 100,
    0
  );

  // Build allocation breakdown
  const allocation: Record<string, { total: number; percentage: number; count: number }> = {};
  for (const asset of assets) {
    const cat = asset.category;
    if (!allocation[cat]) {
      allocation[cat] = { total: 0, percentage: 0, count: 0 };
    }
    allocation[cat].total += Number(asset.value) / 100;
    allocation[cat].count++;
  }
  for (const cat in allocation) {
    allocation[cat].percentage = totalNetWorth > 0
      ? (allocation[cat].total / totalNetWorth) * 100
      : 0;
  }

  // Top 10 holdings
  const topHoldings = assets.slice(0, 10).map((a) => ({
    name: a.name,
    value: Number(a.value) / 100,
    category: CATEGORY_LABELS[a.category as AssetCategory] || a.category,
    entity: a.entity?.name,
  }));

  // Entity summary
  const entitySummary = entities.map((e) => ({
    name: e.name,
    type: e.type,
    assetCount: e.assets.length,
    totalValue: e.assets.reduce((sum, a) => sum + Number(a.value) / 100, 0),
  }));

  return {
    totalNetWorth,
    assetCount: assets.length,
    entityCount: entities.length,
    allocation,
    topHoldings,
    entities: entitySummary,
  };
}

export async function generateInsights(userId: string): Promise<GeneratedInsight[]> {
  const context = await buildPortfolioContext(userId);

  if (context.assetCount === 0) {
    return [];
  }

  const systemPrompt = `You are a senior wealth advisor specializing in ultra-high-net-worth (UHNW) portfolio management. You provide actionable, specific insights based on portfolio data.

Generate exactly 3-5 insights based on the portfolio data provided. Focus on:
1. Concentration risk: any single category exceeding 35% of portfolio
2. Tax optimization: tax-loss harvesting opportunities, estate tax thresholds ($13.99M per individual in 2026)
3. Rebalancing: drift from typical UHNW allocation targets
4. Opportunities: liquidity events, market conditions, or structural improvements

Each insight must be specific to THIS portfolio's actual data. Reference specific assets, values, and percentages.

Respond ONLY with a JSON array. Each object must have:
- "title": string (concise, under 80 chars)
- "description": string (2-3 sentences with specific numbers)
- "category": "opportunity" | "risk" | "tax" | "rebalance"
- "priority": "high" | "medium" | "low"
- "actionable": boolean`;

  const userPrompt = `Portfolio Summary:
- Total Net Worth: $${context.totalNetWorth.toLocaleString()}
- Total Assets: ${context.assetCount}
- Total Entities: ${context.entityCount}

Asset Allocation:
${Object.entries(context.allocation)
  .sort(([, a], [, b]) => b.percentage - a.percentage)
  .map(([cat, data]) => `- ${CATEGORY_LABELS[cat as AssetCategory] || cat}: $${data.total.toLocaleString()} (${data.percentage.toFixed(1)}%, ${data.count} positions)`)
  .join("\n")}

Top Holdings:
${context.topHoldings
  .map((h, i) => `${i + 1}. ${h.name} — $${h.value.toLocaleString()} (${h.category}${h.entity ? `, held by ${h.entity}` : ""})`)
  .join("\n")}

Entity Structure:
${context.entities
  .map((e) => `- ${e.name} (${e.type}): ${e.assetCount} assets, $${e.totalValue.toLocaleString()}`)
  .join("\n")}

Generate 3-5 personalized wealth insights for this portfolio.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  // Extract JSON from response
  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => {
      if (block.type === "text") return block.text;
      return "";
    })
    .join("");

  // Parse JSON (handle potential markdown code blocks)
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Failed to parse insights from AI response");
  }

  const insights: GeneratedInsight[] = JSON.parse(jsonMatch[0]);

  // Clean up old insights (>30 days) and store new ones
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  await prisma.insight.deleteMany({
    where: {
      userId,
      createdAt: { lt: thirtyDaysAgo },
    },
  });

  // Store new insights
  for (const insight of insights) {
    await prisma.insight.create({
      data: {
        userId,
        title: insight.title,
        description: insight.description,
        category: insight.category,
        priority: insight.priority,
        actionable: insight.actionable,
      },
    });
  }

  return insights;
}
