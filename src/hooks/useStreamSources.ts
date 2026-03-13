"use client";

import { api } from "@convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useCallback, useMemo, useState } from "react";
import { z } from "zod";
import { sourceListSchema } from "@/lib/schemas/source.schema";
import { createSourceSchema } from "@/lib/schemas/source-form.schema";

export type CreateSourceInput = {
  name: string;
  type: string;
};

export function useStreamSources(streamId: string) {
  const data = useQuery(api.sources.listSourcesByStream, { streamId });
  const addSourceMutation = useMutation(api.sources.addSource);
  const [error, setError] = useState<string | null>(null);

  const parsed = useMemo(() => {
    if (!data) {
      return null;
    }
    const result = sourceListSchema.safeParse(
      data.map((source) => ({
        id: source._id,
        streamId: source.streamId,
        name: source.name,
        type: source.type,
        config: source.config ?? null,
        zIndex: source.zIndex,
        createdAt: source.createdAt,
      })),
    );
    return result.success ? result.data : null;
  }, [data]);

  const addSource = useCallback(
    async (payload: CreateSourceInput) => {
      setError(null);
      try {
        const parsedInput = createSourceSchema.parse(payload);
        await addSourceMutation({
          streamId,
          name: parsedInput.name,
          type: parsedInput.type,
        });
        return true;
      } catch (caught) {
        if (caught instanceof z.ZodError) {
          setError(caught.errors[0]?.message ?? "Invalid input.");
          return false;
        }
        if (caught instanceof Error) {
          setError(caught.message);
          return false;
        }
        setError("Unable to add source.");
        return false;
      }
    },
    [addSourceMutation, streamId],
  );

  return {
    data: parsed,
    isLoading: data === undefined,
    hasError: data !== undefined && parsed === null,
    error,
    addSource,
  };
}
