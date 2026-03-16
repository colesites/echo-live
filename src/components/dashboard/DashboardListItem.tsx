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
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/70 px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
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
        <span className="text-xs font-semibold text-foreground/70">
          {valueLabel}
        </span>
      ) : null}
    </div>
  );
}
