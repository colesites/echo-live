"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { Scene } from "@/types/scene.types";
import type { Source } from "@/types/source.types";
import type { MixerChannel, StudioSource } from "@/types/video-studio.types";

type UseVideoStudioStateProps = {
  scenes: Scene[];
  mixerChannels: MixerChannel[];
  sources: Source[];
};

const DEFAULT_SOURCE_ACTIVE = true;

const mergeSources = (sources: Source[], current: StudioSource[]) => {
  const currentMap = new Map(current.map((item) => [item.id, item]));
  return sources.map((source) => ({
    ...source,
    active: currentMap.get(source.id)?.active ?? DEFAULT_SOURCE_ACTIVE,
  }));
};

const mergeMixerChannels = (
  channels: MixerChannel[],
  current: MixerChannel[],
) => {
  const currentMap = new Map(current.map((item) => [item.id, item]));
  return channels.map((channel) => {
    const existing = currentMap.get(channel.id);
    return existing
      ? {
          ...channel,
          volume: existing.volume,
          muted: existing.muted,
          solo: existing.solo,
          meter: existing.meter,
        }
      : channel;
  });
};

export function useVideoStudioState({
  scenes,
  mixerChannels,
  sources,
}: UseVideoStudioStateProps) {
  const [programSceneId, setProgramSceneId] = useState("");
  const [mixerState, setMixerState] = useState<MixerChannel[]>([]);
  const [sourceState, setSourceState] = useState<StudioSource[]>([]);

  useEffect(() => {
    setProgramSceneId((current) => {
      if (!scenes.length) {
        return "";
      }
      if (scenes.some((scene) => scene.id === current)) {
        return current;
      }
      return scenes[0]?.id ?? "";
    });
  }, [scenes]);

  useEffect(() => {
    setMixerState((current) => mergeMixerChannels(mixerChannels, current));
  }, [mixerChannels]);

  useEffect(() => {
    setSourceState((current) => mergeSources(sources, current));
  }, [sources]);

  const previewSceneId = useMemo(() => {
    if (!scenes.length) return "";
    const currentIndex = scenes.findIndex(
      (scene) => scene.id === programSceneId,
    );
    const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % scenes.length;
    return scenes[nextIndex]?.id ?? "";
  }, [programSceneId, scenes]);

  const selectScene = useCallback((id: string) => {
    setProgramSceneId(id);
  }, []);

  const updateVolume = useCallback((id: string, volume: number) => {
    setMixerState((current) =>
      current.map((channel) =>
        channel.id === id ? { ...channel, volume } : channel,
      ),
    );
  }, []);

  const toggleMute = useCallback((id: string) => {
    setMixerState((current) =>
      current.map((channel) =>
        channel.id === id ? { ...channel, muted: !channel.muted } : channel,
      ),
    );
  }, []);

  const toggleSolo = useCallback((id: string) => {
    setMixerState((current) =>
      current.map((channel) =>
        channel.id === id ? { ...channel, solo: !channel.solo } : channel,
      ),
    );
  }, []);

  const toggleSource = useCallback((id: string) => {
    setSourceState((current) =>
      current.map((source) =>
        source.id === id ? { ...source, active: !source.active } : source,
      ),
    );
  }, []);

  return {
    programSceneId,
    previewSceneId,
    selectScene,
    mixerState,
    updateVolume,
    toggleMute,
    toggleSolo,
    sourceState,
    toggleSource,
  };
}
