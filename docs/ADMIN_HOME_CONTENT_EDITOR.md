# Admin Home Content Editor

## Overview

Minimal admin editor for the public Home content and canonical media asset references.

## Routes

- `GET /api/admin/content/home`
  - Returns the current Home editor payload and available media assets.
  - Requires admin session.
- `PUT /api/admin/content/home`
  - Updates the persisted Home snapshot used by the public storefront.
  - Requires admin session.
- `GET /api/admin/media-assets`
  - Lists canonical media asset references stored in PostgreSQL.
  - Requires admin session.
- `POST /api/admin/media-assets`
  - Registers or updates a `MediaAsset` from an existing Cloudflare R2 object.
  - Requires admin session.
- `POST /api/admin/media-assets/upload`
  - Uploads a file to Cloudflare R2 and then registers or updates the canonical `MediaAsset` record.
  - Requires admin session.

## Page

- `src/app/admin/content/home/page.tsx`
  - Protected admin page for editing the Home snapshot and selecting the three persisted hero slides.

## Storage Behavior

- The editor now supports direct admin uploads to Cloudflare R2 through `POST /api/admin/media-assets/upload`.
- Manual registration still exists for files that are already present in the bucket.
- When a local file is selected, the editor tries to infer `kind`, suggested `storageKey`, image dimensions, and video duration before upload.
- The upload form also renders a local image or video preview before the file is sent to R2.
- If `publicUrl` is omitted when registering an existing asset, the backend derives it from `CLOUDFLARE_R2_PUBLIC_DEV_URL` plus the provided `storageKey`.
- Direct upload requires server-side credentials via `CLOUDFLARE_R2_ACCESS_KEY_ID` and `CLOUDFLARE_R2_SECRET_ACCESS_KEY`.
- If those credentials are not configured, the upload route returns `503 R2_UPLOAD_UNAVAILABLE` instead of failing silently.

## Scope of the First Editor

This editor persists:

- main hero copy
- hero CTA labels and hrefs
- three persisted hero slide references for slides 1, 2 and 3
- headings and descriptions for categories, products, trust, and CTA
- relational selections for featured categories and featured products
- JSON-backed trust highlights only

Derived sections such as extra promo bands, secondary shelves, and editorial blocks continue to be generated from the persisted base contract in the server mapping layer.

## Local Commands

1. `npm run prisma:migrate:dev`
2. `npm run prisma:seed`
3. `npm run dev`
