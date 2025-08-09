// app/dashboard/users/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/features/users/api";
import type { User } from "@/features/shared/types";

export default function UsersPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", {}],
    queryFn: () => getUsers({ page: 1, pageSize: 20 }),
  });

  if (isLoading) return <div>جارِ التحميل…</div>;
  if (isError) return <div className="text-red-600">حدث خطأ أثناء الجلب.</div>;

  const rows = (data?.data ?? []) as User[];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">المستخدمون</h2>
      <div className="overflow-x-auto border rounded-2xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-right">#</th>
              <th className="p-3 text-right">اسم المستخدم</th>
              <th className="p-3 text-right">الاسم</th>
              <th className="p-3 text-right">الدور</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={String(u.id)} className="border-t">
                <td className="p-3">{String(u.id)}</td>
                <td className="p-3">{u.username}</td>
                <td className="p-3">{u.name ?? "-"}</td>
                <td className="p-3">{u.role ?? "-"}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center opacity-70">
                  لا توجد بيانات.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
