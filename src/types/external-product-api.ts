/**
 * Abstract contract definition for external product API
 * 
 * This defines what data structure and behavior the system expects from any external product provider.
 * When integrating with a specific API (Shopify, custom API, etc.), implement these interfaces
 * by creating an adapter in src/server/catalog/adapters/
 */

/**
 * Minimal required data from external product
 * This is the intersection of what any provider should offer
 */
export interface ExternalProductMoney {
  amount: number;
  currency: string;
}

export interface ExternalProduct {
  // Unique identifier in the external system (required for deduplication)
  externalId: string;

  // Human-readable fields
  name: string;
  brand?: string;
  description?: string;

  // For generating local slug and URL (must be URL-safe)
  slug: string;

  // Categorical classification (optional but recommended)
  category?: string;

  // Pricing information
  price?: ExternalProductMoney;
  discountPrice?: ExternalProductMoney;

  // Stock/availability
  availability?: {
    inStock: boolean;
    quantity?: number;
  };

  // Image/media reference (as URL or path, provider-specific)
  imageUrl?: string;

  // Product classification badge
  badge?: string;

  // Custom metadata that doesn't fit standard fields
  // System will store this as-is for audit and enrichment
  additionalData?: Record<string, unknown>;

  // Timestamp of last update in external system
  lastModifiedAt?: Date;
}

/**
 * Response from external API when listing/syncing products
 */
export interface ExternalProductListResponse {
  // Array of products to sync
  products: ExternalProduct[];

  // Pagination info (if provider supports it)
  pagination?: {
    page: number;
    pageSize: number;
    totalCount: number;
    hasMore: boolean;
  };

  // Timestamp when this response was generated
  fetchedAt: Date;

  // Optional metadata about the sync (for monitoring/debugging)
  syncMetadata?: {
    source: string; // e.g., "shopify", "custom-api"
    sourceVersion?: string;
    requestId?: string;
  };
}

/**
 * Configuration for connecting to external product API
 * Implementations can extend this with provider-specific config
 */
export interface ExternalProductApiConfig {
  // Base URL or endpoint
  endpoint: string;

  // Authentication method
  auth: {
    type: "bearer" | "api-key" | "oauth" | "custom";
    credentials: {
      token?: string;
      apiKey?: string;
      username?: string;
      password?: string;
      [key: string]: unknown;
    };
  };

  // Optional sync parameters
  syncParams?: {
    // Fetch products modified after this date
    modifiedSince?: Date;

    // Filter criteria (provider-specific)
    filters?: Record<string, unknown>;

    // Pagination size
    pageSize?: number;
  };
}

/**
 * Adapter interface that implementations must follow
 * Each external product API provider gets one adapter
 */
export interface IExternalProductAdapter {
  /**
   * Fetch products from external API
   * Must handle pagination if provider supports it
   */
  fetchProducts(config: ExternalProductApiConfig): Promise<ExternalProductListResponse>;

  /**
   * Optional: Fetch a single product by external ID
   */
  fetchProductById?(externalId: string, config: ExternalProductApiConfig): Promise<ExternalProduct>;

  /**
   * Validate config is complete before attempting sync
   */
  validateConfig(config: ExternalProductApiConfig): { valid: boolean; errors: string[] };

  /**
   * Optional: Test connection to verify credentials work
   */
  testConnection?(config: ExternalProductApiConfig): Promise<{ success: boolean; error?: string }>;
}

/**
 * Conflict resolution strategy when local and external data diverge
 */
export enum SyncConflictStrategy {
  // External wins (overwrite local with external data)
  EXTERNAL_WINS = "external-wins",

  // Local wins (keep local, skip external update)
  LOCAL_WINS = "local-wins",

  // Manual review required (log conflict, don't update)
  MANUAL_REVIEW = "manual-review",

  // Merge strategies based on field (e.g., keep local slug, update external price)
  FIELD_MERGE = "field-merge",
}

/**
 * Deduplication strategy for identifying matching products
 */
export enum SyncDeduplicationStrategy {
  // Match by external ID (primary)
  EXTERNAL_ID = "external-id",

  // Match by slug + category (fallback)
  SLUG_AND_CATEGORY = "slug-and-category",

  // Match by name only (risky)
  NAME_ONLY = "name-only",
}

/**
 * Result of a single product sync operation
 */
export interface SyncProductResult {
  externalId: string;
  status: "created" | "updated" | "skipped" | "error";
  localProductId?: string;
  reason?: string;
  error?: string;
  timestamp: Date;
}

/**
 * Summary of a complete sync operation
 */
export interface SyncOperationResult {
  startedAt: Date;
  completedAt: Date;
  totalProcessed: number;
  created: number;
  updated: number;
  skipped: number;
  errors: number;
  results: SyncProductResult[];
  sourceSystemId: string;
}
