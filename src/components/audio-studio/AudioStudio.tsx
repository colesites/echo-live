"use client";

import { useMemo } from "react";

import AudioStudioHeader from "@/components/audio-studio/AudioStudioHeader";
import MicrophonePanel from "@/components/audio-studio/MicrophonePanel";
import ProcessingPanel from "@/components/audio-studio/ProcessingPanel";
import WaveformPanel from "@/components/audio-studio/WaveformPanel";
import {
  AUDIO_EQ_BANDS,
  DEFAULT_AUDIO_GAIN,
  DEFAULT_EQ_GAINS,
} from "@/constants/audio.constants";
import { useAudioControls } from "@/hooks/useAudioControls";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { useDefaultMicrophone } from "@/hooks/useDefaultMicrophone";
import { useLiveKitAudioPublisher } from "@/hooks/useLiveKitAudioPublisher";
import { useMicrophones } from "@/hooks/useMicrophones";
import { useStreamStatus } from "@/hooks/useStreamStatus";
import type { Stream } from "@/types/stream.types";

export type AudioStudioProps = {
  stream: Stream;
};

export default function AudioStudio({ stream }: AudioStudioProps) {
  const microphonesState = useMicrophones();
  const streamStatus = useStreamStatus(stream.id, stream.status);

  const defaultProcessing = useMemo(
    () => ({
      noiseSuppression: true,
      noiseGate: true,
      compressor: true,
      limiter: true,
      gain: DEFAULT_AUDIO_GAIN,
      eqBands: AUDIO_EQ_BANDS.map((band, index) => ({
        id: band.id,
        gain: DEFAULT_EQ_GAINS[index] ?? 0,
      })),
    }),
    [],
  );

  const controls = useAudioControls({
    defaultMicrophoneId: microphonesState.microphones[0]?.id ?? "",
    processing: defaultProcessing,
  });
  useDefaultMicrophone({
    microphones: microphonesState.microphones,
    selectedMicrophoneId: controls.selectedMicrophoneId,
    onSelect: controls.setSelectedMicrophoneId,
  });
  const audioEngine = useAudioEngine({
    deviceId: controls.selectedMicrophoneId,
    isEnabled: true,
    processing: controls.processingState,
  });
  const livekit = useLiveKitAudioPublisher({
    streamId: stream.id,
    isLive: streamStatus.isLive,
    output: audioEngine.output,
  });
  const microphoneError = microphonesState.error ?? audioEngine.error;
  const headerError = livekit.error ?? streamStatus.error;

  return (
    <div className="flex flex-col gap-6">
      <AudioStudioHeader
        publicId={stream.publicId}
        streamTitle={stream.title}
        isLive={streamStatus.isLive}
        isUpdating={streamStatus.isUpdating}
        isConnecting={livekit.isConnecting}
        error={headerError}
        onToggleLive={
          streamStatus.isLive ? streamStatus.stop : streamStatus.goLive
        }
      />
      <div className="grid gap-6 xl:grid-cols-[260px_1fr_320px]">
        <MicrophonePanel
          microphones={microphonesState.microphones}
          isLoading={microphonesState.isLoading}
          error={microphoneError}
          selectedMicrophoneId={controls.selectedMicrophoneId}
          onMicrophoneChange={controls.setSelectedMicrophoneId}
        />
        <WaveformPanel
          isLive={streamStatus.isLive}
          levels={audioEngine.waveform}
        />
        <ProcessingPanel
          processing={controls.processingState}
          meters={audioEngine.meters}
          onToggle={controls.updateToggle}
          onGainChange={controls.updateGain}
          onEqChange={controls.updateEqBand}
        />
      </div>
    </div>
  );
}
