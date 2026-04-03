import { NextRequest, NextResponse } from "next/server";
import { adminLoginInputSchema } from "@/features/auth/schemas/admin-auth.schema";
import {
  AuthenticationRequiredError,
} from "@/server/auth/auth.errors";
import { authenticateUserCredentials } from "@/server/auth/authenticate-user-credentials";
import { setAdminSessionCookie } from "@/server/auth/session";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const timestamp = new Date().toISOString();

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_JSON",
            message: "Request body must be valid JSON",
          },
          timestamp,
        },
        { status: 400 },
      );
    }

    const validationResult = adminLoginInputSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");

      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: `Validation failed: ${errors}`,
          },
          timestamp,
        },
        { status: 422 },
      );
    }

    const user = authenticateUserCredentials(validationResult.data);
    await setAdminSessionCookie(user);

    return NextResponse.json(
      {
        success: true,
        data: {
          user,
        },
        timestamp,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: error.message,
          },
          timestamp,
        },
        { status: 401 },
      );
    }

    console.error("Admin login error:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp,
    });

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to sign in. Please try again.",
        },
        timestamp,
      },
      { status: 500 },
    );
  }
}
