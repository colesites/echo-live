"use client";

import type { RefObject } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { LIVE_AUDIO_SEEK_FALLBACK_WINDOW_SECONDS } from "@/constants/audio.constants";

type UseAudioScrubberProps = {
  audioRef: RefObject<HTMLAudioElement | null>;
  currentTime: number;
  seekMin: number;
  seekMax: number;
  canSeek: boolean;
  isLive: boolean;
};

export function useAudioScrubber({
  audioRef,
  currentTime,
  seekMin,
  seekMax,
  canSeek,
  isLive,
}: UseAudioScrubberProps) {
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubValue, setScrubValue] = useState(currentTime);
  const scrubRef = useRef(currentTime);

  const fallbackMin = Math.max(
    0,
    currentTime - LIVE_AUDIO_SEEK_FALLBACK_WINDOW_SECONDS,
  );
  const fallbackMax = Math.max(currentTime + 1, 1);
  const min = canSeek ? seekMin : fallbackMin;
  const max = canSeek ? seekMax : fallbackMax;

  const value = useMemo(() => {
    if (isScrubbing) {
      return scrubValue;
    }
    if (isLive && canSeek) {
      return seekMax;
    }
    return currentTime;
  }, [canSeek, currentTime, isLive, isScrubbing, scrubValue, seekMax]);

  useEffect(() => {
    if (!isScrubbing) {
      setScrubValue(currentTime);
      scrubRef.current = currentTime;
    }
  }, [currentTime, isScrubbing]);

  const handleScrub = (nextValue: number) => {
    setScrubValue(nextValue);
    scrubRef.current = nextValue;
  };

  const handleScrubStart = () => {
    setIsScrubbing(true);
    setScrubValue(value);
    scrubRef.current = value;
  };

  const handleScrubEnd = (nextValue?: number) => {
    setIsScrubbing(false);
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    const finalValue = nextValue ?? scrubRef.current ?? currentTime;
    const bounded = Math.min(max, Math.max(min, finalValue));
    audio.currentTime = bounded;
  };

  return {
    min,
    max,
    value,
    canScrub: true,
    onScrub: handleScrub,
    onScrubStart: handleScrubStart,
    onScrubEnd: handleScrubEnd,
  };
}
