import { z } from "zod";

export const adminLoginInputSchema = z
  .object({
    email: z.email("Email must be a valid email address"),
    password: z.string().min(1, "Password is required").max(256),
  })
  .strict();
