import { api } from "@/lib/api/client";
import type { ID, ListResponse, Worker } from "@/features/shared/types";
import { endpoints } from "@/lib/api/endpoints";

export const getWorkers = async (params?: Record<string, any>) => {
  const { data } = await api.get<ListResponse<Worker>>(endpoints.workers, { params });
  return data;
};

export const getWorker = async (id: ID) => {
  const { data } = await api.get<Worker>(`${endpoints.workers}/${id}`);
  return data;
};

export const createWorker = async (payload: Partial<Worker>) => {
  const { data } = await api.post<Worker>(endpoints.workers, payload);
  return data;
};

export const updateWorker = async (id: ID, payload: Partial<Worker>) => {
  const { data } = await api.post<Worker>(`${endpoints.workers}/${id}`, payload); // بعض الأنظمة تستخدم POST للتحديث
  return data;
};

export const deleteWorker = async (id: ID) => {
  const { data } = await api.delete<{ success: boolean }>(`${endpoints.workers}/${id}`);
  return data;
};

export const getWorkerProfile = async (id: ID) => {
  const { data } = await api.get(`${endpoints.workers}/${id}/profile`);
  return data;
};

export const getRolesEnum = async () => {
  const { data } = await api.get<string[]>(endpoints.workersEnums.rolesEnum);
  return data;
};

export const workersEnums = {
  jobTitle: async () => (await api.get<string[]>(endpoints.workersEnums.jobTitle)).data,
  jobStatus: async () => (await api.get<string[]>(endpoints.workersEnums.jobStatus)).data,
  quranLevels: async () => (await api.get<string[]>(endpoints.workersEnums.quranLevels)).data,
  sponsorshipTypes: async () => (await api.get<string[]>(endpoints.workersEnums.sponsorshipTypes)).data,
  educationalLevel: async () => (await api.get<string[]>(endpoints.workersEnums.educationalLevel)).data,
};
