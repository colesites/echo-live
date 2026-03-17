import { Badge } from "@/components/ui/badge";

export type DashboardListItemProps = {
  title: string;
  subtitle: string;
  badgeLabel: string;
  valueLabel?: string;
};

export default function DashboardListItem({
  title,
  subtitle,
  badgeLabel,
  valueLabel,
}: DashboardListItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/60 px-4 py-3 shadow-[0_14px_30px_-26px_rgba(0,0,0,0.85)]">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary/70" />
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <Badge
            variant="secondary"
            className="border border-border/60 text-xs"
          >
            {badgeLabel}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {valueLabel ? (
        <span className="rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-xs font-semibold text-foreground/80">
          {valueLabel}
        </span>
      ) : null}
    </div>
  );
}
