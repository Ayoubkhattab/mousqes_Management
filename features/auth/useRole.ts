import { useAuth } from "@/contexts/AuthContext";
import { ROLES } from "@/lib/auth/type.auth";

export function useRole() {
  const { roleName, isSuperAdmin, hasRole, hasAnyRole } = useAuth();
  return {
    roleName,
    isSuperAdmin,
    isBranchManager: () => hasRole(ROLES.BRANCH_MANAGER),
    isSupervisor: () => hasRole(ROLES.SUPERVISOR),
    isFieldCommittee: () => hasRole(ROLES.FIELD_COMMITTEE),
    hasRole,
    hasAnyRole,
  };
}
