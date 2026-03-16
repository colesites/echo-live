import Image from "next/image";

import PublicAudioActions from "@/components/public/PublicAudioActions";
import PublicAudioControls from "@/components/public/PublicAudioControls";
import { Card, CardContent } from "@/components/ui/card";
import type { PublicStream } from "@/types/public-stream.types";

type PublicAudioLayoutProps = {
  stream: PublicStream;
  isLive: boolean;
  canPlay: boolean;
  listenerCount: number;
  averageWatchText: string;
  shareLink: string;
  shareError: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  seekMin: number;
  seekMax: number;
  seekValue: number;
  playbackError: string | null;
  onToggle: () => void;
  onSeek: (value: number) => void;
  onSeekStart: () => void;
  onSeekEnd: (value?: number) => void;
};

export default function PublicAudioLayout({
  stream,
  isLive,
  canPlay,
  listenerCount,
  averageWatchText,
  shareLink,
  shareError,
  isPlaying,
  currentTime,
  duration,
  seekMin,
  seekMax,
  seekValue,
  playbackError,
  onToggle,
  onSeek,
  onSeekStart,
  onSeekEnd,
}: PublicAudioLayoutProps) {
  const statusClassName = isLive
    ? "bg-primary/20 text-primary"
    : "bg-muted text-muted-foreground";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10">
        <div className="flex flex-1 items-stretch">
          <Card className="w-full min-h-[calc(100vh-160px)] border-border/60 bg-background/80 backdrop-blur md:min-h-0">
            <CardContent className="flex flex-col gap-6 px-6 py-8">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusClassName}`}
                  >
                    {isLive ? "Live" : "Offline"}
                  </span>
                  <span>{listenerCount.toLocaleString()} listening</span>
                </div>
                <span>{averageWatchText}</span>
              </div>

              <div className="grid gap-6 md:grid-cols-[176px_1fr]">
                <div className="flex items-center justify-center">
                  {stream.imageUrl ? (
                    <Image
                      src={stream.imageUrl}
                      alt={stream.title}
                      width={176}
                      height={176}
                      className="size-44 rounded-[28px] border border-border/60 object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex size-44 items-center justify-center rounded-[28px] border border-dashed border-border/70 bg-background/70 text-xs text-muted-foreground">
                      Stream image
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {stream.orgName ?? "EchoLive"}
                    </p>
                    <h1 className="text-2xl font-semibold">{stream.title}</h1>
                  </div>
                  <PublicAudioControls
                    canPlay={canPlay}
                    isPlaying={isPlaying}
                    isLive={isLive}
                    currentTime={currentTime}
                    duration={duration}
                    seekMin={seekMin}
                    seekMax={seekMax}
                    seekValue={seekValue}
                    error={playbackError}
                    onToggle={onToggle}
                    onSeek={onSeek}
                    onSeekStart={onSeekStart}
                    onSeekEnd={onSeekEnd}
                  />
                  <PublicAudioActions
                    shareLink={shareLink}
                    shareError={shareError}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
