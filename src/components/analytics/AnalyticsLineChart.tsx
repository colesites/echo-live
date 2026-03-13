import { Activity } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildLinePath } from "@/utils/chart.utils";

export type AnalyticsLineChartProps = {
  title: string;
  values: number[];
};

export default function AnalyticsLineChart({
  title,
  values,
}: AnalyticsLineChartProps) {
  const path = buildLinePath(values);

  return (
    <Card className="border-border/60 bg-background/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="size-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {values.length < 2 ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-background/60 px-4 py-6 text-sm text-muted-foreground">
            Not enough data points yet.
          </div>
        ) : (
          <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
            <svg
              viewBox="0 0 100 40"
              className="h-40 w-full"
              aria-hidden="true"
            >
              <path
                d={path}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
              />
            </svg>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
