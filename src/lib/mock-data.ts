export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  value: number;
  change24h: number;
  change30d: number;
  entity?: string;
  notes?: string;
}

export type AssetCategory =
  | "equities"
  | "fixed-income"
  | "real-estate"
  | "private-equity"
  | "crypto"
  | "cash"
  | "alternatives"
  | "collectibles";

export interface Entity {
  id: string;
  name: string;
  type: "trust" | "llc" | "foundation" | "personal" | "corporation";
  jurisdiction: string;
  totalValue: number;
  assets: string[];
  parent?: string;
}

export interface Insight {
  id: string;
  title: string;
  summary: string;
  category: "opportunity" | "risk" | "tax" | "rebalance";
  priority: "high" | "medium" | "low";
  date: string;
  actionable: boolean;
}

export const MOCK_ASSETS: Asset[] = [
  { id: "a1", name: "S&P 500 Index Fund", category: "equities", value: 8_450_000, change24h: 0.34, change30d: 2.1, entity: "Revocable Trust" },
  { id: "a2", name: "International Equity Fund", category: "equities", value: 4_200_000, change24h: -0.12, change30d: 1.8, entity: "Revocable Trust" },
  { id: "a3", name: "Individual Stock Portfolio", category: "equities", value: 6_800_000, change24h: 0.87, change30d: 3.4, entity: "Family LLC" },
  { id: "a4", name: "Tech Growth Fund", category: "equities", value: 3_100_000, change24h: 1.2, change30d: 5.6, entity: "IRA" },
  { id: "a5", name: "Municipal Bond Portfolio", category: "fixed-income", value: 5_500_000, change24h: 0.02, change30d: 0.3, entity: "Revocable Trust" },
  { id: "a6", name: "Corporate Bond Fund", category: "fixed-income", value: 2_800_000, change24h: -0.05, change30d: 0.1, entity: "Irrevocable Trust" },
  { id: "a7", name: "Treasury Bills", category: "fixed-income", value: 4_000_000, change24h: 0.01, change30d: 0.4, entity: "Personal" },
  { id: "a8", name: "Manhattan Penthouse", category: "real-estate", value: 12_500_000, change24h: 0, change30d: 0.8, entity: "Real Estate LLC" },
  { id: "a9", name: "Miami Beach Estate", category: "real-estate", value: 8_200_000, change24h: 0, change30d: 1.2, entity: "Real Estate LLC" },
  { id: "a10", name: "Aspen Ski Property", category: "real-estate", value: 5_400_000, change24h: 0, change30d: 0.5, entity: "Family LLC" },
  { id: "a11", name: "Commercial Office Building", category: "real-estate", value: 15_000_000, change24h: 0, change30d: -0.3, entity: "Commercial RE LLC" },
  { id: "a12", name: "Sequoia Capital Fund XIV", category: "private-equity", value: 4_500_000, change24h: 0, change30d: 2.1, entity: "Family LLC" },
  { id: "a13", name: "Andreessen Horowitz Bio Fund", category: "private-equity", value: 3_200_000, change24h: 0, change30d: 1.5, entity: "Irrevocable Trust" },
  { id: "a14", name: "Direct Investment - Series B SaaS", category: "private-equity", value: 2_000_000, change24h: 0, change30d: 0, entity: "Family LLC" },
  { id: "a15", name: "Bitcoin", category: "crypto", value: 3_800_000, change24h: 2.4, change30d: 8.2, entity: "Personal" },
  { id: "a16", name: "Ethereum", category: "crypto", value: 1_200_000, change24h: 1.8, change30d: 5.1, entity: "Personal" },
  { id: "a17", name: "Chase Private Client", category: "cash", value: 2_500_000, change24h: 0, change30d: 0, entity: "Personal" },
  { id: "a18", name: "Goldman Sachs Money Market", category: "cash", value: 5_000_000, change24h: 0.01, change30d: 0.4, entity: "Revocable Trust" },
  { id: "a19", name: "Wine Collection (Bordeaux)", category: "collectibles", value: 1_800_000, change24h: 0, change30d: 0.2, entity: "Personal" },
  { id: "a20", name: "Art Collection (Contemporary)", category: "collectibles", value: 4_200_000, change24h: 0, change30d: 0, entity: "Foundation" },
  { id: "a21", name: "Vintage Car Collection", category: "collectibles", value: 2_600_000, change24h: 0, change30d: 0.5, entity: "Family LLC" },
  { id: "a22", name: "Farmland (Iowa)", category: "alternatives", value: 3_500_000, change24h: 0, change30d: 0.3, entity: "Agriculture LLC" },
  { id: "a23", name: "Timber Fund", category: "alternatives", value: 1_500_000, change24h: 0, change30d: 0.1, entity: "Irrevocable Trust" },
];

