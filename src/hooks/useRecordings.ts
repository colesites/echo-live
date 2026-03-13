"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo } from "react";
import { recordingListSchema } from "@/lib/schemas/recording.schema";

export function useRecordings() {
  const data = useQuery(api.recordings.listRecordingsByOwner, {});

  const parsed = useMemo(() => {
    if (!data) {
      return null;
    }
    const result = recordingListSchema.safeParse(
      data.map((recording) => ({
        id: recording._id,
        streamId: recording.streamId,
        type: recording.type,
        url: recording.url,
        downloadUrl: recording.downloadUrl ?? null,
        durationSeconds: recording.durationSeconds,
        createdAt: recording.createdAt,
      })),
    );
    return result.success ? result.data : null;
  }, [data]);

  return {
    data: parsed,
    isLoading: data === undefined,
    hasError: data !== undefined && parsed === null,
  };
}
