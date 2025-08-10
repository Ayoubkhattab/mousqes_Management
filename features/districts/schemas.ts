import { z } from "zod";

export const createDistrictSchema = z
  .object({
    name: z.string({ required_error: "Name is required" }).min(2, "Too short"),
    branch_id: z
      .union([z.string(), z.number()])
      .optional()
      .transform((v) => (v === "" || v == null ? undefined : Number(v))),
    code: z
      .union([z.string(), z.undefined()])
      .optional()
      .transform((v) => (v === "" ? undefined : v)),
  })
  .refine((d) => !!d.branch_id, {
    path: ["branch_id"],
    message: "Branch is required",
  });

export type CreateDistrictValues = z.infer<typeof createDistrictSchema>;

export const updateDistrictSchema = z.object({
  name: z.string().min(2, "Too short").optional(),
  branch_id: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === "" || v == null ? undefined : Number(v))),
  code: z
    .union([z.string(), z.undefined()])
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
});

export type UpdateDistrictValues = z.infer<typeof updateDistrictSchema>;
