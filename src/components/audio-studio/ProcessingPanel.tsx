import { Sliders, Volume2 } from "lucide-react";

import AudioMeter from "@/components/audio-studio/AudioMeter";
import Equalizer from "@/components/audio-studio/Equalizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  AUDIO_GAIN_RANGE,
  AUDIO_METER_SEGMENTS,
} from "@/constants/audio.constants";
import type {
  AudioMeterLevels,
  AudioProcessing,
} from "@/types/audio-studio.types";

export type ProcessingPanelProps = {
  processing: AudioProcessing;
  meters: AudioMeterLevels;
  onToggle: (
    key: "noiseSuppression" | "noiseGate" | "compressor" | "limiter",
  ) => void;
  onGainChange: (value: number) => void;
  onEqChange: (id: string, value: number) => void;
};

export default function ProcessingPanel({
  processing,
  meters,
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
      <CardContent className="flex flex-col gap-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
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
          <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
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
          <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
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
          <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
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

        <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/60 px-4 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-medium">
              <Volume2 className="size-4 text-primary" />
              Gain
            </span>
            <span className="text-xs text-muted-foreground">
              {processing.gain}%
            </span>
          </div>
          <Slider
            min={AUDIO_GAIN_RANGE.MIN}
            max={AUDIO_GAIN_RANGE.MAX}
            step={AUDIO_GAIN_RANGE.STEP}
            value={[processing.gain]}
            onValueChange={(value) => onGainChange(value[0] ?? 0)}
          />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-muted-foreground">
            10-band EQ
          </p>
          <Equalizer bands={processing.eqBands} onChange={onEqChange} />
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/60 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Output Meter
          </p>
          <AudioMeter
            label="L"
            level={meters.left}
            segments={AUDIO_METER_SEGMENTS}
          />
          <AudioMeter
            label="R"
            level={meters.right}
            segments={AUDIO_METER_SEGMENTS}
          />
        </div>
      </CardContent>
    </Card>
  );
}
