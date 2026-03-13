import CreateStreamForm from "@/components/dashboard/CreateStreamForm";
import { Badge } from "@/components/ui/badge";

export default function DashboardHeader() {
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Badge className="w-fit bg-primary/10 text-primary">
            Welcome Back
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight">
            Plan your next broadcast.
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Create new streams, monitor what is live, and keep your community
            connected with instant public links.
          </p>
        </div>
      </div>
      <CreateStreamForm />
    </div>
  );
}
