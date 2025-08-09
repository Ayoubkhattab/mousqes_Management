import { api } from "@/lib/api/client";
import type { ID, ListParams, ListResult, BackendList } from "./types";

export type ParamMapper = (p?: ListParams) => Record<string, any>;

/** convert Body to x-www-form-urlencoded if he need*/
function toUrlEncoded(data: Record<string, any>) {
  const params = new URLSearchParams();
  Object.entries(data || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    params.append(k, String(v));
  });
  return params;
}

export function createCrudApi<T, CreateDto, UpdateDto>(opts: {
  basePath: string; // ex: "/dashboard/users"
  mapListParams?: ParamMapper; // convert ListParams -> query params
  urlencoded?: boolean; // make POST/PUT urlencoded
}) {
  const map = opts.mapListParams ?? ((p?: ListParams) => ({ ...(p || {}) }));

  return {
    async list(params?: ListParams): Promise<ListResult<T>> {
      const q = map(params);
      const { data } = await api.get<BackendList<T>>(opts.basePath, {
        params: q,
      });
      return { data: data.data, total: data.meta?.total, meta: data.meta };
    },
    async get(id: ID): Promise<T> {
      const { data } = await api.get<{ success: boolean; data: T }>(
        `${opts.basePath}/${id}`
      );
      return data.data;
    },
    async create(payload: CreateDto): Promise<T> {
      const body = opts.urlencoded
        ? toUrlEncoded(payload as any)
        : (payload as any);
      const headers = opts.urlencoded
        ? { "Content-Type": "application/x-www-form-urlencoded" }
        : { "Content-Type": "application/json" };
      const { data } = await api.post<{ success: boolean; data: T }>(
        opts.basePath,
        body,
        { headers }
      );
      return data.data;
    },
    async update(id: ID, payload: UpdateDto): Promise<T> {
      // normalize is_active boolean -> 0/1 إن وجد
      const normalized: any = { ...(payload as any) };
      if (typeof normalized.is_active === "boolean") {
        normalized.is_active = normalized.is_active ? 1 : 0;
      }

      const body = opts.urlencoded ? toUrlEncoded(normalized) : normalized;
      const headers = opts.urlencoded
        ? { "Content-Type": "application/x-www-form-urlencoded" }
        : { "Content-Type": "application/json" };
      const { data } = await api.put<{ success: boolean; data: T }>(
        `${opts.basePath}/${id}`,
        body,
        { headers }
      );
      return data.data;
    },
    async remove(id: ID) {
      const { data } = await api.delete<{
        success: boolean;
        data?: { id: ID };
      }>(`${opts.basePath}/${id}`);
      return data;
    },
  };
}
