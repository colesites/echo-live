import Image from "next/image";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type ImageUploadFieldProps = {
  inputId: string;
  label: string;
  description?: string;
  previewUrl?: string | null;
  accept: string;
  error?: string | null;
  onFileChange: (file: File | null | undefined) => void;
  className?: string;
};

export default function ImageUploadField({
  label,
  description,
  inputId,
  previewUrl,
  accept,
  error,
  onFileChange,
  className,
}: ImageUploadFieldProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Input
        id={inputId}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
      />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold">{label}</p>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <label
        htmlFor={inputId}
        className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-border/60 bg-background/60 px-4 py-3 transition hover:border-primary/40 hover:bg-background/80"
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={label}
            width={56}
            height={56}
            unoptimized
            className="size-14 rounded-xl object-cover"
          />
        ) : (
          <div className="flex size-14 items-center justify-center rounded-xl border border-dashed border-border/70 bg-background/70 text-xs text-muted-foreground transition group-hover:border-primary/50 group-hover:text-primary">
            No image
          </div>
        )}
        <p className="text-xs text-muted-foreground transition group-hover:text-primary">
          Click to upload PNG, JPG, or WebP up to 2MB.
        </p>
      </label>
      {error ? <p className="text-xs text-red-200/90">{error}</p> : null}
    </div>
  );
}
