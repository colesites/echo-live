import { z } from "zod";

export const sceneSchema = z.object({
  id: z.string(),
  streamId: z.string(),
  name: z.string(),
  sources: z.array(z.string()),
  order: z.number(),
  createdAt: z.number(),
});

export const sceneListSchema = z.array(sceneSchema);
