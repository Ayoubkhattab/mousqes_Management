import { api } from "@/lib/api/client";
import type { ID } from "@/features/shared/types";
import { endpoints } from "@/lib/api/endpoints";

export const getAttachments = async (params?: Record<string, any>) => {
  const { data } = await api.get<ListResponse<Attachment>>(
    endpoints.mosqueAttachments,
    { params }
  );
  return data;
};

export interface Attachment {
  id: ID;
  mosque_id: ID;
  name: string;
  type?: string;
  url?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export type ListResponse<T> = {
  success: boolean;
  data: T[];
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
};

export type ItemResponse<T> = {
  success: boolean;
  data: T;
};
