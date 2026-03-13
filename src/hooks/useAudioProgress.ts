"use client";

import type { RefObject } from "react";
import { useEffect, useState } from "react";

type AudioProgressState = {
  currentTime: number;
  duration: number;
  progress: number;
};

const DEFAULT_PROGRESS: AudioProgressState = {
  currentTime: 0,
  duration: 0,
  progress: 0,
};

export function useAudioProgress(audioRef: RefObject<HTMLAudioElement | null>) {
  const [state, setState] = useState<AudioProgressState>(DEFAULT_PROGRESS);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      setState(DEFAULT_PROGRESS);
      return;
    }

    const update = () => {
      const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
      const currentTime = audio.currentTime ?? 0;
      const progress =
        duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
      setState({ currentTime, duration, progress });
    };

    update();

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", update);
    audio.addEventListener("durationchange", update);
    audio.addEventListener("ended", update);

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("loadedmetadata", update);
      audio.removeEventListener("durationchange", update);
      audio.removeEventListener("ended", update);
    };
  }, [audioRef]);

  return state;
}
