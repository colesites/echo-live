import { z } from "zod";

export const createSceneSchema = z.object({
  name: z.string().min(2, "Scene name is required."),
});
