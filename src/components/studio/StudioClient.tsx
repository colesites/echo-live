"use client";

import AudioStudio from "@/components/audio-studio/AudioStudio";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import VideoStudio from "@/components/video-studio/VideoStudio";
import { STREAM_MODE } from "@/constants/stream.constants";
import { useStreamById } from "@/hooks/useStreamById";

export type StudioClientProps = {
  streamId: string;
};

export default function StudioClient({ streamId }: StudioClientProps) {
  const { data, isLoading, hasError } = useStreamById(streamId);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-3xl border border-border/60 bg-background/70">
        <Spinner className="size-6 text-primary" />
      </div>
    );
  }

  if (hasError || !data) {
    return (
      <Alert className="border-border/60 bg-background/80">
        We could not load this stream yet.
      </Alert>
    );
  }

  if (data.type === STREAM_MODE.AUDIO) {
    return <AudioStudio stream={data} />;
  }

  return <VideoStudio stream={data} />;
}
