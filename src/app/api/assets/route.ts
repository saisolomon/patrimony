import { NextRequest, NextResponse } from "next/server";
import { requireSubscription, createAsset } from "@/lib/dal";

export async function POST(req: NextRequest) {
  try {
    const user = await requireSubscription();
    const body = await req.json();

    const { name, category, value, entityId, notes, institution } = body;

    if (!name || !category || value === undefined) {
      return NextResponse.json(
        { error: "Name, category, and value are required" },
        { status: 400 }
      );
    }

    if (typeof value !== "number" || value < 0) {
      return NextResponse.json(
        { error: "Value must be a positive number" },
        { status: 400 }
      );
    }

    const asset = await createAsset(user.id, {
      name,
      category,
      value,
      entityId,
      notes,
      institution,
    });

    return NextResponse.json({
      id: asset.id,
      name: asset.name,
      category: asset.category,
      value: Number(asset.value) / 100,
      source: asset.source,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create asset" },
      { status: 500 }
    );
  }
}
