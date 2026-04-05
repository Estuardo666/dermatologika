import "server-only";

const PUBLIC_CLERK_SIGN_IN_URL = "/login";
const PUBLIC_CLERK_SIGN_UP_URL = "/register";

export interface ClerkPublicConfig {
  publishableKey: string;
  signInUrl: string;
  signUpUrl: string;
  isConfigured: boolean;
}

export function getClerkPublicConfig(): ClerkPublicConfig {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() ?? "";
  const secretKey = process.env.CLERK_SECRET_KEY?.trim() ?? "";

  return {
    publishableKey,
    signInUrl: PUBLIC_CLERK_SIGN_IN_URL,
    signUpUrl: PUBLIC_CLERK_SIGN_UP_URL,
    isConfigured: Boolean(publishableKey && secretKey),
  };
}
