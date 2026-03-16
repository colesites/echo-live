"use client";

import { useMemo, useRef } from "react";

import PublicAudioLayout from "@/components/public/PublicAudioLayout";
import { Spinner } from "@/components/ui/spinner";
import { STREAM_STATUS } from "@/constants/stream.constants";
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
  const listenerCount =
    statsState.data?.totalListeners ?? statsState.data?.totalViewers ?? 0;
  const averageWatchText = statsState.data
    ? formatDurationSeconds(statsState.data.averageWatchDuration)
    : "--";

  return (
    <>
      <PublicAudioLayout
        stream={stream}
        isLive={isLive}
        canPlay={canPlay}
        listenerCount={listenerCount}
        averageWatchText={averageWatchText}
        shareLink={shareLink}
        shareError={tracker.error}
        isPlaying={audioPlayback.isPlaying}
        currentTime={progress.currentTime}
        duration={progress.duration}
        seekMin={scrubber.min}
        seekMax={scrubber.max}
        seekValue={scrubber.value}
        playbackError={audioPlayback.error}
        onToggle={audioPlayback.toggle}
        onSeek={scrubber.onScrub}
        onSeekStart={scrubber.onScrubStart}
        onSeekEnd={scrubber.onScrubEnd}
      />
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
    </>
  );
}
