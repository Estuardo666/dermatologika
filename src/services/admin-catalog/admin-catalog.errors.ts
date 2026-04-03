export class CatalogConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatalogConflictError";
  }
}

export class CatalogBulkActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatalogBulkActionError";
  }
}