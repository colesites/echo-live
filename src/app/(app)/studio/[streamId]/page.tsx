import StudioClient from "@/components/studio/StudioClient";

type StudioPageProps = {
  params: Promise<{ streamId: string }>;
};

export default async function StudioPage({ params }: StudioPageProps) {
  const { streamId } = await params;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Live Studio
          </p>
          <h2 className="text-2xl font-semibold">Production Console</h2>
        </div>
      </div>
      <div className="dark rounded-3xl border border-border/60 bg-background p-6 shadow-sm">
        <StudioClient streamId={streamId} />
      </div>
    </div>
  );
}
