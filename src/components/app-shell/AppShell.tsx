import type { ReactNode } from "react";

import AppSidebar from "@/components/app-shell/AppSidebar";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(225,25,25,0.18),_transparent_55%),radial-gradient(circle_at_bottom_left,_rgba(255,77,77,0.12),_transparent_60%)]">
      <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-[260px_1fr]">
        <AppSidebar />
        <main className="flex flex-col gap-8 px-6 py-8 md:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
