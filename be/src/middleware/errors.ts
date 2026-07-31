import type { ErrorRequestHandler } from "express";
import { Error as MongooseError } from "mongoose";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message, ...(error.details ? { issues: error.details } : {}) });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({ message: "Validation failed", issues: error.flatten() });
    return;
  }

  if (error?.code === 11000) {
    res.status(409).json({ message: "An account with this email already exists" });
    return;
  }

  if (error instanceof MongooseError.ValidationError) {
    res.status(400).json({ message: "Validation failed", issues: error.errors });
    return;
  }

  if (error instanceof MongooseError.CastError) {
    res.status(400).json({ message: "Invalid resource id" });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Something went wrong" });
};
