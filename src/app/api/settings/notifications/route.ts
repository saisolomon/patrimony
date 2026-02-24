import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { weeklyDigest: true, insightAlerts: true, taxAlerts: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const data: Record<string, boolean> = {};

  if (typeof body.weeklyDigest === "boolean") data.weeklyDigest = body.weeklyDigest;
  if (typeof body.insightAlerts === "boolean") data.insightAlerts = body.insightAlerts;
  if (typeof body.taxAlerts === "boolean") data.taxAlerts = body.taxAlerts;

  const user = await prisma.user.update({
    where: { clerkUserId: userId },
    data,
    select: { weeklyDigest: true, insightAlerts: true, taxAlerts: true },
  });

  return NextResponse.json(user);
}
