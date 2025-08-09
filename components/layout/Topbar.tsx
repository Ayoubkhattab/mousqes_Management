// components/layout/Topbar.tsx
"use client";

import { usePathname } from "next/navigation";

const map: Record<string, string> = {
  "/dashboard": "الصفحة الرئيسية",
  "/dashboard/users": "المستخدمون",
  "/dashboard/mosques": "المساجد",
};

export default function Topbar() {
  const pathname = usePathname();
  const title =
    Object.keys(map).find(
      (k) => pathname === k || pathname?.startsWith(k + "/")
    ) ?? "/dashboard";

  return (
    <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
      <div className="px-6 py-4">
        <h1 className="text-xl font-semibold">{map[title]}</h1>
      </div>
    </header>
  );
}
