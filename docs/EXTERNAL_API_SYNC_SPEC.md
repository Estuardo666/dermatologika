# External Product API Sync Specification

## Overview

This document provides:
1. **Questions to ask your external API provider** when you have the meeting
2. **Schema your system expects** from any external product dataset
3. **Integration points** and how sync works
4. **Deployment and monitoring** guidance

**Status:** Ready for provider integration. Infrastructure is in place and awaiting API contract details.

---

## Part 1: Questions for Your API Provider Meeting

### Endpoint & Authentication

**Q1: What is the base endpoint URL for the product API?**
- Example: `https://api.provider.com/v1` or `https://shop.provider.com/api/2024-01`
- Note: Will be stored in `EXTERNAL_API_ENDPOINT` environment variable

**Q2: What authentication method does your API use?**
- [ ] Bearer token
- [ ] API key (header-based)
- [ ] OAuth2
- [ ] Basic auth (username/password)
- [ ] Other: ___________

If selected, provide:
- Header name if custom (default: `Authorization` for Bearer, `X-API-Key` for API key)
- Token/key format and expiration policy

**Q3: How long are credentials valid? Do they expire?**
- Need to know token lifetime and refresh strategy
- Impacts monitoring and alerting

**Q4: Does your API have rate limits?**
- Requests per second / minute / day?
- Backoff strategy? (Retry-After header, exponential backoff, etc.)

**Q5: Can you provide a sandbox/test endpoint for integration testing?**
- Dermatologika runs in development, staging, and production
- Each environment needs its own API credentials for safety

---

### Product Data Structure

**Q6: What fields does each product have?**

Minimum required (by system contract):
- `externalId` (unique identifier in your system)
- `name` or `title`
- `slug` or URL-safe identifier
- `description` or `summary`

Recommended (for better storefront):
- `price` (amount + currency)
- `discountPrice` or `salePrice` (optional promotional price)
- `availability` or `inStock` (boolean + optional quantity)
- `category` or `categoryId`
- `image` or `imageUrl` (for product cards)
- `lastModifiedAt` (timestamp for incremental sync)

Additional fields that might exist:
- `badge` or `label` (e.g., "New", "Sale", "Limited")
- `sku` or internal reference codes
- `variants` (if products have size/color options)
- `seo` fields (title, description, keywords)
- Custom attributes specific to your business

**Q7: Can you provide a JSON example for a typical product?**

Example format we expect:
```json
{
  "id": "PROD-12345",
  "name": "Product Name",
  "description": "Product description",
  "slug": "product-name",
  "category": "skincare",
  "price": {
    "amount": 49.99,
    "currency": "USD"
  },
  "discountPrice": {
    "amount": 39.99,
    "currency": "USD"
  },
  "inStock": true,
  "quantity": 150,
  "image": "https://cdn.provider.com/images/prod-12345.jpg",
  "badge": "New",
  "updatedAt": "2026-03-31T10:00:00Z",
  "customAttribute": "value"
}
```

**Q8: Are product descriptions plain text or HTML?**
- Plain text: No special handling needed
- HTML: System will sanitize before display
- Markdown: System will convert to HTML

**Q9: How many products are in your catalog?**
- Helps estimate sync time and resource allocation
- Impacts caching and pagination strategy

---

### Pagination & Filtering

**Q10: Does your API support pagination?**
- [ ] Offset/limit (e.g., `?offset=0&limit=50`)
- [ ] Page/pageSize (e.g., `?page=1&pageSize=50`)
- [ ] Cursor-based (e.g., `?cursor=abc123&limit=50`)
- [ ] Other: ___________

What's the recommended page size?

**Q11: Can products be filtered by modification date?**
- Example format: `?modifiedSince=2026-03-31T00:00:00Z`
- Enables incremental sync (faster than full sync)
- Recommendation: Ask if they support this

**Q12: Can products be filtered by category or other criteria?**
- Helps organize initial import
- Example: `?category=skincare` or `?status=active`

**Q13: What happens if I request a page beyond the end of results?**
- Do you return empty array? Error? Last page again?
- Helps handle edge case of sync during product updates

---

### Data Integrity & Sync

**Q14: How do you handle product deletions?**
- Option A: Soft delete (product marked as `deleted=true` but still returned)
- Option B: Hard delete (product removed, not returned)
- Option C: Deleted products list available separately
- Option D: Other

This affects how we handle removed products in our catalog.

**Q15: Is there a product status field? What values can it have?**
- Active/Inactive?
- Draft/Published/Archived?
- Visible/Hidden?

System maps this to local `isActive` boolean.

