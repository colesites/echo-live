"use client";

import { useMemo } from "react";

export function useAbsoluteUrl(path: string) {
  return useMemo(() => {
    if (typeof window === "undefined") {
      return path;
    }
    const origin = window.location.origin;
    if (!origin) {
      return path;
    }
    return path.startsWith("/") ? `${origin}${path}` : `${origin}/${path}`;
  }, [path]);
}
