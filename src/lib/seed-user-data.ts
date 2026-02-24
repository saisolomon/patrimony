import { prisma } from "./prisma";
import { MOCK_ASSETS, MOCK_ENTITIES, MOCK_INSIGHTS } from "./mock-data";

export async function seedUserData(userId: string) {
  // Check if user already has data
  const existingAssets = await prisma.asset.count({ where: { userId } });
  if (existingAssets > 0) return;

  // Create entities first (need their IDs for assets)
  const entityIdMap = new Map<string, string>();

  // First pass: create entities without parents
  for (const entity of MOCK_ENTITIES) {
    const created = await prisma.entity.create({
      data: {
        userId,
        name: entity.name,
        type: entity.type,
        jurisdiction: entity.jurisdiction,
      },
    });
    entityIdMap.set(entity.id, created.id);
  }

  // Second pass: set parent relationships
  for (const entity of MOCK_ENTITIES) {
    if (entity.parent) {
      const dbId = entityIdMap.get(entity.id);
      const parentDbId = entityIdMap.get(entity.parent);
      if (dbId && parentDbId) {
        await prisma.entity.update({
          where: { id: dbId },
          data: { parentId: parentDbId },
        });
      }
    }
  }

  // Build a lookup from mock entity name to DB entity ID
  const entityNameToId = new Map<string, string>();
  for (const entity of MOCK_ENTITIES) {
    const dbId = entityIdMap.get(entity.id);
    if (dbId) entityNameToId.set(entity.name, dbId);
  }

  // Create assets - link to entities by matching entity name from mock data
  for (const asset of MOCK_ASSETS) {
    let entityId: string | undefined;
    if (asset.entity) {
      // Try exact match first, then partial match
      entityId = entityNameToId.get(asset.entity);
      if (!entityId) {
        for (const [name, id] of entityNameToId) {
          if (name.toLowerCase().includes(asset.entity.toLowerCase()) ||
              asset.entity.toLowerCase().includes(name.toLowerCase())) {
            entityId = id;
            break;
          }
        }
      }
    }

    await prisma.asset.create({
      data: {
        userId,
        entityId: entityId ?? undefined,
        name: asset.name,
        category: asset.category,
        value: BigInt(Math.round(asset.value * 100)), // convert dollars to cents
        currency: "USD",
        change24h: asset.change24h,
        change30d: asset.change30d,
        source: "seed",
      },
    });
  }

  // Create insights
  for (const insight of MOCK_INSIGHTS) {
    await prisma.insight.create({
      data: {
        userId,
        title: insight.title,
        description: insight.summary,
        category: insight.category,
        priority: insight.priority,
      },
    });
  }
}
