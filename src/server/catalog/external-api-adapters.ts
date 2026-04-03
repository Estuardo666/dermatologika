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
      (item: any) => {
        const product: ExternalProduct = {
          externalId: item.id,
          name: item.name || item.title,
          slug: item.slug || this.generateSlug(item.name || item.title),
        };

        if (item.brand || item.marca || item.manufacturer || item.vendor || item.brandName) {
          product.brand = item.brand || item.marca || item.manufacturer || item.vendor || item.brandName;
        }
        if (item.description) product.description = item.description;
        if (item.category) product.category = item.category;
        if (item.price) {
          product.price = {
            amount: item.price.amount || item.price,
            currency: item.price.currency || "USD",
          };
        }
        if (item.availability || item.inStock !== undefined) {
          product.availability = {
            inStock: item.availability?.inStock ?? item.inStock ?? true,
          };
          if (item.availability?.quantity) product.availability.quantity = item.availability.quantity;
          if (item.quantity) product.availability.quantity = item.quantity;
        }
        if (item.image || item.imageUrl) {
          product.imageUrl = item.image || item.imageUrl;
        }
        if (item.badge) product.badge = item.badge;
        if (item.updatedAt) product.lastModifiedAt = new Date(item.updatedAt);
        if (Object.keys(item).length > 0) product.additionalData = item;

        return product;
      }
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
    const product: ExternalProduct = {
      externalId: item.id,
      name: item.name || item.title,
      slug: item.slug || this.generateSlug(item.name || item.title),
    };

    if (item.brand || item.marca || item.manufacturer || item.vendor || item.brandName) {
      product.brand = item.brand || item.marca || item.manufacturer || item.vendor || item.brandName;
    }
    if (item.description) product.description = item.description;
    if (item.category) product.category = item.category;
    if (item.price) {
      product.price = {
        amount: item.price.amount || item.price,
        currency: item.price.currency || "USD",
      };
    }
    if (item.availability || item.inStock !== undefined) {
      product.availability = {
        inStock: item.availability?.inStock ?? item.inStock ?? true,
        ...(item.availability?.quantity !== undefined && {
          quantity: item.availability.quantity,
        }),
        ...(item.quantity !== undefined && { quantity: item.quantity }),
      };
    }
    if (item.image || item.imageUrl) {
      product.imageUrl = item.image || item.imageUrl;
    }
    if (item.badge) product.badge = item.badge;
    if (item.additionalData || Object.keys(item).length > 0) {
      product.additionalData = item;
    }
    if (item.updatedAt) product.lastModifiedAt = new Date(item.updatedAt);

    return product;
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

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
}
