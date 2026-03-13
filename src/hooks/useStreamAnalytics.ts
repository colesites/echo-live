"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo } from "react";
import {
  analyticsCountryListSchema,
  analyticsEntryListSchema,
  analyticsSummarySchema,
} from "@/lib/schemas/analytics.schema";

export function useStreamAnalyticsSummary(streamId: string) {
  const data = useQuery(api.analytics.getSummaryByStream, { streamId });

  const parsed = useMemo(() => {
    if (!data) {
      return null;
    }
    const result = analyticsSummarySchema.safeParse(data);
    return result.success ? result.data : null;
  }, [data]);

  return {
    data: parsed,
    isLoading: data === undefined,
    hasError: data !== undefined && parsed === null,
  };
}

export function useStreamAnalyticsSeries(streamId: string) {
  const data = useQuery(api.analytics.getTimeSeriesByStream, { streamId });

  const parsed = useMemo(() => {
    if (!data) {
      return null;
    }
    const result = analyticsEntryListSchema.safeParse(
      data.map((entry) => ({
        id: entry._id,
        streamId: entry.streamId,
        viewerCount: entry.viewerCount,
        listenerCount: entry.listenerCount,
        country: entry.country,
        watchDurationSeconds: entry.watchDurationSeconds,
        recordedAt: entry.recordedAt,
      })),
    );
    return result.success ? result.data : null;
  }, [data]);

  return {
    data: parsed,
    isLoading: data === undefined,
    hasError: data !== undefined && parsed === null,
  };
}

export function useStreamCountryBreakdown(streamId: string) {
  const data = useQuery(api.analytics.getCountryBreakdownByStream, {
    streamId,
  });

  const parsed = useMemo(() => {
    if (!data) {
      return null;
    }
    const result = analyticsCountryListSchema.safeParse(data);
    return result.success ? result.data : null;
  }, [data]);

  return {
    data: parsed,
    isLoading: data === undefined,
    hasError: data !== undefined && parsed === null,
  };
}
