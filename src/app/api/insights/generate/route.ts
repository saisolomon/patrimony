import { NextResponse } from "next/server";
import { requireSubscription } from "@/lib/dal";
import { generateInsights } from "@/lib/insight-generator";

export async function POST() {
  try {
    const user = await requireSubscription();

    const insights = await generateInsights(user.id);

    return NextResponse.json({ insights, count: insights.length });
  } catch (error) {
    console.error("Insight generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
