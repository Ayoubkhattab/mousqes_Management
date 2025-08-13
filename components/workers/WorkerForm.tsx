// /components/workers/WorkerForm.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  createWorkerSchema,
  updateWorkerSchema,
  type CreateWorkerValues,
  type UpdateWorkerValues,
} from "@/features/workers/schemas";
import type { Worker } from "@/features/workers/types";
import { useBranchesList } from "@/features/branches/hooks";
import {
  useMosquesByBranchName,
  useWorkersEnums,
} from "@/features/workers/queries";

type Props = {
  mode: "create" | "edit";
  defaultValues?: Partial<Worker>;
  onSubmitCreate?: (v: CreateWorkerValues & { image?: File }) => Promise<void>;
  onSubmitUpdate?: (v: UpdateWorkerValues & { image?: File }) => Promise<void>;
  submitLabel?: string;
  formId?: string;
  hideSubmit?: boolean;
};

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

export default function WorkerForm(p: Props) {
  return p.mode === "create" ? <CreateForm {...p} /> : <EditForm {...p} />;
}

/* ---------------------- Create ---------------------- */
function CreateForm({
  onSubmitCreate,
  submitLabel,
  formId,
  hideSubmit,
  defaultValues,
}: Props) {
  const { data: branches = [], isLoading: branchesLoading } = useBranchesList();
  const { data: enums } = useWorkersEnums();
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);

  const form = useForm<CreateWorkerValues>({
    resolver: zodResolver(createWorkerSchema),
    defaultValues: {
      branch_id: (defaultValues?.mosque?.branch_id as any) ?? undefined,
      mosque_id: (defaultValues?.mosque_id as any) ?? undefined,
      name: defaultValues?.name ?? "",
      job_title: defaultValues?.job_title ?? "",
      job_status: defaultValues?.job_status ?? "",
      sponsorship_type: defaultValues?.sponsorship_type ?? "",
      educational_level: defaultValues?.educational_level ?? "",
      quran_level: defaultValues?.quran_level ?? "",
      phone: defaultValues?.phone ?? "",
      salary: (defaultValues?.salary as any) ?? undefined,
    },
  });

  const errors = form.formState.errors;

  // نقرأ الفرع المختار كرقم
  const branchId = form.watch("branch_id") as number | undefined;

  // نحسب اسم الفرع وفق الـ branchId
  const branchName = useMemo(() => {
    if (!branchId) return undefined;
    const b = branches.find((x: any) => Number(x.id) === Number(branchId));
    return b?.name?.trim();
  }, [branches, branchId]);

  // نجلب المساجد الخاصة بالفرع المختار
  const { data: mosques = [], isLoading: mosquesLoading } =
    useMosquesByBranchName(branchName);

  useEffect(() => {
    // عند تغيير الفرع امسح المسجد المختار
    form.resetField("mosque_id", { keepDirty: true, keepTouched: false });
  }, [branchId]); // راقب branchId مباشرة

  const handleSubmit = async (v: CreateWorkerValues) => {
    try {
      await onSubmitCreate?.({
        ...v,
        branch_id: Number(v.branch_id),
        mosque_id: Number(v.mosque_id),
        salary: v.salary === undefined ? undefined : Number(v.salary),
        image: imageFile,
      });
    } catch (e: any) {
      const msg =
        e?.response?.data?.details?.name?.[0] ||
        e?.response?.data?.message ||
        "Action failed";
      toast.error(msg);
    }
  };

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(handleSubmit)}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* الفرع / المسجد / الاسم */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="grid gap-6 md:grid-cols-3">
          {/* الفرع */}
          <div className="space-y-2">
            <Label
              htmlFor="branch_id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              الفرع
            </Label>
            <SelectBase
              id="branch_id"
              className="w-full"
              value={form.watch("branch_id") ?? ""} // controlled
              onChange={(e) => {
                const val = e.target.value;
                if (!val) {
                  // امسح الحقل بطريقة آمنة بدون تمرير undefined لـ setValue
                  form.resetField("branch_id", {
                    keepTouched: true,
                    keepDirty: true,
                  });
                  // صفّر المسجد أيضاً
                  form.resetField("mosque_id", {
                    keepTouched: true,
                    keepDirty: true,
                  });
                  return;
                }
                const num = Number(val);
                form.setValue("branch_id", num, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                // عند تغيير الفرع صفّر المسجد
                form.resetField("mosque_id", {
                  keepTouched: true,
                  keepDirty: true,
                });
              }}
            >
              <option value="">اختر الفرع</option>
              {branchesLoading ? (
                <option disabled>جاري التحميل...</option>
              ) : (
                branches.map((b: any) => (
                  <option key={b.id} value={String(b.id)}>
                    {b.name}
                  </option>
                ))
              )}
            </SelectBase>
            <p className="mt-1 text-xs text-red-600">
              {errors.branch_id?.message as any}
            </p>
          </div>

          {/* المسجد */}
          <div className="space-y-2">
            <Label
              htmlFor="mosque_id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              المسجد
            </Label>
            <SelectBase
              key={form.watch("branch_id") ?? "no-branch"} // يجبر إعادة التركيب عند تغيّر الفرع
              id="mosque_id"
              className="w-full disabled:opacity-60"
              disabled={!branchId || mosquesLoading}
              value={form.watch("mosque_id") ?? ""} // controlled
              onChange={(e) => {
                const v = e.target.value;
                if (!v) {
                  form.resetField("mosque_id", {
                    keepTouched: true,
                    keepDirty: true,
                  });
                  return;
                }
                form.setValue("mosque_id", Number(v), {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            >
              <option value="">اختر المسجد</option>
              {mosquesLoading ? (
                <option disabled>جاري التحميل...</option>
              ) : (
                mosques.map((m: any) => (
                  <option key={m.id} value={String(m.id)}>
                    {m.name}
                  </option>
                ))
              )}
            </SelectBase>
          </div>

          {/* الاسم */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              الاسم
            </Label>
            <Input
              id="name"
              placeholder="اسم الموظف"
              className="w-full"
              {...form.register("name")}
            />
            <p className="mt-1 text-xs text-red-600">
              {errors.name?.message as any}
            </p>
          </div>
        </div>
      </div>

      {/* الوظيفة والحالة */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="job_title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              المسمى الوظيفي
            </Label>
            <SelectBase
              id="job_title"
              className="w-full"
              {...form.register("job_title")}
            >
              <option value="">اختر</option>
              {(enums?.jobTitles ?? []).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </SelectBase>
            <p className="mt-1 text-xs text-red-600">
              {errors.job_title?.message as any}
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="job_status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              الوضع الوظيفي
            </Label>
            <SelectBase
              id="job_status"
              className="w-full"
              {...form.register("job_status")}
            >
              <option value="">غير محدد</option>
              {(enums?.jobStatuses ?? []).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </SelectBase>
          </div>
        </div>
      </div>

      {/* كفالة / تعليم / قرآن */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label
              htmlFor="sponsorship_type"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              طبيعة الكفالة
            </Label>
            <SelectBase
              id="sponsorship_type"
              className="w-full"
              {...form.register("sponsorship_type")}
            >
              <option value="">غير محدد</option>
              {(enums?.sponsorshipTypes ?? []).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </SelectBase>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="educational_level"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              المستوى التعليمي
            </Label>
            <SelectBase
              id="educational_level"
              className="w-full"
              {...form.register("educational_level")}
            >
              <option value="">غير محدد</option>
              {(enums?.educationalLevels ?? []).map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </SelectBase>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="quran_level"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              درجة الحفظ
            </Label>
            <SelectBase
              id="quran_level"
              className="w-full"
              {...form.register("quran_level")}
            >
              <option value="">غير محدد</option>
              {(enums?.quranLevels ?? []).map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </SelectBase>
          </div>
        </div>
      </div>

      {/* هاتف/راتب/صورة */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              الهاتف
            </Label>
            <Input
              id="phone"
              placeholder="+90..."
              className="w-full"
              {...form.register("phone")}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="salary"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              الراتب
            </Label>
            <Input
              id="salary"
              type="number"
              step="0.01"
              className="w-full"
              {...form.register("salary")}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              الصورة (اختياري)
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              className="w-full"
              onChange={(e) => setImageFile(e.target.files?.[0])}
            />
          </div>
        </div>
      </div>

      {!hideSubmit && (
        <div className="pt-2">
          <Button type="submit" className="min-w-32">
            {submitLabel ?? "Create"}
          </Button>
        </div>
      )}
    </form>
  );
}

/* ---------------------- Edit ---------------------- */
function EditForm({
  defaultValues,
  onSubmitUpdate,
  submitLabel,
  formId,
  hideSubmit,
}: Props) {
  const { data: branches = [] } = useBranchesList();
  const { data: enums } = useWorkersEnums();
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);

  const branchesById = useMemo(() => {
    const m = new Map<number, string>();
    branches.forEach((b: any) => m.set(Number(b.id), String(b.name)));
    return m;
  }, [branches]);

  const form = useForm<UpdateWorkerValues>({
    resolver: zodResolver(updateWorkerSchema),
    defaultValues: {
      branch_id: (defaultValues?.mosque?.branch_id as any) ?? undefined,
      mosque_id: (defaultValues?.mosque_id as any) ?? undefined,
      name: defaultValues?.name ?? "",
      job_title: defaultValues?.job_title ?? "",
      job_status: defaultValues?.job_status ?? "",
      sponsorship_type: defaultValues?.sponsorship_type ?? "",
      educational_level: defaultValues?.educational_level ?? "",
      quran_level: defaultValues?.quran_level ?? "",
      phone: defaultValues?.phone ?? "",
      salary: (defaultValues?.salary as any) ?? undefined,
    },
  });

  useEffect(() => {
    if (!defaultValues) return;
    form.reset({
      branch_id: (defaultValues?.mosque?.branch_id as any) ?? undefined,
      mosque_id: (defaultValues?.mosque_id as any) ?? undefined,
      name: defaultValues?.name ?? "",
      job_title: defaultValues?.job_title ?? "",
      job_status: defaultValues?.job_status ?? "",
      sponsorship_type: defaultValues?.sponsorship_type ?? "",
      educational_level: defaultValues?.educational_level ?? "",
      quran_level: defaultValues?.quran_level ?? "",
      phone: defaultValues?.phone ?? "",
      salary: (defaultValues?.salary as any) ?? undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const branchId = form.watch("branch_id") as number | undefined;
  const branchName = branchId ? branchesById.get(Number(branchId)) : undefined;
  const { data: mosques = [], isLoading: mosquesLoading } =
    useMosquesByBranchName(branchName);

  useEffect(() => {
    form.setValue("mosque_id", undefined as any);
  }, [branchName]); // eslint-disable-line

  const errors = form.formState.errors;

  const handleSubmit = async (v: UpdateWorkerValues) => {
    try {
      const cleaned: UpdateWorkerValues & { image?: File } = {
        ...Object.fromEntries(
          Object.entries(v).filter(
            ([, val]) => val !== "" && val !== undefined && val !== null
          )
        ),
        branch_id: v.branch_id === undefined ? undefined : Number(v.branch_id),
        mosque_id: v.mosque_id === undefined ? undefined : Number(v.mosque_id),
        salary: v.salary === undefined ? undefined : Number(v.salary as any),
        image: imageFile,
      };
      await onSubmitUpdate?.(cleaned);
    } catch (e: any) {
      const msg =
        e?.response?.data?.details?.name?.[0] ||
        e?.response?.data?.message ||
        "Action failed";
      toast.error(msg);
    }
  };

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(handleSubmit)}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* الفرع / المسجد / الاسم */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="grid gap-6 md:grid-cols-3">
          {/* الفرع */}
          <div className="space-y-2">
            <Label
              htmlFor="branch_id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              الفرع
            </Label>
            <SelectBase
              id="branch_id"
              className="w-full"
              {...form.register("branch_id", { valueAsNumber: true })}
            >
              <option value="">بدون تغيير</option>
              {branches.map((b: any) => (
                <option key={b.id} value={String(b.id)}>
                  {b.name}
                </option>
              ))}
            </SelectBase>
          </div>

          {/* المسجد */}
          <div className="space-y-2">
            <Label
              htmlFor="mosque_id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              المسجد
            </Label>
            <SelectBase
              id="mosque_id"
              className="w-full disabled:opacity-60"
              disabled={!branchId || mosquesLoading}
              {...form.register("mosque_id", { valueAsNumber: true })}
            >
              <option value="">بدون تغيير</option>
              {mosques.map((m: any) => (
                <option key={m.id} value={String(m.id)}>
                  {m.name}
                </option>
              ))}
            </SelectBase>
          </div>

          {/* الاسم */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              الاسم
            </Label>
            <Input
              id="name"
              placeholder="اسم الموظف"
              className="w-full"
              {...form.register("name")}
            />
          </div>
        </div>
      </div>

      {/* الوظيفة والحالة */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="job_title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              المسمى الوظيفي
            </Label>
            <SelectBase
              id="job_title"
              className="w-full"
              {...form.register("job_title")}
            >
              <option value="">بدون تغيير</option>
              {(enums?.jobTitles ?? []).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </SelectBase>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="job_status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              الوضع الوظيفي
            </Label>
            <SelectBase
              id="job_status"
              className="w-full"
              {...form.register("job_status")}
            >
              <option value="">بدون تغيير</option>
              {(enums?.jobStatuses ?? []).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </SelectBase>
          </div>
        </div>
      </div>

      {/* كفالة / تعليم / قرآن */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label
              htmlFor="sponsorship_type"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              طبيعة الكفالة
            </Label>
            <SelectBase
              id="sponsorship_type"
              className="w-full"
              {...form.register("sponsorship_type")}
            >
              <option value="">بدون تغيير</option>
              {(enums?.sponsorshipTypes ?? []).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </SelectBase>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="educational_level"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              المستوى التعليمي
            </Label>
            <SelectBase
              id="educational_level"
              className="w-full"
              {...form.register("educational_level")}
            >
              <option value="">بدون تغيير</option>
              {(enums?.educationalLevels ?? []).map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </SelectBase>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="quran_level"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              درجة الحفظ
            </Label>
            <SelectBase
              id="quran_level"
              className="w-full"
              {...form.register("quran_level")}
            >
              <option value="">بدون تغيير</option>
              {(enums?.quranLevels ?? []).map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </SelectBase>
          </div>
        </div>
      </div>

      {/* هاتف/راتب/صورة */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              الهاتف
            </Label>
            <Input
              id="phone"
              placeholder="+90..."
              className="w-full"
              {...form.register("phone")}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="salary"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              الراتب
            </Label>
            <Input
              id="salary"
              type="number"
              step="0.01"
              className="w-full"
              {...form.register("salary")}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              الصورة (اختياري)
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              className="w-full"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setImageFile(f);
              }}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
