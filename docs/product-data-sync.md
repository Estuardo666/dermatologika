# Product Data Sync

This document defines how product data should be integrated, persisted, synchronized, and consumed inside the Dermatologika system.

Its purpose is to establish a clear source-of-truth model before the external product integration is fully implemented, so frontend, backend, data modeling, and future automation all follow the same architecture.

---

# 1. Purpose

The system is expected to integrate product data from an external API in the future.

Instead of making the frontend depend directly on that external source, the application will persist a normalized local copy of products in PostgreSQL and expose products through internal backend contracts.

This approach exists to improve:

* stability
* performance
* search and filtering
* internal data relationships
* SEO-oriented content enrichment where relevant
* resilience when the external API is unavailable

---

# 2. Architectural Decision

Products are not frontend-owned data.

Products must be treated as externally sourced domain entities with a backend-controlled local persisted representation.

The application will use a hybrid model:

* the external API provides operational inventory data
* the local PostgreSQL database stores a normalized application read model
* the frontend consumes internal backend APIs only

This means the system does not rely on direct frontend-to-external-API access.

---

# 3. Source of Truth Model

## 3.1 External Source of Truth

Unless explicitly redefined later, the external API is the canonical operational source of truth for externally controlled inventory fields such as:

* price
* stock
* availability
* external status
* SKU if externally owned
* other inventory-related fields controlled by the external system

## 3.2 Local Source of Truth

The local PostgreSQL database is the application source of truth for:

* internal product relations
* local categorization
* internal tagging
* SEO enrichment
* merchandising metadata
* presentation-specific fields
* UI ordering or grouping
* any controlled internal extensions to the product model

## 3.3 Principle

If a field is controlled by the external inventory system, it must not become silently re-owned by the local app.

If a field is created only for internal product presentation, content, or platform behavior, it may be locally owned.

Ownership of each field must be explicit.

---

# 4. Why Products Are Stored Locally

The application stores products in PostgreSQL even though products originate from an external API.

This local persistence is required for the following reasons:

## 4.1 Frontend Stability

The frontend should not be tightly coupled to an external service contract.

A local backend-owned product model allows the UI to remain stable even if the external API changes.

## 4.2 Performance

Serving products from a local database is generally faster and more predictable than making an external API request during normal page rendering or user interaction.

## 4.3 Search and Filtering

Local persistence makes it easier to support:

* product search
* filtering
* sorting
* category pages
* internal indexes
* future merchandising logic

## 4.4 SEO and Enrichment

If public-facing product-related pages are created later, local persistence supports:

* clean routes
* metadata generation
* enriched product content
* internal linking
* canonical product presentation

## 4.5 Operational Resilience

If the external API becomes temporarily unavailable, the system may still serve the most recent synchronized local snapshot instead of failing completely.

---

# 5. High-Level Data Flow

The intended product data flow is:

