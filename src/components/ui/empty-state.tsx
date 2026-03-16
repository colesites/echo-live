import type React from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon: Icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-2 rounded-2xl border border-dashed border-border/70 bg-background/40 px-4 py-6 text-sm text-muted-foreground",
        className,
      )}
    >
      {Icon ? <Icon className="size-4 text-muted-foreground/80" /> : null}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
