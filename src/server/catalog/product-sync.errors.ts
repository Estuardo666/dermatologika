/**
 * Product sync errors
 */

export class ProductSyncError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ProductSyncError";
  }
}

export class ExternalApiFetchError extends ProductSyncError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "EXTERNAL_API_FETCH_ERROR", context);
    this.name = "ExternalApiFetchError";
  }
}

export class ValidationError extends ProductSyncError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "VALIDATION_ERROR", context);
    this.name = "ValidationError";
  }
}

export class DeduplicationError extends ProductSyncError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "DEDUPLICATION_ERROR", context);
    this.name = "DeduplicationError";
  }
}

export class ConflictResolutionError extends ProductSyncError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "CONFLICT_RESOLUTION_ERROR", context);
    this.name = "ConflictResolutionError";
  }
}

export class InvalidConfigurationError extends ProductSyncError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "INVALID_CONFIGURATION", context);
    this.name = "InvalidConfigurationError";
  }
}
