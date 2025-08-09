import { z } from "zod";

export const rolesOptions = [
  { value: "system_administrator", label: "System Administrator" },
  { value: "supervisor", label: "Supervisor" },
  { value: "branch_manager", label: "Branch Manager" },
  { value: "field_committee", label: "Field Committee" },
] as const;

const roleEnum = z.enum(
  rolesOptions.map((r) => r.value) as [string, ...string[]]
);

export const createUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  name: z.string().min(2),
  role: roleEnum,
  branch_id: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => {
      if (v === "" || v === undefined || v === null) return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    }),
});

export const updateUserSchema = z.object({
  username: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().min(3).optional()
  ),
  name: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().min(2).optional()
  ),
  password: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().min(6).optional()
  ),
  role: z.preprocess((v) => (v === "" ? undefined : v), roleEnum.optional()),
  is_active: z.preprocess(
    (v) => (v === "1" ? 1 : v === "0" ? 0 : v),
    z.union([z.boolean(), z.number()]).optional()
  ),
  branch_id: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => {
      if (v === "" || v === undefined || v === null) return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    }),
});

export type CreateUserValues = z.infer<typeof createUserSchema>;
export type UpdateUserValues = z.infer<typeof updateUserSchema>;
