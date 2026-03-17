import type { ReactNode } from "react";

import AppSidebar from "@/components/app-shell/AppSidebar";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-[260px_1fr]">
        <AppSidebar />
        <main className="flex flex-col gap-8 px-6 py-8 md:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
