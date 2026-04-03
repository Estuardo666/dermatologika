import "server-only";
import { NextRequest, NextResponse } from "next/server";
import {
  AuthenticationRequiredError,
  AuthorizationDeniedError,
} from "@/server/auth/auth.errors";
import { getAuthenticatedUser } from "@/server/auth/get-authenticated-user";
import type { AuthenticatedUser } from "@/types/auth";

type AdminAuthResult =
  | { success: true; user: AuthenticatedUser }
  | { success: false; response: NextResponse };

function createAuthErrorResponse(
  status: 401 | 403 | 500,
  code: "UNAUTHORIZED" | "FORBIDDEN" | "INTERNAL_ERROR",
  message: string,
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
      },
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}

export function requireAdminAuth(request: NextRequest): AdminAuthResult {
  try {
    const user = getAuthenticatedUser(request);

    if (user.role !== "admin") {
      throw new AuthorizationDeniedError("Admin permission is required.");
    }

    return {
      success: true,
      user,
    };
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) {
      return {
        success: false,
        response: createAuthErrorResponse(401, "UNAUTHORIZED", error.message),
      };
    }

    if (error instanceof AuthorizationDeniedError) {
      return {
        success: false,
        response: createAuthErrorResponse(403, "FORBIDDEN", error.message),
      };
    }

    return {
      success: false,
      response: createAuthErrorResponse(
        500,
        "INTERNAL_ERROR",
        "Failed to verify admin authentication.",
      ),
    };
  }
}