"use client";

import { api } from "@convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useCallback, useMemo, useState } from "react";
import { z } from "zod";
import type { DestinationPlatform } from "@/constants/destination.constants";
import { destinationListSchema } from "@/lib/schemas/destination.schema";
import { destinationFormSchema } from "@/lib/schemas/destination-form.schema";

export type DestinationFormInput = {
  platform: DestinationPlatform;
  rtmpUrl: string;
  streamKey: string;
};

export function useDestinations(streamId: string) {
  const data = useQuery(api.destinations.listDestinationsByStream, {
    streamId,
  });
  const addDestinationMutation = useMutation(api.destinations.addDestination);
  const toggleDestinationMutation = useMutation(
    api.destinations.toggleDestination,
  );
  const removeDestinationMutation = useMutation(
    api.destinations.removeDestination,
  );
  const [error, setError] = useState<string | null>(null);

  const parsed = useMemo(() => {
    if (!data) {
      return null;
    }
    const result = destinationListSchema.safeParse(
      data.map((destination) => ({
        id: destination._id,
        streamId: destination.streamId,
        platform: destination.platform,
        rtmpUrl: destination.rtmpUrl,
        streamKey: destination.streamKey,
        enabled: destination.enabled,
        createdAt: destination.createdAt,
      })),
    );
    return result.success ? result.data : null;
  }, [data]);

  const addDestination = useCallback(
    async (payload: DestinationFormInput) => {
      setError(null);
      try {
        const parsedInput = destinationFormSchema.parse(payload);
        await addDestinationMutation({
          streamId,
          platform: parsedInput.platform,
          rtmpUrl: parsedInput.rtmpUrl,
          streamKey: parsedInput.streamKey,
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
        setError("Unable to add destination.");
        return false;
      }
    },
    [addDestinationMutation, streamId],
  );

  const toggleDestination = useCallback(
    async (destinationId: string, enabled: boolean) => {
      setError(null);
      try {
        await toggleDestinationMutation({ destinationId, enabled });
        return true;
      } catch (caught) {
        if (caught instanceof Error) {
          setError(caught.message);
          return false;
        }
        setError("Unable to update destination.");
        return false;
      }
    },
    [toggleDestinationMutation],
  );

  const removeDestination = useCallback(
    async (destinationId: string) => {
      setError(null);
      try {
        await removeDestinationMutation({ destinationId });
        return true;
      } catch (caught) {
        if (caught instanceof Error) {
          setError(caught.message);
          return false;
        }
        setError("Unable to remove destination.");
        return false;
      }
    },
    [removeDestinationMutation],
  );

  return {
    data: parsed,
    isLoading: data === undefined,
    hasError: data !== undefined && parsed === null,
    error,
    addDestination,
    toggleDestination,
    removeDestination,
  };
}
