"use client";

import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";

import { AUDIO_WAVEFORM_BARS } from "@/constants/audio.constants";
import {
  AUDIO_ANALYSER_FFT_SIZE,
  AUDIO_ANALYSER_SMOOTHING,
  AUDIO_LATENCY_HINT,
  AUDIO_VISUALIZER_SAMPLE_COUNT,
} from "@/constants/audio-engine.constants";
import { buildWaveformLevels } from "@/utils/audio-engine.utils";

const DEFAULT_LEVELS = Array.from({ length: AUDIO_WAVEFORM_BARS }, () => 0);

type UseAudioElementVisualizerProps = {
  audioRef: RefObject<HTMLAudioElement | null>;
  isActive: boolean;
};

export function useAudioElementVisualizer({
  audioRef,
  isActive,
}: UseAudioElementVisualizerProps) {
  const [levels, setLevels] = useState<number[]>(DEFAULT_LEVELS);
  const contextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isActive) {
      setLevels(DEFAULT_LEVELS);
      return;
    }

    const ensureNodes = () => {
      if (contextRef.current && analyserRef.current && sourceRef.current) {
        return;
      }

      const context = new AudioContext({ latencyHint: AUDIO_LATENCY_HINT });
      const analyser = context.createAnalyser();
      analyser.fftSize = AUDIO_ANALYSER_FFT_SIZE;
      analyser.smoothingTimeConstant = AUDIO_ANALYSER_SMOOTHING;

      const source = context.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(context.destination);

      contextRef.current = context;
      analyserRef.current = analyser;
      sourceRef.current = source;
    };

    const data = new Uint8Array(
      Math.max(AUDIO_VISUALIZER_SAMPLE_COUNT, AUDIO_ANALYSER_FFT_SIZE),
    );

    const loop = () => {
      const analyser = analyserRef.current;
      if (!analyser) {
        return;
      }
      analyser.getByteTimeDomainData(data);
      setLevels(buildWaveformLevels(data, AUDIO_WAVEFORM_BARS));
      rafRef.current = requestAnimationFrame(loop);
    };

    const handlePlay = async () => {
      ensureNodes();
      await contextRef.current?.resume();
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    const handlePause = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setLevels(DEFAULT_LEVELS);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handlePause);

    if (!audio.paused) {
      void handlePlay();
    }

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handlePause);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setLevels(DEFAULT_LEVELS);
      sourceRef.current?.disconnect();
      analyserRef.current?.disconnect();
      void contextRef.current?.close();
      sourceRef.current = null;
      analyserRef.current = null;
      contextRef.current = null;
    };
  }, [audioRef, isActive]);

  return levels;
}
