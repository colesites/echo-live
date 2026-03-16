"use client";

import { OrganizationSwitcher, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { APP_NAV_ITEMS } from "@/constants/navigation.constants";

export default function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const name = user?.fullName ?? user?.firstName ?? "Personal account";

  return (
    <aside className="border-border/60 bg-sidebar text-sidebar-foreground md:sticky md:top-0 md:h-screen md:border-r">
      <div className="flex h-full flex-col gap-6 px-6 py-6">
        <div className="flex flex-col gap-2 rounded-2xl border border-sidebar-border bg-sidebar-accent/40 p-4">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sidebar-foreground/70">
            EchoLive
          </span>
          <span className="text-xl font-semibold text-sidebar-foreground">
            Control Suite
          </span>
          <span className="text-xs text-sidebar-foreground/60">
            Live production for modern ministries.
          </span>
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
                    ? "border-sidebar-border bg-sidebar-accent text-sidebar-foreground"
                    : "border-transparent text-sidebar-foreground/70 hover:border-sidebar-border hover:bg-sidebar-accent/60"
                }`}
              >
                <item.icon
                  className={`size-4 ${
                    isActive
                      ? "text-sidebar-primary"
                      : "text-sidebar-foreground/60 group-hover:text-sidebar-primary"
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
                    ? "border-sidebar-border bg-sidebar-accent text-sidebar-foreground"
                    : "border-sidebar-border/70 text-sidebar-foreground/70"
                }`}
              >
                <item.icon className="size-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden flex-col gap-3 rounded-2xl border border-sidebar-border bg-sidebar-accent/60 p-3 md:flex">
          <OrganizationSwitcher
            afterSelectOrganizationUrl="/dashboard"
            afterSelectPersonalUrl="/dashboard"
            afterLeaveOrganizationUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "w-full",
                organizationSwitcherTrigger:
                  "w-full justify-between rounded-xl border border-sidebar-border bg-sidebar-accent/80 px-3 py-2 text-sm font-medium text-white [&_span]:!text-white [&_p]:!text-white",
                organizationSwitcherTriggerIcon: "!text-white",
                organizationSwitcherTriggerText: "!text-white",
                organizationPreview__organizationName: "!text-white",
                organizationPreview__organizationDetails: "!text-white",
                organizationSwitcherPopoverCard: "text-black",
                organizationSwitcherPopoverActionButtonText: "text-black",
                organizationSwitcherPopoverActionButton: "text-black",
                organizationSwitcherPopoverInviteMembersButtonText:
                  "text-black",
                organizationSwitcherPopoverCreateOrganizationButtonText:
                  "text-black",
              },
            }}
          />
          <div className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent/70 px-3 py-2">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
              userProfileMode="modal"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">
                {name}
              </span>
              <span className="text-xs text-sidebar-foreground/60">
                Manage personal account
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
