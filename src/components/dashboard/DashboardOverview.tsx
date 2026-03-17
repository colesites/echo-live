import { BarChart3, CalendarDays, Radio, Video } from "lucide-react";

import DashboardListItem from "@/components/dashboard/DashboardListItem";
import DashboardMetric from "@/components/dashboard/DashboardMetric";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const activePreview = data.activeStreams[0] ?? null;
  const upcomingPreview = data.upcomingStreams[0] ?? null;
  const recordingPreview = data.recentRecordings[0] ?? null;
  const maxPreviewItems = 3;

  const stats = [
    {
      label: "Active Streams",
      value: data.activeStreams.length.toString(),
      helper: "Currently live",
    },
    {
      label: "Upcoming",
      value: data.upcomingStreams.length.toString(),
      helper: "Next 7 days",
    },
    {
      label: "Total Viewers",
      value: data.analyticsSummary.totalViewers.toLocaleString(),
      helper: "Last 30 days",
    },
    {
      label: "Total Listeners",
      value: data.analyticsSummary.totalListeners.toLocaleString(),
      helper: "Audio only",
    },
  ];

  const activeCard = (showMore: boolean) => (
    <Card className="border-border/70 bg-card/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Radio className="size-4 text-primary" />
          Active Streams
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {activePreview ? (
          <div className="flex flex-col gap-3">
            {data.activeStreams.slice(0, maxPreviewItems).map((stream) => (
              <DashboardListItem
                key={stream.id}
                title={stream.title}
                subtitle={formatLiveUptime(stream.liveStartedAt, nowTimestamp)}
                badgeLabel={STREAM_TYPE_LABELS[stream.type]}
                valueLabel={`${stream.viewerCount} viewers`}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No active streams"
            description="Start a stream to see it show up here."
            icon={Radio}
          />
        )}
        {showMore ? (
          <div className="mt-auto pt-2 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Show more
          </div>
        ) : null}
      </CardContent>
    </Card>
  );

  const upcomingCard = (showMore: boolean) => (
    <Card className="border-border/70 bg-card/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarDays className="size-4 text-primary" />
          Upcoming Streams
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {upcomingPreview ? (
          <div className="flex flex-col gap-3">
            {data.upcomingStreams.slice(0, maxPreviewItems).map((stream) => (
              <DashboardListItem
                key={stream.id}
                title={stream.title}
                subtitle={formatShortDateTime(stream.scheduledFor)}
                badgeLabel={STREAM_TYPE_LABELS[stream.type]}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No upcoming streams"
            description="Schedule a stream and it will appear here."
            icon={CalendarDays}
          />
        )}
        {showMore ? (
          <div className="mt-auto pt-2 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Show more
          </div>
        ) : null}
      </CardContent>
    </Card>
  );

  const recordingsCard = (showMore: boolean) => (
    <Card className="border-border/70 bg-card/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Video className="size-4 text-primary" />
          Recent Recordings
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {recordingPreview ? (
          <div className="flex flex-col gap-3">
            {data.recentRecordings.slice(0, maxPreviewItems).map((stream) => (
              <DashboardListItem
                key={stream.id}
                title={stream.title}
                subtitle={formatShortDate(stream.recordedAt)}
                badgeLabel={STREAM_TYPE_LABELS[stream.type]}
                valueLabel={formatDurationMinutes(stream.durationMinutes)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No recordings yet"
            description="Recordings appear automatically after streams end."
            icon={Video}
          />
        )}
        {showMore ? (
          <div className="mt-auto pt-2 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Show more
          </div>
        ) : null}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-[0_18px_40px_-32px_rgba(0,0,0,0.85)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground">{stat.helper}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-stretch">
        <div className="grid gap-6">
          {data.activeStreams.length > maxPreviewItems ? (
            <Dialog>
              <DialogTrigger asChild>
                <div className="cursor-pointer rounded-2xl">
                  {activeCard(true)}
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-lg border-border/80 bg-background/95">
                <DialogHeader>
                  <DialogTitle>Active Streams</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-4">
                  <div className="flex flex-col gap-3">
                    {data.activeStreams.map((stream) => (
                      <DashboardListItem
                        key={stream.id}
                        title={stream.title}
                        subtitle={formatLiveUptime(
                          stream.liveStartedAt,
                          nowTimestamp,
                        )}
                        badgeLabel={STREAM_TYPE_LABELS[stream.type]}
                        valueLabel={`${stream.viewerCount} viewers`}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          ) : (
            activeCard(false)
          )}

          {data.upcomingStreams.length > maxPreviewItems ? (
            <Dialog>
              <DialogTrigger asChild>
                <div className="cursor-pointer rounded-2xl">
                  {upcomingCard(true)}
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-lg border-border/80 bg-background/95">
                <DialogHeader>
                  <DialogTitle>Upcoming Streams</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-4">
                  <div className="flex flex-col gap-3">
                    {data.upcomingStreams.map((stream) => (
                      <DashboardListItem
                        key={stream.id}
                        title={stream.title}
                        subtitle={formatShortDateTime(stream.scheduledFor)}
                        badgeLabel={STREAM_TYPE_LABELS[stream.type]}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          ) : (
            upcomingCard(false)
          )}
        </div>

        <div className="grid gap-6">
          <Card className="border-border/70 bg-card/70">
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

          {data.recentRecordings.length > maxPreviewItems ? (
            <Dialog>
              <DialogTrigger asChild>
                <div className="cursor-pointer rounded-2xl">
                  {recordingsCard(true)}
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-lg border-border/80 bg-background/95">
                <DialogHeader>
                  <DialogTitle>Recent Recordings</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-4">
                  <div className="flex flex-col gap-3">
                    {data.recentRecordings.map((stream) => (
                      <DashboardListItem
                        key={stream.id}
                        title={stream.title}
                        subtitle={formatShortDate(stream.recordedAt)}
                        badgeLabel={STREAM_TYPE_LABELS[stream.type]}
                        valueLabel={formatDurationMinutes(stream.durationMinutes)}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          ) : (
            recordingsCard(false)
          )}
        </div>
      </div>
    </div>
  );
}