**Q16: What timezone are timestamps in?**
- All timestamps in UTC? 
- Or provider's timezone?

Critical for sync conflict detection and audit logs.

**Q17: How quickly are updates reflected in your API after a change?**
- Real-time?
- Cached for N seconds?
- Batch updated daily?

Affects how often we can safely sync.

**Q18: Do you provide webhooks for product changes?**
- Allows real-time push notifications instead of polling
- More efficient than periodic sync
- If yes: What events? How do we subscribe?

---

### Support & SLA

**Q19: What's your API uptime SLA?**
- Affects alert thresholds in monitoring

**Q20: Who do I contact for API support during integration?**
- Technical contact name, email, Slack channel?
- Support hours?

**Q21: Is there API documentation (Swagger/OpenAPI)?**
- Helps with implementation and testing

**Q22: Do you have a simulator or mock API for testing?**
- Allows us to develop without hitting live API

---

## Part 2: System Architecture (What We're Building)

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ Dermatologika Product Sync Pipeline                            │
└─────────────────────────────────────────────────────────────────┘

1. FETCH PHASE
   External API → [Adapter Fetches Products]
   ↓
   Validates against contract (externalId, name, slug, etc.)

2. PROCESS PHASE
   For each product:
   ├─ Deduplicate (find matching local product if exists)
   ├─ Detect conflicts (local vs external data)
   ├─ Resolve conflicts (external-wins, local-wins, manual review)
   └─ Normalize to local schema

3. PERSIST PHASE
   ├─ Create new products
   ├─ Update existing products
   ├─ Record sync metadata (externalId, lastSyncedAt, version)
   └─ Maintain audit log

4. ENRICHMENT PHASE (Future)
   ├─ Fetch product images from external CDN
   ├─ Process and optimize for web
   └─ Upload to Cloudflare R2
```

### Database Schema Changes

Product table now has sync tracking fields:

```sql
-- New fields in Product table
externalId         STRING? @unique        -- Unique ID from external API
externalSourceId   STRING?               -- Which system (e.g., "shopify")
lastSyncedAt       DATETIME?             -- When last synced
syncVersion        INT     @default(0)   -- Increment on each sync
externalMetadata   JSON?                 -- Store raw external data
```

Examples:
```python
# Product synced from Shopify
{
  id: "prod_abc123",
  name: "Retinol Serum",
  externalId: "gid://shopify/Product/8234720",
  externalSourceId: "shopify",
  lastSyncedAt: "2026-03-31T14:30:00Z",
  syncVersion: 3,
  externalMetadata: {
    "shopifyId": "8234720",
    "handle": "retinol-serum",
    "variants": [...],
    "collections": [...]
  }
}
```

---

## Part 3: Integration Steps (When You Have the API)

Before the real provider is connected, Dermatologika already exposes a protected single-product sync route in mock mode from the admin product editor. This lets the team validate UI behavior, sync tracking, and field locking without calling a live external API.

When the provider configuration exists in the environment, the same editor can switch to `live` mode for an individual product and call the external endpoint only for that record.

### Step 1: Create Adapter Implementation
File: `src/server/catalog/external-api-adapters.ts`

Implement `IExternalProductAdapter` interface:
```typescript
class YourProviderAdapter implements IExternalProductAdapter {
  validateConfig(config) { ... }
  testConnection(config) { ... }
  fetchProducts(config) { ... }
  fetchProductById(id, config) { ... }
}
```

### Step 2: Configure API Connection
File: `.env.local`

```env
EXTERNAL_API_ENDPOINT=https://api.provider.com/v1/products
EXTERNAL_API_AUTH_TYPE=bearer
EXTERNAL_API_TOKEN=your-api-token-here
EXTERNAL_API_SOURCE_ID=shopify  # or your-provider-name
```

### Step 3: Create Sync Route
File: `src/app/api/admin/catalog/sync/route.ts` (new)

Protected admin endpoint to trigger sync:
```typescript
export async function POST(request: Request) {
  // Check admin auth
  // Get config from env
  // Call ProductSyncService.sync()
  // Return results
}
```

### Step 4: Define Conflict Resolution Strategy
Choose one for your business:

- **EXTERNAL_WINS**: External API is source of truth (recommended for catalogs)
- **LOCAL_WINS**: Local edits are preserved (recommended if you edit products in admin)
- **MANUAL_REVIEW**: Conflicts flagged for human review (safest but slowest)
- **FIELD_MERGE**: Some fields from external, some from local (complex)

### Step 5: Monitor & Alert
Track sync metrics:
- Success/failure rate
- Products created/updated/skipped
- Sync duration
- API response times

---

## Part 4: Sample Integration Code (Template)

Once you have the API details, fill in this template:

### `src/app/api/admin/catalog/sync/route.ts`
```typescript
import { requireAdminAuth } from "@/server/auth/require-admin-auth";
import { prisma } from "@/server/db/prisma";
import {
  ProductSyncService,
  SyncConflictStrategy,
  SyncDeduplicationStrategy,
} from "@/server/catalog/product-sync.service";
import { YourProviderAdapter } from "@/server/catalog/external-api-adapters";

