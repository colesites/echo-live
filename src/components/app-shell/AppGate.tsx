"use client";

import type { ReactNode } from "react";

import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { AUTH_SYNC_ERROR_MESSAGE } from "@/constants/user.constants";
import { useEnsureCurrentUser } from "@/hooks/useEnsureCurrentUser";

export default function AppGate({ children }: { children: ReactNode }) {
  const { isReady, error } = useEnsureCurrentUser();

  if (!isReady) {
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

  return <>{children}</>;
}
