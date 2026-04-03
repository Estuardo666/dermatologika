import { z } from "zod";
import {
  CONTACT_LEAD_SOURCES,
  CONTACT_LEAD_STATUSES,
  CONTACT_LEAD_UPDATABLE_STATUSES,
} from "@/types/contact-lead";

/**
 * Validation schemas for ContactLead domain
 * - Input: what clients send to the API
 * - Output: what the API returns
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-\+\(\)]{7,}$/;

export const createContactLeadInputSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(255, "Full name must not exceed 255 characters"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .refine(
      (val) => EMAIL_REGEX.test(val),
      "Email must be a valid email address",
    ),

  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || PHONE_REGEX.test(val),
      "Phone must be a valid phone number",
    )
    .transform((val) => val || null),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must not exceed 5000 characters"),

  source: z.enum(CONTACT_LEAD_SOURCES).optional().default("web-form" as const),
});

export type CreateContactLeadInput = z.infer<typeof createContactLeadInputSchema>;

export const contactLeadResponseSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
  status: z.enum(CONTACT_LEAD_STATUSES),
  createdAt: z.string().datetime(),
});

export type ContactLeadResponseDto = z.infer<typeof contactLeadResponseSchema>;

/**
 * Query params schema for GET /api/contact-leads
 * Coerces string query params to numbers for page/limit
 */
export const listContactLeadsQuerySchema = z.object({
  status: z.enum(CONTACT_LEAD_STATUSES).optional(),

  source: z.enum(CONTACT_LEAD_SOURCES).optional(),

  page: z.coerce
    .number()
    .int("page must be an integer")
    .positive("page must be a positive number")
    .default(1),

  limit: z.coerce
    .number()
    .int("limit must be an integer")
    .positive("limit must be a positive number")
    .max(100, "limit must not exceed 100")
    .default(20),
});

export type ListContactLeadsQuery = z.infer<typeof listContactLeadsQuerySchema>;

export const contactLeadRouteParamsSchema = z.object({
  id: z.string().trim().min(1, "id is required"),
});

export type ContactLeadRouteParamsInput = z.infer<typeof contactLeadRouteParamsSchema>;

export const updateContactLeadStatusBodySchema = z.object({
  status: z.enum(CONTACT_LEAD_UPDATABLE_STATUSES),
});

export type UpdateContactLeadStatusBody = z.infer<
  typeof updateContactLeadStatusBodySchema
>;

/**
 * API Response envelope - consistent response structure
 */
export const apiSuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.unknown(),
  timestamp: z.string().datetime(),
});

export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
  timestamp: z.string().datetime(),
});
