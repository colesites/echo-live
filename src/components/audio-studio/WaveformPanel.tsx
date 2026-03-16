import { Activity } from "lucide-react";

import AudioMeter from "@/components/audio-studio/AudioMeter";
import WaveformBars from "@/components/audio-studio/WaveformBars";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AUDIO_METER_SEGMENTS } from "@/constants/audio.constants";
import type { AudioMeterLevels } from "@/types/audio-studio.types";

export type WaveformPanelProps = {
  isLive: boolean;
  levels: number[];
  meters: AudioMeterLevels;
};

export default function WaveformPanel({
  isLive,
  levels,
  meters,
}: WaveformPanelProps) {
  return (
    <Card className="border-border/60 bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="size-4 text-primary" />
          Live Waveform
        </CardTitle>
      </CardHeader>
      <CardContent className="flex h-full min-h-[220px] flex-col gap-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{isLive ? "Monitoring live input" : "Waiting for input"}</span>
          <span>Low latency</span>
        </div>
        <WaveformBars
          levels={levels}
          className="min-h-[160px] rounded-3xl border border-dashed border-border/60 bg-background/60 px-6"
        />
        <div className="flex flex-col gap-3 rounded-3xl border border-border/60 bg-background/60 px-4 py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Output
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
