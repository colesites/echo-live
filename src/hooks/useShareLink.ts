"use client";

import { useCallback, useMemo, useState } from "react";

import { SHARE_FAILED_MESSAGE } from "@/constants/share.constants";

type UseShareLinkResult = {
  share: () => Promise<boolean>;
  isSupported: boolean;
  error: string | null;
};

export function useShareLink(url: string): UseShareLinkResult {
  const [error, setError] = useState<string | null>(null);
  const isSupported = useMemo(
    () => typeof navigator !== "undefined" && Boolean(navigator.share),
    [],
  );

  const share = useCallback(async () => {
    if (!isSupported) {
      setError(SHARE_FAILED_MESSAGE);
      return false;
    }
    try {
      await navigator.share({ url });
      setError(null);
      return true;
    } catch {
      setError(SHARE_FAILED_MESSAGE);
      return false;
    }
  }, [isSupported, url]);

  return { share, isSupported, error };
}
