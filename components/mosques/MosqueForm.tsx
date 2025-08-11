"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  createMosqueSchema,
  updateMosqueSchema,
  type CreateMosqueValues,
  type UpdateMosqueValues,
} from "@/features/mosques/schemas";
import type { Mosque } from "@/features/mosques/types";
import { useMosqueEnums } from "@/features/mosques/queries";
import { useDistrictsByBranch } from "@/features/districts/queries";
import { useBranchesList } from "@/features/branches/hooks";
import { cn } from "@/lib/utils";

type Props = {
  mode: "create" | "edit";
  defaultValues?: Partial<Mosque>;
  onSubmitCreate?: (v: CreateMosqueValues) => Promise<void>;
  onSubmitUpdate?: (v: UpdateMosqueValues) => Promise<void>;
  submitLabel?: string;
  formId?: string;
  hideSubmit?: boolean;
};

export default function MosqueForm(props: Props) {
  return props.mode === "create" ? (
    <CreateForm {...props} />
  ) : (
    <EditForm {...props} />
  );
}

function SelectBase(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={
        "h-10 rounded-2xl border border-input bg-card text-foreground px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background " +
        (props.className ?? "")
      }
    />
  );
}

/* ------------------------- Create ------------------------- */
function CreateForm({
  onSubmitCreate,
  submitLabel,
  formId,
  hideSubmit,
  defaultValues,
}: Props) {
  const { data: branches, isLoading: branchesLoading } = useBranchesList();

  // branch name needed for districts API

  const branchesById = useMemo(() => {
    const map = new Map<number, string>();
    (branches ?? []).forEach((b) =>
      map.set(Number(b.id as any), String(b.name))
    );
    return map;
  }, [branches]);

  const form = useForm<CreateMosqueValues>({
    resolver: zodResolver(createMosqueSchema),
    defaultValues: {
      branch_id: (defaultValues?.branch_id as any) ?? undefined,
      district_id: (defaultValues?.district_id as any) ?? undefined,
      name: defaultValues?.name ?? "",
      is_active: true,
      category: "",
      current_status: "",
      technical_status: "",
      mosque_attachments: "",
      demolition_percentage: "",
      destruction_status: "",
      latitude: undefined,
      longitude: undefined,
      description: "",
      types: [],
    },
  });

  const errors = form.formState.errors;

  const selectedBranchId = form.watch("branch_id") as number | undefined;
  const branchName = selectedBranchId
    ? branchesById.get(Number(selectedBranchId))
    : undefined;

  const { data: enums } = useMosqueEnums({
    branch_id: selectedBranchId,
    district_id: form.watch("district_id") as any,
    name: form.watch("name") || undefined,
  });

  const { data: districts, isLoading: districtsLoading } =
    useDistrictsByBranch(branchName);

  useEffect(() => {
    form.setValue("district_id", undefined as any);
  }, [branchName, form]);

  const handleSubmit = async (values: CreateMosqueValues) => {
    try {
      await onSubmitCreate?.(values);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "فشل العملية");
    }
  };

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-6 w-full max-w-4xl mx-auto"
    >
      {/* المعلومات الأساسية */}
      <div className="rounded-lg   p-6      ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* اسم المسجد */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              اسم المسجد
            </Label>
            <Input
              id="name"
              placeholder="أدخل اسم المسجد"
              className={`w-full rounded-md border   focus:border-blue-500 focus:ring-blue-500  dark:border-gray-600 py-3 dark:bg-gray-700 dark:text-white ${
                errors.name ? "border-red-500 dark:border-red-400" : ""
              }`}
              {...form.register("name")}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* الفرع */}
          <div className="space-y-2">
            <Label
              htmlFor="branch_id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              الفرع
            </Label>
            <select
              id="branch_id"
              className={`block w-full text-sm rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                errors.branch_id ? "border-red-500 dark:border-red-400" : ""
              }`}
              {...form.register("branch_id", {
                valueAsNumber: true,
                onChange: (e) => {
                  const v = e.target.value ? Number(e.target.value) : undefined;
                  form.setValue("branch_id", v as any, { shouldDirty: true });
                  form.setValue("district_id", undefined as any, {
                    shouldDirty: true,
                  });
                },
              })}
            >
              <option value="">اختر الفرع</option>
              {branchesLoading ? (
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
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.branch_id.message}
              </p>
            )}
          </div>

          {/* المنطقة */}
          <div className="space-y-2">
            <Label
              htmlFor="district_id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              المنطقة
            </Label>
            <select
              id="district_id"
              className={`block w-full text-sm rounded-md border  shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                errors.district_id ? "border-red-500 dark:border-red-400" : ""
              }`}
              disabled={!selectedBranchId || districtsLoading}
              {...form.register("district_id", { valueAsNumber: true })}
            >
              <option value="">
                {districtsLoading ? "جاري التحميل..." : "اختر المنطقة"}
              </option>
              {(districts ?? []).map((d) => (
                <option key={d.id} value={String(d.id)}>
                  {d.name}
                </option>
              ))}
            </select>
            {errors.district_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.district_id.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* الحالات والتصنيفات */}
      <div className="rounded-md bg-white p-6 shadow-sm dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          الحالات والتصنيفات
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* التصنيف */}
          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              التصنيف
            </Label>
            <SelectBase id="category" {...form.register("category")}>
              <option value="">غير محدد</option>
              {(enums?.category ?? []).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </SelectBase>
          </div>

          {/* الحالة الحالية */}
          <div className="space-y-2">
            <Label
              htmlFor="current_status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              الحالة الحالية
            </Label>
            <SelectBase
              id="current_status"
              {...form.register("current_status")}
            >
              <option value="">غير محدد</option>
              {(enums?.currentStatus ?? []).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </SelectBase>
          </div>

          {/* الحالة الفنية */}
          <div className="space-y-2">
            <Label
              htmlFor="technical_status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              الحالة الفنية
            </Label>
            <SelectBase
              id="technical_status"
              {...form.register("technical_status")}
            >
              <option value="">غير محدد</option>
              {(enums?.technicalStatus ?? []).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </SelectBase>
          </div>

          {/* المرفقات */}
          <div className="space-y-2">
            <Label
              htmlFor="mosque_attachments"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              المرفقات
            </Label>
            <SelectBase
              id="mosque_attachments"
              {...form.register("mosque_attachments")}
            >
              <option value="">لا يوجد</option>
              {(enums?.attachments ?? []).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </SelectBase>
          </div>

          {/* نسبة الهدم */}
          <div className="space-y-2">
            <Label
              htmlFor="demolition_percentage"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              نسبة الهدم
            </Label>
            <SelectBase
              id="demolition_percentage"
              {...form.register("demolition_percentage")}
            >
              <option value="">لا يوجد</option>
              {(enums?.demolitionPercentage ?? []).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </SelectBase>
          </div>

          {/* حالة التدمير */}
          <div className="space-y-2">
            <Label
              htmlFor="destruction_status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              حالة التدمير
            </Label>
            <SelectBase
              id="destruction_status"
              {...form.register("destruction_status")}
            >
              <option value="">لا يوجد</option>
              {(enums?.destructionStatus ?? []).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </SelectBase>
          </div>
        </div>
      </div>

      {/* أنواع المسجد */}
      <div className="rounded-md bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="space-y-3">
          <Label
            htmlFor="types"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            أنواع المسجد
          </Label>

          <div className="relative">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {(enums?.types ?? []).map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    id={`type-${type}`}
                    type="checkbox"
                    value={type}
                    className={cn(
                      "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500",
                      "dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-600"
                    )}
                    {...form.register("types")}
                  />
                  <label
                    htmlFor={`type-${type}`}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>

            {errors.types && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                {errors.types.message}
              </p>
            )}

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              يمكنك اختيار أكثر من نوع للمسجد
            </p>
          </div>
        </div>
      </div>

      {/* الحالة العامة */}
      <div className="gap-x-5 pr-2 flex items-center     ">
        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          الحالة
        </Label>
        <SelectBase {...form.register("is_active")}>
          <option value={1}>فعال</option>
          <option value={0}>غير فعال</option>
        </SelectBase>
      </div>

      {/* الوصف */}
      <div className="rounded-md bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            الوصف
          </Label>
          <textarea
            id="description"
            rows={4}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600"
            placeholder="أدخل وصفًا للمسجد..."
            {...form.register("description")}
          />
        </div>
      </div>
    </form>
  );
}
/* ------------------------- Edit ------------------------- */
function EditForm({
  defaultValues,
  onSubmitUpdate,
  submitLabel,
  formId,
  hideSubmit,
}: Props) {
  const { data: branches, isLoading: branchesLoading } = useBranchesList();

  // خريطة (id -> name) لاستخدام الاسم في جلب المناطق
  const branchesById = useMemo(() => {
    const map = new Map<number, string>();
    (branches ?? []).forEach((b) => map.set(Number(b.id), String(b.name)));
    return map;
  }, [branches]);

  const form = useForm<UpdateMosqueValues>({
    resolver: zodResolver(updateMosqueSchema),
    defaultValues: {
      branch_id: (defaultValues?.branch_id as any) ?? undefined,
      district_id: (defaultValues?.district_id as any) ?? undefined,
      name: defaultValues?.name ?? "",
      is_active: defaultValues?.is_active ?? undefined,
      category: defaultValues?.category ?? "",
      current_status: defaultValues?.current_status ?? "",
      technical_status: defaultValues?.technical_status ?? "",
      mosque_attachments: defaultValues?.mosque_attachments ?? "",
      demolition_percentage: defaultValues?.demolition_percentage ?? "",
      destruction_status: defaultValues?.destruction_status ?? "",
      latitude: (defaultValues?.latitude as any) ?? undefined,
      longitude: (defaultValues?.longitude as any) ?? undefined,
      description: defaultValues?.description ?? "",
      // نحول الأنواع الحالية إلى مصفوفة نصوص
      types: (defaultValues?.types ?? []).map((t) => t.type),
    },
  });

  const errors = form.formState.errors;

  // مراقبة الفرع / اشتقاق اسم الفرع
  const branchId = form.watch("branch_id") as number | undefined;
  const branchName = branchId ? branchesById.get(Number(branchId)) : undefined;

  // جلب المناطق الخاصة بالفرع
  const { data: districts, isLoading: districtsLoading } =
    useDistrictsByBranch(branchName);

  // جلب القوائم المنسدلة (enums)
  const { data: enums } = useMosqueEnums({
    branch_id: branchId,
    district_id: form.watch("district_id") as any,
    name: form.watch("name") || undefined,
  });

  // عند تغيير الفرع صفّر المنطقة
  // (بدل useEffect يمكننا فعلها داخل onChange للفرع أيضاً)
  // هنا فقط كحماية إضافية إن تغيّر الاسم متأخرًا
  useEffect(() => {
    form.setValue("district_id", undefined as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchName]);

  useEffect(() => {
    if (!defaultValues) return;
    form.reset({
      branch_id: (defaultValues?.branch_id as any) ?? undefined,
      district_id: (defaultValues?.district_id as any) ?? undefined,
      name: defaultValues?.name ?? "",
      is_active: defaultValues?.is_active ?? undefined,
      category: defaultValues?.category ?? "",
      current_status: defaultValues?.current_status ?? "",
      technical_status: defaultValues?.technical_status ?? "",
      mosque_attachments: defaultValues?.mosque_attachments ?? "",
      demolition_percentage: defaultValues?.demolition_percentage ?? "",
      destruction_status: defaultValues?.destruction_status ?? "",
      latitude: (defaultValues?.latitude as any) ?? undefined,
      longitude: (defaultValues?.longitude as any) ?? undefined,
      description: defaultValues?.description ?? "",
      types: (defaultValues?.types ?? []).map((t) => t.type),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const handleSubmit = async (values: UpdateMosqueValues) => {
    try {
      // تنظيف القيم الفارغة
      const cleanedEntries = Object.entries(values).filter(
        ([, v]) => v !== "" && v !== undefined && v !== null
      );
      // لا ترسل types إذا لم يلمسها المستخدم وتريد الإبقاء على القديم:
      // لكن إن تركتها كما هي سترسل الموجود (استبدال في الـ API).
      const cleaned = Object.fromEntries(cleanedEntries) as UpdateMosqueValues;

      // تأكد من تحويل القيم الرقمية
      if (cleaned.latitude !== undefined) {
        (cleaned as any).latitude = Number(cleaned.latitude);
      }
      if (cleaned.longitude !== undefined) {
        (cleaned as any).longitude = Number(cleaned.longitude);
      }
      if (cleaned.branch_id !== undefined) {
        (cleaned as any).branch_id = Number(cleaned.branch_id);
      }
      if (cleaned.district_id !== undefined) {
        (cleaned as any).district_id = Number(cleaned.district_id);
      }

      await onSubmitUpdate?.(cleaned);
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Action failed";
      toast.error(msg);
    }
  };

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(handleSubmit)}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* المعلومات الأساسية */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* اسم المسجد */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              اسم المسجد
            </Label>
            <Input
              id="name"
              placeholder="اسم المسجد"
              className="w-full"
              {...form.register("name")}
            />
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.name?.message as any}
            </p>
          </div>

          {/* الفرع */}
          <div className="space-y-2">
            <Label
              htmlFor="branch_id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              الفرع
            </Label>
            <select
              id="branch_id"
              className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-600 dark:bg-gray-900"
              {...form.register("branch_id", {
                valueAsNumber: true,
                onChange: (e) => {
                  const v = e.target.value ? Number(e.target.value) : undefined;
                  form.setValue("branch_id", v as any, { shouldDirty: true });
                  form.setValue("district_id", undefined as any, {
                    shouldDirty: true,
                  });
                },
              })}
            >
              <option value="">بدون تغيير</option>
              {branchesLoading ? (
                <option disabled>جاري التحميل...</option>
              ) : (
                (branches ?? []).map((b) => (
                  <option key={b.id} value={String(b.id)}>
                    {b.name}
                  </option>
                ))
              )}
            </select>
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.branch_id?.message as any}
            </p>
          </div>

          {/* المنطقة */}
          <div className="space-y-2">
            <Label
              htmlFor="district_id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              المنطقة
            </Label>
            <select
              id="district_id"
              className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm disabled:opacity-60 dark:border-gray-600 dark:bg-gray-900"
              disabled={!branchId || districtsLoading}
              {...form.register("district_id", { valueAsNumber: true })}
            >
              <option value="">
                {districtsLoading ? "جاري التحميل..." : "اختر المنطقة"}
              </option>
              {(districts ?? []).map((d) => (
                <option key={d.id} value={String(d.id)}>
                  {d.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.district_id?.message as any}
            </p>
          </div>
        </div>
      </div>

      {/* الحالات والتصنيفات */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          الحالات والتصنيفات
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              التصنيف
            </Label>
            <select
              id="category"
              className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-600 dark:bg-gray-900"
              {...form.register("category")}
            >
              <option value="">بدون تغيير</option>
              {(enums?.category ?? []).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="current_status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              الحالة الحالية
            </Label>
            <select
              id="current_status"
              className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-600 dark:bg-gray-900"
              {...form.register("current_status")}
            >
              <option value="">بدون تغيير</option>
              {(enums?.currentStatus ?? []).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="technical_status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              الحالة الفنية
            </Label>
            <select
              id="technical_status"
              className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-600 dark:bg-gray-900"
              {...form.register("technical_status")}
            >
              <option value="">بدون تغيير</option>
              {(enums?.technicalStatus ?? []).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="mosque_attachments"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              المرفقات
            </Label>
            <select
              id="mosque_attachments"
              className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-600 dark:bg-gray-900"
              {...form.register("mosque_attachments")}
            >
              <option value="">لا تغيير</option>
              {(enums?.attachments ?? []).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="demolition_percentage"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              نسبة الهدم
            </Label>
            <select
              id="demolition_percentage"
              className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-600 dark:bg-gray-900"
              {...form.register("demolition_percentage")}
            >
              <option value="">لا تغيير</option>
              {(enums?.demolitionPercentage ?? []).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="destruction_status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              حالة التدمير
            </Label>
            <select
              id="destruction_status"
              className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-600 dark:bg-gray-900"
              {...form.register("destruction_status")}
            >
              <option value="">لا تغيير</option>
              {(enums?.destructionStatus ?? []).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* أنواع المسجد (سيتم استبدال القديم بالجديد) */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <Label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
          أنواع المسجد
        </Label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {(enums?.types ?? []).map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={type}
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600"
                {...form.register("types")}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {type}
              </span>
            </label>
          ))}
        </div>
        {errors.types && (
          <p className="mt-1 text-xs text-red-500 dark:text-red-400">
            {errors.types.message as any}
          </p>
        )}
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          تعديل الأنواع سيستبدل الأنواع السابقة بالقيم المحددة هنا.
        </p>
      </div>

      {/* الإحداثيات والوصف */}
      {/* 
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="latitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Latitude
            </Label>
            <Input
              id="latitude"
              type="number"
              step="0.0000001"
              className="w-full"
              {...form.register("latitude", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Longitude
            </Label>
            <Input
              id="longitude"
              type="number"
              step="0.0000001"
              className="w-full"
              {...form.register("longitude", { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>
      */}

      {/* الوصف */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            الوصف
          </Label>
          <textarea
            id="description"
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
            {...form.register("description")}
          />
        </div>
      </div>

      {/* {!hideSubmit && (
        <div className="pt-2">
          <Button type="submit" className="min-w-32">
            {submitLabel ?? "Save"}
          </Button>
        </div>
      )} */}
    </form>
  );
}
