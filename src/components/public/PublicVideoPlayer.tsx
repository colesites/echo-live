"use client";

import { MessageSquare, Users, Video } from "lucide-react";
import { useMemo, useRef } from "react";

import PublicShareActions from "@/components/public/PublicShareActions";
import PublicStreamHeader from "@/components/public/PublicStreamHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { STREAM_STATUS } from "@/constants/stream.constants";
import { useHls } from "@/hooks/useHls";
import { usePlaybackTracker } from "@/hooks/usePlaybackTracker";
import { usePublicStream } from "@/hooks/usePublicStream";
import { usePublicStreamStats } from "@/hooks/usePublicStreamStats";
import { useTrackPublicView } from "@/hooks/useTrackPublicView";
import { formatDurationSeconds } from "@/utils/format.utils";

const SHARE_PREFIX = "/v/";

export type PublicVideoPlayerProps = {
  publicId: string;
};

export default function PublicVideoPlayer({
  publicId,
}: PublicVideoPlayerProps) {
  const streamState = usePublicStream(publicId);
  const statsState = usePublicStreamStats(publicId);
  const tracker = useTrackPublicView(publicId);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playback = usePlaybackTracker(tracker.trackView);
  useHls({ mediaRef: videoRef, src: streamState.data?.hlsUrl });

  const shareLink = useMemo(() => `${SHARE_PREFIX}${publicId}`, [publicId]);

  if (streamState.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20">
        <Spinner className="size-6 text-primary" />
      </div>
    );
  }

  if (streamState.hasError || !streamState.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20 text-sm text-muted-foreground">
        Video stream not found.
      </div>
    );
  }

  const stream = streamState.data;
  const canPlay = Boolean(stream.hlsUrl);
  const liveLabel = stream.status === STREAM_STATUS.LIVE ? "Live" : "Offline";
  const statusClassName =
    stream.status === STREAM_STATUS.LIVE
      ? "bg-emerald-500/20 text-emerald-200"
      : "bg-muted text-muted-foreground";
  const viewerCount =
    statsState.data?.totalViewers ?? statsState.data?.totalListeners ?? 0;
  const averageWatchLabel = statsState.data
    ? formatDurationSeconds(statsState.data.averageWatchDuration)
    : "--";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(106,90,205,0.14),_transparent_55%),radial-gradient(circle_at_top_right,_rgba(245,184,65,0.14),_transparent_50%)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
        <PublicStreamHeader
          title={stream.title}
          churchName={stream.churchName}
          churchLogo={stream.churchLogo}
          statusLabel={liveLabel}
          statusClassName={statusClassName}
          icon={Video}
        />

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card className="border-border/60 bg-background/80 backdrop-blur">
            <CardContent className="flex flex-col gap-4 px-6 py-6">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Users className="size-4 text-primary" />
                  {viewerCount.toLocaleString()} watching
                </span>
                <span>{averageWatchLabel}</span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-border/60 bg-black">
                {canPlay ? (
                  <>
                    {/* biome-ignore lint/a11y/useMediaCaption: Captions are provided by the streaming provider when available. */}
                    <video
                      ref={videoRef}
                      controls
                      className="aspect-video w-full"
                      onPlay={playback.handlePlay}
                      onPause={playback.handlePause}
                      onEnded={playback.handlePause}
                    />
                  </>
                ) : (
                  <div className="flex aspect-video items-center justify-center text-sm text-muted-foreground">
                    Stream is not live yet.
                  </div>
                )}
              </div>
              <PublicShareActions shareLink={shareLink} error={tracker.error} />
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-background/80 backdrop-blur">
            <CardContent className="flex h-full flex-col gap-4 px-6 py-6">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <MessageSquare className="size-4 text-primary" />
                Live Chat
              </div>
              <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-border/60 bg-background/60 text-sm text-muted-foreground">
                Chat is available during live broadcasts.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
