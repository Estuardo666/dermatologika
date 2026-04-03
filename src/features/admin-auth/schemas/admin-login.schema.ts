import { z } from "zod";

export const adminLoginFormSchema = z.object({
  email: z.email("Please enter a valid email address").trim().toLowerCase(),
  password: z.string().min(1, "Password is required").max(256),
});

export type AdminLoginFormInput = z.infer<typeof adminLoginFormSchema>;
