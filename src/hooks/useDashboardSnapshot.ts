"use client";

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo } from "react";
import { dashboardSnapshotSchema } from "@/lib/schemas/dashboard.schema";

export function useDashboardSnapshot(enabled: boolean) {
  const data = useQuery(api.dashboard.getSnapshot, enabled ? {} : "skip");

  const parsed = useMemo(() => {
    if (!data) {
      return null;
    }
    const result = dashboardSnapshotSchema.safeParse(data);
    return result.success ? result.data : null;
  }, [data]);

  return {
    data: parsed,
    isLoading: enabled && data === undefined,
    hasError: enabled && data !== undefined && parsed === null,
  };
}
