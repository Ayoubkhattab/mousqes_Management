// components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { LayoutDashboard, Users, Building2, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import { useAuth } from "@/contexts/AuthContext";

type NavItem = {
  href: Route;
  label: string;
  icon: LucideIcon;
};

const nav = [
  { href: "/dashboard", label: "الصفحة الرئيسية", icon: LayoutDashboard },
  { href: "/dashboard/users", label: "المستخدمون", icon: Users },
  { href: "/dashboard/mosques", label: "المساجد", icon: Building2 },
] as const satisfies readonly NavItem[];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="text-xl font-semibold text-center">لوحة التحكم</div>

      <nav className="flex-1 space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href} // الآن النوع Route مضبوط
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-2xl text-sm border",
                active
                  ? "bg-black text-white border-black"
                  : "hover:bg-gray-50 border-transparent"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="flex items-center justify-center gap-2 px-3 py-2 rounded-2xl border hover:bg-gray-50 text-sm"
      >
        <LogOut className="h-4 w-4" />
        <span>تسجيل الخروج</span>
      </button>
    </div>
  );
}
