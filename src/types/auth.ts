export const AUTH_ROLES = ["admin", "staff"] as const;

export type AuthRole = (typeof AUTH_ROLES)[number];

export type AuthenticatedUser = {
  email: string;
  role: AuthRole;
};

export type InternalAuthAccount = AuthenticatedUser & {
  password: string;
};

export type AdminLoginInput = {
  email: string;
  password: string;
};

export type AuthSessionPayload = {
  email: string;
  role: AuthRole;
  expiresAt: string;
};