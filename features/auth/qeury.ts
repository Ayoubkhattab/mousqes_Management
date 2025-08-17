import { api } from "@/lib/api/client";
import { useQuery } from "@tanstack/react-query";

export type RoleName =
  | "system_administrator"
  | "supervisor"
  | "branch_manager"
  | "field_committee";
export type Me = {
  id: number;
  name: string;
  roles?: { name?: RoleName } | null;
  branch?: { id: number; name: string } | null;
};

export function useAuthUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async (): Promise<Me> => {
      const { data } = await api.get("/dashboard/me");
      return data?.data as Me;
    },
    staleTime: 5 * 60 * 1000,
  });
}
