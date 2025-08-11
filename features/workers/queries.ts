"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listWorkers,
  getWorker,
  createWorker,
  updateWorker,
  deleteWorker,
  getJobTitles,
  getJobStatus,
  getQuranLevels,
  getSponsorshipTypes,
  getEducationalLevel,
  type WorkerListParams,
} from "./api";

export function useWorkers(params: WorkerListParams) {
  return useQuery({
    queryKey: ["workers", params],
    queryFn: () => listWorkers(params),
  });
}

export function useCreateWorker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createWorker,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workers"] }),
  });
}

export function useUpdateWorker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: number;
      dto: Parameters<typeof updateWorker>[1];
    }) => updateWorker(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workers"] }),
  });
}

export function useWorkersEnums() {
  return useQuery({
    queryKey: ["workers", "enums"],
    queryFn: async () => {
      const [
        jobTitles,
        jobStatuses,
        quranLevels,
        sponsorshipTypes,
        educationalLevels,
      ] = await Promise.all([
        getJobTitles(),
        getJobStatus(),
        getQuranLevels(),
        getSponsorshipTypes(),
        getEducationalLevel(),
      ]);
      return {
        jobTitles,
        jobStatuses,
        quranLevels,
        sponsorshipTypes,
        educationalLevels,
      };
    },
    staleTime: 1000 * 60 * 60,
  });
}
