"use client";

import { useUser } from "@clerk/nextjs";
import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AUTH_SYNC_ERROR_MESSAGE } from "@/constants/user.constants";
import { authUserSchema } from "@/lib/schemas/auth-user.schema";
import { getChurchNameFromProfile } from "@/utils/user.utils";

type UserSyncState = {
  isReady: boolean;
  error: Error | null;
};

const INITIAL_STATE: UserSyncState = {
  isReady: false,
  error: null,
};

export function useEnsureCurrentUser() {
  const { isLoaded, isSignedIn, user } = useUser();
  const upsertUser = useMutation(api.users.upsertCurrentUser);
  const hasSyncedRef = useRef(false);
  const [state, setState] = useState<UserSyncState>(INITIAL_STATE);

  const profile = useMemo(() => {
    if (!user) {
      return null;
    }

    const result = authUserSchema.safeParse({
      fullName: user.fullName ?? undefined,
      primaryEmail: user.primaryEmailAddress?.emailAddress ?? undefined,
      imageUrl: user.imageUrl ?? undefined,
    });

    return result.success ? result.data : null;
  }, [user]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn || !user) {
      setState({ isReady: true, error: null });
      return;
    }

    if (hasSyncedRef.current) {
      return;
    }
    hasSyncedRef.current = true;

    const syncUser = async () => {
      try {
        const churchName = getChurchNameFromProfile(profile);
        await upsertUser({
          churchName,
          logo: profile?.imageUrl,
        });
        setState({ isReady: true, error: null });
      } catch (error) {
        const resolvedError =
          error instanceof Error ? error : new Error(AUTH_SYNC_ERROR_MESSAGE);
        setState({ isReady: true, error: resolvedError });
      }
    };

    void syncUser();
  }, [isLoaded, isSignedIn, profile, upsertUser, user]);

  return state;
}
