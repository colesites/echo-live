"use client";

import { useAuth } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";

import DashboardOverview from "@/components/dashboard/DashboardOverview";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { AUTH_SYNC_ERROR_MESSAGE } from "@/constants/user.constants";
import { useDashboardSnapshot } from "@/hooks/useDashboardSnapshot";
import { useEnsureCurrentUser } from "@/hooks/useEnsureCurrentUser";

export default function DashboardClient() {
  const { isSignedIn, isLoaded } = useAuth();
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const { isReady, error } = useEnsureCurrentUser();
  const canQuery = Boolean(
    isLoaded && isSignedIn && isAuthenticated && isReady && !error,
  );
  const { data, isLoading, hasError } = useDashboardSnapshot(canQuery);

  if (!isReady || isAuthLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center rounded-3xl border border-border/60 bg-background/70">
        <Spinner className="size-6 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-border/60 bg-background/80">
        {AUTH_SYNC_ERROR_MESSAGE}
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center rounded-3xl border border-border/60 bg-background/70">
        <Spinner className="size-6 text-primary" />
      </div>
    );
  }

  if (hasError || !data) {
    return (
      <Alert className="border-border/60 bg-background/80">
        We could not load your dashboard data yet.
      </Alert>
    );
  }

  return <DashboardOverview data={data} />;
}
