"use client";

import { useEffect, useRef, useState } from "react";

import {
  AUDIO_WAVEFORM_BARS,
  DEFAULT_AUDIO_METERS,
} from "@/constants/audio.constants";
import {
  AUDIO_GATE_CLOSED_GAIN,
  AUDIO_GATE_OPEN_GAIN,
  AUDIO_GATE_SMOOTHING,
  AUDIO_GATE_THRESHOLD,
  AUDIO_VISUALIZER_SAMPLE_COUNT,
} from "@/constants/audio-engine.constants";
import type { AudioMeterLevels } from "@/types/audio-studio.types";
import {
  buildWaveformLevels,
  calculateRms,
  mapRmsToMeterLevel,
} from "@/utils/audio-engine.utils";

type UseAudioVisualizerProps = {
  analyser: AnalyserNode | null;
  gate: GainNode | null;
  context: AudioContext | null;
  isGateEnabled: boolean;
};

type VisualizerState = {
  meters: AudioMeterLevels;
  waveform: number[];
};

const DEFAULT_WAVEFORM = Array.from({ length: AUDIO_WAVEFORM_BARS }, () => 0);

export function useAudioVisualizer({
  analyser,
  gate,
  context,
  isGateEnabled,
}: UseAudioVisualizerProps) {
  const [state, setState] = useState<VisualizerState>({
    meters: DEFAULT_AUDIO_METERS,
    waveform: DEFAULT_WAVEFORM,
  });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!analyser) {
      setState({
        meters: DEFAULT_AUDIO_METERS,
        waveform: DEFAULT_WAVEFORM,
      });
      return;
    }

    const sampleSize = Math.max(
      analyser.fftSize,
      AUDIO_VISUALIZER_SAMPLE_COUNT,
    );
    const data = new Uint8Array(sampleSize);

    const loop = () => {
      analyser.getByteTimeDomainData(data);
      const rms = calculateRms(data);
      const meterLevel = mapRmsToMeterLevel(rms);
      const waveform = buildWaveformLevels(data, AUDIO_WAVEFORM_BARS);

      if (gate && isGateEnabled) {
        const targetGain =
          rms >= AUDIO_GATE_THRESHOLD
            ? AUDIO_GATE_OPEN_GAIN
            : AUDIO_GATE_CLOSED_GAIN;
        gate.gain.setTargetAtTime(
          targetGain,
          context?.currentTime ?? 0,
          AUDIO_GATE_SMOOTHING,
        );
      }

      setState({
        meters: { left: meterLevel, right: meterLevel },
        waveform,
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [analyser, context, gate, isGateEnabled]);

  return state;
}
