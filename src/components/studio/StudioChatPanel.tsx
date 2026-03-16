import { MessageSquare } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudioChatPanel() {
  return (
    <Card className="border-border/70 bg-card/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="size-4 text-primary" />
          Live Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="rounded-2xl border border-dashed border-border/60 bg-background/60 px-4 py-6 text-center text-xs text-muted-foreground">
          Chat will appear here once the stream is live.
        </div>
      </CardContent>
    </Card>
  );
}
