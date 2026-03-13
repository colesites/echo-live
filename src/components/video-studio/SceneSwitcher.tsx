"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Scene } from "@/types/scene.types";
import { formatSceneSummary } from "@/utils/scene.utils";

const DEFAULT_SCENE_NAME = "";

export type SceneSwitcherProps = {
  scenes: Scene[];
  programSceneId: string;
  onSelectScene: (id: string) => void;
  onCreateScene: (payload: { name: string }) => Promise<boolean>;
  createError: string | null;
};

export default function SceneSwitcher({
  scenes,
  programSceneId,
  onSelectScene,
  onCreateScene,
  createError,
}: SceneSwitcherProps) {
  const [name, setName] = useState(DEFAULT_SCENE_NAME);

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    const ok = await onCreateScene({ name: trimmed });
    if (ok) {
      setName(DEFAULT_SCENE_NAME);
    }
  };

  return (
    <Card className="border-border/60 bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="size-4 text-primary" />
          Scene Switcher
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {scenes.length ? (
          scenes.map((scene) => {
            const isActive = scene.id === programSceneId;
            return (
              <Button
                key={scene.id}
                variant={isActive ? "default" : "outline"}
                className="h-auto justify-start px-4 py-3 text-left"
                onClick={() => onSelectScene(scene.id)}
              >
                <div className="flex flex-col items-start gap-1">
                  <span className="text-sm font-semibold">{scene.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatSceneSummary(scene.sources.length)}
                  </span>
                </div>
              </Button>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-border/60 bg-background/60 px-4 py-6 text-sm text-muted-foreground">
            Create your first scene to start switching live.
          </div>
        )}
        <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-background/60 p-3 md:col-span-2">
          <Input
            value={name}
            placeholder="Scene name"
            onChange={(event) => setName(event.target.value)}
          />
          <Button onClick={handleCreate} className="w-full">
            Add Scene
          </Button>
          {createError ? (
            <span className="text-xs text-destructive">{createError}</span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
