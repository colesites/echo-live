"use client";

import type { RefObject } from "react";
import { useEffect, useState } from "react";

import { LIVE_AUDIO_SEEK_FALLBACK_WINDOW_SECONDS } from "@/constants/audio.constants";

type SeekableState = {
  min: number;
  max: number;
  canSeek: boolean;
};

const DEFAULT_STATE: SeekableState = {
  min: 0,
  max: 0,
  canSeek: false,
};

export function useAudioSeekable(audioRef: RefObject<HTMLAudioElement | null>) {
  const [state, setState] = useState<SeekableState>(DEFAULT_STATE);
  const [element, setElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current && audioRef.current !== element) {
      setElement(audioRef.current);
    }
  }, [audioRef, element]);

  useEffect(() => {
    const audio = element;
    if (!audio) {
      setState(DEFAULT_STATE);
      return;
    }

    const update = () => {
      const { seekable } = audio;
      if (seekable && seekable.length > 0) {
        const min = seekable.start(0);
        const max = seekable.end(seekable.length - 1);
        setState({ min, max, canSeek: max > min });
        return;
      }
      if (audio.buffered && audio.buffered.length > 0) {
        const max = audio.buffered.end(audio.buffered.length - 1);
        const min = Math.max(0, max - LIVE_AUDIO_SEEK_FALLBACK_WINDOW_SECONDS);
        setState({ min, max, canSeek: max > min });
        return;
      }
      const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
      if (duration > 0) {
        setState({ min: 0, max: duration, canSeek: true });
        return;
      }
      const fallbackMax = Math.max(1, audio.currentTime);
      const fallbackMin = Math.max(
        0,
        fallbackMax - LIVE_AUDIO_SEEK_FALLBACK_WINDOW_SECONDS,
      );
      setState({ min: fallbackMin, max: fallbackMax, canSeek: true });
    };

    update();

    audio.addEventListener("durationchange", update);
    audio.addEventListener("loadedmetadata", update);
    audio.addEventListener("timeupdate", update);
    audio.addEventListener("play", update);

    return () => {
      audio.removeEventListener("durationchange", update);
      audio.removeEventListener("loadedmetadata", update);
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("play", update);
    };
  }, [element]);

  return state;
}
