"use client";

import { useQuery } from "@tanstack/react-query";
// import { useBranchesList } from "../branches/hooks";
import { useMemo } from "react";
import { Mosque } from "../mosques/types";
import { listMosques } from "../mosques/api";
import { useBranchesList } from "../branches/hooks";


export function useMosquesListByBranchId(branchId?: number) {
  const { data: branches = [] } = useBranchesList();
  const branchName = useMemo(() => {
    if (!branchId) return undefined;
    return branches.find((b) => Number(b.id) === Number(branchId))?.name;
  }, [branches, branchId]);

  return useQuery({
    queryKey: ["mosques", "list", branchName ?? null],
    queryFn: async () => {
      if (!branchName) return { data: [] as Mosque[], total: 0 };
      return listMosques({
        pageSize: 200,
        filters: { branch_name: branchName },
      });
    },
    enabled: !!branchName,
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
