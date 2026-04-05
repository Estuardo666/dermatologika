import type { Metadata } from "next";

import { PublicUnifiedAuth } from "@/features/auth/components/public-unified-auth";
import { getClerkPublicConfig } from "@/server/auth/clerk-config";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description: "Crea tu cuenta Dermatologika con correo y contraseña.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  const clerkConfig = getClerkPublicConfig();

  return (
    <PublicUnifiedAuth initialMode="sign-up" isConfigured={clerkConfig.isConfigured} />
  );
}
