import { api } from "@/lib/api/client";
import type {
  MosqueEnumParams,
  MosqueEnumResponse,
  MosqueEnums,
  MosqueListResponse,
  MosqueOneResponse,
} from "./types";

type EnumResp = { success: boolean; data: string[] };

//(branch_id/district_id/name)  params
type EnumParams = {
  branch_id?: number | string;
  district_id?: number | string;
  name?: string;
};

// Endpoints
const base = "/dashboard/mosques/enums";

export async function getMosqueCurrentStatus(p?: MosqueEnumParams) {
  const { data } = await api.get<MosqueEnumResponse>(`${base}/current-status`, {
    params: p,
  });
  return data.data;
}

export async function getMosqueCategory(p?: EnumParams) {
  const { data } = await api.get<EnumResp>(`${base}/category`, { params: p });
  return data.data;
}
export async function getMosqueTechnicalStatus(p?: EnumParams) {
  const { data } = await api.get<EnumResp>(`${base}/technical-status`, {
    params: p,
  });
  return data.data;
}
export async function getMosqueTypes(p?: EnumParams) {
  const { data } = await api.get<EnumResp>(`${base}/type`, { params: p });
  return data.data;
}
export async function getMosqueDemolitionPercentage() {
  const { data } = await api.get<EnumResp>(`${base}/demolition-percentage`);
  return data.data;
}
export async function getMosqueDestructionStatus() {
  const { data } = await api.get<EnumResp>(`${base}/destruction-status`);
  return data.data;
}
export async function getMosqueAttachments() {
  const { data } = await api.get<EnumResp>(`${base}/mosque-attachments`);
  return data.data;
}

export async function getMosqueEnums(p?: EnumParams): Promise<MosqueEnums> {
  const [
    currentStatus,
    category,
    technicalStatus,
    types,
    demolitionPercentage,
    destructionStatus,
    attachments,
  ] = await Promise.all([
    getMosqueCurrentStatus(p),
    getMosqueCategory(p),
    getMosqueTechnicalStatus(p),
    getMosqueTypes(p),
    getMosqueDemolitionPercentage(),
    getMosqueDestructionStatus(),
    getMosqueAttachments(),
  ]);

  return {
    currentStatus,
    category,
    technicalStatus,
    types,
    demolitionPercentage,
    destructionStatus,
    attachments,
  };
}

export type MosquesQuery = {
  page?: number;
  pageSize?: number;
  sort?: string; // ex: -id
  filters?: {
    name?: string;
    branch_name?: string; // maps to filter[branch.name]
    district_name?: string; // maps to filter[district.name]
    current_status?: string; // filter[current_status]
    category?: string; // filter[category]
    types?: string[]; // filter[types.type] as comma list
  };
};

function mapFiltersToParams(f?: MosquesQuery["filters"]) {
  const params: Record<string, any> = {};
  if (!f) return params;
  if (f.name) params["filter[name]"] = f.name;
  if (f.branch_name) params["filter[branch.name]"] = f.branch_name;
  if (f.district_name) params["filter[district.name]"] = f.district_name;
  if (f.current_status) params["filter[current_status]"] = f.current_status;
  if (f.category) params["filter[category]"] = f.category;
  if (f.types && f.types.length)
    params["filter[types.type]"] = f.types.join(",");
  return params;
}

export async function listMosques(q: MosquesQuery) {
  const params: Record<string, any> = {
    page: q.page ?? 1,
    pageSize: q.pageSize ?? 20,
    ...(q.sort ? { sort: q.sort } : {}),
    ...mapFiltersToParams(q.filters),
  };
  const { data } = await api.get<MosqueListResponse>("/dashboard/mosques", {
    params,
  });
  const total = data?.meta?.total ?? data?.data?.length ?? 0;
  return { data: data.data, total };
}

export async function getMosque(id: number | string) {
  const { data } = await api.get<MosqueOneResponse>(`/dashboard/mosques/${id}`);
  return data.data;
}

