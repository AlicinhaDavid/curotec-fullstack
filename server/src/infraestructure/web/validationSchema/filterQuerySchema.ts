import { z } from "zod";

export const filterQuerySchema = z.object({
  search: z.string().optional().default(""),
  page: z
    .string()
    .regex(/^\d+$/, "Page must be a number.")
    .transform(Number)
    .refine((n) => n > 0, { message: "Page must be greater than 0." }),
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a number")
    .transform(Number)
    .refine((n) => n > 0, { message: "Limit must be greater than 0." }),
});
