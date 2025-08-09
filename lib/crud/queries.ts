"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ID, ListParams } from "./types";

export function createCrudQueries<T, CreateDto, UpdateDto>(opts: {
  resourceKey: string; //
  api: {
    list: (
      params?: ListParams
    ) => Promise<{ data: T[]; total?: number; meta?: any }>;
    get: (id: ID) => Promise<T>;
    create: (dto: CreateDto) => Promise<T>;
    update: (id: ID, dto: UpdateDto) => Promise<T>;
    remove: (id: ID) => Promise<any>;
  };
}) {
  const baseKey = [opts.resourceKey] as const;

  function useList(params?: ListParams) {
    return useQuery({
      queryKey: [opts.resourceKey, params],
      queryFn: () => opts.api.list(params),
    });
  }

  function useItem(id?: ID) {
    return useQuery({
      queryKey: [...baseKey, id],
      queryFn: () => opts.api.get(id!),
      enabled: id !== undefined && id !== null,
    });
  }

  function useCreate() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (dto: CreateDto) => opts.api.create(dto),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: baseKey });
      },
    });
  }

  function useUpdate() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, dto }: { id: ID; dto: UpdateDto }) =>
        opts.api.update(id, dto),
      onSuccess: (_data, vars) => {
        qc.invalidateQueries({ queryKey: baseKey });
        qc.invalidateQueries({ queryKey: [...baseKey, vars.id] });
      },
    });
  }

  function useDelete() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: ID) => opts.api.remove(id),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: baseKey });
      },
    });
  }

  return { useList, useItem, useCreate, useUpdate, useDelete };
}
