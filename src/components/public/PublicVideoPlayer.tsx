"use client";

import { MessageSquare, Video } from "lucide-react";
import Image from "next/image";
import { useMemo, useRef } from "react";

import PublicShareActions from "@/components/public/PublicShareActions";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { STREAM_STATUS } from "@/constants/stream.constants";
import { useHls } from "@/hooks/useHls";
import { usePlaybackTracker } from "@/hooks/usePlaybackTracker";
import { usePublicStream } from "@/hooks/usePublicStream";
import { usePublicStreamStats } from "@/hooks/usePublicStreamStats";
import { useTrackPublicView } from "@/hooks/useTrackPublicView";
import { formatDurationSeconds } from "@/utils/format.utils";
import { getInitials, isLocalAsset } from "@/utils/string.utils";

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
      ? "bg-primary/20 text-primary"
      : "bg-muted text-muted-foreground";
  const initials = getInitials(stream.orgName);
  const viewerCount =
    statsState.data?.totalViewers ?? statsState.data?.totalListeners ?? 0;
  const averageWatchLabel = statsState.data
    ? formatDurationSeconds(statsState.data.averageWatchDuration)
    : "--";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-[2.2fr_1fr]">
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-black">
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
              <div
                className={`absolute left-4 top-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusClassName}`}
              >
                <Video className="size-3" />
                {liveLabel}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="text-2xl font-semibold">{stream.title}</h1>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="overflow-hidden rounded-full border border-border/60">
                    {stream.orgImageUrl && isLocalAsset(stream.orgImageUrl) ? (
                      <Image
                        src={stream.orgImageUrl}
                        alt={stream.orgName ?? "Channel"}
                        width={44}
                        height={44}
                        className="size-11 object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {initials || "EL"}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {stream.orgName ?? "EchoLive"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {viewerCount.toLocaleString()} watching ·{" "}
                      {averageWatchLabel}
                    </span>
                  </div>
                </div>
                <PublicShareActions
                  shareLink={shareLink}
                  error={tracker.error}
                />
              </div>
            </div>
          </div>

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