export type CreateMosqueDTO = {
  branch_id: number | string;
  district_id: number | string;
  name: string;

  city_or_village?: string;
  is_active?: boolean | number;
  support_friday?: boolean | number;
  category?: string;
  current_status?: string;
  technical_status?: string;
  mosque_attachments?: string;
  demolition_percentage?: string;
  destruction_status?: string;
  latitude?: string | number;
  longitude?: string | number;
  description?: string;
  types?: string[];
};

export async function createMosque(dto: CreateMosqueDTO) {
  const fd = new URLSearchParams();
  fd.set("branch_id", String(dto.branch_id));
  fd.set("district_id", String(dto.district_id));
  fd.set("name", dto.name);

  if (dto.city_or_village) fd.set("cirty_or_village", dto.city_or_village); // spelling per API doc
  if (dto.is_active !== undefined)
    fd.set("is_active", String(Number(!!dto.is_active)));
  if (dto.support_friday !== undefined)
    fd.set("support_friday", String(Number(!!dto.support_friday)));
  if (dto.category) fd.set("category", dto.category);
  if (dto.current_status) fd.set("current_status", dto.current_status);
  if (dto.technical_status) fd.set("technical_status", dto.technical_status);
  if (dto.mosque_attachments)
    fd.set("mosque_attachments", dto.mosque_attachments);
  if (dto.demolition_percentage)
    fd.set("demolition_percentage", dto.demolition_percentage);
  if (dto.destruction_status)
    fd.set("destruction_status", dto.destruction_status);
  if (dto.latitude !== undefined) fd.set("latitude", String(dto.latitude));
  if (dto.longitude !== undefined) fd.set("longitude", String(dto.longitude));
  if (dto.description) fd.set("description", dto.description);
  if (dto.types?.length) dto.types.forEach((t) => fd.append("types[]", t));

  const { data } = await api.post<MosqueOneResponse>("/dashboard/mosques", fd);
  return data.data;
}

export async function updateMosque(
  id: number | string,
  dto: Partial<CreateMosqueDTO>
) {
  const fd = new URLSearchParams();

  if (dto.branch_id !== undefined) fd.set("branch_id", String(dto.branch_id));
  if (dto.district_id !== undefined)
    fd.set("district_id", String(dto.district_id));
  if (dto.name !== undefined) fd.set("name", dto.name);
  if (dto.city_or_village !== undefined)
    fd.set("cirty_or_village", dto.city_or_village);
  if (dto.is_active !== undefined)
    fd.set("is_active", String(Number(!!dto.is_active)));
  if (dto.support_friday !== undefined)
    fd.set("support_friday", String(Number(!!dto.support_friday)));
  if (dto.category !== undefined) fd.set("category", dto.category ?? "");
  if (dto.current_status !== undefined)
    fd.set("current_status", dto.current_status ?? "");
  if (dto.technical_status !== undefined)
    fd.set("technical_status", dto.technical_status ?? "");
  if (dto.mosque_attachments !== undefined)
    fd.set("mosque_attachments", dto.mosque_attachments ?? "");
  if (dto.demolition_percentage !== undefined)
    fd.set("demolition_percentage", dto.demolition_percentage ?? "");
  if (dto.destruction_status !== undefined)
    fd.set("destruction_status", dto.destruction_status ?? "");
  if (dto.latitude !== undefined)
    fd.set("latitude", String(dto.latitude ?? ""));
  if (dto.longitude !== undefined)
    fd.set("longitude", String(dto.longitude ?? ""));
  if (dto.description !== undefined)
    fd.set("description", dto.description ?? "");
  if (dto.types) {
    dto.types.forEach((t) => fd.append("types[]", t));
  }

  const { data } = await api.put<MosqueOneResponse>(
    `/dashboard/mosques/${id}`,
    fd
  );
  return data.data;
}

export async function deleteMosque(id: number | string) {
  await api.delete(`/dashboard/mosques/${id}`);
}
