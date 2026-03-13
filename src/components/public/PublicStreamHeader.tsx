import type { LucideIcon } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { getInitials, isLocalAsset } from "@/utils/string.utils";

const LOGO_SIZE = 44;

export type PublicStreamHeaderProps = {
  title: string;
  churchName?: string | null;
  churchLogo?: string | null;
  statusLabel: string;
  statusClassName: string;
  icon: LucideIcon;
};

export default function PublicStreamHeader({
  title,
  churchName,
  churchLogo,
  statusLabel,
  statusClassName,
  icon: Icon,
}: PublicStreamHeaderProps) {
  const initials = getInitials(churchName);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {churchLogo && isLocalAsset(churchLogo) ? (
          <Image
            src={churchLogo}
            alt={churchName ?? "Church logo"}
            width={LOGO_SIZE}
            height={LOGO_SIZE}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {initials || "EL"}
          </div>
        )}
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {churchName ?? "EchoLive"}
          </p>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
      </div>
      <Badge className={statusClassName}>
        <Icon className="size-3" />
        {statusLabel}
      </Badge>
    </div>
  );
}
