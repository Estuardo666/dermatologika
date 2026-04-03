/**
 * Template adapter for external product API
 *
 * Replace this with actual implementation when you have the API contract.
 * Example below shows what you'll need to implement for any provider.
 */

import {
  ExternalProduct,
  ExternalProductApiConfig,
  ExternalProductListResponse,
  IExternalProductAdapter,
} from "@/types/external-product-api";

const DEFAULT_EXTERNAL_CURRENCY = "USD";

function generateGenericSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function readMoneyAmount(candidate: unknown): number | null {
  if (typeof candidate === "number") {
    return Number.isFinite(candidate) && candidate >= 0 ? candidate : null;
  }

  if (typeof candidate === "string") {
    const parsedValue = Number(candidate);
    return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : null;
  }

  if (typeof candidate === "object" && candidate !== null && "amount" in candidate) {
    return readMoneyAmount((candidate as { amount?: unknown }).amount);
  }

  return null;
}

function readCurrency(...candidates: unknown[]): string {
  for (const candidate of candidates) {
    if (typeof candidate === "object" && candidate !== null && "currency" in candidate) {
      const currency = (candidate as { currency?: unknown }).currency;
      if (typeof currency === "string" && currency.trim().length > 0) {
        return currency.trim().toUpperCase();
      }
    }
  }

  return DEFAULT_EXTERNAL_CURRENCY;
}

function readStockQuantity(...candidates: unknown[]): number | null {
  for (const candidate of candidates) {
    if (typeof candidate === "number") {
      return Number.isFinite(candidate) && candidate >= 0 ? Math.floor(candidate) : null;
    }

    if (typeof candidate === "string") {
      const parsedValue = Number(candidate);
      if (Number.isFinite(parsedValue) && parsedValue >= 0) {
        return Math.floor(parsedValue);
      }
    }
  }

  return null;
}

function mapGenericRestItemToExternalProduct(item: Record<string, unknown>): ExternalProduct {
  const name = typeof item.name === "string"
    ? item.name
    : typeof item.title === "string"
      ? item.title
      : "Producto externo";
  const externalId = typeof item.id === "string" || typeof item.id === "number"
    ? String(item.id)
    : typeof item.externalId === "string" || typeof item.externalId === "number"
      ? String(item.externalId)
      : name;
  const slug = typeof item.slug === "string" && item.slug.trim().length > 0
    ? item.slug
    : generateGenericSlug(name);
  const currency = readCurrency(
    item.discountPrice,
    item.salePrice,
    item.offerPrice,
    item.promotionalPrice,
    item.regularPrice,
    item.listPrice,
    item.originalPrice,
    item.price,
  );
  const regularPriceAmount = readMoneyAmount(
    item.regularPrice ?? item.listPrice ?? item.originalPrice ?? item.price,
  );
  const discountPriceAmount = readMoneyAmount(
    item.discountPrice ?? item.salePrice ?? item.offerPrice ?? item.promotionalPrice,
  );
  const availabilityObject = typeof item.availability === "object" && item.availability !== null
    ? item.availability as { inStock?: unknown; quantity?: unknown }
    : null;
  const quantity = readStockQuantity(
    availabilityObject?.quantity,
    item.quantity,
    item.stock,
    item.inventory,
  );
  const hasAvailabilitySignal =
    item.availability !== undefined ||
    item.inStock !== undefined ||
    item.quantity !== undefined ||
    item.stock !== undefined ||
    item.inventory !== undefined;

  const product: ExternalProduct = {
    externalId,
    name,
    slug,
  };

  if (typeof item.brand === "string" || typeof item.marca === "string" || typeof item.manufacturer === "string" || typeof item.vendor === "string" || typeof item.brandName === "string") {
    product.brand = String(item.brand ?? item.marca ?? item.manufacturer ?? item.vendor ?? item.brandName);
  }

  if (typeof item.description === "string") {
    product.description = item.description;
  }

  if (typeof item.category === "string") {
    product.category = item.category;
  }

  if (regularPriceAmount !== null) {
    product.price = {
      amount: regularPriceAmount,
      currency,
    };
  }

  if (discountPriceAmount !== null) {
    product.discountPrice = {
      amount: discountPriceAmount,
      currency,
    };
  }

  if (hasAvailabilitySignal) {
    const inStock = typeof availabilityObject?.inStock === "boolean"
      ? availabilityObject.inStock
      : typeof item.inStock === "boolean"
        ? item.inStock
        : quantity !== null
          ? quantity > 0
          : true;

    product.availability = {
      inStock,
      ...(quantity !== null ? { quantity } : {}),
    };
  }

  if (typeof item.image === "string" || typeof item.imageUrl === "string") {
    product.imageUrl = String(item.image ?? item.imageUrl);
  }

  if (typeof item.badge === "string") {
    product.badge = item.badge;
  }

  if (typeof item.updatedAt === "string" || typeof item.updatedAt === "number" || item.updatedAt instanceof Date) {
    product.lastModifiedAt = new Date(item.updatedAt);
  }

  if (Object.keys(item).length > 0) {
    product.additionalData = item;
  }

  return product;
}

