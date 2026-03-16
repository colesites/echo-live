"use client";

import { Sliders } from "lucide-react";
import { useEffect, useState } from "react";

import Equalizer from "@/components/audio-studio/Equalizer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AUDIO_EQ_PRESETS } from "@/constants/audio.constants";

type ExpandedEqDialogProps = {
  bands: { id: string; gain: number }[];
  onChange: (id: string, value: number) => void;
};

const CUSTOM_PRESET_ID = "custom";

export default function ExpandedEqDialog({
  bands,
  onChange,
}: ExpandedEqDialogProps) {
  const [activePreset, setActivePreset] = useState<string>(CUSTOM_PRESET_ID);

  useEffect(() => {
    const gains = bands.map((band) => band.gain);
    const matched = AUDIO_EQ_PRESETS.find((preset) =>
      preset.gains.every((gain, index) => gains[index] === gain),
    );
    setActivePreset(matched?.id ?? CUSTOM_PRESET_ID);
  }, [bands]);

  const applyPreset = (presetId: (typeof AUDIO_EQ_PRESETS)[number]["id"]) => {
    const preset = AUDIO_EQ_PRESETS.find((item) => item.id === presetId);
    if (!preset) {
      return;
    }
    setActivePreset(preset.id);
    preset.gains.forEach((gain, index) => {
      const band = bands[index];
      if (band) {
        onChange(band.id, gain);
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="inline-flex items-center justify-center rounded-xl border border-border/60 bg-background/70 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-foreground/80 transition hover:border-border hover:text-foreground">
        <Sliders className="size-4" />
        Open EQ
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Equalizer</AlertDialogTitle>
          <AlertDialogDescription>
            Fine-tune the tonal balance for the live mix.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-wrap gap-2">
          {AUDIO_EQ_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset.id)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                activePreset === preset.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 bg-background/70 text-foreground/80 hover:border-border hover:text-foreground"
              }`}
            >
              {preset.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setActivePreset(CUSTOM_PRESET_ID)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
              activePreset === CUSTOM_PRESET_ID
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/60 bg-background/70 text-foreground/80 hover:border-border hover:text-foreground"
            }`}
          >
            Custom
          </button>
        </div>
        <Equalizer
          bands={bands}
          onChange={(id, value) => {
            setActivePreset(CUSTOM_PRESET_ID);
            onChange(id, value);
          }}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction>Done</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
