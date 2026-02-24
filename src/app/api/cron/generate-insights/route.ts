import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInsights } from "@/lib/insight-generator";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find all active subscribers
    const activeUsers = await prisma.user.findMany({
      where: {
        subscription: {
          status: { in: ["active", "trialing"] },
        },
      },
      select: { id: true },
    });

    let generated = 0;
    let failed = 0;

    for (const user of activeUsers) {
      try {
        await generateInsights(user.id);
        generated++;
      } catch (error) {
        console.error(`Cron: Failed to generate insights for user ${user.id}:`, error);
        failed++;
      }
    }

    return NextResponse.json({
      generated,
      failed,
      total: activeUsers.length,
    });
  } catch (error) {
    console.error("Cron generate-insights error:", error);
    return NextResponse.json(
      { error: "Cron job failed" },
      { status: 500 }
    );
  }
}
