import { CircleStop, Dot, Radio, Video } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  STREAM_STATUS,
  STREAM_STATUS_LABELS,
  type StreamStatus,
} from "@/constants/stream.constants";

export type StudioControlsProps = {
  status: StreamStatus;
  destinationsTotal: number;
  destinationsEnabled: number;
  canGoLive: boolean;
  canStop: boolean;
  isUpdating: boolean;
  onGoLive: () => void;
  onStop: () => void;
  manageHref: string;
  error: string | null;
};

export default function StudioControls({
  status,
  destinationsTotal,
  destinationsEnabled,
  canGoLive,
  canStop,
  isUpdating,
  onGoLive,
  onStop,
  manageHref,
  error,
}: StudioControlsProps) {
  const statusClass =
    status === STREAM_STATUS.LIVE
      ? "bg-emerald-500/20 text-emerald-200"
      : status === STREAM_STATUS.ENDED
        ? "bg-muted text-muted-foreground"
        : "bg-primary/15 text-primary";
  const destinationsLabel =
    destinationsTotal === 0
      ? "No destinations"
      : `${destinationsEnabled}/${destinationsTotal} destinations`;

  return (
    <Card className="border-border/60 bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Radio className="size-4 text-primary" />
          Live Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={statusClass}>
            <Dot className="size-3" />
            {STREAM_STATUS_LABELS[status]}
          </Badge>
          <Badge variant="secondary">{destinationsLabel}</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            className="flex-1 min-w-32"
            onClick={onGoLive}
            disabled={!canGoLive || isUpdating}
          >
            <Radio />
            {isUpdating && canGoLive ? "Starting…" : "Go Live"}
          </Button>
          <Button
            variant="outline"
            className="flex-1 min-w-32"
            onClick={onStop}
            disabled={!canStop || isUpdating}
          >
            <CircleStop />
            {isUpdating && canStop ? "Stopping…" : "Stop"}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" className="flex-1 min-w-32" disabled>
            <Video />
            Record
          </Button>
          <Button variant="outline" className="flex-1 min-w-32" asChild>
            <Link href={manageHref}>Destinations</Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Recordings are saved automatically when you stop the stream.
        </p>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
