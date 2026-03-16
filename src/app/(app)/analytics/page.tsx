import AnalyticsClient from "@/components/analytics/AnalyticsClient";
import { requireAuth } from "@/utils/require-auth";

export default async function AnalyticsPage() {
  await requireAuth();
  return <AnalyticsClient />;
}
