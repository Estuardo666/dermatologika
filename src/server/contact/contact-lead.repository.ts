import "server-only";
import { prisma } from "@/server/db/prisma";
import type {
  ContactLead,
  ContactLeadCreateInput,
  ContactLeadListFilters,
  ContactLeadUpdatableStatus,
} from "@/types/contact-lead";

/**
 * ContactLeadRepository - data access layer for ContactLead
 * Centralizes all database operations for the contact domain
 */

export const contactLeadRepository = {
  /**
   * Create a new contact lead
   */
  async create(input: ContactLeadCreateInput): Promise<ContactLead> {
    try {
      const lead = await prisma.contactLead.create({
        data: {
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          message: input.message,
          source: input.source,
          status: "new",
        },
      });

      return lead;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create contact lead: ${error.message}`);
      }
      throw new Error("Failed to create contact lead: Unknown error");
    }
  },

  /**
   * Find a contact lead by ID
   */
  async findById(id: string): Promise<ContactLead | null> {
    try {
      return await prisma.contactLead.findUnique({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to find contact lead: ${error.message}`);
      }
      throw new Error("Failed to find contact lead: Unknown error");
    }
  },

  /**
   * Find contacts by email
   */
  async findByEmail(email: string): Promise<ContactLead[]> {
    try {
      return await prisma.contactLead.findMany({
        where: { email },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to find contact leads: ${error.message}`);
      }
      throw new Error("Failed to find contact leads: Unknown error");
    }
  },

  /**
   * Find all contact leads with pagination and optional filters
   */
  async findAll(filters: ContactLeadListFilters): Promise<ContactLead[]> {
    try {
      return await prisma.contactLead.findMany({
        where: {
          ...(filters.status !== undefined && { status: filters.status }),
          ...(filters.source !== undefined && { source: filters.source }),
        },
        orderBy: { createdAt: "desc" },
        skip: filters.skip,
        take: filters.take,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch contact leads: ${error.message}`);
      }
      throw new Error("Failed to fetch contact leads: Unknown error");
    }
  },

  /**
   * Count contact leads matching filters (for pagination totals)
   */
  async count(filters: Pick<ContactLeadListFilters, "status" | "source">): Promise<number> {
    try {
      return await prisma.contactLead.count({
        where: {
          ...(filters.status !== undefined && { status: filters.status }),
          ...(filters.source !== undefined && { source: filters.source }),
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to count contact leads: ${error.message}`);
      }
      throw new Error("Failed to count contact leads: Unknown error");
    }
  },

  /**
   * Update contact lead status
   */
  async updateStatusById(
    id: string,
    status: ContactLeadUpdatableStatus,
  ): Promise<ContactLead> {
    try {
      return await prisma.contactLead.update({
        where: { id },
        data: { status },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update contact lead: ${error.message}`);
      }
      throw new Error("Failed to update contact lead: Unknown error");
    }
  },
};
