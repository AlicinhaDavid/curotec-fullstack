import { z } from "zod";

export const userSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID must be a number.")
    .transform((val) => Number(val))
    .refine((val) => val > 0, { message: "ID must be greater than 0." })
    .transform((val) => String(val)),
  name: z.string().min(1, "* Name is required."),
  email: z.string().email("* Invalid email address."),
});

export type UserFormData = z.infer<typeof userSchema>;
