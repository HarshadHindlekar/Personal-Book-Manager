import { z } from "zod";
import { BOOK_STATUSES } from "../constants/books.js";

export const statusSchema = z.enum(BOOK_STATUSES);

export const bookSchema = z.object({
  title: z.string().trim().min(1).max(160),
  author: z.string().trim().min(1).max(120),
  tags: z.array(z.string().trim().min(1).max(30)).max(12).default([]),
  status: statusSchema.default("want_to_read"),
});

export const bookUpdateSchema = bookSchema.partial();

export const bookQuerySchema = z.object({
  status: statusSchema.optional(),
  tag: z.string().trim().toLowerCase().optional(),
});

export const bookIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid book id"),
});
