import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listDistricts,
  getDistrict,
  createDistrict,
  updateDistrict,
  deleteDistrict,
  type DistrictListParams,
} from "./api";

export function useDistricts(params: DistrictListParams) {
  return useQuery({
    queryKey: ["districts", params],
    queryFn: () => listDistricts(params),
  });
}

export function useDistrict(id?: number) {
  return useQuery({
    queryKey: ["districts", "detail", id],
    queryFn: () => getDistrict(id!),
    enabled: !!id,
  });
}

export function useCreateDistrict() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createDistrict,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["districts"] });
    },
  });
}

export function useUpdateDistrict() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: number;
      dto: Parameters<typeof updateDistrict>[1];
    }) => updateDistrict(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["districts"] });
    },
  });
}

export function useDeleteDistrict() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteDistrict,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["districts"] });
    },
  });
}
