import { z } from "zod";

import { STREAM_MODE } from "@/constants/stream.constants";

export const recordingSchema = z.object({
  id: z.string(),
  streamId: z.string(),
  type: z.enum([STREAM_MODE.AUDIO, STREAM_MODE.VIDEO]),
  url: z.string(),
  downloadUrl: z.string().nullable().optional(),
  durationSeconds: z.number(),
  createdAt: z.number(),
});

export const recordingListSchema = z.array(recordingSchema);
