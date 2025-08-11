"use client";

import { useQuery } from "@tanstack/react-query";
// import { useBranchesList } from "../branches/hooks";
import { useMemo } from "react";
import { listMosques } from "./api";
import { Mosque } from "./types";

export function useMosquesList(branchId?: number) {
  return useQuery({
    queryKey: ["mosques", "list", branchId ?? null],
    queryFn: async () => {
      if (!branchId) return { data: [] as Mosque[], total: 0 };
      return listMosques({ branch_id: branchId, pageSize: 200 });
    },
    enabled: !!branchId,
    staleTime: 1000 * 60 * 10,
  });
}
// export function useBranchesIndex() {
//   const { data, isLoading } = useBranchesList();
//   const map = useMemo(
//     () => new Map((data ?? []).map((b) => [b.id, b.name] as const)),
//     [data]
//   );
//   return { map, isLoading };
// }
