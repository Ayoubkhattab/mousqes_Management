"use client";

import { useAuth } from "@/contexts/AuthContext";
import { RoleName } from "@/lib/auth/type.auth";
import { ReactNode } from "react";

type Props = {
  only?: RoleName | RoleName[];
  not?: RoleName | RoleName[];
  // ماذا يُعرض إن لم تتوفر الصلاحية
  fallback?: ReactNode | null;
  children: ReactNode;
};

export default function Can({ only, not, fallback = null, children }: Props) {
  const { roleName } = useAuth();

  if (!roleName) return <>{fallback}</>;

  const list = (v?: RoleName | RoleName[]) =>
    (Array.isArray(v) ? v : v ? [v] : []) as RoleName[];

  const onlyList = list(only);
  const notList = list(not);

  if (onlyList.length && !onlyList.includes(roleName)) return <>{fallback}</>;

  if (notList.length && notList.includes(roleName)) return <>{fallback}</>;

  return <>{children}</>;
}
