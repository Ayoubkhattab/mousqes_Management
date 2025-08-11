// components/workers/WorkerForm.tsx
"use client";

import { useEffect } from "react";
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
// import { useBranchesList } from "@/features/branches/hooks";
import { useWorkersEnums } from "@/features/workers/queries";
import { useMosquesList } from "@/features/workers/hooks";

type Props = {
  mode: "create" | "edit";
  defaultValues?: Partial<Worker>;
  onSubmitCreate?: (v: CreateWorkerValues) => Promise<void>;
  onSubmitUpdate?: (v: UpdateWorkerValues) => Promise<void>;
  submitLabel?: string;
  formId?: string;
  hideSubmit?: boolean;
};

export default function WorkerForm(props: Props) {
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

/* -------------------- Create -------------------- */
function CreateForm({
  onSubmitCreate,
  submitLabel,
  formId,
  hideSubmit,
}: {
  onSubmitCreate?: (v: CreateWorkerValues) => Promise<void>;
  submitLabel?: string;
  formId?: string;
  hideSubmit?: boolean;
}) {
  //   const { data: branches, isLoading: branchesLoading } = useBranchesList();
  const { data: enums } = useWorkersEnums();

  const form = useForm<CreateWorkerValues>({
    resolver: zodResolver(createWorkerSchema),
    defaultValues: {
      name: "",
      branch_id: undefined as any,
      mosque_id: undefined as any, // ⬅️ مطلوب في الإنشاء
      job_title: "",
      job_status: "",
      quran_levels: "",
      sponsorship_types: "",
      educational_level: "",
      phone: "",
      salary: "" as any,
      image: undefined,
    },
  });
  const errors = form.formState.errors;

  const branchIdWatch = form.watch("branch_id") as number | undefined;
  const { data: mosques, isLoading: mosquesLoading } =
    useMosquesList(branchIdWatch);

  // لو تغيّر الفرع صفّر المسجد
  useEffect(() => {
    form.setValue("mosque_id", undefined as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchIdWatch]);

  const handleSubmit = async (values: CreateWorkerValues) => {
    try {
      await onSubmitCreate?.(values);
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
      className="space-y-6"
    >
      {/* 1) معلومات أساسية */}
      <section className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">
          المعلومات الأساسية
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="اسم العامل"
              {...form.register("name")}
            />
            <p className="text-xs text-red-600">
              {errors.name?.message as any}
            </p>
          </div>
          {/* 
          <div className="space-y-2">
            <Label htmlFor="branch_id">Branch</Label>
            <SelectBase id="branch_id" {...form.register("branch_id")}>
              <option value="">اختر الفرع</option>
              {branchesLoading ? (
                <option disabled>Loading...</option>
              ) : (
                (branches ?? []).map((b) => (
                  <option key={b.id} value={String(b.id)}>
                    {b.name}
                  </option>
                ))
              )}
            </SelectBase>
            <p className="text-xs text-red-600">
              {errors.branch_id?.message as any}
            </p>
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="mosque_id">Mosque</Label>
            <SelectBase id="mosque_id" {...form.register("mosque_id")}>
              <option value="">اختر المسجد</option>
              {mosquesLoading ? (
                <option disabled>Loading mosques...</option>
              ) : (
                (mosques?.data ?? []).map((m) => (
                  <option key={m.id} value={String(m.id)}>
                    {m.name}
                  </option>
                ))
              )}
            </SelectBase>
            <p className="text-xs text-red-600">
              {errors.mosque_id?.message as any}
            </p>
          </div>
        </div>
      </section>

      {/* 2) البيانات الوظيفية والتعليمية */}
      <section className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">
          البيانات الوظيفية
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="job_title">Job Title</Label>
            <SelectBase id="job_title" {...form.register("job_title")}>
              <option value="">اختر المسمى الوظيفي</option>
              {(enums?.jobTitles ?? []).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </SelectBase>
            <p className="text-xs text-red-600">
              {errors.job_title?.message as any}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_status">Job Status</Label>
            <SelectBase id="job_status" {...form.register("job_status")}>
              <option value="">اختر الحالة</option>
              {(enums?.jobStatuses ?? []).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </SelectBase>
            <p className="text-xs text-red-600">
              {errors.job_status?.message as any}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quran_levels">Qur'an Level</Label>
            <SelectBase id="quran_levels" {...form.register("quran_levels")}>
              <option value="">غير محدد</option>
              {(enums?.quranLevels ?? []).map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </SelectBase>
          </div>

          <div className="space-y-2">
            <Label htmlFor="educational_level">Educational Level</Label>
            <SelectBase
              id="educational_level"
              {...form.register("educational_level")}
            >
              <option value="">غير محدد</option>
              {(enums?.educationalLevels ?? []).map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </SelectBase>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="sponsorship_types">Sponsorship Type</Label>
            <SelectBase
              id="sponsorship_types"
              {...form.register("sponsorship_types")}
            >
              <option value="">غير محدد</option>
              {(enums?.sponsorshipTypes ?? []).map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </SelectBase>
          </div>
        </div>
      </section>

      {/* 3) الاتصال والراتب والصورة */}
      <section className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">
          معلومات إضافية
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="+90..."
              {...form.register("phone")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              inputMode="decimal"
              placeholder="200.00"
              {...form.register("salary")}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="image">Image (optional)</Label>
            <input
              id="image"
              type="file"
              accept="image/*"
              className="block w-full text-sm file:me-3 file:rounded-xl file:border file:bg-muted file:px-3 file:py-2 file:text-sm file:hover:bg-muted/80"
              {...form.register("image")}
            />
          </div>
        </div>
      </section>

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

/* -------------------- Edit -------------------- */
function EditForm({
  defaultValues,
  onSubmitUpdate,
  submitLabel,
  formId,
  hideSubmit,
}: {
  defaultValues?: Partial<Worker>;
  onSubmitUpdate?: (v: UpdateWorkerValues) => Promise<void>;
  submitLabel?: string;
  formId?: string;
  hideSubmit?: boolean;
}) {
  //   const { data: branches, isLoading: branchesLoading } = useBranchesList();
  const { data: enums } = useWorkersEnums();

  const form = useForm<UpdateWorkerValues>({
    resolver: zodResolver(updateWorkerSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      branch_id: (defaultValues?.branch_id as any) ?? undefined,
      mosque_id: (defaultValues?.mosque_id as any) ?? undefined,
      job_title: defaultValues?.job_title ?? "",
      job_status: defaultValues?.job_status ?? "",
      quran_levels: defaultValues?.quran_levels ?? "",
      sponsorship_types: defaultValues?.sponsorship_types ?? "",
      educational_level: defaultValues?.educational_level ?? "",
      phone: defaultValues?.phone ?? "",
      salary: (defaultValues?.salary as any) ?? "",
      image: undefined,
    },
  });

  useEffect(() => {
    if (!defaultValues) return;
    form.reset({
      name: defaultValues.name ?? "",
      branch_id: (defaultValues.branch_id as any) ?? undefined,
      mosque_id: (defaultValues.mosque_id as any) ?? undefined,
      job_title: defaultValues.job_title ?? "",
      job_status: defaultValues.job_status ?? "",
      quran_levels: defaultValues.quran_levels ?? "",
      sponsorship_types: defaultValues.sponsorship_types ?? "",
      educational_level: defaultValues.educational_level ?? "",
      phone: defaultValues.phone ?? "",
      salary: (defaultValues.salary as any) ?? "",
      image: undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const errors = form.formState.errors;

  const handleSubmit = async (values: UpdateWorkerValues) => {
    try {
      const cleaned = Object.fromEntries(
        Object.entries(values).filter(
          ([, v]) => v !== "" && v !== undefined && v !== null
        )
      ) as UpdateWorkerValues;
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
      className="space-y-6"
    >
      <section className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">
          تعديل البيانات
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="اسم العامل"
              {...form.register("name")}
            />
            <p className="text-xs text-red-600">
              {errors.name?.message as any}
            </p>
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="branch_id">Branch</Label>
            <SelectBase id="branch_id" {...form.register("branch_id")}>
              <option value="">بدون تغيير</option>
              {branchesLoading ? (
                <option disabled>Loading...</option>
              ) : (
                (branches ?? []).map((b) => (
                  <option key={b.id} value={String(b.id)}>
                    {b.name}
                  </option>
                ))
              )}
            </SelectBase>
            <p className="text-xs text-red-600">
              {errors.branch_id?.message as any}
            </p>
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="mosque_id">Mosque</Label>
            <Input
              id="mosque_id"
              placeholder="ID فقط إن أردت تغييره"
              {...form.register("mosque_id")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_title">Job Title</Label>
            <SelectBase id="job_title" {...form.register("job_title")}>
              <option value="">بدون تغيير</option>
              {(enums?.jobTitles ?? []).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </SelectBase>
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_status">Job Status</Label>
            <SelectBase id="job_status" {...form.register("job_status")}>
              <option value="">بدون تغيير</option>
              {(enums?.jobStatuses ?? []).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </SelectBase>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quran_levels">Qur'an Level</Label>
            <SelectBase id="quran_levels" {...form.register("quran_levels")}>
              <option value="">بدون تغيير</option>
              {(enums?.quranLevels ?? []).map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </SelectBase>
          </div>

          <div className="space-y-2">
            <Label htmlFor="educational_level">Educational Level</Label>
            <SelectBase
              id="educational_level"
              {...form.register("educational_level")}
            >
              <option value="">بدون تغيير</option>
              {(enums?.educationalLevels ?? []).map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </SelectBase>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="sponsorship_types">Sponsorship Type</Label>
            <SelectBase
              id="sponsorship_types"
              {...form.register("sponsorship_types")}
            >
              <option value="">بدون تغيير</option>
              {(enums?.sponsorshipTypes ?? []).map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </SelectBase>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="+90..."
              {...form.register("phone")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              inputMode="decimal"
              placeholder="200.00"
              {...form.register("salary")}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="image">Image (optional)</Label>
            <input
              id="image"
              type="file"
              accept="image/*"
              className="block w-full text-sm file:me-3 file:rounded-xl file:border file:bg-muted file:px-3 file:py-2 file:text-sm file:hover:bg-muted/80"
              {...form.register("image")}
            />
          </div>
        </div>
      </section>

      {!hideSubmit && (
        <div className="pt-2">
          <Button type="submit" className="min-w-32">
            {submitLabel ?? "Save"}
          </Button>
        </div>
      )}
    </form>
  );
}
