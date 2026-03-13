"use client";

import { Headphones, Users } from "lucide-react";
import { useMemo, useRef } from "react";

import PublicAudioControls from "@/components/public/PublicAudioControls";
import PublicShareActions from "@/components/public/PublicShareActions";
import PublicStreamHeader from "@/components/public/PublicStreamHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { STREAM_STATUS } from "@/constants/stream.constants";
import { useAudioElementVisualizer } from "@/hooks/useAudioElementVisualizer";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { useAudioProgress } from "@/hooks/useAudioProgress";
import { useAudioScrubber } from "@/hooks/useAudioScrubber";
import { useAudioSeekable } from "@/hooks/useAudioSeekable";
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
  const progress = useAudioProgress(audioRef);
  const seekable = useAudioSeekable(audioRef);
  const isLive = streamState.data?.status === STREAM_STATUS.LIVE;
  const scrubber = useAudioScrubber({
    audioRef,
    currentTime: progress.currentTime,
    seekMin: seekable.min,
    seekMax: seekable.max,
    canSeek: seekable.canSeek,
    isLive,
  });
  const levels = useAudioElementVisualizer({ audioRef });
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
  const averageWatchText = statsState.data
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
              <span>{averageWatchText}</span>
            </div>
            <PublicAudioControls
              canPlay={canPlay}
              isPlaying={audioPlayback.isPlaying}
              isLive={isLive}
              waveformLevels={levels}
              currentTime={progress.currentTime}
              duration={progress.duration}
              seekMin={scrubber.min}
              seekMax={scrubber.max}
              seekValue={scrubber.value}
              error={audioPlayback.error}
              onToggle={audioPlayback.toggle}
              onSeek={scrubber.onScrub}
              onSeekStart={scrubber.onScrubStart}
              onSeekEnd={scrubber.onScrubEnd}
            />
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
