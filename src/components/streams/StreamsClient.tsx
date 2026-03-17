"use client";

import { useMemo, useState } from "react";

import CreateStreamForm from "@/components/dashboard/CreateStreamForm";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import RecordingList from "@/components/streams/RecordingList";
import StreamCard from "@/components/streams/StreamCard";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { STREAM_MODE } from "@/constants/stream.constants";
import { useDeleteRecording } from "@/hooks/useDeleteRecording";
import { useDeleteStream } from "@/hooks/useDeleteStream";
import { useRecordings } from "@/hooks/useRecordings";
import { useStreams } from "@/hooks/useStreams";

export default function StreamsClient() {
  const streamsState = useStreams();
  const recordingsState = useRecordings();
  const deleteStreamState = useDeleteStream();
  const deleteRecordingState = useDeleteRecording();
  const [pendingStreamId, setPendingStreamId] = useState<string | null>(null);
  const [pendingRecordingId, setPendingRecordingId] = useState<string | null>(
    null,
  );
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

  const handleStreamDelete = (streamId: string) => {
    setPendingStreamId(streamId);
  };

  const handleRecordingDelete = (recordingId: string) => {
    setPendingRecordingId(recordingId);
  };

  const confirmStreamDelete = async () => {
    if (!pendingStreamId) {
      return;
    }
    const success = await deleteStreamState.deleteStream(pendingStreamId);
    if (success) {
      setPendingStreamId(null);
    }
  };

  const confirmRecordingDelete = async () => {
    if (!pendingRecordingId) {
      return;
    }
    const success =
      await deleteRecordingState.deleteRecording(pendingRecordingId);
    if (success) {
      setPendingRecordingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <ConfirmDialog
        open={Boolean(pendingStreamId)}
        title="Delete stream?"
        description="This stream and its recordings will be removed."
        isConfirming={deleteStreamState.isDeleting}
        onConfirm={confirmStreamDelete}
        onClose={() => setPendingStreamId(null)}
      />
      <ConfirmDialog
        open={Boolean(pendingRecordingId)}
        title="Delete recording?"
        description="This recording will be removed permanently."
        isConfirming={deleteRecordingState.isDeleting}
        onConfirm={confirmRecordingDelete}
        onClose={() => setPendingRecordingId(null)}
      />
      {deleteStreamState.error || deleteRecordingState.error ? (
        <Alert className="border-border/60 bg-background/80">
          {deleteStreamState.error ??
            deleteRecordingState.error ??
            "Unable to delete item."}
        </Alert>
      ) : null}
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-background/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base">Streams</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {streams.map((stream) => (
              <StreamCard
                key={stream.id}
                stream={stream}
                isDeleting={deleteStreamState.isDeleting}
                onDelete={handleStreamDelete}
              />
            ))}
          </CardContent>
        </Card>
        <RecordingList
          items={recordingItems}
          isDeleting={deleteRecordingState.isDeleting}
          onDelete={handleRecordingDelete}
        />
      </div>
    </div>
  );
}
