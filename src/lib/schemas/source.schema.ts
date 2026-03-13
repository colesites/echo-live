import { z } from "zod";

export const sourceSchema = z.object({
  id: z.string(),
  streamId: z.string(),
  name: z.string(),
  type: z.string(),
  config: z.string().nullable().optional(),
  zIndex: z.number(),
  createdAt: z.number(),
});

export const sourceListSchema = z.array(sourceSchema);
