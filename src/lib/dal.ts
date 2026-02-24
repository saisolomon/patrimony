import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { subscription: true },
  });

  if (!user) {
    // User authenticated with Clerk but not yet in our DB — send to onboarding
    redirect("/onboarding");
  }

  return user;
}

export async function requireSubscription() {
  const user = await getCurrentUser();
  if (!user.subscription || !["active", "trialing"].includes(user.subscription.status)) {
    redirect("/pricing");
  }
  return user;
}

export async function getUserAssets(userId: string) {
  return prisma.asset.findMany({
    where: { userId },
    include: { entity: true },
    orderBy: { value: "desc" },
  });
}

export async function getUserEntities(userId: string) {
  return prisma.entity.findMany({
    where: { userId },
    include: { assets: true, children: true },
    orderBy: { name: "asc" },
  });
}

export async function getUserInsights(userId: string) {
  return prisma.insight.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createAsset(
  userId: string,
  data: {
    name: string;
    category: string;
    value: number;
    entityId?: string;
    notes?: string;
    institution?: string;
  }
) {
  return prisma.asset.create({
    data: {
      userId,
      name: data.name,
      category: data.category,
      value: BigInt(Math.round(data.value * 100)),
      entityId: data.entityId || undefined,
      notes: data.notes || undefined,
      institution: data.institution || undefined,
      source: "manual",
    },
  });
}

export async function updateAsset(
  assetId: string,
  userId: string,
  data: {
    name?: string;
    category?: string;
    value?: number;
    entityId?: string | null;
    notes?: string | null;
    institution?: string | null;
  }
) {
  return prisma.asset.update({
    where: { id: assetId, userId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.value !== undefined && { value: BigInt(Math.round(data.value * 100)) }),
      ...(data.entityId !== undefined && { entityId: data.entityId }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.institution !== undefined && { institution: data.institution }),
    },
  });
}

export async function deleteAsset(assetId: string, userId: string) {
  return prisma.asset.delete({
    where: { id: assetId, userId },
  });
}

export async function clearSeedData(userId: string) {
  await prisma.insight.deleteMany({ where: { userId } });
  await prisma.asset.deleteMany({ where: { userId, source: "seed" } });
  await prisma.entity.deleteMany({ where: { userId } });
}

export async function getUserDocuments(userId: string) {
  return prisma.document.findMany({
    where: { userId },
    include: { entity: true },
    orderBy: { createdAt: "desc" },
  });
}
