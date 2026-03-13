"use client";

import { useCallback, useEffect, useState } from "react";

import {
  DEFAULT_MIC_LABEL,
  MICROPHONE_ENUMERATION_ERROR_MESSAGE,
  MICROPHONE_PERMISSION_ERROR_MESSAGE,
} from "@/constants/audio.constants";

export type MicrophoneDevice = {
  id: string;
  label: string;
};

export function useMicrophones() {
  const [microphones, setMicrophones] = useState<MicrophoneDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDevices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!navigator.mediaDevices?.enumerateDevices) {
        setMicrophones([]);
        return;
      }

      if (navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices
        .filter((device) => device.kind === "audioinput")
        .map((device) => ({
          id: device.deviceId,
          label: device.label || DEFAULT_MIC_LABEL,
        }));
      setMicrophones(audioInputs);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : MICROPHONE_ENUMERATION_ERROR_MESSAGE,
      );
      if (caught instanceof DOMException && caught.name === "NotAllowedError") {
        setError(MICROPHONE_PERMISSION_ERROR_MESSAGE);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadIfMounted = async () => {
      if (!isMounted) {
        return;
      }
      await loadDevices();
    };

    void loadIfMounted();

    navigator.mediaDevices?.addEventListener("devicechange", loadDevices);

    return () => {
      isMounted = false;
      navigator.mediaDevices?.removeEventListener("devicechange", loadDevices);
    };
  }, [loadDevices]);

  return {
    microphones,
    isLoading,
    error,
  };
}
