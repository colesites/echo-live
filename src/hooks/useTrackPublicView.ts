"use client";

import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { useCallback, useState } from "react";

export function useTrackPublicView(publicId: string) {
  const mutation = useMutation(api.analytics.trackView);
  const [error, setError] = useState<string | null>(null);

  const trackView = useCallback(
    async (watchDurationSeconds?: number) => {
      setError(null);
      try {
        await mutation({ publicId, watchDurationSeconds });
        return true;
      } catch (caught) {
        if (caught instanceof Error) {
          setError(caught.message);
          return false;
        }
        setError("Unable to track view.");
        return false;
      }
    },
    [mutation, publicId],
  );

  return { trackView, error };
}
