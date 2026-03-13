import { CircleDot, Link as LinkIcon, Radio } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type AudioStudioHeaderProps = {
  publicId: string;
  streamTitle: string;
  isLive: boolean;
  isUpdating: boolean;
  isConnecting: boolean;
  error: string | null;
  onToggleLive: () => void;
};

export default function AudioStudioHeader({
  publicId,
  streamTitle,
  isLive,
  isUpdating,
  isConnecting,
  error,
  onToggleLive,
}: AudioStudioHeaderProps) {
  const statusLabel = isLive ? "Live" : "Offline";
  const statusStyle = isLive
    ? "bg-emerald-500/15 text-emerald-200"
    : "bg-muted text-muted-foreground";

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge className={statusStyle}>
              <CircleDot className="size-3" />
              {statusLabel}
            </Badge>
            <Badge variant="secondary">
              <Radio className="size-3" />
              Audio Studio
            </Badge>
          </div>
          <div>
            <h1 className="text-xl font-semibold">{streamTitle}</h1>
            <p className="text-sm text-muted-foreground">
              Public ID: {publicId}
            </p>
          </div>
        </div>
        <Button
          onClick={onToggleLive}
          className="min-w-32"
          disabled={isUpdating || isConnecting}
        >
          {isUpdating
            ? "Updating…"
            : isConnecting
              ? "Connecting…"
              : isLive
                ? "Stop"
                : "Go Live"}
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <LinkIcon className="size-3" />
        Public link: /a/{publicId}
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
