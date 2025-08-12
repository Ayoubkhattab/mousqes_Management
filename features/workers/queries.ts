// /features/workers/queries.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getWorkers,
  getWorker,
  createWorker,
  updateWorker,
  deleteWorker,
  getWorkersEnums,
  getMosquesByBranchName,
} from "./api";
import type {
  ID,
  Worker,
  WorkerCreateDTO,
  WorkerUpdateDTO,
  ApiList,
} from "./types";

export function useWorkers(params: Parameters<typeof getWorkers>[0]) {
  return useQuery({
    queryKey: ["workers", params],
    queryFn: () => getWorkers(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useWorker(id?: ID) {
  return useQuery({
    queryKey: ["workers", "one", id ?? null],
    queryFn: () => getWorker(id!),
    enabled: !!id,
  });
}

export function useCreateWorker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: WorkerCreateDTO) => createWorker(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workers"] }),
  });
}

export function useUpdateWorker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: ID; dto: WorkerUpdateDTO }) =>
      updateWorker(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workers"] }),
  });
}

export function useDeleteWorker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: ID) => deleteWorker(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workers"] }),
  });
}

export function useWorkersEnums() {
  return useQuery({
    queryKey: ["workers", "enums"],
    queryFn: getWorkersEnums,
    staleTime: 10 * 60 * 1000,
  });
}

export function useMosquesByBranchName(branchName?: string) {
  return useQuery({
    queryKey: ["mosques", "by-branch", branchName ?? null],
    queryFn: () => getMosquesByBranchName(branchName!),
    enabled: !!branchName,
    staleTime: 10 * 60 * 1000,
  });
}

export function useMosquesByBranch(branchName?: string) {
  return useQuery({
    queryKey: ["mosques", "by-branch", branchName ?? null],
    queryFn: () => getMosquesByBranchName(branchName!),
    enabled: !!branchName,
    staleTime: 10 * 60 * 1000,
  });
}
// useMosquesByBranch
