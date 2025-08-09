import { api } from "@/lib/api/client";
import type { ID, ListResponse, Mosque } from "@/features/shared/types";
import { endpoints } from "@/lib/api/endpoints";

export const getMosques = async (params?: Record<string, any>) => {
  const { data } = await api.get<ListResponse<Mosque>>(endpoints.mosques, { params });
  return data;
};

export const getMosque = async (id: ID) => {
  const { data } = await api.get<Mosque>(`${endpoints.mosques}/${id}`);
  return data;
};

export const createMosque = async (payload: Partial<Mosque>) => {
  const { data } = await api.post<Mosque>(endpoints.mosques, payload);
  return data;
};

export const updateMosque = async (id: ID, payload: Partial<Mosque>) => {
  const { data } = await api.put<Mosque>(`${endpoints.mosques}/${id}`, payload);
  return data;
};

export const deleteMosque = async (id: ID) => {
  const { data } = await api.delete<{ success: boolean }>(`${endpoints.mosques}/${id}`);
  return data;
};

// Filter & sort examples (عدّل params حسب باك إندك)
export const getMosquesMultiValue = async (params: Record<string, any>) => {
  const { data } = await api.get<ListResponse<Mosque>>(`${endpoints.mosques}`, { params });
  return data;
};

export const getMosquesCompositeFilters = async (params: Record<string, any>) => {
  const { data } = await api.get<ListResponse<Mosque>>(`${endpoints.mosques}`, { params });
  return data;
};

export const getMosquesSortAndFilter = async (params: Record<string, any>) => {
  const { data } = await api.get<ListResponse<Mosque>>(`${endpoints.mosques}`, { params });
  return data;
};

export const getMosquesByBranch = async (branchId: ID, params?: Record<string, any>) => {
  const { data } = await api.get<ListResponse<Mosque>>(`${endpoints.mosques}`, { params: { branchId, ...params } });
  return data;
};

// Enums
export const mosquesEnums = {
  currentStatus: async () => (await api.get<string[]>(endpoints.mosquesEnums.currentStatus)).data,
  category: async () => (await api.get<string[]>(endpoints.mosquesEnums.category)).data,
  technicalStatus: async () => (await api.get<string[]>(endpoints.mosquesEnums.technicalStatus)).data,
  type: async () => (await api.get<string[]>(endpoints.mosquesEnums.type)).data,
  demolitionPercentage: async () => (await api.get<string[]>(endpoints.mosquesEnums.demolitionPercentage)).data,
  destructionStatus: async () => (await api.get<string[]>(endpoints.mosquesEnums.destructionStatus)).data,
};
