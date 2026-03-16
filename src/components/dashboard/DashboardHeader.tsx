import Link from "next/link";

import CreateStreamForm from "@/components/dashboard/CreateStreamForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DashboardHeader() {
  return (
    <div className="flex flex-col gap-6 rounded-[28px] border border-border/70 bg-gradient-to-br from-background via-background to-muted/50 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-col gap-3">
          <Badge className="w-fit border border-primary/20 bg-primary/10 text-primary">
            Control Room
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight">
            Schedule, stream, and measure with confidence.
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Keep your production pipeline clean: create streams, track live
            audiences, and review recordings in one place.
          </p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/studio">Open Studio</Link>
        </Button>
      </div>
      <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
        <CreateStreamForm />
      </div>
    </div>
  );
}
