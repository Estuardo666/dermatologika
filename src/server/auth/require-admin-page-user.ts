import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getAuthSessionConfig } from "@/server/auth/auth-config";
import { verifySessionToken } from "@/server/auth/session";
import type { AuthenticatedUser } from "@/types/auth";

export async function requireAdminPageUser(): Promise<AuthenticatedUser> {
  const cookieStore = await cookies();
  const { cookieName } = getAuthSessionConfig();
  const sessionToken = cookieStore.get(cookieName)?.value;

  if (!sessionToken) {
    redirect("/admin/login");
  }

  const payload = verifySessionToken(sessionToken);
  if (!payload || payload.role !== "admin") {
    redirect("/admin/login");
  }

  return {
    email: payload.email,
    role: payload.role,
  };
}