export async function POST(request: Request) {
  // Auth check
  const adminSession = await requireAdminAuth(request);
  if (!adminSession) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const syncService = new ProductSyncService(prisma);
    const adapter = new YourProviderAdapter();

    const result = await syncService.sync({
      adapter,
      apiConfig: {
        endpoint: process.env.EXTERNAL_API_ENDPOINT!,
        auth: {
          type: "bearer",
          credentials: {
            token: process.env.EXTERNAL_API_TOKEN!,
          },
        },
        syncParams: {
          pageSize: 100,
          modifiedSince: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24h
        },
      },
      deduplicationStrategy: SyncDeduplicationStrategy.EXTERNAL_ID,
      conflictStrategy: SyncConflictStrategy.EXTERNAL_WINS,
      sourceSystemId: "shopify",
      autoCreateCategories: false,
      incrementalSync: true,
      dryRun: false,
    });

    return Response.json(result);
  } catch (error) {
    console.error("Sync failed:", error);
    return Response.json(
      { error: "Sync failed", details: String(error) },
      { status: 500 }
    );
  }
}
```

---

## Part 5: What Happens Next

### Immediate (This Week)
- [ ] Schedule meeting with API provider
- [ ] Collect answers to questions in Part 1
- [ ] Create adapter implementation based on answers

### Short-term (Next Week)
- [ ] Test adapter against their sandbox/test endpoint
- [ ] Verify data mapping
- [ ] Create admin UI for triggering sync
- [ ] Run initial full sync with production data

### Medium-term (Next 2 Weeks)
- [ ] Set up incremental sync (daily or on-demand)
- [ ] Implement webhook support if available
- [ ] Create sync monitoring dashboard
- [ ] Define SLA and alerting rules
- [ ] Document fallback/rollback procedures

### Long-term
- [ ] Image sync pipeline (download and optimize product images)
- [ ] Real-time sync via webhooks
- [ ] Multi-provider support (if needed)
- [ ] Conflict resolution UI for manual review cases
- [ ] Historical audit trail for product changes

---

## Part 6: Deployment Checklist

Before going live with sync:

- [ ] Adapter implementation complete and tested
- [ ] Sandbox/staging environment syncs successfully
- [ ] Conflict resolution strategy documented
- [ ] Rollback procedure documented
- [ ] Monitoring and alerting configured
- [ ] Admin can trigger sync and see results
- [ ] Error handling and retry logic tested
- [ ] Rate limiting and backoff implemented
- [ ] Documentation updated in ADMIN_GUIDE.md
- [ ] Team trained on sync operations

---

## Troubleshooting

### "Connection failed"
- Check endpoint URL is correct
- Verify API key/token is valid and not expired
- Test connection using adapter's `testConnection()` method

### "Validation error: Invalid external product"
- Check product export from provider
- Verify all required fields are present (externalId, name, slug)
- Confirm slug is URL-safe (lowercase, hyphens only)

### "Deduplication failed"
- Check if products with same externalId already exist
- May indicate duplicate sync or data corruption
- Review conflict resolution strategy

### "Sync timeout"
- Reduce pageSize in syncParams
- Run incremental sync (modifiedSince) instead of full sync
- Contact API provider about performance

---

## References

- `src/types/external-product-api.ts` — Interface contracts
- `src/server/catalog/external-product-sync-fields.ts` — Central sync-managed price, offer, and stock normalization
- `src/server/catalog/product-sync.service.ts` — Sync orchestration
- `src/server/catalog/external-api-adapters.ts` — Example adapters
- `src/app/api/admin/catalog/products/[id]/sync/route.ts` — Protected single-product sync endpoint
- Prisma schema: `prisma/schema.prisma`

### Minimum environment for live single-product sync

- `EXTERNAL_PRODUCT_SYNC_ENDPOINT`
- `EXTERNAL_PRODUCT_SYNC_BEARER_TOKEN` or `EXTERNAL_PRODUCT_SYNC_API_KEY`
- Optional: `EXTERNAL_PRODUCT_SYNC_SOURCE_SYSTEM_ID`

---

**Last Updated:** March 31, 2026  
**Status:** Ready for provider integration
