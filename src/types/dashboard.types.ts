import type { z } from "zod";

import type {
  activeStreamSchema,
  analyticsSummarySchema,
  dashboardSnapshotSchema,
  recordingSchema,
  upcomingStreamSchema,
} from "@/lib/schemas/dashboard.schema";

export type UpcomingStream = z.infer<typeof upcomingStreamSchema>;
export type ActiveStream = z.infer<typeof activeStreamSchema>;
export type RecordingStream = z.infer<typeof recordingSchema>;
export type AnalyticsSummary = z.infer<typeof analyticsSummarySchema>;
export type DashboardSnapshot = z.infer<typeof dashboardSnapshotSchema>;
