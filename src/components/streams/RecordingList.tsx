import { Download, Play } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StreamMode } from "@/constants/stream.constants";
import { STREAM_TYPE_LABELS } from "@/constants/stream.constants";
import type { Recording } from "@/types/recording.types";
import { formatDurationSeconds, formatShortDate } from "@/utils/format.utils";

export type RecordingListItem = {
  recording: Recording;
  title: string;
  streamType: StreamMode;
};

export type RecordingListProps = {
  items: RecordingListItem[];
  isDeleting?: boolean;
  onDelete?: (recordingId: string) => void;
};

export default function RecordingList({
  items,
  isDeleting = false,
  onDelete,
}: RecordingListProps) {
  return (
    <Card className="border-border/60 bg-background/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-base">Recordings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {items.length ? (
          items.map(({ recording, title, streamType }) => (
            <div
              key={recording.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/60 px-4 py-3"
            >
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold">{title}</p>
                  <Badge variant="secondary" className="text-xs">
                    {STREAM_TYPE_LABELS[streamType]}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatShortDate(recording.createdAt)} ·{" "}
                  {formatDurationSeconds(recording.durationSeconds)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={recording.url} target="_blank" rel="noreferrer">
                    <Play />
                    Play
                  </Link>
                </Button>
                {recording.downloadUrl ? (
                  <Button asChild variant="ghost" size="sm">
                    <Link
                      href={recording.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Download />
                      Download
                    </Link>
                  </Button>
                ) : null}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete?.(recording.id)}
                  disabled={isDeleting}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border/60 bg-background/60 px-4 py-6 text-sm text-muted-foreground">
            No recordings yet. Recordings appear automatically after streams
            end.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
