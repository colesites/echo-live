import { Spinner } from "@/components/ui/spinner";

export default function StudioLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 rounded-3xl border border-border/60 bg-background/70">
      <Spinner className="size-6 text-primary" />
      <p className="text-sm text-muted-foreground">Loading studio…</p>
    </div>
  );
}
