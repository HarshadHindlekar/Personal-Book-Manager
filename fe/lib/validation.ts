import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const bookSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(160, "Title must be 160 characters or less"),
  author: z.string().trim().min(1, "Author is required").max(120, "Author must be 120 characters or less"),
  tags: z.string().refine(
    (value) => value.split(",").map((tag) => tag.trim()).filter(Boolean).length <= 12,
    "Use no more than 12 tags",
  ),
  status: z.enum(["want_to_read", "reading", "completed"]),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type BookFormValues = z.infer<typeof bookSchema>;
