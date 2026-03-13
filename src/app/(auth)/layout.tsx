import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(106,90,205,0.16),_transparent_55%),radial-gradient(circle_at_top_right,_rgba(245,184,65,0.16),_transparent_50%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-12">
        {children}
      </div>
    </div>
  );
}
