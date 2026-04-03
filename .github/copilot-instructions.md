# Dermatologika — Global Repository Custom Instructions

These instructions apply globally across the entire repository.

They are intended for AI coding assistants, code-generation agents, and any automated contributor working inside the Dermatologika codebase.

Follow these instructions before proposing architecture, creating files, modifying features, or generating code.

---

# 1. Project Context

This repository supports a system with two major surfaces:

1. A **public-facing frontend** for Dermatologika, focused on brand presentation, trust, SEO, and conversion.
2. A **protected operational surface** for internal workflows such as items, customers, records, or admin operations.

You must preserve the architectural separation between these surfaces while allowing them to share stable foundations such as tokens, types, services, documentation, and reusable patterns.

---

# 2. Global Mission

Always optimize for:

* clarity
* correctness
* maintainability
* security
* scalability
* accessibility
* SEO integrity
* production readiness

Do **not** optimize for speed alone.

Do **not** introduce short-term hacks that damage long-term code quality.

---

# 3. Architecture Rules

## 3.1 Respect Existing Structure

Assume the project follows a modular structure like:

```txt
src/
  app/
  components/
  features/
  lib/
  services/
  server/
  hooks/
  types/
  styles/
  config/
  seo/
  tests/
```

Do not collapse responsibilities across folders.

## 3.2 Separation of Concerns Is Mandatory

Keep these separated:

* UI presentation
* business logic
* validation
* data access
* server-only code
* SEO logic
* configuration

Do not place business logic in presentational components.
Do not place database logic in client-facing code.
Do not place SEO structure randomly across unrelated files.

## 3.3 Dependency Direction

Preferred dependency direction:

```txt
app -> features -> services -> server/data
```

Shared utilities and shared types may be used across layers when appropriate.

Do not create reverse architectural dependency drift.

---

# 4. Frontend Instructions

## 4.1 Frontend Style Direction

The public frontend must follow these principles:

* Apple HIG-like cleanliness and hierarchy
* calm, premium, medically trustworthy presentation
* mobile-first responsive behavior
* clear visual rhythm
* restrained and elegant motion
* strong semantic structure

## 4.2 Frontend Implementation Rules

* Use reusable components.
* Use TypeScript props interfaces.
* Use design tokens instead of arbitrary values.
* Include loading, empty, success, error, and disabled states where relevant.
* Prefer semantic HTML and accessible markup.
* Do not mix domain logic into shared UI primitives.

## 4.3 Styling Rules

* Use centralized tokens for color, typography, spacing, radius, shadow, and motion.
* Prefer semantic tokens over raw utility values when a semantic token exists.
* Avoid one-off visual styling unless justified.
* Favor whitespace, hierarchy, and typography over excessive decoration.

## 4.4 Motion Rules

* Motion must be subtle, coherent, and spatially believable.
* Nothing important should appear from nowhere.
* Nothing important should disappear without a meaningful exit.
* Motion should reinforce hierarchy and continuity, not spectacle.
* Admin motion must be more restrained than public-brand motion.

---

# 5. Backend Instructions

## 5.1 Backend Priorities

The backend must be:

* typed
* validated
* secure
* predictable
* maintainable

## 5.2 Backend Rules

* Never trust client input.
* Validate request bodies, params, query values, filters, and uploads.
* Keep business logic out of UI and out of bloated route handlers.
* Centralize important logic in services or domain-owned backend modules.
* Keep auth and authorization checks explicit.
* Do not bypass permission checks for convenience.
* Do not leak secrets, raw errors, or internal implementation details.

## 5.3 Data Rules

* Preserve source-of-truth clarity.
* Keep data models explicit and typed.
* Avoid conflicting copies of business entities.
* Treat import/export workflows as sensitive and validate them carefully.

---

# 6. SEO Instructions

These apply to public-facing pages.

* Use one clear H1 per page unless there is a rare justified exception.
* Preserve correct H2 and H3 hierarchy.
* Do not use headings only for visual styling.
* Keep semantic structure clean and indexable.
* Maintain readable, trustworthy, conversion-aware content.
* Prefer centralized SEO utilities for metadata, schema, canonicals, and related helpers.
* Do not damage clarity in the name of keyword optimization.

