import { AudioWaveform } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MixerChannel from "@/components/video-studio/MixerChannel";
import type { MixerChannel as MixerChannelType } from "@/types/video-studio.types";

export type AudioMixerPanelProps = {
  channels: MixerChannelType[];
  onVolumeChange: (id: string, value: number) => void;
  onToggleMute: (id: string) => void;
  onToggleSolo: (id: string) => void;
};

export default function AudioMixerPanel({
  channels,
  onVolumeChange,
  onToggleMute,
  onToggleSolo,
}: AudioMixerPanelProps) {
  return (
    <Card className="border-border/60 bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AudioWaveform className="size-4 text-primary" />
          Audio Mixer
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {channels.map((channel) => (
          <MixerChannel
            key={channel.id}
            channel={channel}
            onVolumeChange={onVolumeChange}
            onToggleMute={onToggleMute}
            onToggleSolo={onToggleSolo}
          />
        ))}
      </CardContent>
    </Card>
  );
}
