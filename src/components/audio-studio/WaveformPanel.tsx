import { Activity } from "lucide-react";

import WaveformBars from "@/components/audio-studio/WaveformBars";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type WaveformPanelProps = {
  isLive: boolean;
  levels: number[];
};

export default function WaveformPanel({ isLive, levels }: WaveformPanelProps) {
  return (
    <Card className="border-border/60 bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="size-4 text-primary" />
          Live Waveform
        </CardTitle>
      </CardHeader>
      <CardContent className="flex h-full min-h-[240px] flex-col gap-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{isLive ? "Monitoring live input" : "Waiting for input"}</span>
          <span>Low latency</span>
        </div>
        <WaveformBars
          levels={levels}
          className="flex-1 rounded-3xl border border-dashed border-border/60 bg-background/60 px-6"
        />
      </CardContent>
    </Card>
  );
}
