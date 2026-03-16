import { Mic } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import type { MicrophoneDevice } from "@/hooks/useMicrophones";

export type MicrophonePanelProps = {
  microphones: MicrophoneDevice[];
  isLoading: boolean;
  error: string | null;
  selectedMicrophoneId: string;
  onMicrophoneChange: (value: string) => void;
};

export default function MicrophonePanel({
  microphones,
  isLoading,
  error,
  selectedMicrophoneId,
  onMicrophoneChange,
}: MicrophonePanelProps) {
  return (
    <Card className="border-border/60 bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Mic className="size-4 text-primary" />
          Microphone
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner className="size-4 text-primary" />
            Loading microphones…
          </div>
        ) : null}
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
        <Select
          value={selectedMicrophoneId}
          onValueChange={onMicrophoneChange}
          disabled={isLoading || microphones.length === 0}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select microphone" />
          </SelectTrigger>
          <SelectContent>
            {microphones.map((mic) => (
              <SelectItem key={mic.id} value={mic.id}>
                {mic.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!isLoading && microphones.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No microphones detected. Check browser permissions.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
