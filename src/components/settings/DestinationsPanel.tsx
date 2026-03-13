"use client";

import { Plus, Trash2, Wifi } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import {
  DESTINATION_LABELS,
  DESTINATION_PLATFORMS,
} from "@/constants/destination.constants";
import { useDestinations } from "@/hooks/useDestinations";

const DEFAULT_RTMP_URL = "";
const DEFAULT_STREAM_KEY = "";

export type DestinationsPanelProps = {
  streamId: string;
};

export default function DestinationsPanel({
  streamId,
}: DestinationsPanelProps) {
  const destinationsState = useDestinations(streamId);
  const [platform, setPlatform] = useState(DESTINATION_PLATFORMS.YOUTUBE);
  const [rtmpUrl, setRtmpUrl] = useState(DEFAULT_RTMP_URL);
  const [streamKey, setStreamKey] = useState(DEFAULT_STREAM_KEY);

  const handleAdd = async () => {
    const ok = await destinationsState.addDestination({
      platform,
      rtmpUrl,
      streamKey,
    });
    if (ok) {
      setRtmpUrl(DEFAULT_RTMP_URL);
      setStreamKey(DEFAULT_STREAM_KEY);
    }
  };

  return (
    <Card className="border-border/60 bg-background/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Wifi className="size-4 text-primary" />
          Stream Destinations
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/60 p-4">
          <div className="grid gap-3 md:grid-cols-[180px_1fr]">
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(DESTINATION_PLATFORMS).map((value) => (
                  <SelectItem key={value} value={value}>
                    {DESTINATION_LABELS[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={rtmpUrl}
              placeholder="RTMP URL"
              onChange={(event) => setRtmpUrl(event.target.value)}
            />
          </div>
          <Input
            value={streamKey}
            placeholder="Stream key"
            onChange={(event) => setStreamKey(event.target.value)}
          />
          <Button onClick={handleAdd} className="w-full">
            <Plus />
            Add Destination
          </Button>
          {destinationsState.error ? (
            <span className="text-xs text-destructive">
              {destinationsState.error}
            </span>
          ) : null}
        </div>

        {destinationsState.isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner className="size-4 text-primary" />
            Loading destinations…
          </div>
        ) : null}

        {destinationsState.data?.length ? (
          destinationsState.data.map((destination) => (
            <div
              key={destination.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/60 px-4 py-3"
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">
                  {DESTINATION_LABELS[destination.platform]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {destination.rtmpUrl}
                </p>
                <p className="text-xs text-muted-foreground">
                  Key: {destination.streamKey}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={destination.enabled}
                  onCheckedChange={(value) =>
                    destinationsState.toggleDestination(destination.id, value)
                  }
                />
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() =>
                    destinationsState.removeDestination(destination.id)
                  }
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border/60 bg-background/60 px-4 py-6 text-sm text-muted-foreground">
            No destinations connected yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
