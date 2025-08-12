"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMosqueCurrentStatus,
  getMosqueEnums,
  // getMosquesByBranchName,
} from "./api";
import {
  createMosque,
  deleteMosque,
  getMosque,
  listMosques,
  updateMosque,
} from "./api";
import type { MosquesQuery } from "./api";
import { MosqueEnumParams } from "./types";
import { endpoints } from "@/lib/api/endpoints";
import { api } from "@/lib/api/client";

export function useMosqueEnums(params?: {
  branch_id?: number | string;
  district_id?: number | string;
  name?: string;
}) {
  return useQuery({
    queryKey: [
      "mosques",
      "enums",
      "current-status",
      params?.branch_id ?? null,
      params?.district_id ?? null,
      params?.name ?? null,
    ],
    queryFn: () => getMosqueEnums(params),
    staleTime: 10 * 60 * 1000,
  });
}

export function useMosqueCurrentStatus(params?: MosqueEnumParams) {
  return useQuery({
    queryKey: [
      "mosques",
      "enums",
      "current-status",
      params?.branch_id ?? null,
      params?.district_id ?? null,
      params?.name ?? null,
    ],
    queryFn: () => getMosqueCurrentStatus(params),
    staleTime: 10 * 60 * 1000,
  });
}

export function useMosqueTypes(p?: {
  branch_id?: number | string;
  district_id?: number | string;
  name?: string;
}) {
  const q = useMosqueEnums(p);
  return { ...q, data: q.data?.types ?? [] };
}
export function useMosqueCategories(p?: {
  branch_id?: number | string;
  district_id?: number | string;
  name?: string;
}) {
  const q = useMosqueEnums(p);
  return { ...q, data: q.data?.category ?? [] };
}

// export function useMosqueCurrentStatus(p?: {
//   branch_id?: number | string;
//   district_id?: number | string;
//   name?: string;
// }) {
//   const q = useMosqueEnums(p);
//   return { ...q, data: q.data?.currentStatus ?? [] };
// }

export function useMosqueTechnicalStatus(p?: {
  branch_id?: number | string;
  district_id?: number | string;
  name?: string;
}) {
  const q = useMosqueEnums(p);
  return { ...q, data: q.data?.technicalStatus ?? [] };
}
export function useMosqueDemolitionPercentage() {
  const q = useMosqueEnums();
  return { ...q, data: q.data?.demolitionPercentage ?? [] };
}
export function useMosqueDestructionStatus() {
  const q = useMosqueEnums();
  return { ...q, data: q.data?.destructionStatus ?? [] };
}
export function useMosqueAttachments() {
  const q = useMosqueEnums();
  return { ...q, data: q.data?.attachments ?? [] };
}

export function useMosques(q: MosquesQuery) {
  return useQuery({
    queryKey: ["mosques", q],
    queryFn: () => listMosques(q),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMosque(id?: number | string) {
  return useQuery({
    queryKey: ["mosque", id],
    queryFn: () => getMosque(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateMosque() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createMosque,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mosques"] });
    },
  });
}

export function useUpdateMosque() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: number;
      dto: Parameters<typeof updateMosque>[1];
    }) => updateMosque(id, dto),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["mosques"] });
      qc.invalidateQueries({ queryKey: ["mosque", vars.id] });
    },
  });
}

export function useDeleteMosque() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteMosque,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mosques"] });
    },
  });
}
export function useMosquesByBranchName(branchName?: string) {
  return useQuery({
    queryKey: ["mosques", "by-branch", branchName ?? null],
    enabled: !!branchName,
    retry: false,
    staleTime: 10 * 60 * 1000,
    queryFn: async () => {
      console.log("[HOOK] fetching mosques for branch:", branchName);
      const { data } = await api.get(endpoints.mosques, {
        params: { "filter[branch.name]": branchName, pageSize: 1000 },
      });
      const list = (data?.data ?? []).map((m: any) => ({
        id: m.id,
        name: m.name,
      }));
      console.log("[HOOK] mosques result:", list.length);
      return list;
    },
  });
}
