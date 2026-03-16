"use client";

import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { useCallback, useState } from "react";
import { STREAM_STATUS, type StreamStatus } from "@/constants/stream.constants";

export function useStreamStatus(streamId: string, status: StreamStatus) {
  const mutation = useMutation(api.streams.updateStreamStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useCallback(
    async (nextStatus: StreamStatus) => {
      setError(null);
      setIsUpdating(true);
      try {
        await mutation({ streamId, status: nextStatus });
        return true;
      } catch (caught) {
        if (caught instanceof Error) {
          setError(caught.message);
          return false;
        }
        setError("Unable to update stream status.");
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [mutation, streamId],
  );

  const goLive = useCallback(
    () => updateStatus(STREAM_STATUS.LIVE),
    [updateStatus],
  );

  const stop = useCallback(
    () => updateStatus(STREAM_STATUS.ENDED),
    [updateStatus],
  );

  return {
    isLive: status === STREAM_STATUS.LIVE,
    canGoLive: status === STREAM_STATUS.SCHEDULED,
    canStop: status === STREAM_STATUS.LIVE,
    isUpdating,
    error,
    goLive,
    stop,
  };
}
