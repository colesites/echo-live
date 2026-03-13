import type { z } from "zod";

import type {
  recordingListSchema,
  recordingSchema,
} from "@/lib/schemas/recording.schema";

export type Recording = z.infer<typeof recordingSchema>;
export type RecordingList = z.infer<typeof recordingListSchema>;
