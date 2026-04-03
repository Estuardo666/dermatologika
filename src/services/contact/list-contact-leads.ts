import "server-only";
import { contactLeadRepository } from "@/server/contact/contact-lead.repository";
import type { ListContactLeadsQuery } from "@/features/contact/schemas/contact-lead.schema";
import type {
  ContactLeadListItem,
  ContactLeadListFilters,
  ContactLeadPaginatedResponse,
  ContactLeadSource,
  ContactLeadStatus,
} from "@/types/contact-lead";
import type { ContactLead } from "@/types/contact-lead";

/**
 * ListContactLeadsService - application service for paginated lead listing
 * Orchestrates pagination, filtering, and repository calls
 */
export async function listContactLeadsService(
  query: ListContactLeadsQuery,
): Promise<ContactLeadPaginatedResponse> {
  const { page, limit, status, source } = query;
  const skip = (page - 1) * limit;

  const filters: ContactLeadListFilters = {
    skip,
    take: limit,
    ...(status !== undefined && { status }),
    ...(source !== undefined && { source }),
  };

  const countFilters = {
    ...(status !== undefined && { status }),
    ...(source !== undefined && { source }),
  };

  const [leads, total] = await Promise.all([
    contactLeadRepository.findAll(filters),
    contactLeadRepository.count(countFilters),
  ]);

  return {
    items: leads.map(contactLeadToListItem),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

function contactLeadToListItem(lead: ContactLead): ContactLeadListItem {
  return {
    id: lead.id,
    fullName: lead.fullName,
    email: lead.email,
    source: lead.source as ContactLeadSource,
    status: lead.status as ContactLeadStatus,
    createdAt: lead.createdAt.toISOString(),
  };
}
