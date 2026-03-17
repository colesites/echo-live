"use client";

import { useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ImageUploadField from "@/components/shared/ImageUploadField";
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
import { useImagePicker } from "@/hooks/useImagePicker";
import { createStreamSchema } from "@/lib/schemas/stream-form.schema";

const DEFAULT_TITLE = "";

export type CreateStreamFormProps = {
  onSuccess?: (streamId: string) => void;
};

export default function CreateStreamForm({
  onSuccess,
}: CreateStreamFormProps) {
  const { createStream, error, isSubmitting } = useCreateStream();
  const imagePicker = useImagePicker(null);
  const router = useRouter();
  const { organization } = useOrganization();
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [type, setType] = useState(STREAM_MODE.VIDEO);

  const handleSubmit = async () => {
    const parsed = createStreamSchema.safeParse({
      title,
      type,
      imageUrl: imagePicker.previewUrl,
      orgId: organization?.id ?? null,
      orgName: organization?.name ?? null,
      orgImageUrl: organization?.imageUrl ?? null,
    });
    if (!parsed.success) {
      return;
    }

    const streamId = await createStream(parsed.data);
    if (streamId) {
      setTitle(DEFAULT_TITLE);
      imagePicker.reset();
      onSuccess?.(streamId);
      router.push(`/studio/${streamId}`);
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
      <ImageUploadField
        inputId="new-stream-image"
        label="Stream image"
        description="Optional, max 2MB."
        previewUrl={imagePicker.previewUrl}
        accept={imagePicker.accept}
        error={imagePicker.error}
        onFileChange={imagePicker.handleFile}
        previewShape={type === STREAM_MODE.VIDEO ? "landscape" : "square"}
        previewVariant={type === STREAM_MODE.VIDEO ? "wide" : "compact"}
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Creating…" : "Create Stream"}
        </Button>
        {error ? (
          <span className="text-xs text-destructive">{error}</span>
        ) : null}
      </div>
    </div>
  );
}
