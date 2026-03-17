export type DashboardMetricProps = {
  label: string;
  value: string;
  helper: string;
};

export default function DashboardMetric({
  label,
  value,
  helper,
}: DashboardMetricProps) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border/70 bg-background/60 px-4 py-4 shadow-[0_14px_30px_-26px_rgba(0,0,0,0.85)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{helper}</p>
    </div>
  );
}
