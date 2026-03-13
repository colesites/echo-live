import { BarChart3, CalendarDays, Radio, Video } from "lucide-react";

import DashboardListItem from "@/components/dashboard/DashboardListItem";
import DashboardMetric from "@/components/dashboard/DashboardMetric";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STREAM_TYPE_LABELS } from "@/constants/stream.constants";
import type { DashboardSnapshot } from "@/types/dashboard.types";
import {
  formatDurationMinutes,
  formatLiveUptime,
  formatShortDate,
  formatShortDateTime,
} from "@/utils/format.utils";

export default function DashboardOverview({
  data,
}: {
  data: DashboardSnapshot;
}) {
  const nowTimestamp = Date.now();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border/60 bg-background/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="size-4 text-primary" />
            Upcoming Streams
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {data.upcomingStreams.map((stream) => (
            <DashboardListItem
              key={stream.id}
              title={stream.title}
              subtitle={formatShortDateTime(stream.scheduledFor)}
              badgeLabel={STREAM_TYPE_LABELS[stream.type]}
            />
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-background/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Radio className="size-4 text-primary" />
            Active Streams
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {data.activeStreams.map((stream) => (
            <DashboardListItem
              key={stream.id}
              title={stream.title}
              subtitle={formatLiveUptime(stream.liveStartedAt, nowTimestamp)}
              badgeLabel={STREAM_TYPE_LABELS[stream.type]}
              valueLabel={`${stream.viewerCount} viewers`}
            />
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-background/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="size-4 text-primary" />
            Viewer Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <DashboardMetric
            label="Total Viewers"
            value={data.analyticsSummary.totalViewers.toLocaleString()}
            helper="Last 30 days"
          />
          <DashboardMetric
            label="Peak Viewers"
            value={data.analyticsSummary.peakViewers.toLocaleString()}
            helper="Best single stream"
          />
          <DashboardMetric
            label="Avg Watch"
            value={`${data.analyticsSummary.averageWatchMinutes} min`}
            helper="Average duration"
          />
          <DashboardMetric
            label="Total Listeners"
            value={data.analyticsSummary.totalListeners.toLocaleString()}
            helper="Audio only"
          />
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-background/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Video className="size-4 text-primary" />
            Recent Recordings
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {data.recentRecordings.map((stream) => (
            <DashboardListItem
              key={stream.id}
              title={stream.title}
              subtitle={formatShortDate(stream.recordedAt)}
              badgeLabel={STREAM_TYPE_LABELS[stream.type]}
              valueLabel={formatDurationMinutes(stream.durationMinutes)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
