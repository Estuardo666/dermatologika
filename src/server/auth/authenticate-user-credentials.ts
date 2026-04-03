import "server-only";
import { timingSafeEqual } from "node:crypto";
import {
  AuthenticationRequiredError,
  AuthorizationDeniedError,
} from "@/server/auth/auth.errors";
import { getInternalAuthAccounts } from "@/server/auth/auth-config";
import type { AdminLoginInput, AuthenticatedUser } from "@/types/auth";

function matchesCredential(provided: string, expected: string): boolean {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
}

export function authenticateUserCredentials(
  input: AdminLoginInput,
): AuthenticatedUser {
  const matchedAccount = getInternalAuthAccounts().find(
    (account) =>
      matchesCredential(input.email, account.email) &&
      matchesCredential(input.password, account.password),
  );

  if (!matchedAccount) {
    throw new AuthenticationRequiredError("Invalid email or password.");
  }

  return {
    email: matchedAccount.email,
    role: matchedAccount.role,
  };
}

export function authenticateAdminCredentials(
  input: AdminLoginInput,
): AuthenticatedUser {
  const user = authenticateUserCredentials(input);

  if (user.role !== "admin") {
    throw new AuthorizationDeniedError("Admin permission is required.");
  }

  return user;
}
