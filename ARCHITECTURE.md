# ARCHITECTURE.md

# Dermatologika — System Architecture

This document defines the intended technical architecture for the Dermatologika project.

Its purpose is to provide a clear, scalable, and maintainable system design that aligns product delivery, engineering, SEO, data integrity, and security.

This file should be used as the architectural reference when building new modules, reviewing implementations, or making structural decisions.

---

# 1. Architecture Goals

The Dermatologika system must be designed to be:

* modular
* scalable
* secure
* maintainable
* SEO-ready
* performance-aware
* accessible
* easy to reason about

The architecture must support both public-facing experiences and protected operational workflows without mixing responsibilities.

---

# 2. High-Level System View

Dermatologika is structured around multiple architectural layers.

## Primary Layers

1. Presentation Layer
   User-facing UI, layouts, pages, and shared components.

2. Feature Layer
   Domain-driven modules that group related UI, state, flows, and logic.

3. Application Layer
   Services, orchestration logic, and use-case coordination.

4. Server Layer
   Auth-protected logic, database access, backend workflows, and integrations.

5. Data Layer
   PostgreSQL schemas, entities, constraints, and persistence rules.

6. SEO and Content Layer
   Metadata generation, structured data, semantic hierarchy, and content architecture.

7. Documentation and Governance Layer
   Agent rules, project rules, architecture decisions, and implementation docs.

---

# 3. Product Surfaces

The project should be understood as a system with at least two major surfaces.

## 3.1 Public Surface

This includes:

* marketing pages
* informational pages
* service pages
* SEO landing pages
* contact and lead-generation flows
* branded content and trust-building content

### Goals

* clear information hierarchy
* medical trust and credibility
* strong SEO foundations
* conversion-oriented design
* fast and responsive browsing experience

## 3.2 Protected Operational Surface

This includes internal or restricted workflows such as:

* items or inventory views
* customer or record management
* internal dashboards
* admin workflows
* protected data operations
* data import/export processes

### Goals

* strong access control
* clean operational flows
* stable data handling
* clear auditability where needed
* maintainable backend behavior

These two surfaces must share foundations where useful, but they must not collapse into the same uncontrolled architecture.

---

# 4. Core Architectural Principles

## 4.1 Separate Concerns Strictly

Do not mix:

* UI presentation with business logic
* public content structure with admin logic
* database access with client components
* SEO logic with arbitrary view code
* server-only functionality with client code

## 4.2 Design for Growth

The architecture must support:

* new sections
* new features
* new data entities
* new internal workflows
* content expansion
* new integrations

without requiring structural rewrites.

## 4.3 Favor Explicit Structure

The system should make ownership clear.

A developer or AI agent should be able to answer quickly:

* where this feature belongs
* where this data is validated
* where this API is defined
* where this component should live
* where this metadata comes from

## 4.4 Keep the Core Predictable

As the project grows, the architecture should become more organized, not more improvised.

---

# 5. Recommended Project Structure

```txt
/.
├── AGENTS.md
├── PROJECT_RULES.md
├── ARCHITECTURE.md
├── README.md
├── docs/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── lib/
│   ├── services/
│   ├── server/
│   ├── hooks/
│   ├── types/
│   ├── styles/
│   ├── config/
│   ├── seo/
│   └── tests/
└── package.json
```

---

# 6. Folder Responsibilities

## `src/app/`

Owns route-level composition.

Typical responsibilities:

* page entry points
* layouts
* route segments
* route metadata wiring
* top-level page assembly

Rules:

* do not put heavy business logic here
* do not turn pages into giant files
* compose from `features/` and `components/`

## `src/components/`

Owns shared, reusable UI building blocks.

Typical responsibilities:

* buttons
* cards
* modals
* forms primitives
* layout primitives
* shared visual patterns

Rules:

* avoid domain-specific assumptions unless clearly intentional
* keep these components reusable
* do not access the database from here

## `src/features/`

Owns domain-driven feature modules.

Typical responsibilities:

* feature-specific UI
* feature-specific hooks
* local business flow coordination
* feature forms
* feature states and transformations

Examples:

* `features/contact/`
* `features/home/`
* `features/services/`
* `features/seo-pages/`
* `features/customers/`
* `features/inventory/`

