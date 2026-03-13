import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  VIDEO_METER_SEGMENTS,
  VIDEO_VOLUME_RANGE,
} from "@/constants/video.constants";
import { cn } from "@/lib/utils";
import type { MixerChannel as MixerChannelType } from "@/types/video-studio.types";

export type MixerChannelProps = {
  channel: MixerChannelType;
  onVolumeChange: (id: string, value: number) => void;
  onToggleMute: (id: string) => void;
  onToggleSolo: (id: string) => void;
};

export default function MixerChannel({
  channel,
  onVolumeChange,
  onToggleMute,
  onToggleSolo,
}: MixerChannelProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/60 px-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{channel.label}</p>
          <p className="text-xs text-muted-foreground">
            Source {channel.sourceId}
          </p>
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {channel.volume}%
        </span>
      </div>
      <Slider
        min={VIDEO_VOLUME_RANGE.MIN}
        max={VIDEO_VOLUME_RANGE.MAX}
        step={VIDEO_VOLUME_RANGE.STEP}
        value={[channel.volume]}
        onValueChange={(value) => onVolumeChange(channel.id, value[0] ?? 0)}
      />
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={channel.muted ? "default" : "outline"}
          onClick={() => onToggleMute(channel.id)}
        >
          Mute
        </Button>
        <Button
          size="sm"
          variant={channel.solo ? "default" : "outline"}
          onClick={() => onToggleSolo(channel.id)}
        >
          Solo
        </Button>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: VIDEO_METER_SEGMENTS }).map((_, index) => (
          <span
            key={`${channel.id}-${index}`}
            className={cn(
              "h-2 flex-1 rounded-full",
              index < channel.meter ? "bg-emerald-400/80" : "bg-muted/70",
            )}
          />
        ))}
      </div>
    </div>
  );
}
