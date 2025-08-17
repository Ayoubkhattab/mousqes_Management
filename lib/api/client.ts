"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { TOKEN_COOKIE, TOKEN_TYPE_COOKIE } from "@/lib/auth/constants";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: false,
  headers: { Accept: "application/json" },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get(TOKEN_COOKIE);
  const type = Cookies.get(TOKEN_TYPE_COOKIE) || "Bearer";
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `${type} ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      Cookies.remove(TOKEN_COOKIE);
      Cookies.remove(TOKEN_TYPE_COOKIE);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// بعد إنشاء instance: export const api = axios.create({...})

// api.interceptors.request.use((config) => {
//   console.log("[API ⇢]", (config.method || "get").toUpperCase(), config.url, {
//     params: config.params,
//     data: config.data,
//   });
//   return config;
// });

api.interceptors.response.use(
  (res) => {
    // console.log("[API ⇠]", res.status, res.config.url, res.data);
    return res;
  },
  (err) => {
    console.log(
      "[API ⇠ ERR]",
      err?.response?.status,
      err?.config?.url,
      err?.response?.data
    );
    return Promise.reject(err);
  }
);
