 "use client";
import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { RoleName } from "@/lib/auth/type.auth";

const CAN_CHOOSE_ROLES: RoleName[] = ["system_administrator"];

export function useBranchScope() {
  const { roleName, user } = useAuth();
  const canChooseBranch = !!roleName && CAN_CHOOSE_ROLES.includes(roleName);

  const forcedBranchId   = canChooseBranch ? undefined : (user?.branch_id ?? undefined);
  const forcedBranchName = canChooseBranch ? undefined : (user?.branch_name ?? undefined);

  return { canChooseBranch, forcedBranchId, forcedBranchName, user };
}
