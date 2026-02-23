import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUserToDb } from "@/lib/user-sync";
import { seedUserData } from "@/lib/seed-user-data";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { goal, netWorthRange, institutionCount, entityCount, primaryConcern } = body;

  // Ensure user exists in DB
  const user = await syncUserToDb(userId, body.email ?? "", body.name);

  // Save onboarding data
  await prisma.user.update({
    where: { clerkUserId: userId },
    data: {
      onboardingGoal: goal,
      netWorthRange: netWorthRange,
      institutionCount: institutionCount,
      entityCount: entityCount,
      primaryConcern: primaryConcern,
    },
  });

  // Seed mock data for the user
  await seedUserData(user.id);

  return NextResponse.json({ success: true });
}