Rules:

* group code by business feature
* keep feature ownership explicit
* move shared logic out when reuse becomes real

## `src/lib/`

Owns low-level shared helpers.

Typical responsibilities:

* formatters
* utility functions
* small abstractions
* framework-agnostic helpers

Rules:

* do not turn `lib/` into a dumping ground
* move domain logic into the domain that owns it

## `src/services/`

Owns application-level services and orchestration helpers.

Typical responsibilities:

* calling internal endpoints
* external integrations
* reusable application flows
* service abstractions consumed by UI or backend layers
* checkout pricing preview clients and admin promotion orchestration helpers

Rules:

* keep responsibilities clear
* avoid mixing sensitive server-only logic into client-safe services

## `src/server/`

Owns server-only logic.

Typical responsibilities:

* authentication and authorization
* database access
* public content reads and media resolution boundaries
* protected workflows
* secure actions
* route handlers or server-side use cases
* integrations requiring secrets
* pricing and promotion rule evaluation

Rules:

* this is the secure backend boundary
* nothing here should leak accidentally to the client
* validation and permission checks belong here when relevant

### Pricing and Promotions Module

The pricing module is split across clear ownership boundaries:

* `src/server/pricing/` evaluates promotion rules, scope filters, shipping incentives, and checkout price previews.
* `src/services/admin-promotions/` orchestrates protected promotion CRUD workflows for admin APIs.
* `src/app/api/admin/promotions/` exposes authenticated promotion management contracts.
* `src/app/api/checkout/price-preview/` exposes the public checkout pricing preview contract used by checkout UI.

This module must remain a pricing layer on top of product base prices.

It must not overwrite synchronized product pricing fields just to represent temporary offers.

## `src/hooks/`

Owns reusable React hooks.

Rules:

* hooks must have clear purpose
* hooks should not hide excessive business complexity
* move domain-specific complexity to feature or service layers when necessary

## `src/types/`

Owns shared TypeScript contracts.

Typical responsibilities:

* DTOs
* entity types
* API response types
* shared interfaces
* enums or discriminated unions where appropriate

Rules:

* centralize repeated contracts
* avoid conflicting versions of the same business type

## `src/styles/`

Owns global style structure.

Typical responsibilities:

* global CSS
* token references
* theme definitions
* shared visual foundations

## `src/config/`

Owns centralized configuration.

Typical responsibilities:

* environment mappings
* route config
* role config
* app-level constants
* feature flags if used

## `src/seo/`

Owns SEO-specific infrastructure.

Typical responsibilities:

* metadata builders
* canonical patterns
* structured data helpers
* sitemap or SEO-related utilities

Rules:

* keep public metadata logic centralized where possible
* avoid spreading SEO decisions randomly across the app

## `src/tests/`

Owns testing logic and helpers.

Typical responsibilities:

* test utilities
* feature tests
* integration tests
* regression-critical flow coverage

---

# 7. Application Layers and Allowed Dependencies

To prevent architectural drift, layers should depend in predictable ways.

## Allowed Dependency Direction

Preferred direction:

Presentation → Features → Services → Server/Data

Shared utilities and shared types may be consumed where appropriate.

## Rules

* `components/` should not depend on page-specific implementations.
* `app/` may compose `features/` and `components/`.
* `features/` may use `services/`, `hooks/`, `types/`, and shared UI.
* `server/` may use database logic, validation, secrets, and protected integrations.
* client-side code must not directly depend on secret-aware server internals.

## Anti-Patterns To Avoid

* component importing raw database client
* page owning all feature logic
* service layer bypassing validation rules
* duplicated contracts across frontend and backend
* SEO logic scattered into unrelated files

---

# 8. Rendering Strategy

The architecture should use the simplest rendering model that supports performance, SEO, and maintainability.

## Preferred Principles

* prefer server-rendered or server-composed content when useful for SEO and performance
* use client components only when interactivity requires them
* avoid pushing everything to the client by default
* keep protected and sensitive logic on the server

## Public SEO-Driven Pages

Likely best served by:

* server-first rendering
* statically optimized output where appropriate
* metadata generation integrated with route-level composition

