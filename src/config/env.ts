import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .refine(
      (value) => value.startsWith("postgresql://") || value.startsWith("postgres://"),
      "DATABASE_URL must be a valid PostgreSQL connection string",
    ),
  ADMIN_AUTH_EMAIL: z.email("ADMIN_AUTH_EMAIL must be a valid email address"),
  ADMIN_AUTH_PASSWORD: z
    .string()
    .min(12, "ADMIN_AUTH_PASSWORD must be at least 12 characters long"),
  STAFF_AUTH_EMAIL: z.email("STAFF_AUTH_EMAIL must be a valid email address"),
  STAFF_AUTH_PASSWORD: z
    .string()
    .min(12, "STAFF_AUTH_PASSWORD must be at least 12 characters long"),
  CLOUDFLARE_API_TOKEN: z.string().min(1).optional(),
  CLOUDFLARE_R2_ACCOUNT_ID: z.string().min(1).optional(),
  CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().min(1).optional(),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  CLOUDFLARE_R2_S3_API_URL: z.url("CLOUDFLARE_R2_S3_API_URL must be a valid URL").optional(),
  CLOUDFLARE_R2_BUCKET_URL: z.url("CLOUDFLARE_R2_BUCKET_URL must be a valid URL").optional(),
  CLOUDFLARE_R2_PUBLIC_DEV_URL: z
    .url("CLOUDFLARE_R2_PUBLIC_DEV_URL must be a valid URL")
    .optional(),
  EXTERNAL_PRODUCT_SYNC_ENDPOINT: z
    .url("EXTERNAL_PRODUCT_SYNC_ENDPOINT must be a valid URL")
    .optional(),
  EXTERNAL_PRODUCT_SYNC_BEARER_TOKEN: z.string().min(1).optional(),
  EXTERNAL_PRODUCT_SYNC_API_KEY: z.string().min(1).optional(),
  EXTERNAL_PRODUCT_SYNC_SOURCE_SYSTEM_ID: z.string().min(1).optional(),
  AUTH_SESSION_SECRET: z
    .string()
    .min(32, "AUTH_SESSION_SECRET must be at least 32 characters long"),
  AUTH_SESSION_MAX_AGE_SECONDS: z.coerce
    .number()
    .int("AUTH_SESSION_MAX_AGE_SECONDS must be an integer")
    .positive("AUTH_SESSION_MAX_AGE_SECONDS must be greater than 0")
    .max(60 * 60 * 24 * 30, "AUTH_SESSION_MAX_AGE_SECONDS must be 30 days or less")
    .default(60 * 60 * 8),
});

const parsedServerEnv = serverEnvSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  ADMIN_AUTH_EMAIL: process.env.ADMIN_AUTH_EMAIL,
  ADMIN_AUTH_PASSWORD: process.env.ADMIN_AUTH_PASSWORD,
  STAFF_AUTH_EMAIL: process.env.STAFF_AUTH_EMAIL,
  STAFF_AUTH_PASSWORD: process.env.STAFF_AUTH_PASSWORD,
  CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
  CLOUDFLARE_R2_ACCOUNT_ID: process.env.CLOUDFLARE_R2_ACCOUNT_ID,
  CLOUDFLARE_R2_ACCESS_KEY_ID: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  CLOUDFLARE_R2_S3_API_URL: process.env.CLOUDFLARE_R2_S3_API_URL,
  CLOUDFLARE_R2_BUCKET_URL: process.env.CLOUDFLARE_R2_BUCKET_URL,
  CLOUDFLARE_R2_PUBLIC_DEV_URL: process.env.CLOUDFLARE_R2_PUBLIC_DEV_URL,
  EXTERNAL_PRODUCT_SYNC_ENDPOINT: process.env.EXTERNAL_PRODUCT_SYNC_ENDPOINT,
  EXTERNAL_PRODUCT_SYNC_BEARER_TOKEN: process.env.EXTERNAL_PRODUCT_SYNC_BEARER_TOKEN,
  EXTERNAL_PRODUCT_SYNC_API_KEY: process.env.EXTERNAL_PRODUCT_SYNC_API_KEY,
  EXTERNAL_PRODUCT_SYNC_SOURCE_SYSTEM_ID: process.env.EXTERNAL_PRODUCT_SYNC_SOURCE_SYSTEM_ID,
  AUTH_SESSION_SECRET: process.env.AUTH_SESSION_SECRET,
  AUTH_SESSION_MAX_AGE_SECONDS: process.env.AUTH_SESSION_MAX_AGE_SECONDS,
});

if (!parsedServerEnv.success) {
  const formattedErrors = parsedServerEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");

  throw new Error(`Invalid server environment variables: ${formattedErrors}`);
}

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export const env: Readonly<ServerEnv> = Object.freeze(parsedServerEnv.data);
