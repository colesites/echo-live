"use client";

import { UserButton, useUser } from "@clerk/nextjs";

import { Badge } from "@/components/ui/badge";

export default function AppHeader() {
  const { user } = useUser();
  const name = user?.fullName ?? user?.firstName ?? "Account";

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/80 px-4 py-3 backdrop-blur">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          EchoLive
        </span>
        <span className="text-base font-semibold text-foreground">
          Welcome back, {name}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="border-border/60">
          Signed in
        </Badge>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-9 w-9",
            },
          }}
        />
      </div>
    </header>
  );
}
