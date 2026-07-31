import type { RequestHandler } from "express";
import type { z } from "zod";
import { AppError } from "../errors/AppError.js";

export function validateBody(schema: z.ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(new AppError("Validation failed", 400, result.error.flatten()));
      return;
    }
    req.body = result.data;
    next();
  };
}
