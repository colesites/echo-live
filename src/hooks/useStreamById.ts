"use client";

import { useAuth } from "@clerk/nextjs";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo } from "react";
import { streamSchema } from "@/lib/schemas/stream.schema";

export function useStreamById(streamId: string) {
  const { isLoaded, isSignedIn } = useAuth();
  const canQuery = isLoaded && Boolean(isSignedIn);
  const data = useQuery(
    api.streams.getStreamById,
    canQuery ? { streamId } : "skip",
  );

  const parsed = useMemo(() => {
    if (!data) {
      return null;
    }
    const result = streamSchema.safeParse({
      id: data._id,
      publicId: data.publicId,
      title: data.title,
      type: data.type,
      status: data.status,
      imageUrl: data.imageUrl ?? null,
      orgName: data.orgName ?? null,
      orgImageUrl: data.orgImageUrl ?? null,
      hlsUrl: data.hlsUrl ?? null,
      audioUrl: data.audioUrl ?? null,
      createdAt: data.createdAt,
      scheduledFor: data.scheduledFor ?? null,
      liveStartedAt: data.liveStartedAt ?? null,
    });
    return result.success ? result.data : null;
  }, [data]);

  return {
    data: parsed,
    isLoading: !canQuery || data === undefined,
    hasError: canQuery && data !== undefined && parsed === null,
  };
}
