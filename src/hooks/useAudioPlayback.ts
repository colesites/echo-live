"use client";

import type { RefObject } from "react";
import { useCallback, useState } from "react";

import { AUDIO_PLAYBACK_ERROR_MESSAGE } from "@/constants/audio.constants";

type UseAudioPlaybackProps = {
  audioRef: RefObject<HTMLAudioElement>;
  canPlay: boolean;
};

export function useAudioPlayback({ audioRef, canPlay }: UseAudioPlaybackProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const play = useCallback(async () => {
    if (!canPlay || !audioRef.current) {
      return;
    }
    try {
      await audioRef.current.play();
      setError(null);
    } catch {
      setError(AUDIO_PLAYBACK_ERROR_MESSAGE);
    }
  }, [audioRef, canPlay]);

  const pause = useCallback(() => {
    if (!audioRef.current) {
      return;
    }
    audioRef.current.pause();
  }, [audioRef]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
      return;
    }
    void play();
  }, [isPlaying, pause, play]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setError(null);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return {
    error,
    isPlaying,
    toggle,
    handlePlay,
    handlePause,
  };
}
