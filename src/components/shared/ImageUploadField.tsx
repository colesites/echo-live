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
  previewShape?: "square" | "landscape";
  previewVariant?: "compact" | "wide";
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
  previewShape = "square",
  previewVariant = "compact",
}: ImageUploadFieldProps) {
  const previewClassName =
    previewVariant === "wide"
      ? "aspect-video w-full max-w-[360px] rounded-2xl"
      : previewShape === "landscape"
        ? "h-14 w-24 rounded-lg"
        : "size-14 rounded-xl";
  const labelLayoutClassName =
    previewVariant === "wide"
      ? "flex flex-col items-start gap-3"
      : "flex items-center gap-4";
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
        className={cn(
          "group cursor-pointer rounded-2xl border border-border/60 bg-background/60 px-4 py-3 transition hover:border-primary/40 hover:bg-background/80",
          labelLayoutClassName,
        )}
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={label}
            width={previewVariant === "wide" ? 640 : previewShape === "landscape" ? 96 : 56}
            height={previewVariant === "wide" ? 360 : 56}
            unoptimized
            className={cn(previewClassName, "object-cover")}
          />
        ) : (
          <div
            className={cn(
              "flex items-center justify-center border border-dashed border-border/70 bg-background/70 text-xs text-muted-foreground transition group-hover:border-primary/50 group-hover:text-primary",
              previewClassName,
            )}
          >
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
