"use client";

import AnalyticsCountryList from "@/components/analytics/AnalyticsCountryList";
import AnalyticsLineChart from "@/components/analytics/AnalyticsLineChart";
import DashboardMetric from "@/components/dashboard/DashboardMetric";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { STREAM_MODE } from "@/constants/stream.constants";
import {
  useStreamAnalyticsSeries,
  useStreamAnalyticsSummary,
  useStreamCountryBreakdown,
} from "@/hooks/useStreamAnalytics";
import type { Stream } from "@/types/stream.types";
import { formatDurationSeconds } from "@/utils/format.utils";

export type AnalyticsDetailsProps = {
  stream: Stream;
};

export default function AnalyticsDetails({ stream }: AnalyticsDetailsProps) {
  const summaryState = useStreamAnalyticsSummary(stream.id);
  const seriesState = useStreamAnalyticsSeries(stream.id);
  const countryState = useStreamCountryBreakdown(stream.id);

  if (
    summaryState.isLoading ||
    seriesState.isLoading ||
    countryState.isLoading
  ) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center rounded-3xl border border-border/60 bg-background/70">
        <Spinner className="size-6 text-primary" />
      </div>
    );
  }

  if (summaryState.hasError || seriesState.hasError || countryState.hasError) {
    return (
      <Alert className="border-border/60 bg-background/80">
        We could not load analytics for this stream.
      </Alert>
    );
  }

  const summary = summaryState.data;
  const series = seriesState.data ?? [];
  const countries = countryState.data ?? [];
  const values = series.map((entry) =>
    stream.type === STREAM_MODE.AUDIO ? entry.listenerCount : entry.viewerCount,
  );

  return (
    <div className="flex flex-col gap-6">
      {summary ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardMetric
            label="Total Viewers"
            value={summary.totalViewers.toLocaleString()}
            helper="All-time views"
          />
          <DashboardMetric
            label="Total Listeners"
            value={summary.totalListeners.toLocaleString()}
            helper="Audio sessions"
          />
          <DashboardMetric
            label="Peak Viewers"
            value={summary.peakViewers.toLocaleString()}
            helper="Highest concurrency"
          />
          <DashboardMetric
            label="Avg Watch"
            value={formatDurationSeconds(summary.averageWatchDuration)}
            helper="Average session length"
          />
        </div>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <AnalyticsLineChart title="Viewers Over Time" values={values} />
        <AnalyticsCountryList countries={countries} />
      </div>
    </div>
  );
}