---

# 7. Code Quality Rules

## 7.1 TypeScript

* TypeScript strict mode is required.
* Avoid `any` unless documented and justified.
* Use explicit interfaces for reusable public APIs and components.
* Keep shared contracts centralized when patterns repeat.

## 7.2 Functions and Components

* Prefer small, composable units.
* Functions should do one thing well.
* Components should remain readable and decoupled.
* Split large files before they become unmaintainable.

## 7.3 Naming

Use names that are:

* descriptive
* stable
* domain-aware
* easy to scan

Avoid vague names like:

* `data`
* `value`
* `item`
* `helper`
* `tmp`

## 7.4 Comments

Only comment when the comment explains:

* why something exists
* why a tradeoff was made
* why a non-obvious implementation is correct

Do not narrate obvious code.

---

# 8. File Creation Rules

Before creating a file, ask:

* Does this belong in an existing module?
* Is there already a reusable abstraction that should be extended?
* Is the new file aligned with the project structure?
* Will this reduce or increase long-term complexity?

Do not create files casually.

Do not create near-duplicate components, utilities, or services.

---

# 9. Design System Rules

* Respect the centralized design system.
* Use shared tokens and component patterns.
* Keep public and admin surfaces visually related but not identical.
* Public pages should feel premium, clean, bright, calm, and trustworthy.
* Admin surfaces should feel structured, dense, and operationally clear.
* Do not improvise colors, spacing, motion, or typography outside the system without justification.

---

# 10. Testing and QA Rules

Before considering a task complete, verify where relevant:

* the intended flow works
* edge cases were considered
* loading state exists
* empty state exists
* error state exists
* responsive behavior is acceptable
* accessibility basics are covered
* no obvious regression risk remains
* no obvious console errors remain

Do not claim a task is complete if it is only visually close but logically incomplete.

---

# 11. Security Rules

* Never hardcode secrets.
* Never expose secret-aware code to the client.
* Sanitize and validate external input.
* Review auth, permissions, and abuse surfaces for sensitive actions.
* Avoid verbose error leakage.
* Protect uploads, admin actions, and destructive flows carefully.

Security concerns take precedence over convenience.

---

# 12. Documentation Rules

Update documentation when changes affect:

* architecture
* setup
* environment requirements
* feature behavior
* routes or APIs
* design system usage
* operational workflows

Documentation must stay aligned with the real codebase.

---

# 13. What To Do Before Implementing

Before implementing a non-trivial task:

1. Identify the affected surface: public, admin, or shared.
2. Identify the correct module ownership.
3. Check whether an existing pattern already exists.
4. Confirm what belongs in `components`, `features`, `services`, `server`, or `seo`.
5. Decide whether the task affects architecture, tokens, motion, SEO, auth, or data integrity.
6. Only then implement.

---

# 14. Definition Of Done

A task is not done unless:

* the requested scope is complete
* the solution is typed
* the architecture remains coherent
* validation and error handling exist where needed
* states are handled where relevant
* the result is maintainable
* obvious regressions were considered
* documentation was updated if needed

---

# 15. Anti-Patterns To Avoid

Do not:

* place business logic in presentational components
* make giant page files that do everything
* duplicate API contracts across layers without reason
* invent ad hoc styling when the system already defines tokens
* push server-only responsibilities into the client
* create SEO structures that break semantics
* introduce hidden technical debt just to move faster

---

# 16. Final Instruction

If a proposed implementation works but makes the repository harder to understand, harder to maintain, harder to scale, harder to secure, or harder to evolve, do not do it.

Choose the solution that preserves system quality.

# 17. Rendering and Client/Server Boundaries

## 17.1 Rendering Strategy

Prefer the simplest rendering model that preserves SEO, performance, and maintainability.

Default rules:

* Prefer server-rendered or server-composed output for public SEO-sensitive pages.
* Use client components only when interactivity truly requires them.
* Do not push everything to the client by default.
* Keep protected and sensitive logic on the server.

