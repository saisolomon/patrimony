import { requireSubscription, getUserInsights } from "@/lib/dal";
import { InsightList } from "@/components/dashboard/insight-list";

export default async function InsightsPage() {
  const user = await requireSubscription();
  const insights = await getUserInsights(user.id);

  const serializedInsights = insights.map((i) => ({
    id: i.id,
    title: i.title,
    summary: i.description,
    category: i.category,
    priority: i.priority,
    date: i.createdAt.toISOString().split("T")[0],
    actionable: true,
  }));

  return (
    <div className="space-y-8">
      <InsightList insights={serializedInsights} />
    </div>
  );
}
