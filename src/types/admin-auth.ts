import { z } from "zod";

export const adminAuthErrorCodeSchema = z.enum([
  "INVALID_CREDENTIALS",
  "VALIDATION_ERROR",
  "SERVER_ERROR",
  "NETWORK_ERROR",
]);

export type AdminAuthErrorCode = z.infer<typeof adminAuthErrorCodeSchema>;

export type AdminAuthError = {
  code: AdminAuthErrorCode;
  message: string;
};
