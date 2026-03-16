"use client";

import Link from "next/link";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { STREAM_TYPE_LABELS } from "@/constants/stream.constants";
import { useStreams } from "@/hooks/useStreams";

export default function StudioHub() {
  const streamsState = useStreams();
  const streams = streamsState.data ?? [];

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
        We could not load your studio yet.
      </Alert>
    );
  }

  if (!streams.length) {
    return (
      <div className="flex min-h-[calc(100vh-220px)] items-center justify-center">
        <Card className="w-full max-w-2xl border-border/60 bg-background/80 backdrop-blur">
          <CardContent className="flex flex-col gap-4 px-6 py-8">
            <div className="flex items-center gap-2 text-primary">
              <p className="text-sm font-semibold uppercase tracking-wide">
                Studio
              </p>
            </div>
            <p className="text-lg font-semibold">No studio sessions yet.</p>
            <p className="text-sm text-muted-foreground">
              Create a stream to launch your first live room.
            </p>
            <Button asChild className="w-fit">
              <Link href="/dashboard">Create a Stream</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {streams.map((stream) => (
        <Card
          key={stream.id}
          className="border-border/70 bg-card/80 backdrop-blur"
        >
          <CardHeader>
            <CardTitle className="text-base">{stream.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">
              {STREAM_TYPE_LABELS[stream.type]}
            </p>
            <Button asChild>
              <Link href={`/studio/${stream.id}`}>Open Studio</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
