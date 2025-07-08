import { z } from "zod";
import { userSchema } from "./userSchema";

export const userWithoutIdSchema = userSchema.omit({ id: true });

export type userWithoutIdFormData = z.infer<typeof userWithoutIdSchema>;
