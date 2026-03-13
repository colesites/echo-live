import DashboardClient from "@/components/dashboard/DashboardClient";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />
      <DashboardClient />
    </div>
  );
}
