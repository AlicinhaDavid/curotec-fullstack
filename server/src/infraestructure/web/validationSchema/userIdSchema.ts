import { z } from "zod";

/**
 * Zod schema for validating a user ID parameter.
 *
 * Validations performed:
 * - Must be a string consisting only of digits (regex /^\d+$/).
 * - Transforms the string to a number.
 * - Ensures the number is greater than zero.
 *
 */
export const userIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID must be a number")
    .transform((val) => Number(val))
    .refine((val) => val > 0, { message: "ID must be greater than 0" }),
});
