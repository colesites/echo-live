"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { APP_NAV_ITEMS } from "@/constants/navigation.constants";

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-border/60 bg-background/90 backdrop-blur md:min-h-screen md:border-r">
      <div className="flex h-full flex-col gap-6 px-6 py-6">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            EchoLive
          </span>
          <span className="text-lg font-semibold">Streaming Studio</span>
        </div>

        <nav className="hidden flex-1 flex-col gap-2 md:flex">
          {APP_NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-border/70 bg-muted/70 text-foreground"
                    : "border-transparent text-foreground/80 hover:border-border/60 hover:bg-muted/70"
                }`}
              >
                <item.icon
                  className={`size-4 ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <nav className="flex flex-wrap gap-2 md:hidden">
          {APP_NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                  isActive
                    ? "border-border/70 bg-muted/70 text-foreground"
                    : "border-border/60 text-muted-foreground"
                }`}
              >
                <item.icon className="size-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
