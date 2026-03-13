import { Slider } from "@/components/ui/slider";
import { AUDIO_EQ_BANDS, AUDIO_EQ_RANGE } from "@/constants/audio.constants";
import { cn } from "@/lib/utils";
import type { AudioEqBand } from "@/types/audio-studio.types";

export type EqualizerProps = {
  bands: AudioEqBand[];
  onChange: (id: string, value: number) => void;
};

export default function Equalizer({ bands, onChange }: EqualizerProps) {
  return (
    <div className="flex items-end justify-between gap-2 rounded-2xl border border-border/60 bg-background/60 px-4 py-4">
      {AUDIO_EQ_BANDS.map((band, index) => {
        const bandValue = bands.find((item) => item.id === band.id)?.gain ?? 0;
        return (
          <div key={band.id} className="flex flex-col items-center gap-2">
            <Slider
              orientation="vertical"
              min={AUDIO_EQ_RANGE.MIN}
              max={AUDIO_EQ_RANGE.MAX}
              step={AUDIO_EQ_RANGE.STEP}
              value={[bandValue]}
              onValueChange={(value) => onChange(band.id, value[0] ?? 0)}
              className={cn("h-24", index % 2 === 0 && "opacity-90")}
            />
            <span className="text-[10px] font-semibold text-muted-foreground">
              {band.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