## Interactive Internal Workflows

May use:

* client-side interaction where it improves usability
* server-backed actions and protected endpoints
* carefully scoped client state

---

# 9. Data Architecture

## 9.1 Data Model Philosophy

Data must be structured to preserve:

* integrity
* clarity
* traceability
* scalability
* operational usefulness

## 9.2 Data Categories

The system may contain multiple kinds of data, such as:

* public content entities
* service content entities
* customer-related records
* inventory or item records
* internal operational records
* user and role data
* audit-sensitive actions if applicable

## 9.3 Data Rules

* each important entity needs a clear owner
* field naming must be consistent
* source of truth must be explicit
* destructive actions should be controlled
* normalized storage is preferred where appropriate
* derived data should not quietly replace source data

## 9.4 Import and Export Concerns

For operational data flows:

* validate mappings before processing
* separate raw input from normalized data when needed
* log failures clearly
* avoid silent corruption or ambiguous transformations

---

# 10. API and Backend Architecture

## 10.1 Backend Responsibilities

The backend layer owns:

* validation
* auth
* permission checks
* business rules
* data persistence
* server-side orchestration
* secure external integrations

## 10.2 Route Design Principles

Routes or handlers should:

* be predictable
* be typed
* validate input
* call appropriate services or domain logic
* avoid becoming monolithic

## 10.3 Service Layer Role

The service layer should:

* coordinate business use cases
* reduce duplication across handlers
* isolate reusable workflows
* keep domain behavior understandable

## 10.4 Validation Layer

Validation should be explicit for:

* body payloads
* query params
* route params
* filters and sorting
* file metadata
* external inputs

---

# 11. Frontend Architecture

## 11.1 UI Structure

The frontend should be divided into:

* route-level composition in `app/`
* shared UI primitives in `components/`
* feature-specific interfaces in `features/`

## 11.2 Design System Alignment

UI should rely on a centralized system for:

* colors
* spacing
* typography
* radii
* shadows
* container widths
* reusable interaction patterns

## 11.3 State Strategy

Use the smallest appropriate state model.

Principles:

* keep local state local
* avoid unnecessary global state
* do not duplicate server truth without reason
* use derived state when possible
* prefer predictable flow over state sprawl

## 11.4 Forms and User Actions

Forms should:

* validate clearly
* provide useful feedback
* handle loading and submission states
* fail safely
* avoid ambiguous user outcomes

---

# 12. SEO Architecture

## 12.1 SEO Ownership

SEO is not a cosmetic afterthought.

It is an architectural concern that affects:

* page structure
* rendering decisions
* metadata generation
* internal linking
* content modeling
* URL strategy

## 12.2 Public Content Requirements

Public pages should support:

* one clear H1
* proper H2 and H3 hierarchy
* semantic sections
* route-level metadata
* clean canonical strategy
* internal linking where useful
* structured data where appropriate

## 12.3 SEO Utilities

Centralize reusable SEO logic in `src/seo/` when possible.

This may include:

* metadata generators
* schema helpers
* open graph helpers
* canonical builders

---

# 13. Security Architecture

## 13.1 Security Boundaries

Security should be enforced through architecture, not only conventions.

Core boundaries include:

* client vs server separation
* authenticated vs unauthenticated flows
* authorized vs unauthorized actions
* public vs protected data access
* secret-aware vs client-safe code

## 13.2 Sensitive Areas

Extra care is required around:

* login and session logic
* protected actions
* record creation and updates
* imports and exports
* file uploads
* admin operations
* external integrations with credentials

## 13.3 Security Controls

The architecture should support:

* explicit auth checks
* authorization checks
* validation before processing
* safe error behavior
* rate limiting where relevant
* secure secret handling

---

# 14. Testing Architecture

## 14.1 Testing Scope

Testing should focus on the most meaningful risk areas.

Priority areas include:

* critical public page behavior
* lead or contact flows
* auth-protected actions
* operational CRUD workflows
* import/export reliability
* SEO-sensitive structure where practical
* regression-prone shared components

## 14.2 Test Types

Where appropriate, use:

* unit tests for isolated logic
* integration tests for feature and backend flow validation
* UI verification for critical screens
* manual QA for visual and responsive confidence

