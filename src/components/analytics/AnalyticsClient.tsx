"use client";

import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import AnalyticsDetails from "@/components/analytics/AnalyticsDetails";
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
import { STREAM_TYPE_LABELS } from "@/constants/stream.constants";
import { useStreams } from "@/hooks/useStreams";

const DEFAULT_STREAM_ID = "";

export default function AnalyticsClient() {
  const streamsState = useStreams();
  const [selectedStreamId, setSelectedStreamId] = useState(DEFAULT_STREAM_ID);

  useEffect(() => {
    if (!streamsState.data?.length) {
      return;
    }
    setSelectedStreamId((current) => current || streamsState.data[0]?.id);
  }, [streamsState.data]);

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
        We could not load analytics yet.
      </Alert>
    );
  }

  if (!streamsState.data?.length) {
    return (
      <Card className="border-border/60 bg-background/80 backdrop-blur">
        <CardContent className="flex flex-col gap-4 px-6 py-8">
          <div className="flex items-center gap-2 text-primary">
            <BarChart3 className="size-5" />
            <p className="text-sm font-semibold uppercase tracking-wide">
              Analytics
            </p>
          </div>
          <p className="text-lg font-semibold">No streams yet to analyze.</p>
          <p className="text-sm text-muted-foreground">
            Start a stream to unlock viewer analytics and country insights.
          </p>
          <Button asChild className="w-fit">
            <Link href="/dashboard">Create a Stream</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/60 bg-background/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="size-4 text-primary" />
            Stream Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_auto]">
          <Select value={selectedStreamId} onValueChange={setSelectedStreamId}>
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
        </CardContent>
      </Card>
      {selectedStream ? <AnalyticsDetails stream={selectedStream} /> : null}
    </div>
  );
}
