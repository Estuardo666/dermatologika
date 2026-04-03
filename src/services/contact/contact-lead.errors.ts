import "server-only";

export class ContactLeadNotFoundError extends Error {
  constructor(id: string) {
    super(`Contact lead not found: ${id}`);
    this.name = "ContactLeadNotFoundError";
  }
}