/**
 * Example: Shopify API Adapter
 * When you get a real Shopify API, implement like this
 */
export class ShopifyProductAdapter implements IExternalProductAdapter {
  async fetchProducts(
    config: ExternalProductApiConfig
  ): Promise<ExternalProductListResponse> {
    // 1. Build request with pagination
    // 2. Call Shopify API endpoint
    // 3. Map Shopify products to ExternalProduct format
    // 4. Return with pagination info

    throw new Error("Shopify adapter not yet implemented");
  }

  async fetchProductById(
    externalId: string,
    config: ExternalProductApiConfig
  ): Promise<ExternalProduct> {
    // Fetch single product by Shopify ID
    throw new Error("Shopify adapter not yet implemented");
  }

  validateConfig(config: ExternalProductApiConfig) {
    const errors: string[] = [];

    if (!config.endpoint) errors.push("Shopify endpoint required");
    if (!config.auth.credentials.token) errors.push("Shopify API token required");

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  async testConnection(config: ExternalProductApiConfig) {
    // Test credentials by making minimal API call
    try {
      const response = await fetch(`${config.endpoint}/products?limit=1`, {
        headers: {
          Authorization: `Bearer ${config.auth.credentials.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Connection failed",
      };
    }
  }
}

/**
 * Example: Generic REST API Adapter
 * Use this if your provider exposes standard REST JSON API
 */
export class GenericRestApiAdapter implements IExternalProductAdapter {
  async fetchProducts(
    config: ExternalProductApiConfig
  ): Promise<ExternalProductListResponse> {
    const url = new URL(config.endpoint);

    // Add pagination
    if (config.syncParams?.pageSize) {
      url.searchParams.set("limit", String(config.syncParams.pageSize));
    }

    // Add modified-since filter if available
    if (config.syncParams?.modifiedSince) {
      url.searchParams.set(
        "modifiedSince",
        config.syncParams.modifiedSince.toISOString()
      );
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add auth header based on type
    if (config.auth.type === "bearer" && config.auth.credentials.token) {
      headers["Authorization"] = `Bearer ${config.auth.credentials.token}`;
    } else if (config.auth.type === "api-key" && config.auth.credentials.apiKey) {
      headers["X-API-Key"] = config.auth.credentials.apiKey;
    }

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      throw new Error(
        `API returned ${response.status}: ${await response.text()}`
      );
    }

    const data = await response.json();

    // Map API response to standard format
    // You'll need to adjust based on actual API structure
    const products: ExternalProduct[] = (data.products || data.items || []).map(
      (item: Record<string, unknown>) => mapGenericRestItemToExternalProduct(item)
    );

    const requestId = response.headers.get("x-request-id");
    return {
      products,
      fetchedAt: new Date(),
      syncMetadata: {
        source: "generic-rest-api",
        ...(requestId && { requestId }),
      },
    };
  }

  async fetchProductById(
    externalId: string,
    config: ExternalProductApiConfig
  ): Promise<ExternalProduct> {
    // Endpoint pattern: {endpoint}/{externalId}
    const url = `${config.endpoint}/${externalId}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (config.auth.type === "bearer" && config.auth.credentials.token) {
      headers["Authorization"] = `Bearer ${config.auth.credentials.token}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch product ${externalId}: ${response.status}`
      );
    }

    const item = await response.json();
    return mapGenericRestItemToExternalProduct(item as Record<string, unknown>);
  }

  validateConfig(config: ExternalProductApiConfig) {
    const errors: string[] = [];

    if (!config.endpoint) errors.push("Endpoint URL required");
    if (!config.auth.credentials.token && !config.auth.credentials.apiKey) {
      errors.push("API token or API key required");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  async testConnection(config: ExternalProductApiConfig) {
    try {
      const headers: Record<string, string> = {};

      if (config.auth.type === "bearer" && config.auth.credentials.token) {
        headers["Authorization"] = `Bearer ${config.auth.credentials.token}`;
      } else if (config.auth.type === "api-key" && config.auth.credentials.apiKey) {
        headers["X-API-Key"] = config.auth.credentials.apiKey;
      }

      const response = await fetch(config.endpoint, { headers });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Connection failed",
      };
    }
  }
}
