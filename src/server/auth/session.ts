import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getAuthSessionConfig } from "@/server/auth/auth-config";
import type { AuthSessionPayload, AuthenticatedUser } from "@/types/auth";

function encodeBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function createSessionSignature(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function getSessionCookieBaseOptions() {
  const config = getAuthSessionConfig();

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: config.secure,
    path: "/",
  };
}

export function createSessionToken(user: AuthenticatedUser): string {
  const { maxAgeSeconds, secret } = getAuthSessionConfig();
  const payload: AuthSessionPayload = {
    email: user.email,
    role: user.role,
    expiresAt: new Date(Date.now() + maxAgeSeconds * 1000).toISOString(),
  };

  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = createSessionSignature(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): AuthSessionPayload | null {
  const { secret } = getAuthSessionConfig();
  const [encodedPayload, providedSignature, ...rest] = token.split(".");

  if (!encodedPayload || !providedSignature || rest.length > 0) {
    return null;
  }

  const expectedSignature = createSessionSignature(encodedPayload, secret);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(providedBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as AuthSessionPayload;

    if (!payload.email || !payload.role || !payload.expiresAt) {
      return null;
    }

    const expiresAt = new Date(payload.expiresAt);
    if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function setAdminSessionCookie(user: AuthenticatedUser): Promise<void> {
  const cookieStore = await cookies();
  const { cookieName, maxAgeSeconds } = getAuthSessionConfig();

  cookieStore.set(cookieName, createSessionToken(user), {
    ...getSessionCookieBaseOptions(),
    maxAge: maxAgeSeconds,
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  const { cookieName } = getAuthSessionConfig();

  cookieStore.set(cookieName, "", {
    ...getSessionCookieBaseOptions(),
    expires: new Date(0),
    maxAge: 0,
  });
}
