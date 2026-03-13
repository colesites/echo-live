"use client";

import { Pause, Play } from "lucide-react";

import WaveformBars from "@/components/audio-studio/WaveformBars";
import { Button } from "@/components/ui/button";
import { formatDurationSeconds } from "@/utils/format.utils";

type PublicAudioControlsProps = {
  canPlay: boolean;
  isPlaying: boolean;
  isLive: boolean;
  waveformLevels: number[];
  currentTime: number;
  duration: number;
  seekMin: number;
  seekMax: number;
  seekValue: number;
  error: string | null;
  onToggle: () => void;
  onSeek: (value: number) => void;
  onSeekStart: () => void;
  onSeekEnd: (value?: number) => void;
};

export default function PublicAudioControls({
  canPlay,
  isPlaying,
  isLive,
  waveformLevels,
  currentTime,
  duration,
  seekMin,
  seekMax,
  seekValue,
  error,
  onToggle,
  onSeek,
  onSeekStart,
  onSeekEnd,
}: PublicAudioControlsProps) {
  const rightLabel = isLive ? "LIVE" : formatDurationSeconds(duration);
  const leftLabel = isLive ? "On air" : formatDurationSeconds(currentTime);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex min-h-[220px] items-center justify-center rounded-3xl border border-dashed border-border/60 bg-background/60">
        <WaveformBars
          levels={waveformLevels}
          className="pointer-events-none absolute inset-6"
        />
        <Button
          size="icon-lg"
          variant="secondary"
          onClick={onToggle}
          disabled={!canPlay}
          className="relative"
        >
          {isPlaying ? <Pause /> : <Play />}
        </Button>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{leftLabel}</span>
        <span
          className={
            isLive ? "text-emerald-500 font-semibold tracking-wide" : undefined
          }
        >
          {rightLabel}
        </span>
      </div>
      <input
        type="range"
        min={seekMin}
        max={seekMax}
        step={0.1}
        value={seekValue}
        onChange={(event) => onSeek(Number(event.target.value))}
        onInput={(event) => onSeek(Number(event.currentTarget.value))}
        onPointerDown={onSeekStart}
        onPointerUp={(event) => onSeekEnd(Number(event.currentTarget.value))}
        onPointerCancel={(event) =>
          onSeekEnd(Number(event.currentTarget.value))
        }
        onTouchStart={onSeekStart}
        onTouchEnd={(event) =>
          onSeekEnd(Number((event.currentTarget as HTMLInputElement).value))
        }
        onMouseDown={onSeekStart}
        onMouseUp={(event) =>
          onSeekEnd(Number((event.currentTarget as HTMLInputElement).value))
        }
        disabled={!canPlay}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary disabled:cursor-not-allowed disabled:opacity-60"
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {!canPlay ? (
        <p className="text-sm text-muted-foreground">
          The audio feed is not available yet. Please check back soon.
        </p>
      ) : null}
      {isLive ? (
        <p className="text-xs text-muted-foreground">
          Live stream supports a short rewind window.
        </p>
      ) : null}
    </div>
  );
}
