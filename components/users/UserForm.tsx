// components/users/UserForm.tsx
"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  createUserSchema,
  updateUserSchema,
  rolesOptions,
} from "@/features/users/schemas";
import type {
  CreateUserValues,
  UpdateUserValues,
} from "@/features/users/schemas";
import type { User } from "@/features/shared/types";
import { useBranchesList } from "@/features/branches/hooks";
import { cn } from "@/lib/utils/cn";

type Props = {
  mode: "create" | "edit";
  defaultValues?: Partial<User>;
  onSubmitCreate?: (values: CreateUserValues) => Promise<void>;
  onSubmitUpdate?: (values: UpdateUserValues) => Promise<void>;
  submitLabel?: string;
  formId?: string;
  hideSubmit?: boolean;
};

export default function UserForm(props: Props) {
  return props.mode === "create" ? (
    <CreateForm
      onSubmitCreate={props.onSubmitCreate}
      submitLabel={props.submitLabel}
      formId={props.formId}
      hideSubmit={props.hideSubmit}
    />
  ) : (
    <EditForm
      defaultValues={props.defaultValues}
      onSubmitUpdate={props.onSubmitUpdate}
      submitLabel={props.submitLabel}
      formId={props.formId}
      hideSubmit={props.hideSubmit}
    />
  );
}

/* ------------------------- Create Form ------------------------- */
function CreateForm({
  onSubmitCreate,
  submitLabel,
  formId,
  hideSubmit,
}: {
  onSubmitCreate?: (values: CreateUserValues) => Promise<void>;
  submitLabel?: string;
  formId?: string;
  hideSubmit?: boolean;
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
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Action failed");
    }
  };

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(handleSubmit)}
      className="grid gap-4 md:grid-cols-2"
    >
      <div className="space-y-2">
        <Label htmlFor="username">اسم المستخدم</Label>
        <Input id="username" {...form.register("username")} />
        <p className="text-xs text-red-600">
          {errors.username?.message as any}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">كلمة المرور</Label>
        <Input id="password" {...form.register("password")} />
        <p className="text-xs text-red-600">
          {errors.password?.message as any}
        </p>
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="name">الاسم</Label>
        <Input id="name" {...form.register("name")} />
        <p className="text-xs text-red-600">{errors.name?.message as any}</p>
      </div>

      <div className="flex  w-full p-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">الوظيفة</Label>
          <select
            id="role"
            className={cn(
              "h-10 rounded-lg border border-gray-300 dark:border-gray-600",
              "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
              "px-3 py-2 text-sm focus:outline-none focus:ring-2",
              "focus:ring-blue-500 focus:border-blue-500",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-colors duration-200"
            )}
            {...form.register("role")}
          >
            {rolesOptions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="branch_id">الفرع</Label>
          <select
            id="branch_id"
            {...form.register("branch_id", {
              required: needBranch ? "حقل الفرع مطلوب." : false,
              valueAsNumber: true, // يحوّل القيمة لرقم
            })}
            className={cn(
              "  h-10 rounded-lg border border-gray-300 dark:border-gray-600",
              "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
              "px-3 py-2 text-sm focus:outline-none focus:ring-2",
              "focus:ring-blue-500 focus:border-blue-500",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-colors duration-200"
            )}
          >
            <option value="">
              {needBranch
                ? "Select branch (required)"
                : "Select branch (optional)"}
            </option>
            {branchesLoading ? (
              <option disabled>...تحميل الأفرع</option>
            ) : (
              (branches ?? []).map((b) => (
                <option key={b.id} value={String(b.id)}>
                  {b.name}
                </option>
              ))
            )}
          </select>
          <p className="text-xs text-red-600">
            {errors.branch_id?.message as any}
          </p>
        </div>
      </div>

      {/* {!hideSubmit && (
        <div className="md:col-span-2 pt-2">
          <Button type="submit" className="min-w-32">
            {submitLabel ?? "Create"}
          </Button>
        </div>
      )} */}
    </form>
  );
}

