import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncPlaidItem } from "@/lib/plaid-sync";

export async function GET(req: NextRequest) {
  // Verify cron secret for Vercel cron jobs
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const activeItems = await prisma.plaidItem.findMany({
      where: { status: "active" },
    });

    let synced = 0;
    let failed = 0;

    for (const item of activeItems) {
      try {
        await syncPlaidItem(item);
        synced++;
      } catch (error) {
        console.error(`Cron: Failed to sync item ${item.id}:`, error);
        failed++;
      }
    }

    return NextResponse.json({ synced, failed, total: activeItems.length });
  } catch (error) {
    console.error("Cron plaid-sync error:", error);
    return NextResponse.json(
      { error: "Cron job failed" },
      { status: 500 }
    );
  }
}
