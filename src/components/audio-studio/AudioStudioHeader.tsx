"use client";

import { CircleDot, Link as LinkIcon, Radio } from "lucide-react";

import PublicShareActions from "@/components/public/PublicShareActions";
import { Badge } from "@/components/ui/badge";
import { useAbsoluteUrl } from "@/hooks/useAbsoluteUrl";

export type AudioStudioHeaderProps = {
  publicId: string;
  streamTitle: string;
  isLive: boolean;
  error: string | null;
};

export default function AudioStudioHeader({
  publicId,
  streamTitle,
  isLive,
  error,
}: AudioStudioHeaderProps) {
  const statusLabel = isLive ? "Live" : "Offline";
  const statusStyle = isLive
    ? "bg-primary/20 text-primary"
    : "bg-muted text-muted-foreground";
  const publicHref = `/a/${publicId}`;
  const publicLink = useAbsoluteUrl(publicHref);

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
        <Badge variant="secondary">Audio Studio</Badge>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <LinkIcon className="size-3" />
          {publicLink}
        </span>
        <PublicShareActions shareLink={publicLink} />
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
