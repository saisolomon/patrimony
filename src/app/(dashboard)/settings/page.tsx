import { currentUser } from "@clerk/nextjs/server";
import { getCurrentUser } from "@/lib/dal";
import { PLANS, type PlanId } from "@/lib/stripe";
import { SettingsForm } from "@/components/dashboard/settings-form";

export default async function SettingsPage() {
  const [clerkUser, dbUser] = await Promise.all([
    currentUser(),
    getCurrentUser(),
  ]);

  const profile = {
    fullName: clerkUser
      ? `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim()
      : dbUser.name || "User",
    email: clerkUser?.emailAddresses?.[0]?.emailAddress || dbUser.email || "",
  };

  const sub = dbUser.subscription;
  const subscription = sub
    ? {
        planName: (PLANS[sub.plan as PlanId]?.name ?? sub.plan) + " Plan",
        status: sub.status,
        price: sub.billingInterval === "annual"
          ? `$${(PLANS[sub.plan as PlanId]?.annualPrice ?? 0) / 100}/year`
          : `$${(PLANS[sub.plan as PlanId]?.monthlyPrice ?? 0) / 100}/month`,
      }
    : null;

  const notifications = {
    weeklyDigest: dbUser.weeklyDigest,
    insightAlerts: dbUser.insightAlerts,
    taxAlerts: dbUser.taxAlerts,
  };

  return (
    <div className="space-y-8">
      <SettingsForm profile={profile} subscription={subscription} notifications={notifications} />
    </div>
  );
}
