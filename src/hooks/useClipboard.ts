"use client";

import { useCallback, useState } from "react";

type ClipboardStatus = "idle" | "copied" | "error";

export function useClipboard(text: string) {
  const [status, setStatus] = useState<ClipboardStatus>("idle");

  const copy = useCallback(async () => {
    try {
      if (!navigator?.clipboard?.writeText) {
        setStatus("error");
        return false;
      }
      await navigator.clipboard.writeText(text);
      setStatus("copied");
      return true;
    } catch {
      setStatus("error");
      return false;
    }
  }, [text]);

  return { copy, status };
}
