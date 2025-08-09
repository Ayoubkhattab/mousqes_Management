import { api } from "@/lib/api/client";
import type { Branch, ID } from "@/features/shared/types";
import { endpoints } from "@/lib/api/endpoints";

// شكل رد الباك إند حسب الأمثلة المرسلة
type BackendList<T> = {
  success: boolean;
  data: T[];
  links?: any;
  meta?: {
    total?: number;
    per_page?: number;
    current_page?: number;
    last_page?: number;
    [k: string]: any;
  };
};

// GET /dashboard/branches with filters/sort/pagination
export async function getBranches(params?: {
  page?: number; // 1
  pageSize?: number; // 20
  sort?: string; // "-id" أو "name"
  filter?: { name?: string }; // filter[name]=...
}) {
  const searchParams: Record<string, any> = {
    page: params?.page,
    pageSize: params?.pageSize,
    sort: params?.sort,
    ...(params?.filter?.name ? { "filter[name]": params.filter.name } : {}),
  };

  const { data } = await api.get<BackendList<Branch>>(endpoints.branches, {
    params: searchParams,
  });

  return {
    data: data.data,
    total: data.meta?.total,
    meta: data.meta,
  };
}

// GET /dashboard/branches?list=1  (قائمة مختصرة للاختيارات)
export async function getBranchesList() {
  const { data } = await api.get<{
    success: boolean;
    data: Pick<Branch, "id" | "name">[];
  }>(`${endpoints.branches}`, { params: { list: 1 } });
  return data.data;
}

// اختياري: جلب سجل مفرد إن وُجد endpoint /dashboard/branches/:id
export async function getBranch(id: ID) {
  const { data } = await api.get<{ success: boolean; data: Branch }>(
    `${endpoints.branches}/${id}`
  );
  return data.data;
}
