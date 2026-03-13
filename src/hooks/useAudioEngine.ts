"use client";

import { useEffect, useRef, useState } from "react";

import { MICROPHONE_ACCESS_ERROR_MESSAGE } from "@/constants/audio.constants";
import { useAudioVisualizer } from "@/hooks/useAudioVisualizer";
import {
  type AudioGraph,
  applyNoiseSuppression,
  applyProcessingSettings,
  createAudioGraph,
  destroyAudioGraph,
} from "@/services/audio-engine.service";
import type { AudioProcessing } from "@/types/audio-studio.types";

type UseAudioEngineProps = {
  deviceId: string | null;
  isEnabled: boolean;
  processing: AudioProcessing;
};

export function useAudioEngine({
  deviceId,
  isEnabled,
  processing,
}: UseAudioEngineProps) {
  const [graph, setGraph] = useState<AudioGraph | null>(null);
  const [error, setError] = useState<string | null>(null);

  const visualizer = useAudioVisualizer({
    analyser: graph?.analyser ?? null,
    gate: graph?.gate ?? null,
    context: graph?.context ?? null,
    isGateEnabled: processing.noiseGate,
  });

  const eqBandsRef = useRef(processing.eqBands);

  useEffect(() => {
    eqBandsRef.current = processing.eqBands;
  }, [processing.eqBands]);

  useEffect(() => {
    if (!isEnabled) {
      setGraph(null);
      return;
    }

    let isMounted = true;
    let currentGraph: AudioGraph | null = null;

    const setup = async () => {
      try {
        const newGraph = await createAudioGraph(
          deviceId,
          processing.noiseSuppression,
          eqBandsRef.current,
        );
        currentGraph = newGraph;
        if (!isMounted) {
          await destroyAudioGraph(newGraph);
          return;
        }
        setGraph(newGraph);
        setError(null);
      } catch (caught) {
        if (isMounted) {
          setError(
            caught instanceof Error
              ? caught.message
              : MICROPHONE_ACCESS_ERROR_MESSAGE,
          );
        }
      }
    };

    void setup();

    return () => {
      isMounted = false;
      void destroyAudioGraph(currentGraph);
    };
  }, [deviceId, isEnabled, processing.noiseSuppression]);

  useEffect(() => {
    if (!isEnabled && graph) {
      void destroyAudioGraph(graph);
    }
  }, [graph, isEnabled]);

  useEffect(() => {
    if (!graph) {
      return;
    }
    applyProcessingSettings(graph, processing);
  }, [graph, processing]);

  useEffect(() => {
    if (!graph) {
      return;
    }
    void applyNoiseSuppression(graph.stream, processing.noiseSuppression);
  }, [graph, processing.noiseSuppression]);

  return {
    output: graph?.destination.stream ?? null,
    meters: visualizer.meters,
    waveform: visualizer.waveform,
    error,
  };
}
