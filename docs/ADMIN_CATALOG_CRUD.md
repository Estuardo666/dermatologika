# Admin Catalog CRUD

## Overview

Admin CRUD for the normalized local catalog used by the public storefront and Home featured selections.

## Page

- `GET /admin/catalog`
  - Redirects to the dedicated categories screen.
  - Requires admin session.

- `GET /admin/catalog/categories`
  - Protected admin page with the category library, URL-backed filters, real pagination, column sorting, and bulk selection/actions.
  - Requires admin session.

- `GET /admin/catalog/categories/new`
  - Protected admin page for creating a category in its own dedicated form view.
  - Requires admin session.

- `GET /admin/catalog/categories/:id`
  - Protected admin page for editing an existing category in its own dedicated form view.
  - Includes breadcrumbs and visual save-state feedback inside the record.
  - Requires admin session.

- `GET /admin/catalog/products`
  - Protected admin page with the product library, URL-backed filters, real pagination, column sorting, and bulk selection/actions.
  - Requires admin session.

- `GET /admin/catalog/products/new`
  - Protected admin page for creating a product in its own dedicated form view.
  - Requires admin session.

- `GET /admin/catalog/products/:id`
  - Protected admin page for editing an existing product in its own dedicated form view.
  - Includes breadcrumbs and visual save-state feedback inside the record.
  - Requires admin session.

- `GET /admin/catalog/brands`
  - Protected admin page for listing catalog brands available to products.
  - Requires admin session.

- `GET /admin/catalog/brands/new`
  - Protected admin page for creating a brand with name and image.
  - Requires admin session.

- `GET /admin/catalog/brands/:id`
  - Protected admin page for editing an existing brand.
  - Requires admin session.

- `GET /admin/catalog/badges`
  - Protected admin page for managing reusable global product badge presets.
  - Supports create, edit, activate/deactivate, ordering, color preview, and delete.
  - Requires admin session.

## API Routes

- `GET /api/admin/catalog`
  - Returns categories, products, and available media assets for the admin catalog panel.
  - Requires admin session.

- `POST /api/admin/catalog/categories`
  - Creates a category.
  - Requires admin session.

  Body:
  ```json
  {
    "name": "Dermocosmética",
    "description": "Cuidado diario con base clínica.",
    "slug": "",
    "href": "",
    "isActive": true,
    "mediaAssetId": ""
  }
  ```

  `slug` and `href` are derived automatically from `name` when omitted or sent as empty strings.

- `PUT /api/admin/catalog/categories/:id`
  - Updates an existing category.
  - Returns `409 CONFLICT` when name, slug, or href would collide with another category.
  - Requires admin session.

- `DELETE /api/admin/catalog/categories/:id`
  - Deletes a category if it is not currently featured on Home.
  - Requires admin session.

- `POST /api/admin/catalog/categories/bulk`
  - Applies `activate`, `deactivate`, or `delete` to the selected categories.
  - Rejects deletes when any selected category is still featured on Home.
  - Requires admin session.

- `POST /api/admin/catalog/products`
  - Creates a product.
  - Requires admin session.

  Body:
  ```json
  {
    "name": "Serum despigmentante",
    "brand": "ISDIN",
    "brandId": "brand_123",
    "description": "Tratamiento intensivo para tono irregular.",
    "slug": "",
    "href": "",
    "badge": "Nuevo",
    "badgeColor": "#1F8F6B",
    "isActive": true,
    "categoryId": "cmnfjfhns000avpnwtlqdlar3",
    "categoryIds": ["cmnfjfhns000avpnwtlqdlar3", "cmnfjfhns000bvpnw9h2kq01"],
    "mediaAssetId": ""
  }
  ```

  `slug` and `href` are derived automatically from `name` when omitted or sent as empty strings.

- `PUT /api/admin/catalog/products/:id`
  - Updates an existing product.
  - Returns `409 CONFLICT` when name, slug, or href would collide with another product.
  - Requires admin session.

- `DELETE /api/admin/catalog/products/:id`
  - Deletes a product if it is not currently featured on Home.
  - Requires admin session.

- `POST /api/admin/catalog/brands`
  - Creates a brand.
  - Requires admin session.

  Body:
  ```json
  {
    "name": "ISDIN",
    "mediaAssetId": ""
  }
  ```

- `PUT /api/admin/catalog/brands/:id`
  - Updates an existing brand.
  - Returns `409 CONFLICT` when the name would collide with another brand.
  - Requires admin session.

- `DELETE /api/admin/catalog/brands/:id`
  - Deletes a brand and detaches it from linked products while preserving the product-facing brand text.
  - Requires admin session.

- `POST /api/admin/catalog/products/bulk`
  - Applies `activate`, `deactivate`, or `delete` to the selected products.
  - Rejects deletes when any selected product is still featured on Home.
  - Requires admin session.

