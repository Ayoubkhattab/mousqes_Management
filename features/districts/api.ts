import { api } from "@/lib/api/client";
import type { District } from "./types";

export type DistrictListParams = {
  page?: number;
  pageSize?: number;
  filters?: {
    name?: string; // -> filter[name]
    branchName?: string; // -> filter[branch.name]
  };
};

function mapFilters(filters?: DistrictListParams["filters"]) {
  if (!filters) return {};
  const params: Record<string, string> = {};
  if (filters.name) params["filter[name]"] = filters.name;
  if (filters.branchName) params["filter[branch.name]"] = filters.branchName;
  return params;
}

export async function listDistricts(params: DistrictListParams) {
  const res = await api.get("/dashboard/districts", {
    params: {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      ...mapFilters(params.filters),
    },
  });
  const payload = res.data;
  return {
    data: (payload?.data ?? []) as District[],
    total: payload?.meta?.total ?? payload?.data?.length ?? 0,
  };
}

export async function getDistrict(id: number) {
  const res = await api.get(`/dashboard/districts/${id}`);
  return res.data?.data as District;
}

export async function createDistrict(dto: {
  name: string;
  branch_id: number;
  code?: string;
}) {
  const res = await api.post("/dashboard/districts", dto);
  return res.data?.data as District;
}

export async function updateDistrict(
  id: number,
  dto: {
    name?: string;
    branch_id?: number;
    code?: string;
  }
) {
  const res = await api.put(`/dashboard/districts/${id}`, dto);
  return res.data?.data as District;
}

export async function deleteDistrict(id: number) {
  const res = await api.delete(`/dashboard/districts/${id}`);
  return res.data;
}
