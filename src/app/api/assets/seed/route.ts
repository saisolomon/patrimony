import { NextResponse } from "next/server";
import { requireSubscription, clearSeedData } from "@/lib/dal";

export async function DELETE() {
  try {
    const user = await requireSubscription();

    await clearSeedData(user.id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to clear seed data" },
      { status: 500 }
    );
  }
}
