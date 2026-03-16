"use client";

import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";

import { useImagePicker } from "@/hooks/useImagePicker";
import { streamEditSchema } from "@/lib/schemas/stream-edit.schema";

export type StreamEditorState = {
  title: string;
  setTitle: (value: string) => void;
  imageUrl: string | null;
  imageError: string | null;
  onImageChange: (file: File | null | undefined) => Promise<void>;
  isDirty: boolean;
  isSaving: boolean;
  error: string | null;
  save: () => Promise<boolean>;
  reset: () => void;
  accept: string;
};

export function useStreamEditor(
  streamId: string,
  initialTitle: string,
  initialImageUrl?: string | null,
): StreamEditorState {
  const mutation = useMutation(api.streamUpdates.updateStreamDetails);
  const [title, setTitle] = useState(initialTitle);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const imagePicker = useImagePicker(initialImageUrl);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  const isDirty = useMemo(
    () => imagePicker.isDirty || title !== initialTitle,
    [imagePicker.isDirty, initialTitle, title],
  );

  const reset = useCallback(() => {
    setTitle(initialTitle);
    setError(null);
    imagePicker.reset();
  }, [imagePicker, initialTitle]);

  const save = useCallback(async () => {
    setError(null);
    setIsSaving(true);
    try {
      const parsed = streamEditSchema.parse({ title: title.trim() });
      await mutation({
        streamId,
        title: parsed.title,
        imageUrl: imagePicker.previewUrl ?? null,
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
      setError("Unable to update stream details.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [imagePicker.previewUrl, mutation, streamId, title]);

  return {
    title,
    setTitle,
    imageUrl: imagePicker.previewUrl,
    imageError: imagePicker.error,
    onImageChange: imagePicker.handleFile,
    isDirty,
    isSaving,
    error,
    save,
    reset,
    accept: imagePicker.accept,
  };
}
