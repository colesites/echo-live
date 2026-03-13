"use client";

import { useMemo } from "react";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import AudioMixerPanel from "@/components/video-studio/AudioMixerPanel";
import SceneSwitcher from "@/components/video-studio/SceneSwitcher";
import SourcesPanel from "@/components/video-studio/SourcesPanel";
import StudioControlsClient from "@/components/video-studio/StudioControlsClient";
import StudioMonitors from "@/components/video-studio/StudioMonitors";
import {
  DEFAULT_MIXER_METER,
  DEFAULT_MIXER_VOLUME,
} from "@/constants/video.constants";
import { useStreamScenes } from "@/hooks/useStreamScenes";
import { useStreamSources } from "@/hooks/useStreamSources";
import { useVideoStudioState } from "@/hooks/useVideoStudioState";
import type { Stream } from "@/types/stream.types";

export type VideoStudioProps = {
  stream: Stream;
};

export default function VideoStudio({ stream }: VideoStudioProps) {
  const scenesState = useStreamScenes(stream.id);
  const sourcesState = useStreamSources(stream.id);

  const scenes = scenesState.data ?? [];
  const sources = sourcesState.data ?? [];

  const mixerChannels = useMemo(
    () =>
      sources.map((source) => ({
        id: `mixer-${source.id}`,
        label: source.name,
        sourceId: source.id,
        volume: DEFAULT_MIXER_VOLUME,
        muted: false,
        solo: false,
        meter: DEFAULT_MIXER_METER,
      })),
    [sources],
  );

  const studioState = useVideoStudioState({
    scenes,
    mixerChannels,
    sources,
  });

  if (scenesState.isLoading || sourcesState.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-3xl border border-border/60 bg-background/70">
        <Spinner className="size-6 text-primary" />
      </div>
    );
  }

  if (scenesState.hasError || sourcesState.hasError) {
    return (
      <Alert className="border-border/60 bg-background/80">
        We could not load this studio yet.
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <StudioMonitors
        publicId={stream.publicId}
        streamTitle={stream.title}
        status={stream.status}
        programSceneId={studioState.programSceneId}
        previewSceneId={studioState.previewSceneId}
        scenes={scenes}
      />
      <div className="grid gap-6 xl:grid-cols-[260px_1fr_320px]">
        <SourcesPanel
          sources={studioState.sourceState}
          onToggleSource={studioState.toggleSource}
          onCreateSource={sourcesState.addSource}
          createError={sourcesState.error}
        />
        <div className="flex flex-col gap-6">
          <SceneSwitcher
            scenes={scenes}
            programSceneId={studioState.programSceneId}
            onSelectScene={studioState.selectScene}
            onCreateScene={scenesState.addScene}
            createError={scenesState.error}
          />
          <StudioControlsClient stream={stream} />
        </div>
        <AudioMixerPanel
          channels={studioState.mixerState}
          onVolumeChange={studioState.updateVolume}
          onToggleMute={studioState.toggleMute}
          onToggleSolo={studioState.toggleSolo}
        />
      </div>
    </div>
  );
}
