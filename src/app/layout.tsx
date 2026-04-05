import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Plus_Jakarta_Sans } from "next/font/google";

import { getClerkPublicConfig } from "@/server/auth/clerk-config";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Dermatologika",
    template: "%s | Dermatologika",
  },
  description: "Dermatologika public storefront and internal operations platform.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  const clerkConfig = getClerkPublicConfig();

  return (
    <html lang="es" className={plusJakartaSans.variable}>
      <body className="min-h-screen antialiased">
        {clerkConfig.isConfigured ? (
          <ClerkProvider
            publishableKey={clerkConfig.publishableKey}
            signInUrl={clerkConfig.signInUrl}
            signUpUrl={clerkConfig.signUpUrl}
          >
            {children}
          </ClerkProvider>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
