"use client";

import { useEffect } from "react";

import type { MicrophoneDevice } from "@/hooks/useMicrophones";

type UseDefaultMicrophoneProps = {
  microphones: MicrophoneDevice[];
  selectedMicrophoneId: string;
  onSelect: (id: string) => void;
};

export function useDefaultMicrophone({
  microphones,
  selectedMicrophoneId,
  onSelect,
}: UseDefaultMicrophoneProps) {
  useEffect(() => {
    if (selectedMicrophoneId || microphones.length === 0) {
      return;
    }
    const [first] = microphones;
    if (first) {
      onSelect(first.id);
    }
  }, [microphones, onSelect, selectedMicrophoneId]);
}
