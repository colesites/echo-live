"use client";

import { Layers, Plus } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { SOURCE_TYPE_LABELS, SOURCE_TYPES } from "@/constants/video.constants";
import type { StudioSource } from "@/types/video-studio.types";

const DEFAULT_SOURCE_NAME = "";

export type SourcesPanelProps = {
  sources: StudioSource[];
  onToggleSource: (id: string) => void;
  onCreateSource: (payload: { name: string; type: string }) => Promise<boolean>;
  createError: string | null;
};

export default function SourcesPanel({
  sources,
  onToggleSource,
  onCreateSource,
  createError,
}: SourcesPanelProps) {
  const [name, setName] = useState(DEFAULT_SOURCE_NAME);
  const [type, setType] = useState(SOURCE_TYPES.CAMERA);

  const handleCreate = async () => {
    const ok = await onCreateSource({ name, type });
    if (ok) {
      setName(DEFAULT_SOURCE_NAME);
    }
  };

  return (
    <Card className="border-border/60 bg-card/80">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Layers className="size-4 text-primary" />
          Sources
        </CardTitle>
        <Button size="icon-sm" variant="outline" onClick={handleCreate}>
          <Plus />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {sources.length ? (
          sources.map((source) => (
            <div
              key={source.id}
              className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-4 py-3"
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">{source.name}</p>
                <p className="text-xs text-muted-foreground">
                  {SOURCE_TYPE_LABELS[
                    source.type as keyof typeof SOURCE_TYPES
                  ] ?? source.type}
                </p>
              </div>
              <Switch
                checked={source.active}
                onCheckedChange={() => onToggleSource(source.id)}
              />
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border/60 bg-background/60 px-4 py-6 text-sm text-muted-foreground">
            Add your first camera, screen share, or media source.
          </div>
        )}

        <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-background/60 p-3">
          <Input
            value={name}
            placeholder="Source name"
            onChange={(event) => setName(event.target.value)}
          />
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(SOURCE_TYPES).map((value) => (
                <SelectItem key={value} value={value}>
                  {SOURCE_TYPE_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleCreate} className="w-full">
            Add Source
          </Button>
          {createError ? (
            <span className="text-xs text-destructive">{createError}</span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
