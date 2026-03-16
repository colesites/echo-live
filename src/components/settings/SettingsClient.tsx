"use client";

import { Settings2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import DestinationsPanel from "@/components/settings/DestinationsPanel";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { STREAM_MODE, STREAM_TYPE_LABELS } from "@/constants/stream.constants";
import { useStreams } from "@/hooks/useStreams";

const DEFAULT_STREAM_ID = "";

export type SettingsClientProps = {
  defaultStreamId?: string | null;
};

export default function SettingsClient({
  defaultStreamId,
}: SettingsClientProps) {
  const streamsState = useStreams();
  const [selectedStreamId, setSelectedStreamId] = useState(DEFAULT_STREAM_ID);

  useEffect(() => {
    if (!streamsState.data?.length) {
      return;
    }
    setSelectedStreamId((current) => {
      if (current) {
        return current;
      }
      const preferred = streamsState.data.find(
        (stream) => stream.id === defaultStreamId,
      );
      return preferred?.id ?? streamsState.data[0]?.id ?? DEFAULT_STREAM_ID;
    });
  }, [defaultStreamId, streamsState.data]);

  const selectedStream = useMemo(
    () =>
      streamsState.data?.find((stream) => stream.id === selectedStreamId) ??
      null,
    [selectedStreamId, streamsState.data],
  );

  if (streamsState.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center rounded-3xl border border-border/60 bg-background/70">
        <Spinner className="size-6 text-primary" />
      </div>
    );
  }

  if (streamsState.hasError) {
    return (
      <Alert className="border-border/60 bg-background/80">
        We could not load your settings yet.
      </Alert>
    );
  }

  if (!streamsState.data?.length) {
    return (
      <div className="flex min-h-[calc(100vh-220px)] items-center justify-center">
        <Card className="w-full max-w-2xl border-border/60 bg-background/80 backdrop-blur">
          <CardContent className="flex flex-col gap-4 px-6 py-8">
            <div className="flex items-center gap-2 text-primary">
              <Settings2 className="size-5" />
              <p className="text-sm font-semibold uppercase tracking-wide">
                Settings
              </p>
            </div>
            <p className="text-lg font-semibold">
              Create a stream to manage destinations.
            </p>
            <p className="text-sm text-muted-foreground">
              Once you have a stream, you can configure RTMP destinations and
              multistream outputs here.
            </p>
            <Button asChild className="w-fit">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/60 bg-background/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings2 className="size-4 text-primary" />
            Stream Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <Select
              value={selectedStreamId}
              onValueChange={setSelectedStreamId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a stream" />
              </SelectTrigger>
              <SelectContent>
                {streamsState.data.map((stream) => (
                  <SelectItem key={stream.id} value={stream.id}>
                    {stream.title} · {STREAM_TYPE_LABELS[stream.type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedStream ? (
              <Button asChild variant="outline">
                <Link href={`/studio/${selectedStream.id}`}>Open Studio</Link>
              </Button>
            ) : null}
          </div>
          {selectedStream ? (
            <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-xs text-muted-foreground">
              Public link:{" "}
              {selectedStream.type === STREAM_MODE.AUDIO
                ? `/a/${selectedStream.publicId}`
                : `/v/${selectedStream.publicId}`}
            </div>
          ) : null}
        </CardContent>
      </Card>
      {selectedStream ? (
        <DestinationsPanel streamId={selectedStream.id} />
      ) : null}
    </div>
  );
}
