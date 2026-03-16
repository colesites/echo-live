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

  const activeCard = (showMore: boolean) => (
    <Card className="relative h-full border-border/70 bg-background/80 backdrop-blur transition group-hover:ring-1 group-hover:ring-primary/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Radio className="size-4 text-primary" />
          Active Streams
        </CardTitle>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-3">
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
          <div className="mt-auto pt-2 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition group-hover:text-primary">
            Show more
          </div>
        ) : null}
      </CardContent>
    </Card>
  );

  const upcomingCard = (showMore: boolean) => (
    <Card className="relative h-full border-border/70 bg-background/80 backdrop-blur transition group-hover:ring-1 group-hover:ring-primary/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarDays className="size-4 text-primary" />
          Upcoming Streams
        </CardTitle>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-3">
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
          <div className="mt-auto pt-2 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition group-hover:text-primary">
            Show more
          </div>
        ) : null}
      </CardContent>
    </Card>
  );

  const recordingsCard = (showMore: boolean) => (
    <Card className="relative h-full border-border/70 bg-background/80 backdrop-blur transition group-hover:ring-1 group-hover:ring-primary/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Video className="size-4 text-primary" />
          Recent Recordings
        </CardTitle>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-3">
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
          <div className="mt-auto pt-2 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition group-hover:text-primary">
            Show more
          </div>
        ) : null}
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-6 xl:grid-cols-2 xl:items-stretch">
      <div className="grid gap-6 xl:grid-rows-2">
        {data.activeStreams.length > maxPreviewItems ? (
          <Dialog>
            <DialogTrigger asChild>
              <div className="group h-full cursor-pointer rounded-2xl overflow-hidden transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
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
              <div className="group h-full cursor-pointer rounded-2xl overflow-hidden transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
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

      <div className="grid gap-6 xl:grid-rows-2">
        <Card className="h-full border-border/70 bg-background/80 backdrop-blur">
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
              <div className="group h-full cursor-pointer rounded-2xl overflow-hidden transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
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
  );
}
