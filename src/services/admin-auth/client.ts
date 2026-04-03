"use client";

import type { AdminAuthError } from "@/types/admin-auth";

export async function loginAdmin(email: string, password: string): Promise<void> {
  const response = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!response.ok) {
    let errorCode: string;
    let errorMessage: string;

    try {
      const errorBody = (await response.json()) as {
        error?: { code?: string; message?: string };
      };
      errorCode = errorBody.error?.code ?? "SERVER_ERROR";
      errorMessage =
        errorBody.error?.message ?? "Failed to sign in. Please try again.";
    } catch {
      errorCode = "SERVER_ERROR";
      errorMessage = "Failed to sign in. Please try again.";
    }

    if (response.status === 401) {
      const error: AdminAuthError = {
        code: "INVALID_CREDENTIALS",
        message: errorMessage || "Invalid email or password",
      };
      throw error;
    }

    const error: AdminAuthError = {
      code: (errorCode as AdminAuthError["code"]) ?? "SERVER_ERROR",
      message: errorMessage,
    };
    throw error;
  }
}

export async function logoutAdmin(): Promise<void> {
  const response = await fetch("/api/admin/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to sign out. Please try again.");
  }
}
