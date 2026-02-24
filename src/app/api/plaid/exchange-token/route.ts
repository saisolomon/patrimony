import { NextRequest, NextResponse } from "next/server";
import { requireSubscription } from "@/lib/dal";
import { plaidClient } from "@/lib/plaid";
import { encryptAccessToken } from "@/lib/plaid-crypto";
import { syncPlaidItem } from "@/lib/plaid-sync";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await requireSubscription();
    const { publicToken, institutionId, institutionName } = await req.json();

    if (!publicToken) {
      return NextResponse.json(
        { error: "Public token is required" },
        { status: 400 }
      );
    }

    // Exchange public token for access token
    const { data } = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    // Encrypt the access token
    const { enc, iv, tag } = encryptAccessToken(data.access_token);

    // Store the Plaid item
    const plaidItem = await prisma.plaidItem.create({
      data: {
        userId: user.id,
        itemId: data.item_id,
        institutionId: institutionId || null,
        institutionName: institutionName || null,
        accessTokenEnc: enc,
        accessTokenIv: iv,
        accessTokenTag: tag,
      },
    });

    // Sync accounts immediately
    await syncPlaidItem(plaidItem);

    return NextResponse.json({ success: true, itemId: plaidItem.id });
  } catch (error) {
    console.error("Plaid exchange token error:", error);
    return NextResponse.json(
      { error: "Failed to link account" },
      { status: 500 }
    );
  }
}
