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
    <div className="flex flex-col gap-1 rounded-2xl border border-border/60 bg-background/70 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{helper}</p>
    </div>
  );
}