/* ------------------------- Edit Form ------------------------- */
function EditForm({
  defaultValues,
  onSubmitUpdate,
  submitLabel,
  formId,
  hideSubmit,
}: {
  defaultValues?: Partial<User>;
  onSubmitUpdate?: (values: UpdateUserValues) => Promise<void>;
  submitLabel?: string;
  formId?: string;
  hideSubmit?: boolean;
}) {
  const { data: branches, isLoading: branchesLoading } = useBranchesList();
  const hadBranch = !!defaultValues?.branch?.id;

  const form = useForm<UpdateUserValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: (defaultValues?.username as any) ?? "",
      name: defaultValues?.name ?? "",
      password: "",
      role: (defaultValues?.roles?.name as any) ?? undefined,
      branch_id: (defaultValues?.branch?.id as any) ?? undefined,
      is_active: (defaultValues?.is_active as any) ?? true,
    },
  });
  useEffect(() => {
    if (!defaultValues) return;
    form.reset({
      username: (defaultValues?.username as any) ?? "",
      name: defaultValues?.name ?? "",
      password: "",
      role: (defaultValues?.roles?.name as any) ?? undefined,
      branch_id: (defaultValues?.branch?.id as any) ?? undefined,
      is_active: (defaultValues?.is_active as any) ?? true,
    });
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
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Action failed");
    }
  };

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex flex-col"
    >
      <div className="space-y-2">
        <Label htmlFor="username">اسم المستخدم</Label>
        <Input
          id="username"
          placeholder="jdoe"
          {...form.register("username")}
        />
        <p className="text-xs text-red-600">
          {errors.username?.message as any}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">الإسم</Label>
        <Input id="name" placeholder="Full name" {...form.register("name")} />
        <p className="text-xs text-red-600">{errors.name?.message as any}</p>
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="password">كلمة السر </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...form.register("password")}
        />
        <p className="text-xs text-red-600">
          {errors.password?.message as any}
        </p>
      </div>

      <div className="flex  w-full p-4 gap-4    ">
        {/* Status Field */}
        <div className="space-y-2">
          <Label
            htmlFor="is_active"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            الحالة
          </Label>
          <div className="relative">
            <select
              id="is_active"
              className={cn(
                "  h-10 rounded-lg border border-gray-300 dark:border-gray-600",
                "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                "px-3 py-2 text-sm focus:outline-none focus:ring-2",
                "focus:ring-blue-500 focus:border-blue-500",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-colors duration-200"
              )}
              {...form.register("is_active", { valueAsNumber: true })}
            >
              <option value={1}>نشط</option>
              <option value={0}>غير نشط</option>
            </select>
          </div>
          {errors.is_active && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">
              {errors.is_active.message as string}
            </p>
          )}
        </div>

        {/* Role Field */}
        <div className="space-y-2">
          <Label
            htmlFor="role"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            الدور
          </Label>
          <div className="relative">
            <select
              id="role"
              className={cn(
                "  h-10 rounded-lg border border-gray-300 dark:border-gray-600",
                "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                "px-3 py-2 text-sm focus:outline-none focus:ring-2",
                "focus:ring-blue-500 focus:border-blue-500",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-colors duration-200"
              )}
              {...form.register("role")}
            >
              {rolesOptions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          {errors.role && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">
              {errors.role.message as string}
            </p>
          )}
        </div>

        {/* Branch Field */}
        <div className="space-y-2">
          <Label
            htmlFor="branch_id"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            الفرع
          </Label>
          <div className="relative">
            <select
              id="branch_id"
              disabled={hadBranch}
              className={cn(
                "  h-10 rounded-lg border border-gray-300 dark:border-gray-600",
                "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                "px-3 py-2 text-sm focus:outline-none focus:ring-2",
                "focus:ring-blue-500 focus:border-blue-500",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-colors duration-200"
              )}
              {...form.register("branch_id")}
            >
              <option value="">
                {needBranch ? "اختر الفرع (مطلوب)" : "اختر الفرع (اختياري)"}
              </option>
              {branchesLoading ? (
                <option disabled>جاري تحميل الفروع...</option>
              ) : (
                (branches ?? []).map((b) => (
                  <option key={b.id} value={String(b.id)}>
                    {b.name}
                  </option>
                ))
              )}
            </select>
          </div>
          {hadBranch && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              لا يمكن تغيير الفرع لمستخدم مرتبط بفرع.
            </p>
          )}
          {errors.branch_id && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">
              {errors.branch_id.message as string}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
