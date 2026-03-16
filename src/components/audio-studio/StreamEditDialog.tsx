"use client";

import { useState } from "react";

import ImageUploadField from "@/components/shared/ImageUploadField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useStreamEditor } from "@/hooks/useStreamEditor";

type StreamEditDialogProps = {
  streamId: string;
  streamTitle: string;
  streamImageUrl?: string | null;
};

export default function StreamEditDialog({
  streamId,
  streamTitle,
  streamImageUrl,
}: StreamEditDialogProps) {
  const [open, setOpen] = useState(false);
  const editor = useStreamEditor(streamId, streamTitle, streamImageUrl);

  const handleSave = async () => {
    const success = await editor.save();
    if (success) {
      setOpen(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      editor.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit stream details</DialogTitle>
          <DialogDescription>
            Update the stream title and artwork. Images must be under 2MB.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" htmlFor="stream-title">
              Stream title
            </label>
            <Input
              id="stream-title"
              value={editor.title}
              onChange={(event) => editor.setTitle(event.target.value)}
              placeholder="Sunday worship service"
            />
          </div>
          <ImageUploadField
            inputId="stream-artwork"
            label="Stream artwork"
            description="Shown on your studio and player pages."
            previewUrl={editor.imageUrl}
            accept={editor.accept}
            error={editor.imageError}
            onFileChange={editor.onImageChange}
          />
          {editor.error ? (
            <p className="text-xs text-red-200/90">{editor.error}</p>
          ) : null}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!editor.isDirty || editor.isSaving}
          >
            {editor.isSaving ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
