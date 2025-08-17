"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { api } from "@/lib/api/client";
import { TOKEN_COOKIE, TOKEN_TYPE_COOKIE } from "@/lib/auth/constants";
import { RoleName } from "@/lib/auth/type.auth";

type AuthContextType = {
  loading: boolean;
  user: User | null;
  roleName: RoleName | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (r: RoleName) => boolean;
  hasAnyRole: (rs: RoleName[]) => boolean;
  isSuperAdmin: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function extractRoleName(u: User | null): RoleName | null {
  if (!u?.roles) return null;
  // أوسع معالجة لأن الشكل قد يختلف:
  // 1) كائن واحد { name }
  if (
    !Array.isArray(u.roles) &&
    typeof u.roles === "object" &&
    "name" in u.roles
  ) {
    return (u.roles as any).name as RoleName;
  }
  // 2) مصفوفة كائنات [{ name }]
  if (Array.isArray(u.roles) && u.roles.length && "name" in u.roles[0]) {
    return (u.roles[0] as any).name as RoleName;
  }
  // 3) fallback
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("auth_user");
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });

  const roleName = useMemo(() => extractRoleName(user), [user]);

  // لو عندك /auth/me يفضّل جلبه هنا عند وجود توكن
  useEffect(() => {
    const token = Cookies.get(TOKEN_COOKIE);
    const type = Cookies.get(TOKEN_TYPE_COOKIE) || "Bearer";
    if (token) {
      api.defaults.headers.common.Authorization = `${type} ${token}`;
    }
  }, []);

  const persistUser = (u: User | null) => {
    setUser(u);
    try {
      if (u) localStorage.setItem("auth_user", JSON.stringify(u));
      else localStorage.removeItem("auth_user");
    } catch {}
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post<LoginResponse>("/auth/login", {
        username,
        password,
      });
      const token = res.data?.data?.auth?.accessToken;
      const tokenType = res.data?.data?.auth?.tokenType || "Bearer";
      if (!token) throw new Error("لم يستلم التوكن من الخادم");

      Cookies.set(TOKEN_COOKIE, token, { sameSite: "lax", path: "/" });
      Cookies.set(TOKEN_TYPE_COOKIE, tokenType, { sameSite: "lax", path: "/" });
      api.defaults.headers.common.Authorization = `${tokenType} ${token}`;

      // ابنِ كائن المستخدم من الاستجابة لحفظه محليًا
      const u: User = {
        id: res.data.data.id,
        name: res.data.data.name,
        username: res.data.data.username,
        is_active: res.data.data.is_active,
        roles: res.data.data.roles, // {id,name}
        branch_id: res.data.data.branch_id ?? null,
        branch_name: res.data.data.branch_name ?? null,
      };
      persistUser(u);

      toast.success("تم تسجيل الدخول");
      window.location.href = "/dashboard";
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "فشل تسجيل الدخول";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      Cookies.remove(TOKEN_COOKIE);
      Cookies.remove(TOKEN_TYPE_COOKIE);
      persistUser(null);
      toast.success("تم تسجيل الخروج");
      window.location.href = "/login";
    } catch {}
  };

  const hasRole = (r: RoleName) => roleName === r;
  const hasAnyRole = (rs: RoleName[]) =>
    roleName ? rs.includes(roleName) : false;
  const isSuperAdmin = () => roleName === "system_administrator";

  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        roleName,
        login,
        logout,
        hasRole,
        hasAnyRole,
        isSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export type UserRoleObject = { id: number; name: RoleName };

export type User = {
  id: number;
  name: string;
  username: string;
  is_active: boolean;
  roles?: UserRoleObject | UserRoleObject[] | { name: string } | null;
  branch_id?: number | null;
  branch_name?: string | null;
};

export type LoginResponse = {
  success: boolean;
  data: {
    id: number;
    name: string;
    username: string;
    is_active: boolean;
    roles: UserRoleObject;
    auth: {
      accessToken: string;
      tokenType: string;
    };
    branch_id?: number | null;
    branch_name?: string | null;
  };
};
