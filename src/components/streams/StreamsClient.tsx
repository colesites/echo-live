"use client";

import { useMemo } from "react";

import CreateStreamForm from "@/components/dashboard/CreateStreamForm";
import RecordingList from "@/components/streams/RecordingList";
import StreamCard from "@/components/streams/StreamCard";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { STREAM_MODE } from "@/constants/stream.constants";
import { useRecordings } from "@/hooks/useRecordings";
import { useStreams } from "@/hooks/useStreams";

export default function StreamsClient() {
  const streamsState = useStreams();
  const recordingsState = useRecordings();
  const streams = streamsState.data ?? [];
  const recordings = recordingsState.data ?? [];
  const streamById = useMemo(
    () => new Map(streams.map((stream) => [stream.id, stream])),
    [streams],
  );

  if (streamsState.isLoading || recordingsState.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center rounded-3xl border border-border/60 bg-background/70">
        <Spinner className="size-6 text-primary" />
      </div>
    );
  }

  if (streamsState.hasError || recordingsState.hasError) {
    return (
      <Alert className="border-border/60 bg-background/80">
        We could not load your streams yet.
      </Alert>
    );
  }

  if (!streams.length) {
    return (
      <Card className="border-border/60 bg-background/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">Create your first stream</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Start a new audio or video stream to unlock the studio,
            destinations, and recordings.
          </p>
          <CreateStreamForm />
        </CardContent>
      </Card>
    );
  }

  const recordingItems = recordings.map((recording) => {
    const stream = streamById.get(recording.streamId);
    return {
      recording,
      title: stream?.title ?? "Untitled stream",
      streamType: stream?.type ?? STREAM_MODE.VIDEO,
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-2">
        {streams.map((stream) => (
          <StreamCard key={stream.id} stream={stream} />
        ))}
      </div>
      <RecordingList items={recordingItems} />
    </div>
  );
}
