import "server-only";
import { NextRequest } from "next/server";
import { AuthenticationRequiredError } from "@/server/auth/auth.errors";
import { getAuthSessionConfig } from "@/server/auth/auth-config";
import { verifySessionToken } from "@/server/auth/session";
import type { AuthenticatedUser } from "@/types/auth";

export function getAuthenticatedUser(request: NextRequest): AuthenticatedUser {
  const { cookieName } = getAuthSessionConfig();
  const sessionToken = request.cookies.get(cookieName)?.value;

  if (!sessionToken) {
    throw new AuthenticationRequiredError("Admin session is required.");
  }

  const payload = verifySessionToken(sessionToken);
  if (!payload) {
    throw new AuthenticationRequiredError("Admin session is invalid or expired.");
  }

  return {
    email: payload.email,
    role: payload.role,
  };
}
