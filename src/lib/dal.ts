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
