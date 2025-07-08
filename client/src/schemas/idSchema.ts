import { z } from "zod";

export const idSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID must be a number.")
    .transform((val) => Number(val))
    .refine((val) => val > 0, { message: "ID must be greater than 0." })
    .transform((val) => String(val)),
});

export type IdFormData = z.infer<typeof idSchema>;
