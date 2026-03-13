"use client";

import { Link2, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CLIPBOARD_FAILED_MESSAGE } from "@/constants/share.constants";
import { useClipboard } from "@/hooks/useClipboard";
import { useShareLink } from "@/hooks/useShareLink";

export type PublicShareActionsProps = {
  shareLink: string;
  error?: string | null;
};

export default function PublicShareActions({
  shareLink,
  error,
}: PublicShareActionsProps) {
  const clipboard = useClipboard(shareLink);
  const share = useShareLink(shareLink);
  const clipboardError =
    clipboard.status === "error" ? CLIPBOARD_FAILED_MESSAGE : null;

  return (
    <div className="flex flex-wrap gap-2">
      {share.isSupported ? (
        <Button variant="outline" onClick={share.share}>
          <Share2 />
          Share
        </Button>
      ) : null}
      <Button variant="ghost" onClick={clipboard.copy}>
        <Link2 />
        {clipboard.status === "copied" ? "Copied" : "Copy Link"}
      </Button>
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
      {share.error ? (
        <span className="text-xs text-destructive">{share.error}</span>
      ) : null}
      {clipboardError ? (
        <span className="text-xs text-destructive">{clipboardError}</span>
      ) : null}
    </div>
  );
}
