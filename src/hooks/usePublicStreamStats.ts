"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo } from "react";
import { analyticsSummarySchema } from "@/lib/schemas/analytics.schema";

export function usePublicStreamStats(publicId: string) {
  const data = useQuery(api.publicAnalytics.getPublicSummaryByPublicId, {
    publicId,
  });

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
