import type { ReactNode } from "react";

import AppSidebar from "@/components/app-shell/AppSidebar";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(106,90,205,0.08),_transparent_55%)]">
      <div className="mx-auto grid min-h-screen w-full max-w-[1600px] grid-cols-1 md:grid-cols-[240px_1fr]">
        <AppSidebar />
        <main className="flex flex-col gap-8 px-6 py-8 md:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
