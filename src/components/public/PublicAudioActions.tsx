import { MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";

import PublicShareActions from "@/components/public/PublicShareActions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type PublicAudioActionsProps = {
  shareLink: string;
  shareError: string | null;
};

export default function PublicAudioActions({
  shareLink,
  shareError,
}: PublicAudioActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm">
        <ThumbsUp className="size-4" />
        Like
      </Button>
      <Button variant="outline" size="sm">
        <ThumbsDown className="size-4" />
        Dislike
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <MessageSquare className="size-4" />
            Live Chat
          </Button>
        </DialogTrigger>
        <DialogContent className="border-border/80 bg-background/95">
          <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-border/60 bg-background/60 text-sm text-muted-foreground">
            Chat is available during live broadcasts.
          </div>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Share
          </Button>
        </DialogTrigger>
        <DialogContent className="border-border/80 bg-background/95">
          <PublicShareActions shareLink={shareLink} error={shareError} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
