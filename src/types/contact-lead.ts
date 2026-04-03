/**
 * ContactLead types - shared across the contact domain
 * Represents a lead captured from contact forms or other capture channels
 */

export const CONTACT_LEAD_STATUSES = [
  "new",
  "contacted",
  "converted",
  "rejected",
] as const;

export const CONTACT_LEAD_UPDATABLE_STATUSES = [
  "new",
  "contacted",
  "converted",
] as const;

export const CONTACT_LEAD_SOURCES = [
  "web-form",
  "landing-page",
  "email",
  "referral",
] as const;

export type ContactLeadStatus = (typeof CONTACT_LEAD_STATUSES)[number];
export type ContactLeadUpdatableStatus =
  (typeof CONTACT_LEAD_UPDATABLE_STATUSES)[number];
export type ContactLeadSource = (typeof CONTACT_LEAD_SOURCES)[number];

export type ContactLeadBase = {
  fullName: string;
  email: string;
  phone: string | null;
  message: string;
  source: string; // generic string from Prisma; validation happens in schemas
  status: string; // generic string from Prisma; validation happens in schemas
};

export type ContactLeadCreateInput = {
  fullName: string;
  email: string;
  phone: string | null;
  message: string;
  source: ContactLeadSource;
};

export type ContactLeadUpdateStatusInput = {
  status: ContactLeadUpdatableStatus;
};

export type ContactLeadRouteParams = {
  id: string;
};

export type ContactLead = ContactLeadBase & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactLeadResponse = {
  id: string;
  fullName: string;
  email: string;
  status: ContactLeadStatus;
  createdAt: string;
};

export type ContactLeadDetailResponse = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  message: string;
  source: ContactLeadSource;
  status: ContactLeadStatus;
  createdAt: string;
  updatedAt: string;
};

/**
 * Filters and pagination options passed to the repository findAll method
 */
export type ContactLeadListFilters = {
  status?: ContactLeadStatus;
  source?: ContactLeadSource;
  skip: number;
  take: number;
};

/**
 * Single item in a paginated list response
 */
export type ContactLeadListItem = {
  id: string;
  fullName: string;
  email: string;
  source: ContactLeadSource;
  status: ContactLeadStatus;
  createdAt: string;
};

/**
 * Pagination metadata included in list responses
 */
export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

/**
 * Paginated response shape for GET /api/contact-leads
 */
export type ContactLeadPaginatedResponse = {
  items: ContactLeadListItem[];
  pagination: PaginationMeta;
};