export const MOCK_ENTITIES: Entity[] = [
  { id: "e1", name: "Personal Holdings", type: "personal", jurisdiction: "New York", totalValue: 12_500_000, assets: ["a7", "a15", "a16", "a17", "a19"] },
  { id: "e2", name: "Solomon Revocable Trust", type: "trust", jurisdiction: "Delaware", totalValue: 22_150_000, assets: ["a1", "a2", "a5", "a18"] },
  { id: "e3", name: "Solomon Irrevocable Trust", type: "trust", jurisdiction: "South Dakota", totalValue: 7_500_000, assets: ["a6", "a13", "a23"], parent: "e2" },
  { id: "e4", name: "Solomon Family LLC", type: "llc", jurisdiction: "Wyoming", totalValue: 16_900_000, assets: ["a3", "a10", "a12", "a14", "a21"] },
  { id: "e5", name: "Coastal Real Estate LLC", type: "llc", jurisdiction: "Florida", totalValue: 20_700_000, assets: ["a8", "a9"] },
  { id: "e6", name: "Commercial Properties LLC", type: "llc", jurisdiction: "Delaware", totalValue: 15_000_000, assets: ["a11"] },
  { id: "e7", name: "Solomon Foundation", type: "foundation", jurisdiction: "New York", totalValue: 4_200_000, assets: ["a20"] },
  { id: "e8", name: "Heartland Agriculture LLC", type: "llc", jurisdiction: "Iowa", totalValue: 3_500_000, assets: ["a22"] },
  { id: "e9", name: "Retirement Account (IRA)", type: "personal", jurisdiction: "Federal", totalValue: 3_100_000, assets: ["a4"] },
];

export const MOCK_INSIGHTS: Insight[] = [
  {
    id: "i1",
    title: "Tax-Loss Harvesting Opportunity",
    summary: "Your International Equity Fund is down 3.2% YTD. Selling now and reinvesting in a similar fund could save approximately $84,000 in capital gains taxes this year.",
    category: "tax",
    priority: "high",
    date: "2026-02-23",
    actionable: true,
  },
  {
    id: "i2",
    title: "Real Estate Concentration Risk",
    summary: "Real estate now represents 38% of your total portfolio, up from 32% last quarter. Consider rebalancing to reduce single-sector exposure below 35%.",
    category: "risk",
    priority: "high",
    date: "2026-02-22",
    actionable: true,
  },
  {
    id: "i3",
    title: "Bitcoin Position Up 82% — Consider Taking Profits",
    summary: "Your Bitcoin allocation has grown from 2.1% to 3.5% of portfolio due to price appreciation. Consider trimming to your target 2% allocation, locking in approximately $1.4M in gains.",
    category: "rebalance",
    priority: "medium",
    date: "2026-02-21",
    actionable: true,
  },
  {
    id: "i4",
    title: "Sequoia Fund Capital Call Expected",
    summary: "Based on Fund XIV's deployment pace, expect a capital call of approximately $500K-$750K in the next 60 days. Ensure liquidity in your Family LLC account.",
    category: "opportunity",
    priority: "medium",
    date: "2026-02-20",
    actionable: false,
  },
  {
    id: "i5",
    title: "Estate Tax Threshold Update",
    summary: "The 2026 estate tax exemption is $13.99M per individual. Your current estate exceeds this by approximately $96M. Review gifting strategies with your estate attorney.",
    category: "tax",
    priority: "high",
    date: "2026-02-19",
    actionable: true,
  },
  {
    id: "i6",
    title: "Commercial Property Lease Renewal",
    summary: "Your commercial office building's primary tenant lease expires in 8 months. Market rents have increased 12% since the original lease. Negotiate early for favorable terms.",
    category: "opportunity",
    priority: "medium",
    date: "2026-02-18",
    actionable: true,
  },
];

export const TOTAL_NET_WORTH = MOCK_ASSETS.reduce((sum, a) => sum + a.value, 0);

export const NET_WORTH_HISTORY = [
  { month: "Sep", value: 98_200_000 },
  { month: "Oct", value: 101_500_000 },
  { month: "Nov", value: 103_800_000 },
  { month: "Dec", value: 105_100_000 },
  { month: "Jan", value: 107_900_000 },
  { month: "Feb", value: TOTAL_NET_WORTH },
];

export function getAssetsByCategory() {
  const grouped: Record<AssetCategory, { total: number; assets: Asset[] }> = {
    equities: { total: 0, assets: [] },
    "fixed-income": { total: 0, assets: [] },
    "real-estate": { total: 0, assets: [] },
    "private-equity": { total: 0, assets: [] },
    crypto: { total: 0, assets: [] },
    cash: { total: 0, assets: [] },
    alternatives: { total: 0, assets: [] },
    collectibles: { total: 0, assets: [] },
  };

  for (const asset of MOCK_ASSETS) {
    grouped[asset.category].total += asset.value;
    grouped[asset.category].assets.push(asset);
  }

  return grouped;
}

export const CATEGORY_COLORS: Record<AssetCategory, string> = {
  equities: "#D4AF37",
  "fixed-income": "#8B7355",
  "real-estate": "#C9A961",
  "private-equity": "#B8860B",
  crypto: "#DAA520",
  cash: "#A0937D",
  alternatives: "#C4A265",
  collectibles: "#E6C86E",
};

export const CATEGORY_LABELS: Record<AssetCategory, string> = {
  equities: "Public Equities",
  "fixed-income": "Fixed Income",
  "real-estate": "Real Estate",
  "private-equity": "Private Equity",
  crypto: "Digital Assets",
  cash: "Cash & Equivalents",
  alternatives: "Alternative Assets",
  collectibles: "Collectibles & Art",
};
