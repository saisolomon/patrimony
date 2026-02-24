import { NextResponse } from "next/server";
import { requireSubscription } from "@/lib/dal";
import { plaidClient } from "@/lib/plaid";
import { CountryCode, Products } from "plaid";

export async function POST() {
  try {
    const user = await requireSubscription();

    const { data } = await plaidClient.linkTokenCreate({
      user: { client_user_id: user.id },
      client_name: "Patrimony",
      products: [Products.Auth, Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
    });

    return NextResponse.json({ linkToken: data.link_token });
  } catch (error) {
    console.error("Plaid link token error:", error);
    return NextResponse.json(
      { error: "Failed to create link token" },
      { status: 500 }
    );
  }
}