---

# 15. Documentation Architecture

## 15.1 Core Governance Files

The project should maintain at least:

* `AGENTS.md`
* `PROJECT_RULES.md`
* `ARCHITECTURE.md`
* `README.md`
* supporting docs inside `docs/`

## 15.2 Decision Records

Important architectural decisions should be documented when they affect:

* module boundaries
* rendering strategy
* auth model
* database design
* SEO model
* integrations
* large refactors

---

# 16. Recommended Feature Delivery Flow

A healthy implementation flow for new features is:

1. define scope and constraints
2. identify affected modules
3. define data and API needs
4. define UI structure
5. implement backend or service contracts
6. implement feature UI
7. review SEO impact if public-facing
8. review security impact if sensitive
9. validate QA and regression risk
10. update documentation when needed

---

# 17. Future Scalability Considerations

The architecture should remain ready for:

* additional marketing sections
* richer service content
* more complex internal operations
* role-based dashboards
* analytics integrations
* content system expansion
* automation or AI-assisted workflows

Growth should happen by adding modules and documented boundaries, not by increasing chaos inside existing files.

---

# 18. Architecture Anti-Patterns

The following patterns are not acceptable:

* giant page files containing everything
* business logic hidden inside presentational components
* raw database logic scattered through the app
* duplicated API contracts
* random utility accumulation without ownership
* public pages with broken heading hierarchy
* protected flows with weak auth assumptions
* unstructured folder growth driven only by speed

---

# 19. Final Architectural Standard

A solution is architecturally correct only if it:

* has clear ownership
* preserves separation of concerns
* can scale without major rewrites
* does not weaken security
* does not harm SEO structure
* remains understandable to future contributors

If it works but makes the system messier, the architecture has failed.


## Product Data Integration and Synchronization

The product catalog is expected to be integrated from an external API as the system evolves.

### Architectural Intent

Product data must not be treated as frontend-owned or permanently hardcoded.
The system must support externally sourced product records with a controlled local persisted representation.

### Source of Truth Model

The application will store products in the local PostgreSQL database as a normalized internal read model.

The local database exists to support:

* frontend stability
* performance
* search and filtering
* internal relationships
* SEO-oriented enrichment where relevant
* operational resilience if the external API is temporarily unavailable

However, dynamic commercial fields such as price, stock, and availability should continue to be synchronized from the external API.

Unless explicitly redefined later, the external API is the canonical operational source of truth for:

* price
* stock
* availability
* external product status
* other externally controlled inventory fields

The local database is the application source of truth for:

* internal relations
* local categorization
* SEO enrichment
* UI-specific merchandising fields
* presentation metadata
* controlled internal extensions to the product model

### Backend Ownership

The frontend must not depend directly on the external product API.

All product consumption must go through internal typed backend contracts.
The backend layer is responsible for:

* fetching external product data
* validating external payloads
* mapping external fields into internal product models
* persisting normalized records
* synchronizing dynamic inventory fields
* handling external API failures safely

### Synchronization Rules

Product synchronization must be implemented as a controlled backend concern.

The architecture should support:

* initial product ingestion from the external API
* recurring synchronization for dynamic fields
* explicit mapping between external identifiers and internal records
* safe handling of partial failures
* traceable synchronization timestamps
* future extension to manual sync triggers, scheduled sync jobs, or webhook-based updates if available

At minimum, each synchronized product should preserve:

* external source identifier
* internal database identifier
* last synchronized timestamp
* normalized product fields required by the application

### Conflict Rules

If local values conflict with canonical external inventory values, externally controlled fields must win unless a documented exception exists.

Do not allow uncontrolled manual editing of externally owned canonical fields inside the application.

If the external API is temporarily unavailable, the system may serve the latest synchronized local snapshot, but the architecture must preserve clarity that the snapshot is cached operational data, not newly confirmed live inventory.

### Architectural Boundary

Do not mix external API assumptions directly into presentational components.

External product integration must remain isolated behind backend services, validation layers, and database persistence boundaries so the public frontend and protected operational surface remain stable even if the external integration changes later.

---

# Version

**ARCHITECTURE.md v1.0**
Dermatologika System Architecture
