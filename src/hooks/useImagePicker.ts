"use client";

import { useCallback, useEffect, useState } from "react";

import {
  BRAND_IMAGE_ACCEPT,
  MAX_BRAND_IMAGE_SIZE_BYTES,
} from "@/constants/media.constants";
import { readFileAsDataUrl } from "@/utils/file.utils";

export type ImagePickerState = {
  previewUrl: string | null;
  isDirty: boolean;
  error: string | null;
};

export type ImagePickerControls = ImagePickerState & {
  handleFile: (file: File | null | undefined) => Promise<void>;
  reset: () => void;
  accept: string;
};

export function useImagePicker(
  initialUrl?: string | null,
): ImagePickerControls {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialUrl ?? null,
  );
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isDirty) {
      setPreviewUrl(initialUrl ?? null);
    }
  }, [initialUrl, isDirty]);

  const handleFile = useCallback(async (file: File | null | undefined) => {
    if (!file) {
      return;
    }
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please upload a PNG, JPG, or WebP image.");
      return;
    }
    if (file.size > MAX_BRAND_IMAGE_SIZE_BYTES) {
      setError("Image must be 2MB or less.");
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setPreviewUrl(dataUrl);
      setIsDirty(true);
    } catch (caught) {
      if (caught instanceof Error) {
        setError(caught.message);
        return;
      }
      setError("Unable to read image.");
    }
  }, []);

  const reset = useCallback(() => {
    setPreviewUrl(initialUrl ?? null);
    setIsDirty(false);
    setError(null);
  }, [initialUrl]);

  return {
    previewUrl,
    isDirty,
    error,
    handleFile,
    reset,
    accept: BRAND_IMAGE_ACCEPT,
  };
}
