import { requireSubscription, getUserEntities } from "@/lib/dal";
import { EntityTree } from "@/components/dashboard/entity-tree";

export default async function EntitiesPage() {
  const user = await requireSubscription();
  const entities = await getUserEntities(user.id);

  const serializedEntities = entities.map((e) => ({
    id: e.id,
    name: e.name,
    type: e.type,
    jurisdiction: e.jurisdiction ?? "",
    parentId: e.parentId,
    totalValue: e.assets.reduce((sum, a) => sum + Number(a.value) / 100, 0),
    assets: e.assets.map((a) => a.name),
    children: e.children.map((c) => c.id),
  }));

  return (
    <div className="space-y-8">
      <EntityTree entities={serializedEntities} />
    </div>
  );
}
