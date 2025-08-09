import { api } from "@/lib/api/client";
import type { ID, ListResponse, Attachment } from "@/features/shared/types";
import { endpoints } from "@/lib/api/endpoints";

export const getAttachments = async (params?: Record<string, any>) => {
  const { data } = await api.get<ListResponse<Attachment>>(endpoints.mosqueAttachments, { params });
  return data;
};

export const getAttachment = async (id: ID) => {
  const { data } = await api.get<Attachment>(`${endpoints.mosqueAttachments}/${id}`);
  return data;
};

export const createAttachment = async (payload: Partial<Attachment>) => {
  const { data } = await api.post<Attachment>(endpoints.mosqueAttachments, payload);
  return data;
};

export const updateAttachment = async (id: ID, payload: Partial<Attachment>) => {
  const { data } = await api.put<Attachment>(`${endpoints.mosqueAttachments}/${id}`, payload);
  return data;
};

export const deleteAttachment = async (id: ID) => {
  const { data } = await api.delete<{ success: boolean }>(`${endpoints.mosqueAttachments}/${id}`);
  return data;
};
