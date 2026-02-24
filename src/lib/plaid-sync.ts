import { plaidClient } from "./plaid";
import { decryptAccessToken } from "./plaid-crypto";
import { prisma } from "./prisma";

type PlaidAccountType = "depository" | "investment" | "credit" | "loan" | "brokerage" | "other";

type PlaidItemRecord = Awaited<ReturnType<typeof prisma.plaidItem.findUniqueOrThrow>>;

const ACCOUNT_TYPE_TO_CATEGORY: Record<PlaidAccountType, string> = {
  depository: "cash",
  investment: "equities",
  brokerage: "equities",
  credit: "cash",
  loan: "fixed-income",
  other: "alternatives",
};

function dollarsToCents(amount: number | null | undefined): bigint | null {
  if (amount == null) return null;
  return BigInt(Math.round(amount * 100));
}

export async function syncPlaidItem(plaidItem: PlaidItemRecord) {
  const accessToken = decryptAccessToken(
    plaidItem.accessTokenEnc,
    plaidItem.accessTokenIv,
    plaidItem.accessTokenTag
  );

  // Fetch accounts from Plaid
  const { data: accountsData } = await plaidClient.accountsGet({
    access_token: accessToken,
  });

  for (const account of accountsData.accounts) {
    const currentBalance = dollarsToCents(account.balances.current);
    const availableBalance = dollarsToCents(account.balances.available);
    const accountType = (account.type || "other") as PlaidAccountType;

    // Upsert PlaidAccount
    const plaidAccount = await prisma.plaidAccount.upsert({
      where: { plaidAccountId: account.account_id },
      create: {
        plaidItemId: plaidItem.id,
        plaidAccountId: account.account_id,
        name: account.name,
        officialName: account.official_name || null,
        type: account.type,
        subtype: account.subtype || null,
        mask: account.mask || null,
        currentBalance,
        availableBalance,
        isoCurrencyCode: account.balances.iso_currency_code || "USD",
        lastSyncedAt: new Date(),
      },
      update: {
        name: account.name,
        officialName: account.official_name || null,
        currentBalance,
        availableBalance,
        isoCurrencyCode: account.balances.iso_currency_code || "USD",
        lastSyncedAt: new Date(),
      },
    });

    // Determine asset value (negative for credit/loan)
    let assetValue = currentBalance ?? BigInt(0);
    if (accountType === "credit" || accountType === "loan") {
      assetValue = assetValue > BigInt(0) ? -assetValue : assetValue;
    }

    const category = ACCOUNT_TYPE_TO_CATEGORY[accountType] || "alternatives";
    const assetName = account.official_name || account.name;

    // Upsert the corresponding Asset
    const existingAsset = await prisma.asset.findFirst({
      where: { plaidAccountId: plaidAccount.id, userId: plaidItem.userId },
    });

    if (existingAsset) {
      await prisma.asset.update({
        where: { id: existingAsset.id },
        data: {
          name: assetName,
          value: assetValue,
          institution: plaidItem.institutionName || undefined,
          accountMask: account.mask || undefined,
        },
      });
    } else {
      await prisma.asset.create({
        data: {
          userId: plaidItem.userId,
          name: assetName,
          category,
          value: assetValue,
          currency: account.balances.iso_currency_code || "USD",
          institution: plaidItem.institutionName || undefined,
          accountMask: account.mask || undefined,
          source: "plaid",
          plaidAccountId: plaidAccount.id,
        },
      });
    }
  }

  // Update last synced timestamp
  await prisma.plaidItem.update({
    where: { id: plaidItem.id },
    data: { lastSyncedAt: new Date() },
  });
}

export async function syncAllUserPlaidItems(userId: string) {
  const items = await prisma.plaidItem.findMany({
    where: { userId, status: "active" },
  });

  for (const item of items) {
    try {
      await syncPlaidItem(item);
    } catch (error) {
      console.error(`Failed to sync Plaid item ${item.id}:`, error);
      await prisma.plaidItem.update({
        where: { id: item.id },
        data: {
          status: "error",
          errorCode: error instanceof Error ? error.message : "UNKNOWN_ERROR",
        },
      });
    }
  }
}
