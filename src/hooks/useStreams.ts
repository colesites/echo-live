"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo } from "react";
import { streamListSchema } from "@/lib/schemas/stream.schema";

export function useStreams() {
  const data = useQuery(api.streams.listStreamsByOwner, {});

  const parsed = useMemo(() => {
    if (!data) {
      return null;
    }
    const result = streamListSchema.safeParse(
      data.map((stream) => ({
        id: stream._id,
        publicId: stream.publicId,
        title: stream.title,
        type: stream.type,
        status: stream.status,
        hlsUrl: stream.hlsUrl ?? null,
        audioUrl: stream.audioUrl ?? null,
        createdAt: stream.createdAt,
        scheduledFor: stream.scheduledFor ?? null,
        liveStartedAt: stream.liveStartedAt ?? null,
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
