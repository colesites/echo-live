import type { Source } from "@/types/source.types";

export type StudioSource = Source & {
  active: boolean;
};

export type MixerChannel = {
  id: string;
  label: string;
  sourceId: string;
  volume: number;
  muted: boolean;
  solo: boolean;
  meter: number;
};
