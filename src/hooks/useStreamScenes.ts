"use client";

import { api } from "@convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useCallback, useMemo, useState } from "react";
import { z } from "zod";
import { sceneListSchema } from "@/lib/schemas/scene.schema";
import { createSceneSchema } from "@/lib/schemas/scene-form.schema";

export type CreateSceneInput = {
  name: string;
};

export function useStreamScenes(streamId: string) {
  const data = useQuery(api.scenes.listScenesByStream, { streamId });
  const addSceneMutation = useMutation(api.scenes.addScene);
  const [error, setError] = useState<string | null>(null);

  const parsed = useMemo(() => {
    if (!data) {
      return null;
    }
    const result = sceneListSchema.safeParse(
      data.map((scene) => ({
        id: scene._id,
        streamId: scene.streamId,
        name: scene.name,
        sources: scene.sources,
        order: scene.order,
        createdAt: scene.createdAt,
      })),
    );
    return result.success ? result.data : null;
  }, [data]);

  const addScene = useCallback(
    async (payload: CreateSceneInput) => {
      setError(null);
      try {
        const parsedInput = createSceneSchema.parse(payload);
        await addSceneMutation({
          streamId,
          name: parsedInput.name,
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
        setError("Unable to add scene.");
        return false;
      }
    },
    [addSceneMutation, streamId],
  );

  return {
    data: parsed,
    isLoading: data === undefined,
    hasError: data !== undefined && parsed === null,
    error,
    addScene,
  };
}