```txt
External Product API
  -> backend integration layer
  -> validation and mapping
  -> normalized PostgreSQL product records
  -> internal backend contracts
  -> frontend consumption

  The frontend must never bypass this flow by calling the external product API directly.

6. Backend Responsibilities

The backend owns all product integration behavior related to the external source.

This includes:

connecting to the external API
validating external payloads
mapping external data into internal types
creating or updating local product records
tracking synchronization state
resolving canonical field ownership
exposing stable internal product contracts to the frontend
handling external API failures safely

Product synchronization is a backend concern, not a UI concern.

7. Frontend Rules

The frontend must consume products only through internal application contracts.

The frontend must not:

call the external product API directly
assume the external API response shape
embed external API business rules in UI components
own canonical product inventory data
hardcode product catalog data expected to come from the sync pipeline

Temporary mock data is acceptable only during clearly identified prototyping phases and must not be mistaken for the intended production data flow.

8. Product Record Design

Each synchronized product should preserve both external traceability and internal usability.

At minimum, the local model should support:

internal database identifier
external source identifier
source system name
product name
slug if used
SKU if available
description if relevant
primary image or media references if relevant
price
stock
availability
status
category references if relevant
external updated timestamp if available
local last synchronized timestamp
sync status

The exact schema may evolve, but the model must preserve both:

traceability to the external source
stable internal usage across the application
9. Field Ownership Rules

To prevent ambiguity, product fields must be treated according to ownership.

9.1 Externally Owned Fields

These fields are expected to be owned by the external system unless documented otherwise:

price
stock
availability
external inventory status
external identifiers
externally managed product codes

These fields must be synchronized from the external API and should not be freely edited locally.

9.2 Locally Owned Fields

These fields may be owned inside the application if needed:

SEO copy
merchandising labels
internal badges
curated grouping
featured flags
local display order
platform-specific presentation metadata
content enrichments not managed by the external inventory source
9.3 Shared or Conditional Fields

Some fields may require project-specific decisions, such as:

product descriptions
category mapping
image prioritization
brand labeling
local visibility state

Whenever ownership is mixed or conditional, the rule must be documented explicitly instead of being inferred in code.

10. Synchronization Strategy

The system must support controlled synchronization from the external API into PostgreSQL.

The architecture should be compatible with the following sync modes:

initial catalog ingestion
recurring scheduled sync
manual sync trigger
incremental sync where supported
future webhook-triggered sync if the external provider supports it

The exact first implementation may be simpler, but the architecture should not block future expansion.

11. Synchronization Rules
11.1 Initial Ingestion

The initial sync should create normalized local records for products coming from the external source.

11.2 Ongoing Updates

Subsequent syncs should update externally owned dynamic fields such as:

price
stock
availability
external status
11.3 Stable Identity

Each local product must be linked to a stable external identifier so the sync process updates the correct local record.

11.4 Timestamps

Each synchronized record should store when it was last updated locally and, if available, when the external source last updated it.

11.5 Safe Failure Handling

If part of a synchronization job fails, the system should fail clearly and traceably rather than corrupting local product state silently.

12. Conflict Resolution Rules

The system must have a predictable rule for conflicts between local values and external values.

Default rule:

externally owned fields must be overwritten by the external source during synchronization
locally owned fields must not be accidentally destroyed by external sync unless explicitly mapped that way

If a product contains both external and local data, synchronization must update only the fields that belong to the external source or are intentionally mapped.

Do not implement full-record replacement if it risks deleting local enrichments.

13. API Failure Behavior

The application must handle external API failure safely.

If the external API is unavailable:

the sync process should fail clearly
errors should be logged at the correct backend layer
the application may continue serving the most recent synchronized local snapshot
the system must preserve clarity that the served data is the latest cached local state, not newly confirmed live inventory

The UI should not make false claims about real-time data if the external source has not been successfully refreshed.

14. Data Integrity Requirements

Product sync must preserve data integrity.

Rules:

validate external payloads before persistence
reject malformed or ambiguous payloads
map external fields explicitly
avoid silent fallback behavior that corrupts meaning
preserve traceability between external records and local records
do not duplicate products without documented reason
keep product identity stable across repeated sync cycles
15. Security Considerations

External integration logic belongs in secure backend layers only.

Rules:

do not expose external API credentials to the client
do not expose secret-aware integration code to the frontend
validate all external input before writing to the database
control sync triggers if manual sync is later exposed operationally
avoid leaking raw external API errors directly to end users
16. Observability and Auditability

The system should preserve enough metadata to understand sync behavior over time.

Recommended tracking includes:

last successful sync timestamp
last attempted sync timestamp if relevant
sync status
error summary where useful
external source identifier
record creation and update timestamps

This does not require a full audit system on day one, but the architecture should not prevent observability.

17. Implementation Boundaries

To keep the architecture maintainable, product sync responsibilities should be separated clearly.

Recommended separation:

integration client for external API communication
validation and mapping layer
repository or persistence layer
sync orchestration service
internal API layer for frontend consumption

Do not collapse all of this into page code, UI components, or oversized route handlers.

18. Recommended Internal Contract Principle

The frontend should consume stable product contracts shaped for application needs, not raw external payloads.

Internal product responses should:

expose only what the frontend needs
use stable naming
remain typed
hide irrelevant external implementation details
avoid coupling the UI to a vendor-specific structure
19. Temporary Development Rule

During early development, mock product data may be used to unblock UI work.

However:

mock data must be clearly temporary
product structure should already reflect the intended normalized domain shape
mocks must not create architectural assumptions that conflict with the future sync model
frontend code should be designed so it can later switch to internal backend contracts cleanly
20. Future Extensions

This architecture should remain compatible with future capabilities such as:

category sync
image sync
product variants
multi-source catalog ingestion
product visibility rules
merchandising layers
webhook-triggered updates
scheduled cron sync
conflict review tools
admin sync controls
sync monitoring dashboards

The first implementation should stay simple, but the design must not block future growth.

21. Non-Negotiable Rules

The following rules apply across the project:

do not make the frontend depend directly on the external product API
do not hardcode production product catalog data that is expected to come from sync
do not treat externally owned inventory fields as unrestricted local fields
do not overwrite local enrichments carelessly during sync
do not hide source-of-truth ambiguity
do not leave product ownership undefined
22. Final Standard

The product sync architecture is correct only if it:

preserves clear ownership of data
protects frontend stability
keeps backend integration controlled
supports synchronization without ambiguity
avoids direct UI coupling to the external source
remains understandable and maintainable as the system grows