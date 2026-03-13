import { Globe } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsCountry } from "@/types/analytics.types";

export type AnalyticsCountryListProps = {
  countries: AnalyticsCountry[];
};

export default function AnalyticsCountryList({
  countries,
}: AnalyticsCountryListProps) {
  const maxCount = Math.max(1, ...countries.map((country) => country.count));

  return (
    <Card className="border-border/60 bg-background/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Globe className="size-4 text-primary" />
          Audience by Country
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {countries.length ? (
          countries.map((country) => (
            <div
              key={country.country}
              className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-background/60 px-4 py-3"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">{country.country}</span>
                <span className="text-xs text-muted-foreground">
                  {country.count}
                </span>
              </div>
              <progress
                value={country.count}
                max={maxCount}
                className="h-2 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-muted/60 [&::-webkit-progress-value]:bg-primary"
              />
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border/60 bg-background/60 px-4 py-6 text-sm text-muted-foreground">
            No country data yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
