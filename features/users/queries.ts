"use client";

import { createCrudQueries } from "@/lib/crud/queries";
import { usersApi } from "./api";
import type { CreateUserDto, UpdateUserDto } from "./api";

export const usersQueries = createCrudQueries<
  unknown,
  CreateUserDto,
  UpdateUserDto
>({
  resourceKey: "users",
  api: usersApi,
});

// export hooks
export const {
  useList: useUsers,
  useItem: useUser,
  useCreate: useCreateUser,
  useUpdate: useUpdateUser,
  useDelete: useDeleteUser,
} = usersQueries;
