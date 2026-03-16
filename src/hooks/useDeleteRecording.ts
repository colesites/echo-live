"use client";

import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { useCallback, useState } from "react";

export function useDeleteRecording() {
  const mutation = useMutation(api.recordings.deleteRecording);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteRecording = useCallback(
    async (recordingId: string) => {
      setError(null);
      setIsDeleting(true);
      try {
        await mutation({ recordingId });
        return true;
      } catch (caught) {
        if (caught instanceof Error) {
          setError(caught.message);
          return false;
        }
        setError("Unable to delete recording.");
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [mutation],
  );

  return { deleteRecording, isDeleting, error };
}
