import { ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from "express";

export function validate(
  schema: ZodTypeAny,
  target: "body" | "params" | "query" = "body"
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return res.status(400).json({ errors: result.error.flatten() });
    }
    req[target] = result.data;
    next();
  };
}
