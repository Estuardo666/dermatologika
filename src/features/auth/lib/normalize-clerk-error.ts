interface ClerkErrorShape {
  errors?: Array<{
    longMessage?: string;
    message?: string;
  }>;
}

function isClerkErrorShape(error: unknown): error is ClerkErrorShape {
  return typeof error === "object" && error !== null && "errors" in error;
}

export function normalizeClerkErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (isClerkErrorShape(error)) {
    const message = error.errors?.[0]?.longMessage ?? error.errors?.[0]?.message;
    if (message) {
      return message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}
