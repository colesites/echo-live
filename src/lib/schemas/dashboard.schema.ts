import { z } from "zod";

import { STREAM_MODE, STREAM_STATUS } from "@/constants/stream.constants";

export const streamBaseSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum([STREAM_MODE.AUDIO, STREAM_MODE.VIDEO]),
  status: z.enum([
    STREAM_STATUS.SCHEDULED,
    STREAM_STATUS.LIVE,
    STREAM_STATUS.ENDED,
  ]),
});

export const upcomingStreamSchema = streamBaseSchema.extend({
  scheduledFor: z.number(),
  publicId: z.string(),
});

export const activeStreamSchema = streamBaseSchema.extend({
  viewerCount: z.number(),
  liveStartedAt: z.number(),
  publicId: z.string(),
});

export const recordingSchema = streamBaseSchema.extend({
  recordedAt: z.number(),
  durationMinutes: z.number(),
  publicId: z.string(),
  url: z.string(),
});

export const analyticsSummarySchema = z.object({
  totalViewers: z.number(),
  peakViewers: z.number(),
  averageWatchMinutes: z.number(),
  totalListeners: z.number(),
});

export const dashboardSnapshotSchema = z.object({
  upcomingStreams: z.array(upcomingStreamSchema),
  activeStreams: z.array(activeStreamSchema),
  recentRecordings: z.array(recordingSchema),
  analyticsSummary: analyticsSummarySchema,
});