## 17.2 Server/Client Boundaries

* Client code must not import secret-aware server internals.
* Database access must remain inside controlled server-only layers.
* Auth, authorization, validation, and protected workflows belong on the server.
* Public routes and protected operational routes must not collapse into the same uncontrolled structure.

---

# 18. API Contract Rules

## 18.1 Contract Quality

All APIs must:

* use explicit request and response shapes
* expose only what the client actually needs
* keep success and error responses predictable
* use stable naming
* avoid ad hoc payloads across similar routes

## 18.2 Validation Expectations

Validate explicitly:

* body payloads
* route params
* query params
* filters
* sorting
* pagination
* uploaded file metadata
* external integration payloads

## 18.3 Route Handler Discipline

* Route handlers should stay thin when logic becomes meaningful.
* Business rules should move into `services` or `server` modules.
* Do not allow handlers to become monolithic.

---

# 19. Content Ownership Rules

## 19.1 Hardcoded Content

Do not hardcode content that is expected to change operationally or marketing-wise.

Examples:

* hero text
* CTA text
* banners
* promotional cards
* service section copy
* metadata-driven marketing content

Hardcoded content is acceptable only when it is:

* truly static
* part of the design system
* structural UI copy
* a temporary prototype with explicit note

## 19.2 Source of Truth

When content is dynamic or business-managed:

* define a clear source of truth
* keep the content model explicit
* do not duplicate editable content across frontend files
* keep content retrieval predictable and typed

---

# 20. Dependency and Environment Rules

## 20.1 Dependency Discipline

Before adding any new package, ask:

* does the current stack already solve this?
* does this reduce recurring complexity?
* what is the performance cost?
* what is the maintenance cost?
* what is the security risk?

Do not add dependencies for trivial tasks.

## 20.2 Environment Access

* Never hardcode secrets.
* Centralize environment access patterns.
* Do not read environment values ad hoc across unrelated files.
* Do not leak private configuration through logs, responses, or client bundles.

---

# 21. Data Integrity and Import/Export Rules

## 21.1 Source of Truth

Every important entity must have a clear source of truth.

Avoid:

* duplicate records without reason
* conflicting values for the same business concept
* ambiguous field ownership
* derived values replacing canonical values silently

## 21.2 Import and Export Workflows

Treat import/export flows as integrity-sensitive.

Rules:

* validate mappings before processing
* separate raw input from normalized data when needed
* fail safely
* report errors clearly
* avoid silent corruption
* preserve traceability for high-impact changes

---

# 22. Execution Protocol For Non-Trivial Tasks

Before implementing a non-trivial task:

1. identify the affected surface: public, admin, or shared
2. identify affected folders and ownership
3. check whether an existing pattern already exists
4. define whether backend contracts are needed
5. define whether SEO impact exists
6. define whether security impact exists
7. implement in the smallest coherent unit
8. review regression risk
9. update docs if behavior, architecture, setup, or contracts changed

## 22.1 Delivery Order

Default delivery order for non-trivial features:

1. plan scope and ownership
2. define backend/data contracts
3. implement frontend
4. review SEO if public-facing
5. review QA and regression risk
6. review security if sensitive
7. update documentation

---

# 23. Output Quality Rules For AI Contributors

When generating code, proposals, or refactors:

* prefer concrete implementation over vague advice
* do not create placeholder code disguised as complete
* do not leave dead code or misleading TODOs
* do not invent behavior not implemented
* do not expand scope silently
* keep outputs typed, modular, and production-oriented

When proposing changes, state clearly:

* what files are affected
* why they are affected
* what layer owns the logic
* what risks or tradeoffs exist

Product data will be integrated from an external API in the future.
The system must store a normalized local copy of products in PostgreSQL for performance, search, filtering, internal relationships, and frontend stability.
However, the external API will remain the operational source of truth for dynamic fields such as price, stock, and availability unless explicitly redefined later.
Synchronization logic must update local records from the external source on a controlled schedule or through dedicated sync processes.
The frontend should consume internal backend contracts, not call the external product API directly.

