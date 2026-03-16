import { ArrowRight, Headphones, Video } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16">
        <div className="flex flex-col gap-6">
          <Badge className="w-fit bg-primary/10 text-primary">
            EchoLive Studio
          </Badge>
          <div className="flex flex-col gap-5">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Cloud streaming built for churches that want to go live in
              minutes.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Broadcast audio-only services for smaller gatherings or run a full
              production studio in your browser with scenes, sources, and live
              audio mixing.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Open Dashboard <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-primary/20 bg-background/80 backdrop-blur">
            <CardContent className="flex h-full flex-col gap-3 px-6 py-6">
              <div className="flex items-center gap-2 text-primary">
                <Headphones className="size-5" />
                <p className="text-sm font-semibold uppercase tracking-wide">
                  Audio Only
                </p>
              </div>
              <p className="text-base font-medium">
                Go live with just a microphone and built-in processing.
              </p>
              <p className="text-sm text-muted-foreground">
                Noise suppression, EQ, compressors, and live meters tuned for
                sermons.
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-background/80 backdrop-blur">
            <CardContent className="flex h-full flex-col gap-3 px-6 py-6">
              <div className="flex items-center gap-2 text-primary">
                <Video className="size-5" />
                <p className="text-sm font-semibold uppercase tracking-wide">
                  Full Studio
                </p>
              </div>
              <p className="text-base font-medium">
                Switch scenes, mix sources, and deliver a polished broadcast.
              </p>
              <p className="text-sm text-muted-foreground">
                Camera, screen share, overlays, and lower thirds in one place.
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-background/80 backdrop-blur">
            <CardContent className="flex h-full flex-col gap-3 px-6 py-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Public Links
              </p>
              <p className="text-base font-medium">
                Share a single link and anyone can watch or listen instantly.
              </p>
              <p className="text-sm text-muted-foreground">
                No accounts required for viewers, optimized for mobile and
                low-bandwidth connections.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
