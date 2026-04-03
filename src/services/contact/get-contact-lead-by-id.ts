import "server-only";
import { contactLeadRepository } from "@/server/contact/contact-lead.repository";
import { ContactLeadNotFoundError } from "@/services/contact/contact-lead.errors";
import type { ContactLead, ContactLeadDetailResponse } from "@/types/contact-lead";
import type { ContactLeadSource, ContactLeadStatus } from "@/types/contact-lead";

/**
 * GetContactLeadByIdService - application service for reading a single lead by id
 */
export async function getContactLeadByIdService(
  id: string,
): Promise<ContactLeadDetailResponse> {
  const lead = await contactLeadRepository.findById(id);

  if (!lead) {
    throw new ContactLeadNotFoundError(id);
  }

  return contactLeadToDetailResponse(lead);
}

function contactLeadToDetailResponse(lead: ContactLead): ContactLeadDetailResponse {
  return {
    id: lead.id,
    fullName: lead.fullName,
    email: lead.email,
    phone: lead.phone,
    message: lead.message,
    source: lead.source as ContactLeadSource,
    status: lead.status as ContactLeadStatus,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  };
}