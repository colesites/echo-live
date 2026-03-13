import type { z } from "zod";

import type { sceneListSchema, sceneSchema } from "@/lib/schemas/scene.schema";

export type Scene = z.infer<typeof sceneSchema>;
export type SceneList = z.infer<typeof sceneListSchema>;
