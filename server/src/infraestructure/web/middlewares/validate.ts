import { ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

/**
 * Middleware factory for request validation using Zod schemas.
 *
 * Validates the specified part of the request (body, params, or query)
 * against the provided Zod schema.
 *
 * If validation fails, throws an AppError with HTTP 400 and validation details.
 * If validation succeeds, replaces the original data with the parsed
 * and validated data (which may be sanitized or transformed by Zod),
 * then calls next middleware/handler.
 *
 * @param schema - Zod schema to validate against.
 * @param target - Request property to validate: "body" (default), "params", or "query".
 * @returns Express middleware function.
 */
export function validate(
  schema: ZodTypeAny,
  target: "body" | "params" | "query" = "body"
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const formatted = result.error.flatten();
      throw new AppError(
        "Validation error",
        400,
        "VALIDATION_ERROR",
        formatted
      );
    }

    req[target] = result.data;
    next();
  };
}
