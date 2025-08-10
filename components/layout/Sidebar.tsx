"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  LogOut,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type NavItem = {
  href: Route;
  label: string;
  icon: LucideIcon;
};

const DEFAULT_NAV = [
  { href: "/dashboard", label: "الصفحة الرئيسية", icon: LayoutDashboard },
  { href: "/dashboard/users", label: "المستخدمون", icon: Users },
  { href: "/dashboard/mosques", label: "المساجد", icon: Building2 },
] as const satisfies readonly NavItem[];

export default function Sidebar({
  nav = DEFAULT_NAV,
  logout = () => {},
}: {
  nav?: readonly NavItem[];
  logout?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="text-xl font-semibold text-center">لوحة التحكم</div>

      <nav className="flex-1 space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            pathname?.startsWith((item.href as string) + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm border transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                active
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "text-foreground/80 border-transparent hover:bg-muted"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  active ? "text-primary" : "text-foreground/60"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className={cn(
          "flex items-center justify-center gap-2 px-3 py-2 rounded-2xl text-sm border border-border",
          "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
        )}
      >
        <LogOut className="h-4 w-4" />
        <span>تسجيل الخروج</span>
      </button>
    </div>
  );
}
