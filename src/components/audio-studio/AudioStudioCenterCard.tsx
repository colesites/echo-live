"use client";

import { CalendarDays } from "lucide-react";
import Image from "next/image";

import StreamEditDialog from "@/components/audio-studio/StreamEditDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STREAM_STATUS, type StreamStatus } from "@/constants/stream.constants";
import { useLiveTimer } from "@/hooks/useLiveTimer";
import { formatShortDateTime } from "@/utils/format.utils";

type AudioStudioCenterCardProps = {
  streamId: string;
  streamTitle: string;
  streamImageUrl?: string | null;
  scheduledFor: number | null;
  createdAt: number;
  liveStartedAt?: number | null;
  status: StreamStatus;
  isLive: boolean;
  isUpdating: boolean;
  isConnecting: boolean;
  onToggleLive: () => void;
};

export default function AudioStudioCenterCard({
  streamId,
  streamTitle,
  streamImageUrl,
  scheduledFor,
  createdAt,
  liveStartedAt,
  status,
  isLive,
  isUpdating,
  isConnecting,
  onToggleLive,
}: AudioStudioCenterCardProps) {
  const dateLabel = formatShortDateTime(scheduledFor ?? createdAt);
  const statusLabel = isLive ? "Live" : "Ready";
  const statusClass = isLive
    ? "bg-primary/20 text-primary"
    : "bg-muted text-muted-foreground";
  const timer = useLiveTimer(isLive, liveStartedAt);

  const isEnded = status === STREAM_STATUS.ENDED;
  const handleToggle = () => {
    if (!isLive) {
      timer.startNow();
    }
    onToggleLive();
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-[720px] flex-col rounded-3xl border border-border/70 bg-card/80 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <Badge className={statusClass}>{statusLabel}</Badge>
        <StreamEditDialog
          streamId={streamId}
          streamTitle={streamTitle}
          streamImageUrl={streamImageUrl}
        />
      </div>

      <div className="mt-4 flex flex-1 flex-col items-center text-center">
        {streamImageUrl ? (
          <Image
            src={streamImageUrl}
            alt={streamTitle}
            width={176}
            height={176}
            unoptimized
            className="size-44 rounded-[28px] border border-border/60 object-cover"
          />
        ) : (
          <div className="flex size-44 items-center justify-center rounded-[28px] border border-dashed border-border/70 bg-background/70 text-xs text-muted-foreground">
            Stream image
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2">
          <h2 className="text-xl font-semibold">{streamTitle}</h2>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="size-3" />
            {dateLabel}
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center gap-2">
          <p className="text-5xl font-semibold tracking-wide text-foreground">
            {timer.label}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-dashed border-border/60 bg-background/60 p-4">
        <Button
          onClick={handleToggle}
          className="w-full"
          disabled={isUpdating || isConnecting || isEnded}
        >
          {isEnded
            ? "Stream Ended"
            : isUpdating
              ? "Updating…"
              : isConnecting
                ? "Connecting…"
                : isLive
                  ? "End Stream"
                  : "Go Live"}
        </Button>
      </div>
    </div>
  );
}
