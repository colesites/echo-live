import type { LucideIcon } from "lucide-react";
import { BarChart3, LayoutDashboard, Radio, Settings2 } from "lucide-react";

export type AppNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const APP_NAV_ITEMS: AppNavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Streams",
    href: "/streams",
    icon: Radio,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings2,
  },
];
