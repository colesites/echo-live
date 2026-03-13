"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STREAM_MODE, STREAM_TYPE_LABELS } from "@/constants/stream.constants";
import { useCreateStream } from "@/hooks/useCreateStream";
import { createStreamSchema } from "@/lib/schemas/stream-form.schema";

const DEFAULT_TITLE = "";

export default function CreateStreamForm() {
  const { createStream, error, isSubmitting } = useCreateStream();
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [type, setType] = useState(STREAM_MODE.VIDEO);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSuccessMessage(null);
    const parsed = createStreamSchema.safeParse({ title, type });
    if (!parsed.success) {
      return;
    }

    const ok = await createStream(parsed.data);
    if (ok) {
      setTitle(DEFAULT_TITLE);
      setSuccessMessage("Stream created.");
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/70 p-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
        <Input
          value={title}
          placeholder="Stream title"
          onChange={(event) => setTitle(event.target.value)}
        />
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={STREAM_MODE.AUDIO}>
              {STREAM_TYPE_LABELS[STREAM_MODE.AUDIO]}
            </SelectItem>
            <SelectItem value={STREAM_MODE.VIDEO}>
              {STREAM_TYPE_LABELS[STREAM_MODE.VIDEO]}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Creating…" : "Create Stream"}
        </Button>
        {error ? (
          <span className="text-xs text-destructive">{error}</span>
        ) : null}
        {successMessage ? (
          <span className="text-xs text-emerald-500">{successMessage}</span>
        ) : null}
      </div>
    </div>
  );
}
