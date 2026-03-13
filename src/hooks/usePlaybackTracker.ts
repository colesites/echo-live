"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function usePlaybackTracker(
  trackView: (watchDurationSeconds?: number) => Promise<boolean>,
) {
  const sessionStartRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const startSession = useCallback(() => {
    if (!sessionStartRef.current) {
      sessionStartRef.current = Date.now();
    }
  }, []);

  const endSession = useCallback(() => {
    if (!sessionStartRef.current) {
      return;
    }
    const durationSeconds = Math.max(
      0,
      Math.round((Date.now() - sessionStartRef.current) / 1000),
    );
    sessionStartRef.current = null;
    void trackView(durationSeconds);
  }, [trackView]);

  const handlePlay = useCallback(() => {
    startSession();
    setIsPlaying(true);
  }, [startSession]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    endSession();
  }, [endSession]);

  useEffect(() => {
    const handlePageHide = () => endSession();
    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, [endSession]);

  return {
    isPlaying,
    handlePlay,
    handlePause,
  };
}
