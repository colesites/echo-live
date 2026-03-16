"use client";

import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { useCallback, useState } from "react";

export function useDeleteStream() {
  const mutation = useMutation(api.streams.deleteStream);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteStream = useCallback(
    async (streamId: string) => {
      setError(null);
      setIsDeleting(true);
      try {
        await mutation({ streamId });
        return true;
      } catch (caught) {
        if (caught instanceof Error) {
          setError(caught.message);
          return false;
        }
        setError("Unable to delete stream.");
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [mutation],
  );

  return { deleteStream, isDeleting, error };
}
