import type { z } from "zod";

import type { publicStreamSchema } from "@/lib/schemas/public-stream.schema";

export type PublicStream = z.infer<typeof publicStreamSchema>;
