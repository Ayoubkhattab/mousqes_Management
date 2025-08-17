export type RoleName =
  | "system_administrator"
  | "branch_manager"
  | "supervisor"
  | "field_committee";

export const ROLES = {
  SYS_ADMIN: "system_administrator" as RoleName,
  BRANCH_MANAGER: "branch_manager" as RoleName,
  SUPERVISOR: "supervisor" as RoleName,
  FIELD_COMMITTEE: "field_committee" as RoleName,
} as const;
