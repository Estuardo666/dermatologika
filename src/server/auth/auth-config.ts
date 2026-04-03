import "server-only";
import { env } from "@/config/env";
import type { InternalAuthAccount } from "@/types/auth";

export const AUTH_SESSION_COOKIE_NAME = "dermatologika_admin_session";

export function getInternalAuthAccounts(): InternalAuthAccount[] {
  return [
    {
      email: env.ADMIN_AUTH_EMAIL,
      password: env.ADMIN_AUTH_PASSWORD,
      role: "admin",
    },
    {
      email: env.STAFF_AUTH_EMAIL,
      password: env.STAFF_AUTH_PASSWORD,
      role: "staff",
    },
  ];
}

export function getAuthSessionConfig(): {
  cookieName: string;
  maxAgeSeconds: number;
  secret: string;
  secure: boolean;
} {
  return {
    cookieName: AUTH_SESSION_COOKIE_NAME,
    maxAgeSeconds: env.AUTH_SESSION_MAX_AGE_SECONDS,
    secret: env.AUTH_SESSION_SECRET,
    secure: env.NODE_ENV === "production",
  };
}
