"use client";

import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { api } from "@/lib/api/client";
import { TOKEN_COOKIE, TOKEN_TYPE_COOKIE } from "@/lib/auth/constants";

type AuthContextType = {
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { username, password });

      const token: string | undefined = res.data?.data?.auth?.accessToken;
      const tokenType: string = res.data?.data?.auth?.tokenType || "Bearer";

      if (!token) {
        throw new Error("لم يستلم التوكن من الخادم");
      }

      Cookies.set(TOKEN_COOKIE, token, { sameSite: "lax", path: "/" });
      Cookies.set(TOKEN_TYPE_COOKIE, tokenType, { sameSite: "lax", path: "/" });

      toast.success("تم تسجيل الدخول");
      window.location.href = "/dashboard";
    } catch (e: any) {
      console.log("e", e);
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
      toast.success("تم تسجيل الخروج");
      window.location.href = "/login";
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
