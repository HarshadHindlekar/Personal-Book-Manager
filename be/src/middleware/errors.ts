import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({ message: "Validation failed", issues: error.flatten() });
    return;
  }

  if (error?.code === 11000) {
    res.status(409).json({ message: "An account with this email already exists" });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Something went wrong" });
};
