"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  createDistrictSchema,
  updateDistrictSchema,
  type CreateDistrictValues,
  type UpdateDistrictValues,
} from "@/features/districts/schemas";
import type { District } from "@/features/districts/types";
import { useBranchesList } from "@/features/branches/hooks";
import { cn } from "@/lib/utils/cn";

type Props = {
  mode: "create" | "edit";
  defaultValues?: Partial<District>;
  onSubmitCreate?: (v: CreateDistrictValues) => Promise<void>;
  onSubmitUpdate?: (v: UpdateDistrictValues) => Promise<void>;
  submitLabel?: string;
  formId?: string;
  hideSubmit?: boolean;
  className?: string;
};

export default function DistrictForm(props: Props) {
  return props.mode === "create" ? (
    <CreateForm {...props} />
  ) : (
    <EditForm {...props} />
  );
}

function CreateForm({
  onSubmitCreate,
  submitLabel,
  formId,
  hideSubmit,
  className,
}: Props) {
  const { data: branches, isLoading } = useBranchesList();
  const form = useForm<CreateDistrictValues>({
    resolver: zodResolver(createDistrictSchema),
    defaultValues: { name: "", branch_id: undefined, code: "" },
  });
  const errors = form.formState.errors;

  const handleSubmit = async (values: CreateDistrictValues) => {
    try {
      await onSubmitCreate?.(values);
    } catch (e: any) {
      const msg =
        e?.response?.data?.details?.name?.[0] ||
        e?.response?.data?.message ||
        "فشل العملية";
      toast.error(msg);
    }
  };

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(handleSubmit)}
      className={cn("space-y-6", className)}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
              اسم المنطقة
            </Label>
            <Input
              id="name"
              placeholder="أدخل اسم المنطقة"
              className={cn(
                "w-full rounded-lg border-gray-300 dark:border-gray-600",
                "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                errors.name && "border-red-500 dark:border-red-400"
              )}
              {...form.register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500 dark:text-red-400">
                {errors.name.message as string}
              </p>
            )}
          </div>

          {/* حقل الفرع */}
          <div className="space-y-2">
            <Label
              htmlFor="branch_id"
              className="text-gray-700 dark:text-gray-300"
            >
              الفرع
            </Label>
            <select
              id="branch_id"
              className={cn(
                "w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600",
                "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                "px-3 py-2 text-sm focus:outline-none focus:ring-2",
                "focus:ring-blue-500 focus:border-blue-500",
                errors.branch_id && "border-red-500 dark:border-red-400",
                "transition-colors duration-200"
              )}
              {...form.register("branch_id")}
            >
              <option value="">اختر الفرع</option>
              {isLoading ? (
                <option disabled>جاري التحميل...</option>
              ) : (
                (branches ?? []).map((b) => (
                  <option key={b.id} value={String(b.id)}>
                    {b.name}
                  </option>
                ))
              )}
            </select>
            {errors.branch_id && (
              <p className="text-xs text-red-500 dark:text-red-400">
                {errors.branch_id.message as string}
              </p>
            )}
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="code" className="text-gray-700 dark:text-gray-300">
              الكود (اختياري)
            </Label>
            <Input
              id="code"
              placeholder="أدخل كود المنطقة"
              className={cn(
                "w-full rounded-lg border-gray-300 dark:border-gray-600",
                "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              )}
              {...form.register("code")}
            />
            {errors.code && (
              <p className="text-xs text-red-500 dark:text-red-400">
                {errors.code.message as string}
              </p>
            )}
          </div>
        </div>
      </div>

      {!hideSubmit && (
        <div className="flex justify-end pt-4">
          <Button type="submit" className="min-w-32">
            {submitLabel ?? "إنشاء"}
          </Button>
        </div>
      )}
    </form>
  );
}

function EditForm({
  defaultValues,
  onSubmitUpdate,
  submitLabel,
  formId,
  hideSubmit,
  className,
}: Props) {
  const { data: branches, isLoading } = useBranchesList();
  const form = useForm<UpdateDistrictValues>({
    resolver: zodResolver(updateDistrictSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      branch_id: defaultValues?.branch_id as any,
      code: defaultValues?.code ?? "",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        name: defaultValues.name ?? "",
        branch_id: defaultValues.branch_id as any,
        code: defaultValues.code ?? "",
      });
    }
  }, [defaultValues, form]);

  const errors = form.formState.errors;

  const handleSubmit = async (values: UpdateDistrictValues) => {
    try {
      const cleaned = Object.fromEntries(
        Object.entries(values).filter(
          ([, v]) => v !== "" && v !== undefined && v !== null
        )
      ) as UpdateDistrictValues;
      await onSubmitUpdate?.(cleaned);
    } catch (e: any) {
      const msg =
        e?.response?.data?.details?.name?.[0] ||
        e?.response?.data?.message ||
        "فشل العملية";
      toast.error(msg);
    }
  };

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(handleSubmit)}
      className={cn("space-y-6", className)}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
              اسم المنطقة
            </Label>
            <Input
              id="name"
              placeholder="أدخل اسم المنطقة"
              className={cn(
                "w-full rounded-lg border-gray-300 dark:border-gray-600",
                "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                errors.name && "border-red-500 dark:border-red-400"
              )}
              {...form.register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500 dark:text-red-400">
                {errors.name.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="branch_id"
              className="text-gray-700 dark:text-gray-300"
            >
              الفرع
            </Label>
            <select
              id="branch_id"
              className={cn(
                "w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600",
                "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                "px-3 py-2 text-sm focus:outline-none focus:ring-2",
                "focus:ring-blue-500 focus:border-blue-500",
                errors.branch_id && "border-red-500 dark:border-red-400",
                "transition-colors duration-200"
              )}
              {...form.register("branch_id")}
            >
              <option value="">بدون تغيير</option>
              {isLoading ? (
                <option disabled>جاري التحميل...</option>
              ) : (
                (branches ?? []).map((b) => (
                  <option key={b.id} value={String(b.id)}>
                    {b.name}
                  </option>
                ))
              )}
            </select>
            {errors.branch_id && (
              <p className="text-xs text-red-500 dark:text-red-400">
                {errors.branch_id.message as string}
              </p>
            )}
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="code" className="text-gray-700 dark:text-gray-300">
              الكود (اختياري)
            </Label>
            <Input
              id="code"
              placeholder="أدخل كود المنطقة"
              className={cn(
                "w-full rounded-lg border-gray-300 dark:border-gray-600",
                "focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              )}
              {...form.register("code")}
            />
            {errors.code && (
              <p className="text-xs text-red-500 dark:text-red-400">
                {errors.code.message as string}
              </p>
            )}
          </div>
        </div>
      </div>

      {!hideSubmit && (
        <div className="flex justify-end pt-4">
          <Button type="submit" className="min-w-32">
            {submitLabel ?? "حفظ"}
          </Button>
        </div>
      )}
    </form>
  );
}
