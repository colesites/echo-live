import type { z } from "zod";

import type {
  destinationListSchema,
  destinationSchema,
} from "@/lib/schemas/destination.schema";

export type Destination = z.infer<typeof destinationSchema>;
export type DestinationList = z.infer<typeof destinationListSchema>;
