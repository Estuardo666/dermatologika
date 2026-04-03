import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/server/auth/session";

export async function POST(): Promise<NextResponse> {
  const timestamp = new Date().toISOString();

  try {
    await clearAdminSessionCookie();

    return NextResponse.json(
      {
        success: true,
        data: {
          loggedOut: true,
        },
        timestamp,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Admin logout error:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp,
    });

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to sign out. Please try again.",
        },
        timestamp,
      },
      { status: 500 },
    );
  }
}
