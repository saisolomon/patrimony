import { requireSubscription, getUserAssets } from "@/lib/dal";
import { AssetList } from "@/components/dashboard/asset-list";

export default async function AssetsPage() {
  const user = await requireSubscription();
  const assets = await getUserAssets(user.id);

  const serializedAssets = assets.map((a) => ({
    id: a.id,
    name: a.name,
    category: a.category,
    value: Number(a.value) / 100,
    change24h: a.change24h ? Number(a.change24h) : 0,
    change30d: a.change30d ? Number(a.change30d) : 0,
    entity: a.entity?.name,
  }));

  const totalNetWorth = serializedAssets.reduce((sum, a) => sum + a.value, 0);

  return (
    <div className="space-y-8">
      <AssetList assets={serializedAssets} totalNetWorth={totalNetWorth} />
    </div>
  );
}
