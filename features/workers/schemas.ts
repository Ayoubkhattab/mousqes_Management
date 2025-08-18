// /features/workers/schemas.ts
import { z } from "zod";

export const createWorkerSchema = z.object({
  branch_id: z.number({ required_error: "الفرع مطلوب" }),
  mosque_id: z.number({ required_error: "المسجد مطلوب" }),
  name: z.string().min(2, "الاسم قصير"),
  job_title: z.string().min(1, "المسمى مطلوب"),
  job_status: z.string().optional(),
  sponsorship_types: z.string().optional(),
  educational_level: z.string().optional(),
  quran_levels: z.string().min(1, "حقل درجة الحفظ مطلوب."),
  phone: z.string().optional(),
  salary: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : Number(v)),
    z.number().positive().optional()
  ),
  image: z.any().optional(),
});

export const updateWorkerSchema = createWorkerSchema.partial();

export type CreateWorkerValues = z.infer<typeof createWorkerSchema>;
export type UpdateWorkerValues = z.infer<typeof updateWorkerSchema>;
