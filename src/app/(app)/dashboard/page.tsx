import DashboardClient from "@/components/dashboard/DashboardClient";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { requireAuth } from "@/utils/require-auth";

export default async function DashboardPage() {
  await requireAuth();
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />
      <DashboardClient />
    </div>
  );
}
