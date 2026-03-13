import { z } from "zod";

export const analyticsSummarySchema = z.object({
  totalViewers: z.number(),
  totalListeners: z.number(),
  peakViewers: z.number(),
  peakListeners: z.number(),
  averageWatchDuration: z.number(),
});

export const analyticsEntrySchema = z.object({
  id: z.string(),
  streamId: z.string(),
  viewerCount: z.number(),
  listenerCount: z.number(),
  country: z.string(),
  watchDurationSeconds: z.number(),
  recordedAt: z.number(),
});

export const analyticsEntryListSchema = z.array(analyticsEntrySchema);

export const analyticsCountrySchema = z.object({
  country: z.string(),
  count: z.number(),
});

export const analyticsCountryListSchema = z.array(analyticsCountrySchema);
