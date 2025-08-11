"use client";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/shared/queryKeys";
import { getBranchesList } from "./api";

export function useBranchesList() {
  return useQuery({
    queryKey: queryKeys.branchesList(),
    queryFn: getBranchesList,
    staleTime: 5 * 60 * 1000,
  });
}
