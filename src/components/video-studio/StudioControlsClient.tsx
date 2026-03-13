"use client";

import StudioControls from "@/components/video-studio/StudioControls";
import { useDestinations } from "@/hooks/useDestinations";
import { useStreamStatus } from "@/hooks/useStreamStatus";
import type { Stream } from "@/types/stream.types";

export type StudioControlsClientProps = {
  stream: Stream;
};

export default function StudioControlsClient({
  stream,
}: StudioControlsClientProps) {
  const destinationsState = useDestinations(stream.id);
  const streamStatus = useStreamStatus(stream.id, stream.status);

  const destinations = destinationsState.data ?? [];
  const destinationsEnabled = destinations.filter(
    (item) => item.enabled,
  ).length;
  const error = destinationsState.error ?? streamStatus.error;

  return (
    <StudioControls
      status={stream.status}
      destinationsTotal={destinations.length}
      destinationsEnabled={destinationsEnabled}
      canGoLive={streamStatus.canGoLive}
      canStop={streamStatus.canStop}
      isUpdating={streamStatus.isUpdating}
      onGoLive={streamStatus.goLive}
      onStop={streamStatus.stop}
      manageHref={`/settings?streamId=${stream.id}`}
      error={error}
    />
  );
}
