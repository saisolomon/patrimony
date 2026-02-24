import { NextRequest, NextResponse } from "next/server";
import { requireSubscription, updateAsset, deleteAsset } from "@/lib/dal";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireSubscription();
    const { id } = await params;
    const body = await req.json();

    const asset = await updateAsset(id, user.id, body);

    return NextResponse.json({
      id: asset.id,
      name: asset.name,
      category: asset.category,
      value: Number(asset.value) / 100,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update asset" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireSubscription();
    const { id } = await params;

    await deleteAsset(id, user.id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete asset" },
      { status: 500 }
    );
  }
}
