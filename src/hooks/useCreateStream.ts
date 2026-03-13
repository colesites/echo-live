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
        await mutation({
          title: parsed.title,
          type: parsed.type,
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
        setError("Unable to create stream.");
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [mutation],
  );

  return { createStream, error, isSubmitting };
}
