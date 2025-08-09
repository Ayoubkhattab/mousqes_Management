import { api } from "@/lib/api/client";
import type { ID, ListResponse, District } from "@/features/shared/types";
import { endpoints } from "@/lib/api/endpoints";

export const getDistricts = async (params?: Record<string, any>) => {
  const { data } = await api.get<ListResponse<District>>(endpoints.districts, { params });
  return data;
};

export const getDistrict = async (id: ID) => {
  const { data } = await api.get<District>(`${endpoints.districts}/${id}`);
  return data;
};

export const createDistrict = async (payload: Partial<District>) => {
  const { data } = await api.post<District>(endpoints.districts, payload);
  return data;
};

export const updateDistrict = async (id: ID, payload: Partial<District>) => {
  const { data } = await api.put<District>(`${endpoints.districts}/${id}`, payload);
  return data;
};

export const deleteDistrict = async (id: ID) => {
  const { data } = await api.delete<{ success: boolean }>(`${endpoints.districts}/${id}`);
  return data;
};
