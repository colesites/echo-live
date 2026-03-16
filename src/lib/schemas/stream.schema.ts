import { z } from "zod";

import { STREAM_MODE, STREAM_STATUS } from "@/constants/stream.constants";

export const streamSchema = z.object({
  id: z.string(),
  publicId: z.string(),
  title: z.string(),
  type: z.enum([STREAM_MODE.AUDIO, STREAM_MODE.VIDEO]),
  status: z.enum([
    STREAM_STATUS.SCHEDULED,
    STREAM_STATUS.LIVE,
    STREAM_STATUS.ENDED,
  ]),
  imageUrl: z.string().nullable().optional(),
  orgName: z.string().nullable().optional(),
  orgImageUrl: z.string().nullable().optional(),
  hlsUrl: z.string().nullable().optional(),
  audioUrl: z.string().nullable().optional(),
  createdAt: z.number(),
  scheduledFor: z.number().nullable().optional(),
  liveStartedAt: z.number().nullable().optional(),
});

export const streamListSchema = z.array(streamSchema);
