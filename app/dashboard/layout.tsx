// app/dashboard/layout.tsx
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة التحكم",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="border-l md:border-l-0 md:border-r bg-white sticky top-0 h-screen p-4">
        <Sidebar />
      </aside>
      <main className="flex flex-col min-h-screen">
        <Topbar />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
