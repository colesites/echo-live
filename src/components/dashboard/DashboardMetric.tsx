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
    <div className="flex flex-col gap-2 rounded-2xl border border-border/70 bg-gradient-to-br from-background to-muted/60 px-4 py-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{helper}</p>
    </div>
  );
}
