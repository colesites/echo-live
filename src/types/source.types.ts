import type { z } from "zod";

import type {
  sourceListSchema,
  sourceSchema,
} from "@/lib/schemas/source.schema";

export type Source = z.infer<typeof sourceSchema>;
export type SourceList = z.infer<typeof sourceListSchema>;
