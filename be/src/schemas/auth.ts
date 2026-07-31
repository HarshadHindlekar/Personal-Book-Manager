import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(8).max(100),
});

export const signupSchema = credentialsSchema.extend({
  name: z.string().trim().min(2).max(80),
});
