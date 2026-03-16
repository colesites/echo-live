"use client";

import { Link as LinkIcon, PlayCircle, Tv } from "lucide-react";

import PublicShareActions from "@/components/public/PublicShareActions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StreamStatus } from "@/constants/stream.constants";
import {
  STREAM_STATUS,
  STREAM_STATUS_LABELS,
} from "@/constants/stream.constants";
import { useAbsoluteUrl } from "@/hooks/useAbsoluteUrl";
import type { Scene } from "@/types/scene.types";
import { formatSceneSummary } from "@/utils/scene.utils";

export type StudioMonitorsProps = {
  publicId: string;
  streamTitle: string;
  status: StreamStatus;
  programSceneId: string;
  previewSceneId: string;
  scenes: Scene[];
};

export default function StudioMonitors({
  publicId,
  streamTitle,
  status,
  programSceneId,
  previewSceneId,
  scenes,
}: StudioMonitorsProps) {
  const programScene = scenes.find((scene) => scene.id === programSceneId);
  const previewScene = scenes.find((scene) => scene.id === previewSceneId);
  const publicHref = `/v/${publicId}`;
  const publicLink = useAbsoluteUrl(publicHref);
  const statusClass =
    status === STREAM_STATUS.LIVE
      ? "bg-emerald-500/20 text-emerald-200"
      : status === STREAM_STATUS.ENDED
        ? "bg-muted text-muted-foreground"
        : "bg-primary/15 text-primary";

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{streamTitle}</h1>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <LinkIcon className="size-3" />
            {publicLink}
          </p>
        </div>
        <Badge className={statusClass}>
          <PlayCircle className="size-3" />
          {STREAM_STATUS_LABELS[status]}
        </Badge>
      </div>
      <PublicShareActions shareLink={publicLink} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60 bg-background/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Tv className="size-4 text-primary" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="flex h-40 flex-col justify-between rounded-2xl border border-dashed border-border/60 bg-gradient-to-br from-muted/80 to-muted/40 px-4 py-4">
            <div>
              <p className="text-xs text-muted-foreground">Next Scene</p>
              <p className="text-lg font-semibold">
                {previewScene?.name ?? "-"}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              {previewScene
                ? formatSceneSummary(previewScene.sources.length)
                : "Select a scene"}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-background/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PlayCircle className="size-4 text-primary" />
              Program
            </CardTitle>
          </CardHeader>
          <CardContent className="flex h-40 flex-col justify-between rounded-2xl border border-dashed border-border/60 bg-gradient-to-br from-primary/20 via-muted/20 to-muted/50 px-4 py-4">
            <div>
              <p className="text-xs text-muted-foreground">Live Scene</p>
              <p className="text-lg font-semibold">
                {programScene?.name ?? "-"}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              {programScene
                ? formatSceneSummary(programScene.sources.length)
                : "Select a scene"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
