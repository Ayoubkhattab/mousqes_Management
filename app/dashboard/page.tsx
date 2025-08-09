// app/dashboard/page.tsx
import Link from "next/link";

export default function DashboardHome() {
  return (
    <div className="space-y-4">
      <p className="opacity-80">
        أهلاً بك. استخدم القائمة الجانبية للتنقل بين الوحدات.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/users"
          className="px-4 py-2 rounded-2xl border hover:bg-gray-50"
        >
          إدارة المستخدمين
        </Link>
        <Link
          href="/dashboard/mosques"
          className="px-4 py-2 rounded-2xl border hover:bg-gray-50"
        >
          إدارة المساجد
        </Link>
      </div>
    </div>
  );
}
