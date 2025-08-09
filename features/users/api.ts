import { api } from "@/lib/api/client";
import type { ID, ListResponse, User } from "@/features/shared/types";
import { endpoints } from "@/lib/api/endpoints";

export const getUsers = async (params?: Record<string, any>) => {
  console.log("first", endpoints.users);
  const { data } = await api.get<ListResponse<User>>(endpoints.users, {
    params,
  });
  return data;
};

export const getUser = async (id: ID) => {
  const { data } = await api.get<User>(`${endpoints.users}/${id}`);
  return data;
};

export const createUser = async (payload: Partial<User>) => {
  const { data } = await api.post<User>(endpoints.users, payload);
  return data;
};

export const updateUser = async (id: ID, payload: Partial<User>) => {
  const { data } = await api.put<User>(`${endpoints.users}/${id}`, payload);
  return data;
};

export const deleteUser = async (id: ID) => {
  const { data } = await api.delete<{ success: boolean }>(
    `${endpoints.users}/${id}`
  );
  return data;
};
