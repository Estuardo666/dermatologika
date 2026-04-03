import "server-only";
import { PrismaClient } from "@prisma/client";
import { env } from "@/config/env";

type GlobalPrisma = {
  prismaClient: PrismaClient | undefined;
};

const globalForPrisma = globalThis as typeof globalThis & GlobalPrisma;

export const prisma =
  globalForPrisma.prismaClient ??
  new PrismaClient({
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
  });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prismaClient = prisma;
}
