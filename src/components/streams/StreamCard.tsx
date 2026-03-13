"use client";

import Link from "next/link";

import PublicShareActions from "@/components/public/PublicShareActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  STREAM_MODE,
  STREAM_STATUS_LABELS,
  STREAM_TYPE_LABELS,
} from "@/constants/stream.constants";
import { useAbsoluteUrl } from "@/hooks/useAbsoluteUrl";
import type { Stream } from "@/types/stream.types";
import { formatShortDateTime } from "@/utils/format.utils";

export type StreamCardProps = {
  stream: Stream;
};

export default function StreamCard({ stream }: StreamCardProps) {
  const publicHref =
    stream.type === STREAM_MODE.AUDIO
      ? `/a/${stream.publicId}`
      : `/v/${stream.publicId}`;
  const shareLink = useAbsoluteUrl(publicHref);
  const scheduleLabel = formatShortDateTime(
    stream.scheduledFor ?? stream.createdAt,
  );

  return (
    <Card className="border-border/60 bg-background/80 backdrop-blur">
      <CardContent className="flex flex-col gap-4 px-5 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base font-semibold">{stream.title}</p>
              <Badge variant="secondary" className="text-xs">
                {STREAM_TYPE_LABELS[stream.type]}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {STREAM_STATUS_LABELS[stream.status]}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Scheduled: {scheduleLabel}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="default">
            <Link href={`/studio/${stream.id}`}>Open Studio</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href={`/settings?streamId=${stream.id}`}>Destinations</Link>
          </Button>
          <PublicShareActions shareLink={shareLink} />
        </div>
      </CardContent>
    </Card>
  );
}
