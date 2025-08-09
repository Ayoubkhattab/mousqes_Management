import type { ID, User } from "@/features/shared/types";
import type { ListParams } from "@/lib/crud/types";
import { createCrudApi } from "@/lib/crud/http";

export type CreateUserDto = {
  username: string;
  password: string;
  name: string;
  role: string; // "branch_manager" | "supervisor" | ...
  branch_id?: ID; // required for certain roles
};

export type UpdateUserDto = {
  username?: string; //
  name?: string;
  password?: string;
  role?: string;
  is_active?: 0 | 1 | boolean | "0" | "1";
  branch_id?: ID;
};

/** convert ui filters to backend parameter (filter[name], sort, page...) */
function mapListParams(p?: ListParams) {
  const out: Record<string, any> = {};
  if (!p) return out;

  if (p.page !== undefined) out.page = p.page;
  if (p.pageSize !== undefined) out.pageSize = p.pageSize;
  if (p.sort) out.sort = p.sort;
  if (p.filters?.name) out["filter[name]"] = p.filters.name;

  return out;
}

export const usersApi = createCrudApi<User, CreateUserDto, UpdateUserDto>({
  basePath: "/dashboard/users",
  mapListParams,
  urlencoded: true, // POST/PUT body urlencoded
});

export async function updateUser(id: ID, payload: UpdateUserDto) {
  const normalized: any = {};
  for (const [k, v] of Object.entries(payload ?? {})) {
    if (v === "" || v === undefined || v === null) continue;
    if (k === "is_active") {
      normalized.is_active = v === true || v === 1 || v === "1" ? 1 : 0;
    } else {
      normalized[k] = v;
    }
  }
}
