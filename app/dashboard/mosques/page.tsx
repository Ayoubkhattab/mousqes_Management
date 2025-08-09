// app/dashboard/mosques/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { getMosques } from "@/features/mosques/api";
import type { Mosque } from "@/features/shared/types";

export default function MosquesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["mosques", {}],
    queryFn: () => getMosques({ page: 1, pageSize: 20 }),
  });

  if (isLoading) return <div>جارِ التحميل…</div>;
  if (isError) return <div className="text-red-600">حدث خطأ أثناء الجلب.</div>;

  const rows = (data?.data ?? []) as Mosque[];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">المساجد</h2>
      <div className="overflow-x-auto border rounded-2xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-right">#</th>
              <th className="p-3 text-right">الاسم</th>
              <th className="p-3 text-right">الحي/المنطقة</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={String(m.id)} className="border-t">
                <td className="p-3">{String(m.id)}</td>
                <td className="p-3">{m.name}</td>
                <td className="p-3">{String(m.districtId ?? "-")}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="p-6 text-center opacity-70">
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
