"use client";

import { useCallback, useState } from "react";

import type { AudioProcessing } from "@/types/audio-studio.types";

type UseAudioControlsProps = {
  defaultMicrophoneId: string;
  processing: AudioProcessing;
};

export function useAudioControls({
  defaultMicrophoneId,
  processing,
}: UseAudioControlsProps) {
  const [selectedMicrophoneId, setSelectedMicrophoneId] =
    useState(defaultMicrophoneId);
  const [processingState, setProcessingState] = useState(processing);

  const updateToggle = useCallback(
    (key: "noiseSuppression" | "noiseGate" | "compressor" | "limiter") => {
      setProcessingState((current) => ({
        ...current,
        [key]: !current[key],
      }));
    },
    [],
  );

  const updateGain = useCallback((value: number) => {
    setProcessingState((current) => ({
      ...current,
      gain: value,
    }));
  }, []);

  const updateEqBand = useCallback((id: string, gain: number) => {
    setProcessingState((current) => ({
      ...current,
      eqBands: current.eqBands.map((band) =>
        band.id === id ? { ...band, gain } : band,
      ),
    }));
  }, []);

  return {
    selectedMicrophoneId,
    setSelectedMicrophoneId,
    processingState,
    updateToggle,
    updateGain,
    updateEqBand,
  };
}
