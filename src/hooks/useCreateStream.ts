"use client";

import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { useCallback, useState } from "react";
import { z } from "zod";
import type { StreamMode } from "@/constants/stream.constants";
import { createStreamSchema } from "@/lib/schemas/stream-form.schema";

export type CreateStreamPayload = {
  title: string;
  type: StreamMode;
  imageUrl?: string | null;
  orgId?: string | null;
  orgName?: string | null;
  orgImageUrl?: string | null;
};

export function useCreateStream() {
  const mutation = useMutation(api.streams.createStream);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createStream = useCallback(
    async (payload: CreateStreamPayload) => {
      setError(null);
      setIsSubmitting(true);
      try {
        const parsed = createStreamSchema.parse(payload);
        const streamId = await mutation({
          title: parsed.title,
          type: parsed.type,
          imageUrl: parsed.imageUrl ?? undefined,
          orgId: parsed.orgId ?? undefined,
          orgName: parsed.orgName ?? undefined,
          orgImageUrl: parsed.orgImageUrl ?? undefined,
        });
        return streamId;
      } catch (caught) {
        if (caught instanceof z.ZodError) {
          setError(caught.errors[0]?.message ?? "Invalid input.");
          return null;
        }
        if (caught instanceof Error) {
          setError(caught.message);
          return null;
        }
        setError("Unable to create stream.");
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [mutation],
  );

  return { createStream, error, isSubmitting };
}
