"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo } from "react";
import { publicStreamSchema } from "@/lib/schemas/public-stream.schema";

export function usePublicStream(publicId: string) {
  const data = useQuery(api.publicStreams.getPublicStreamDetails, { publicId });

  const parsed = useMemo(() => {
    if (!data) {
      return null;
    }
    const result = publicStreamSchema.safeParse({
      id: data.stream._id,
      publicId: data.stream.publicId,
      title: data.stream.title,
      type: data.stream.type,
      status: data.stream.status,
      hlsUrl: data.stream.hlsUrl ?? null,
      audioUrl: data.stream.audioUrl ?? null,
      imageUrl: data.stream.imageUrl ?? null,
      createdAt: data.stream.createdAt,
      scheduledFor: data.stream.scheduledFor ?? null,
      liveStartedAt: data.stream.liveStartedAt ?? null,
      orgName: data.org?.name ?? null,
      orgImageUrl: data.org?.imageUrl ?? null,
    });
    return result.success ? result.data : null;
  }, [data]);

  return {
    data: parsed,
    isLoading: data === undefined,
    hasError: data !== undefined && parsed === null,
  };
}
