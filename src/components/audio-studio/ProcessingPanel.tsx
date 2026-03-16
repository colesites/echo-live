import { Sliders, Volume2 } from "lucide-react";

import ExpandedEqDialog from "@/components/audio-studio/ExpandedEqDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { AUDIO_GAIN_RANGE } from "@/constants/audio.constants";
import type { AudioProcessing } from "@/types/audio-studio.types";

export type ProcessingPanelProps = {
  processing: AudioProcessing;
  onToggle: (
    key: "noiseSuppression" | "noiseGate" | "compressor" | "limiter",
  ) => void;
  onGainChange: (value: number) => void;
  onEqChange: (id: string, value: number) => void;
};

export default function ProcessingPanel({
  processing,
  onToggle,
  onGainChange,
  onEqChange,
}: ProcessingPanelProps) {
  return (
    <Card className="border-border/60 bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sliders className="size-4 text-primary" />
          Processing
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-4 py-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Noise suppression</span>
              <span className="text-xs text-muted-foreground">
                Adaptive filtering
              </span>
            </div>
            <Switch
              checked={processing.noiseSuppression}
              onCheckedChange={() => onToggle("noiseSuppression")}
            />
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-4 py-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Noise gate</span>
              <span className="text-xs text-muted-foreground">
                Speech focus
              </span>
            </div>
            <Switch
              checked={processing.noiseGate}
              onCheckedChange={() => onToggle("noiseGate")}
            />
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-4 py-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Compressor</span>
              <span className="text-xs text-muted-foreground">
                Smooth dynamics
              </span>
            </div>
            <Switch
              checked={processing.compressor}
              onCheckedChange={() => onToggle("compressor")}
            />
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-4 py-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Limiter</span>
              <span className="text-xs text-muted-foreground">
                Protect output
              </span>
            </div>
            <Switch
              checked={processing.limiter}
              onCheckedChange={() => onToggle("limiter")}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium">
                <Volume2 className="size-4 text-primary" />
                Gain
              </span>
              <span className="text-xs text-muted-foreground">
                {processing.gain}%
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Slider
                min={AUDIO_GAIN_RANGE.MIN}
                max={AUDIO_GAIN_RANGE.MAX}
                step={AUDIO_GAIN_RANGE.STEP}
                value={[processing.gain]}
                onValueChange={(value) => onGainChange(value[0] ?? 0)}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
            <div className="flex flex-col">
              <p className="text-sm font-medium">10-band EQ</p>
              <p className="text-xs text-muted-foreground">
                Advanced tone shaping
              </p>
            </div>
            <ExpandedEqDialog
              bands={processing.eqBands}
              onChange={onEqChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
