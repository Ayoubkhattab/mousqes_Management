import { z } from "zod";

const idNum = z.union([z.string(), z.number()]).transform((v) => Number(v));

export const createMosqueSchema = z.object({
  branch_id: idNum,
  district_id: idNum,
  name: z.string().min(2, "Required"),
  city_or_village: z.string().optional(),
  is_active: z.union([z.boolean(), z.number()]).optional(),
  support_friday: z.union([z.boolean(), z.number()]).optional(),
  category: z.string().optional(),
  current_status: z.string().optional(),
  technical_status: z.string().optional(),
  mosque_attachments: z.string().optional(),
  demolition_percentage: z.string().optional(),
  destruction_status: z.string().optional(),
  latitude: z.union([z.string(), z.number()]).optional(),
  longitude: z.union([z.string(), z.number()]).optional(),
  description: z.string().optional(),
  types: z.array(z.string()).optional(),
});

export type CreateMosqueValues = z.infer<typeof createMosqueSchema>;

export const updateMosqueSchema = createMosqueSchema.partial();
export type UpdateMosqueValues = z.infer<typeof updateMosqueSchema>;
