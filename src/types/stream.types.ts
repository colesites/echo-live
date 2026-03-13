import type { z } from "zod";

import type {
  streamListSchema,
  streamSchema,
} from "@/lib/schemas/stream.schema";

export type Stream = z.infer<typeof streamSchema>;
export type StreamList = z.infer<typeof streamListSchema>;
