import { cn } from "@/lib/utils";

export type AudioMeterProps = {
  label: string;
  level: number;
  segments: number;
};

export default function AudioMeter({
  label,
  level,
  segments,
}: AudioMeterProps) {
  const segmentValues = Array.from(
    { length: segments },
    (_, index) => index + 1,
  );

  return (
    <div className="flex items-center gap-3">
      <span className="w-8 text-xs font-semibold text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-1 gap-1">
        {segmentValues.map((segment) => (
          <span
            key={`${label}-${segment}`}
            className={cn(
              "h-2 flex-1 rounded-full",
              segment <= level ? "bg-primary/80" : "bg-muted/50",
            )}
          />
        ))}
      </div>
    </div>
  );
}
