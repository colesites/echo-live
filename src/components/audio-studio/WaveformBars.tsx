import { AUDIO_WAVEFORM_BARS } from "@/constants/audio.constants";
import { cn } from "@/lib/utils";

const BAR_HEIGHT_CLASSES = ["h-2", "h-4", "h-6", "h-8", "h-10", "h-12", "h-14"];
const BAR_DELAY_CLASSES = [
  "",
  "wave-bar-delay-1",
  "wave-bar-delay-2",
  "wave-bar-delay-3",
];
const WAVEFORM_BARS = Array.from(
  { length: AUDIO_WAVEFORM_BARS },
  (_, index) => ({
    id: `wave-${index + 1}`,
    order: index,
  }),
);

export type WaveformBarsProps = {
  className?: string;
  barClassName?: string;
  levels?: number[];
};

export default function WaveformBars({
  className,
  barClassName,
  levels,
}: WaveformBarsProps) {
  const hasLevels = Boolean(levels?.length);
  const levelSource = levels ?? [];
  const bars = hasLevels
    ? levelSource.map((level, index) => ({
        id: `wave-${index + 1}`,
        order: index,
        level,
      }))
    : WAVEFORM_BARS;

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {bars.map((bar) => {
        const heightIndex = hasLevels
          ? Math.min(BAR_HEIGHT_CLASSES.length - 1, Math.max(0, bar.level ?? 0))
          : bar.order % BAR_HEIGHT_CLASSES.length;
        const delayClass = hasLevels
          ? ""
          : BAR_DELAY_CLASSES[bar.order % BAR_DELAY_CLASSES.length];

        return (
          <div
            key={bar.id}
            className={cn(
              hasLevels
                ? "w-2 origin-bottom rounded-full bg-gradient-to-b from-primary/80 via-primary/50 to-primary/20"
                : "wave-bar w-2 origin-center rounded-full bg-gradient-to-b from-primary/80 via-primary/50 to-primary/20",
              BAR_HEIGHT_CLASSES[heightIndex],
              delayClass,
              barClassName,
            )}
          />
        );
      })}
    </div>
  );
}
