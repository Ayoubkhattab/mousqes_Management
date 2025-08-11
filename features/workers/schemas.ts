import { z } from "zod";

const toNumberReq = z
  .union([z.string(), z.number()])
  .transform((v) => Number(v))
  .refine((v) => !Number.isNaN(v), "Required");

const toNumberOpt = z
  .union([z.string(), z.number()])
  .optional()
  .transform((v) => (v === "" || v == null ? undefined : Number(v)));

const fileOpt = z
  .any()
  .optional()
  .transform((v) => {
    if (!v) return undefined;
    if (v instanceof File) return v;
    if (typeof FileList !== "undefined" && v instanceof FileList)
      return v.item(0) ?? undefined;
    return undefined;
  });

export const createWorkerSchema = z.object({
  name: z.string().min(2, "Too short"),
  branch_id: toNumberReq,
  mosque_id: toNumberReq,
  job_title: z.string().min(1, "Job title is required"),
  job_status: z.string().min(1, "Job status is required"),
  quran_levels: z.string().optional(),
  sponsorship_types: z.string().optional(),
  educational_level: z.string().optional(),
  phone: z.string().optional(),
  salary: z.union([z.string(), z.number()]).optional(),
  image: fileOpt,
});
export type CreateWorkerValues = z.infer<typeof createWorkerSchema>;

export const updateWorkerSchema = z.object({
  name: z.string().min(2, "Too short").optional(),
  branch_id: toNumberOpt,
  mosque_id: toNumberOpt,
  job_title: z.string().optional(),
  job_status: z.string().optional(),
  quran_levels: z.string().optional(),
  sponsorship_types: z.string().optional(),
  educational_level: z.string().optional(),
  phone: z.string().optional(),
  salary: z.union([z.string(), z.number()]).optional(),
  image: fileOpt,
});
export type UpdateWorkerValues = z.infer<typeof updateWorkerSchema>;
