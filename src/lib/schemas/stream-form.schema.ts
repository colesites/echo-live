import { z } from "zod";

import { STREAM_MODE } from "@/constants/stream.constants";

export const createStreamSchema = z.object({
  title: z.string().min(2, "Stream title is required."),
  type: z.enum([STREAM_MODE.AUDIO, STREAM_MODE.VIDEO]),
  imageUrl: z.string().nullable().optional(),
  orgId: z.string().nullable().optional(),
  orgName: z.string().nullable().optional(),
  orgImageUrl: z.string().nullable().optional(),
});
