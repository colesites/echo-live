import type { z } from "zod";

import type {
  analyticsCountryListSchema,
  analyticsCountrySchema,
  analyticsEntryListSchema,
  analyticsEntrySchema,
  analyticsSummarySchema,
} from "@/lib/schemas/analytics.schema";

export type AnalyticsSummary = z.infer<typeof analyticsSummarySchema>;
export type AnalyticsEntry = z.infer<typeof analyticsEntrySchema>;
export type AnalyticsEntryList = z.infer<typeof analyticsEntryListSchema>;
export type AnalyticsCountry = z.infer<typeof analyticsCountrySchema>;
export type AnalyticsCountryList = z.infer<typeof analyticsCountryListSchema>;