- `POST /api/admin/catalog/badges`
  - Creates a global badge preset.
  - Requires admin session.

  Body:
  ```json
  {
    "label": "Nuevo",
    "color": "#1F8F6B",
    "isActive": true,
    "sortOrder": 0
  }
  ```

- `PUT /api/admin/catalog/badges/:id`
  - Updates an existing global badge preset.
  - Returns `409 CONFLICT` when the label would collide with another preset.
  - Requires admin session.

- `DELETE /api/admin/catalog/badges/:id`
  - Deletes a global badge preset.
  - Requires admin session.

## Validation Rules

- `slug`
  - Optional in the admin flow.
  - Lowercase letters, numbers, and hyphens only when provided manually.
- `href`
  - Optional in the admin flow.
  - Must start with `/` when provided manually.
- `mediaAssetId`
  - Optional.
  - Must reference an existing `MediaAsset` when provided.
- `badge`
  - Optional for products.
- `badgeColor`
  - Optional for products.
  - Must be a valid hex color when provided.
- `brand`
  - Derived from the selected brand record in product forms.
  - Existing products are backfilled from external metadata when available and fall back to `Sin marca`.
- `brandId`
  - Required for products in the admin flow.
  - Must reference an existing `Brand`.
- `mediaAssetId`
  - Optional for brands.
  - Must reference an existing `MediaAsset` when provided.
- `label`
  - Required for badge presets.
  - Must be unique across presets.
- `color`
  - Required for badge presets.
  - Must be a valid hex color.
- `sortOrder`
  - Required for badge presets.
  - Must be an integer greater than or equal to `0`.
- `categoryId`
  - Sent as the primary category for compatibility.
  - Automatically mirrors the first entry from `categoryIds`.
- `categoryIds`
  - Required for products.
  - Must contain at least one valid `Category` id.
  - Supports multi-category membership in the admin product editor.

## Error Behavior

- `400 INVALID_JSON`
  - Request body is not valid JSON.
- `404 NOT_FOUND`
  - Category or product does not exist.
- `409 CONFLICT`
  - Duplicate name, slug, or href; or deletion blocked because the entity is still featured on Home.
- `422 VALIDATION_ERROR`
  - Invalid payload or non-existent media asset reference.

## Module Ownership

- `src/features/admin-catalog/`
  - Client-side admin UI and validation schemas.
- `src/services/admin-catalog/`
  - Client fetch helpers and server-side CRUD orchestration.
- `src/server/catalog/`
  - Prisma-backed repository layer for catalog admin and future sync workflows.
- `src/app/api/admin/catalog/`
  - Protected route handlers for catalog CRUD.

## Notes

- Home selections already consume these normalized entities.
- Deletion is intentionally blocked while an entity is still featured on Home to avoid breaking the public composition unexpectedly.
- Product sync metadata remains visible in the admin list and is preserved for future provider integration.
- The admin panel uploads category and product images first through the existing protected media upload route and then persists the resulting `mediaAssetId` on the catalog entity.
- The catalog forms now render a local image preview before upload, using the same media frame pattern as the Home editor.
- Product forms now include badge presets (`Nuevo`, `Oferta`, `Destacado`) plus custom badge text and a color picker.
- Product forms now expose a required `Marca` field and a searchable multi-category selector; the first selected category is treated as the primary one for legacy displays.
- `Marca` is now a dedicated backend-managed entity with its own list, create, and edit screens, plus optional image upload.
- Badge presets are now manageable globally from their own admin screen and feed the product editor as reusable quick options.
- The product editor now renders category selection and badge controls in a single row, and category descriptions are hidden inside the category selector for a denser workflow.
- Public product cards now render the badge in the top-right corner as a fully opaque color pill without blur.
- Public product cards now render the brand as normal body text directly below the product name.
- Category and product libraries now render in a column-based operational table closer to WooCommerce or Shopify, with persisted search and status filters in the URL.
- Category and product libraries now support server-driven column sorting plus row selection with bulk activate, deactivate, and delete actions.
- Pagination is server-driven for both category and product libraries instead of slicing full datasets on the client.
- Category and product records now expose breadcrumbs plus a visible save-state indicator so editors can distinguish between saving, saved, error, and unsaved changes without leaving the record.
- The protected backend now exposes a persistent left sidebar with collapsible sections and richer active states so leads, Home content, categories, and products feel closer to WooCommerce or Shopify navigation patterns.
- Category and product screens now use dedicated library pages plus dedicated create/edit pages, closer to WordPress or Shopify admin flows.
- Product records are now category-backed in the data model, and product creation/update requires at least one valid category selection.
- Product rows in the library keep a compact title-first layout (without description under the title) to match denser operational listing patterns.
