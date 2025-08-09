"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  rolesOptions,
  createUserSchema,
  updateUserSchema,
  type CreateUserValues,
  type UpdateUserValues,
} from "@/features/users/schemas";
import { useBranchesList } from "@/features/branches/hooks";
import type { User } from "@/features/shared/types";

type CreateFormProps = {
  onSubmitCreate?: (values: CreateUserValues) => Promise<void>;
  submitLabel?: string;
};

type EditFormProps = {
  defaultValues?: Partial<User>;
  onSubmitUpdate?: (values: UpdateUserValues) => Promise<void>;
  submitLabel?: string;
};

type Props =
  | ({ mode: "create" } & CreateFormProps)
  | ({ mode: "edit" } & EditFormProps);

export default function UserForm(props: Props) {
  if (props.mode === "create") {
    return (
      <CreateForm
        onSubmitCreate={props.onSubmitCreate}
        submitLabel={props.submitLabel}
      />
    );
  }
  return (
    <EditForm
      defaultValues={props.defaultValues}
      onSubmitUpdate={props.onSubmitUpdate}
      submitLabel={props.submitLabel}
    />
  );
}

function CreateForm({
  onSubmitCreate,
  submitLabel,
}: {
  onSubmitCreate?: (values: CreateUserValues) => Promise<void>;
  submitLabel?: string;
}) {
  const { data: branches, isLoading: branchesLoading } = useBranchesList();

  const form = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      role: rolesOptions[0].value,
      branch_id: undefined,
    },
  });

  const errors = form.formState.errors;

  const role = form.watch("role") || "";
  const needBranch = ["branch_manager", "field_committee"].includes(role);

  const handleSubmit = async (values: CreateUserValues) => {
    try {
      await onSubmitCreate?.(values);
      toast.success("User created");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Action failed");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          {...form.register("username")}
          placeholder="jdoe"
        />
        <p className="text-sm text-red-600">{errors.username?.message}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...form.register("password")}
          placeholder="••••••••"
        />
        <p className="text-sm text-red-600">{errors.password?.message}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...form.register("name")} placeholder="Full name" />
        <p className="text-sm text-red-600">{errors.name?.message}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          className="h-10 rounded-2xl border px-3 text-sm"
          {...form.register("role")}
        >
          {rolesOptions.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <p className="text-sm text-red-600">{errors.role?.message}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="branch_id">Branch</Label>
        <select
          id="branch_id"
          className="h-10 rounded-2xl border px-3 text-sm"
          {...form.register("branch_id")}
        >
          <option value="">
            {needBranch
              ? "Select branch (required)"
              : "Select branch (optional)"}
          </option>
          {branchesLoading ? (
            <option disabled>Loading branches...</option>
          ) : (
            (branches ?? []).map((b) => (
              <option key={b.id} value={String(b.id)}>
                {b.name}
              </option>
            ))
          )}
        </select>
        <p className="text-sm text-red-600">{errors.branch_id?.message}</p>
      </div>

      <div className="pt-2">
        <Button type="submit" className="min-w-32">
          {submitLabel ?? "Create"}
        </Button>
      </div>
    </form>
  );
}

/* ---------------------------- Edit Form ---------------------------- */
function EditForm({
  defaultValues,
  onSubmitUpdate,
  submitLabel,
}: {
  defaultValues?: Partial<User>;
  onSubmitUpdate?: (values: UpdateUserValues) => Promise<void>;
  submitLabel?: string;
}) {
  const { data: branches, isLoading: branchesLoading } = useBranchesList();
  const hadBranch = !!defaultValues?.branch?.id;

  const form = useForm<UpdateUserValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: (defaultValues?.username as any) ?? "", // ⬅️ جديد
      name: defaultValues?.name ?? "",
      password: "",
      role: (defaultValues?.roles?.name as any) ?? undefined,
      branch_id: (defaultValues?.branch?.id as any) ?? undefined,
      is_active: (defaultValues?.is_active as any) ?? true,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        username: (defaultValues?.username as any) ?? "", // ⬅️ جديد
        name: defaultValues?.name ?? "",
        password: "",
        role: (defaultValues?.roles?.name as any) ?? undefined,
        branch_id: (defaultValues?.branch?.id as any) ?? undefined,
        is_active: (defaultValues?.is_active as any) ?? true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const errors = form.formState.errors;

  const role = form.watch("role") || "";
  const needBranch = ["branch_manager", "field_committee"].includes(role);

  const handleSubmit = async (values: UpdateUserValues) => {
    try {
      const cleaned = Object.fromEntries(
        Object.entries(values).filter(
          ([, v]) => v !== "" && v !== undefined && v !== null
        )
      ) as UpdateUserValues;

      if (hadBranch) delete (cleaned as any).branch_id;

      await onSubmitUpdate?.(cleaned);
      toast.success("User updated");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Action failed");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          {...form.register("username")}
          placeholder="jdoe"
        />
        <p className="text-sm text-red-600">{errors.username?.message}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...form.register("name")} placeholder="Full name" />
        <p className="text-sm text-red-600">{errors.name?.message}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">New Password (optional)</Label>
        <Input
          id="password"
          type="password"
          {...form.register("password")}
          placeholder="••••••••"
        />
        <p className="text-sm text-red-600">{errors.password?.message}</p>
      </div>

      <div className="space-y-2">
        <select
          id="is_active"
          className="h-10 rounded-2xl border px-3 text-sm"
          {...form.register("is_active", { valueAsNumber: true })}
        >
          <option value={1}>نشط</option>
          <option value={0}>غير نشط</option>
        </select>

        <p className="text-sm text-red-600">{errors.is_active?.message}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          className="h-10 rounded-2xl border px-3 text-sm"
          {...form.register("role")}
        >
          {rolesOptions.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <p className="text-sm text-red-600">{errors.role?.message}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="branch_id">Branch</Label>
        <select
          id="branch_id"
          disabled={hadBranch}
          className="h-10 rounded-2xl border px-3 text-sm"
          {...form.register("branch_id")}
        >
          <option value="">
            {needBranch
              ? "Select branch (required)"
              : "Select branch (optional)"}
          </option>
          {branchesLoading ? (
            <option disabled>Loading branches...</option>
          ) : (
            (branches ?? []).map((b) => (
              <option key={b.id} value={String(b.id)}>
                {b.name}
              </option>
            ))
          )}
        </select>
        <p className="text-sm text-red-600">{errors.branch_id?.message}</p>
      </div>

      <div className="pt-2">
        <Button type="submit" className="min-w-32">
          {submitLabel ?? "Save"}
        </Button>
      </div>
    </form>
  );
}
