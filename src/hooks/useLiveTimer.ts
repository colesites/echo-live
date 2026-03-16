"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { formatElapsedTime } from "@/utils/format.utils";

const TICK_INTERVAL_MS = 1000;

export type LiveTimerState = {
  label: string;
  startNow: () => void;
  isRunning: boolean;
};

export function useLiveTimer(
  isLive: boolean,
  liveStartedAt?: number | null,
): LiveTimerState {
  const [manualStart, setManualStart] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const startAt = liveStartedAt ?? manualStart;
  const isRunning = Boolean(startAt && (isLive || !liveStartedAt));

  useEffect(() => {
    if (liveStartedAt) {
      setManualStart(null);
    }
  }, [liveStartedAt]);

  useEffect(() => {
    if (!isLive && liveStartedAt) {
      setManualStart(null);
    }
  }, [isLive, liveStartedAt]);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, TICK_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [isRunning]);

  const startNow = useCallback(() => {
    if (!manualStart) {
      setManualStart(Date.now());
      setNow(Date.now());
    }
  }, [manualStart]);

  const label = useMemo(() => {
    if (!startAt) {
      return "00:00:00";
    }
    const seconds = (now - startAt) / 1000;
    return formatElapsedTime(seconds);
  }, [now, startAt]);

  return {
    label,
    startNow,
    isRunning,
  };
}
