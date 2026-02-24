import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncPlaidItem } from "@/lib/plaid-sync";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { webhook_type, webhook_code, item_id } = body;

    if (!item_id) {
      return NextResponse.json({ received: true });
    }

    const plaidItem = await prisma.plaidItem.findUnique({
      where: { itemId: item_id },
    });

    if (!plaidItem) {
      return NextResponse.json({ received: true });
    }

    if (webhook_type === "ITEM" && webhook_code === "ERROR") {
      await prisma.plaidItem.update({
        where: { id: plaidItem.id },
        data: {
          status: "error",
          errorCode: body.error?.error_code || "ITEM_ERROR",
        },
      });
    } else if (
      webhook_type === "HOLDINGS" ||
      webhook_type === "TRANSACTIONS" ||
      webhook_type === "INVESTMENTS_TRANSACTIONS"
    ) {
      await syncPlaidItem(plaidItem);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Plaid webhook error:", error);
    return NextResponse.json({ received: true });
  }
}
