"use client";

import { Headphones, Pause, Play, Users } from "lucide-react";
import { useMemo, useRef } from "react";

import WaveformBars from "@/components/audio-studio/WaveformBars";
import PublicShareActions from "@/components/public/PublicShareActions";
import PublicStreamHeader from "@/components/public/PublicStreamHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { STREAM_STATUS } from "@/constants/stream.constants";
import { useAudioElementVisualizer } from "@/hooks/useAudioElementVisualizer";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { useHls } from "@/hooks/useHls";
import { usePlaybackTracker } from "@/hooks/usePlaybackTracker";
import { usePublicStream } from "@/hooks/usePublicStream";
import { usePublicStreamStats } from "@/hooks/usePublicStreamStats";
import { useTrackPublicView } from "@/hooks/useTrackPublicView";
import { formatDurationSeconds } from "@/utils/format.utils";

const SHARE_PREFIX = "/a/";

export type PublicAudioPlayerProps = {
  publicId: string;
};

export default function PublicAudioPlayer({
  publicId,
}: PublicAudioPlayerProps) {
  const streamState = usePublicStream(publicId);
  const statsState = usePublicStreamStats(publicId);
  const tracker = useTrackPublicView(publicId);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playback = usePlaybackTracker(tracker.trackView);
  const canPlay = Boolean(streamState.data?.audioUrl);
  const audioPlayback = useAudioPlayback({ audioRef, canPlay });
  const levels = useAudioElementVisualizer({
    audioRef,
    isActive: canPlay && audioPlayback.isPlaying,
  });
  useHls({ mediaRef: audioRef, src: streamState.data?.audioUrl });

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
        Audio stream not found.
      </div>
    );
  }

  const stream = streamState.data;
  const liveLabel = stream.status === STREAM_STATUS.LIVE ? "Live" : "Offline";
  const statusClassName =
    stream.status === STREAM_STATUS.LIVE
      ? "bg-emerald-500/20 text-emerald-200"
      : "bg-muted text-muted-foreground";
  const listenerCount =
    statsState.data?.totalListeners ?? statsState.data?.totalViewers ?? 0;
  const averageWatchLabel = statsState.data
    ? formatDurationSeconds(statsState.data.averageWatchDuration)
    : "--";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(106,90,205,0.16),_transparent_55%),radial-gradient(circle_at_top_right,_rgba(245,184,65,0.16),_transparent_50%)]">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
        <PublicStreamHeader
          title={stream.title}
          churchName={stream.churchName}
          churchLogo={stream.churchLogo}
          statusLabel={liveLabel}
          statusClassName={statusClassName}
          icon={Headphones}
        />

        <Card className="border-border/60 bg-background/80 backdrop-blur">
          <CardContent className="flex flex-col gap-6 px-6 py-8">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                {listenerCount.toLocaleString()} listening
              </span>
              <span>{averageWatchLabel}</span>
            </div>
            <div className="relative flex min-h-[220px] items-center justify-center rounded-3xl border border-dashed border-border/60 bg-background/60">
              <WaveformBars
                levels={levels}
                className="pointer-events-none absolute inset-6"
              />
              <Button
                size="icon-lg"
                variant="secondary"
                onClick={audioPlayback.toggle}
                disabled={!canPlay}
                className="relative"
              >
                {audioPlayback.isPlaying ? <Pause /> : <Play />}
              </Button>
            </div>
            {!canPlay ? (
              <p className="text-sm text-muted-foreground">
                The audio feed is not available yet. Please check back soon.
              </p>
            ) : null}
            {audioPlayback.error ? (
              <p className="text-sm text-destructive">{audioPlayback.error}</p>
            ) : null}
            <PublicShareActions shareLink={shareLink} error={tracker.error} />
            {/* biome-ignore lint/a11y/useMediaCaption: Captions are provided by the streaming provider when available. */}
            <audio
              ref={audioRef}
              crossOrigin="anonymous"
              onPlay={() => {
                audioPlayback.handlePlay();
                playback.handlePlay();
              }}
              onPause={() => {
                audioPlayback.handlePause();
                playback.handlePause();
              }}
              onEnded={() => {
                audioPlayback.handlePause();
                playback.handlePause();
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
