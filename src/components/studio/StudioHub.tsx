"use client";

import { useState } from "react";
import Link from "next/link";

import CreateStreamForm from "@/components/dashboard/CreateStreamForm";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { STREAM_TYPE_LABELS } from "@/constants/stream.constants";
import { useStreams } from "@/hooks/useStreams";

export default function StudioHub() {
  const streamsState = useStreams();
  const streams = streamsState.data ?? [];
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <div className="flex min-h-[calc(100vh-220px)] items-center justify-center">
          <div className="w-full max-w-2xl rounded-3xl border border-border/60 bg-gradient-to-br from-background/80 via-background/70 to-background/50 p-8 shadow-[0_18px_50px_-40px_rgba(239,68,68,0.6)] backdrop-blur">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-primary">
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_18px_rgba(239,68,68,0.9)]" />
                <p className="text-xs font-semibold uppercase tracking-[0.3em]">
                  Studio
                </p>
              </div>
              <p className="text-2xl font-semibold">No studio sessions yet.</p>
              <p className="text-sm text-muted-foreground">
                Create a stream to launch your first live room.
              </p>
              <DialogTrigger asChild>
                <Button className="w-fit">Create a Stream</Button>
              </DialogTrigger>
            </div>
          </div>
        </div>
        <DialogContent className="sm:max-w-[620px]">
          <DialogHeader>
            <DialogTitle>Create a stream</DialogTitle>
            <DialogDescription>
              Pick the stream type, set a title, and add an optional image.
            </DialogDescription>
          </DialogHeader>
          <CreateStreamForm onSuccess={() => setIsCreateOpen(false)} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Studio
            </p>
            <h2 className="text-2xl font-semibold">Choose a live room</h2>
            <p className="text-sm text-muted-foreground">
              Jump back into a session or start fresh with a new stream.
            </p>
          </div>
          <DialogTrigger asChild>
            <Button variant="outline">Create a Stream</Button>
          </DialogTrigger>
        </div>
        <div className="flex flex-col gap-3">
          {streams.map((stream) => (
            <div
              key={stream.id}
              className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/70 px-5 py-4 shadow-[0_10px_30px_-26px_rgba(0,0,0,0.65)] transition hover:border-primary/40 hover:bg-background/90"
            >
              <div className="flex flex-col gap-2">
                <p className="text-base font-semibold">{stream.title}</p>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {STREAM_TYPE_LABELS[stream.type]}
                </p>
              </div>
              <Button asChild className="min-w-[160px]">
                <Link href={`/studio/${stream.id}`}>Open Studio</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
      <DialogContent className="sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle>Create a stream</DialogTitle>
          <DialogDescription>
            Pick the stream type, set a title, and add an optional image.
          </DialogDescription>
        </DialogHeader>
        <CreateStreamForm onSuccess={() => setIsCreateOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
