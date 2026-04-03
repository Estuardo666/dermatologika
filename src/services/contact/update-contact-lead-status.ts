import "server-only";
import { contactLeadRepository } from "@/server/contact/contact-lead.repository";
import type { UpdateContactLeadStatusBody } from "@/features/contact/schemas/contact-lead.schema";
import type { ContactLead, ContactLeadResponse } from "@/types/contact-lead";
import { ContactLeadNotFoundError } from "@/services/contact/contact-lead.errors";

/**
 * UpdateContactLeadStatusService - application service for controlled status changes
 */
export async function updateContactLeadStatusService(
  id: string,
  input: UpdateContactLeadStatusBody,
): Promise<ContactLeadResponse> {
  const existingLead = await contactLeadRepository.findById(id);

  if (!existingLead) {
    throw new ContactLeadNotFoundError(id);
  }

  const updatedLead = await contactLeadRepository.updateStatusById(id, input.status);

  return contactLeadToResponse(updatedLead);
}

function contactLeadToResponse(lead: ContactLead): ContactLeadResponse {
  return {
    id: lead.id,
    fullName: lead.fullName,
    email: lead.email,
    status: lead.status as ContactLeadResponse["status"],
    createdAt: lead.createdAt.toISOString(),
  };
}