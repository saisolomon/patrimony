import { NextResponse } from "next/server";
import { requireSubscription } from "@/lib/dal";
import { syncAllUserPlaidItems } from "@/lib/plaid-sync";

export async function POST() {
  try {
    const user = await requireSubscription();

    await syncAllUserPlaidItems(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Plaid sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync accounts" },
      { status: 500 }
    );
  }
}
