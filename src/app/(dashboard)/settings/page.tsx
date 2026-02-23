import { currentUser } from "@clerk/nextjs/server";
import { getCurrentUser } from "@/lib/dal";
import { SettingsForm } from "@/components/dashboard/settings-form";

export default async function SettingsPage() {
  const [clerkUser, dbUser] = await Promise.all([
    currentUser(),
    getCurrentUser(),
  ]);

  const profile = {
    fullName: clerkUser
      ? `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim()
      : dbUser.email || "User",
    email: clerkUser?.emailAddresses?.[0]?.emailAddress || dbUser.email || "",
  };

  const subscription = dbUser.subscription
    ? {
        planName: dbUser.subscription.planName,
        status: dbUser.subscription.status,
        price: `$${(Number(dbUser.subscription.price) / 100).toLocaleString()}/month`,
      }
    : null;

  return (
    <div className="space-y-8">
      <SettingsForm profile={profile} subscription={subscription} />
    </div>
  );
}
