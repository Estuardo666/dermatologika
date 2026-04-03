# PROJECT_RULES.md

# Dermatologika — Project Rules

This document defines the mandatory rules for building, scaling, securing, and maintaining the Dermatologika project.

These rules apply to all contributors, whether human or AI.

The purpose of this file is to reduce inconsistency, prevent technical debt, protect architectural quality, and ensure the product remains production-ready as it grows.

---

# 1. Project Intent

Dermatologika must be built as a modern, trustworthy, medically credible digital platform with strong foundations in:

* maintainability
* scalability
* security
* performance
* SEO
* accessibility
* clean UI/UX
* data integrity

Every implementation must support long-term growth.

Short-term convenience must never damage the long-term quality of the system.

---

# 2. Core Decision Principles

When making decisions, always prioritize:

1. clarity
2. correctness
3. security
4. maintainability
5. scalability
6. performance
7. user trust
8. delivery speed

Speed matters, but it does not override architectural quality.

---

# 3. Global Non-Negotiable Rules

## 3.1 No Unnecessary Complexity

Do not introduce complexity unless it solves a real problem.

Avoid:

* premature abstraction
* overengineering
* unnecessary dependencies
* fragmented folder structures
* generic utility dumping grounds
* patterns that the team cannot maintain

## 3.2 No Silent Technical Debt

Do not leave behind:

* dead code
* duplicate logic
* weak typing
* misleading TODOs
* placeholder implementations disguised as complete
* magic values without explanation
* hidden coupling between unrelated modules

If a temporary compromise is unavoidable, it must be documented clearly.

## 3.3 Separation of Concerns Is Mandatory

Always keep these concerns separated:

* presentation
* business logic
* validation
* data access
* server-only concerns
* configuration
* SEO metadata and content structure

No single file should own multiple unrelated responsibilities when a cleaner split is possible.

## 3.4 Production-Grade Standard

Write code as if it will remain in the project for years.

Do not implement only for the happy path.

Do not optimize only for a demo.

Do not create structures that become fragile after the next feature.

---

# 4. Architecture Rules

## 4.1 Recommended Source Structure

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

## 4.2 Folder Responsibilities

* `app/`: routes, layouts, route-level composition
* `components/`: shared and reusable UI building blocks
* `features/`: domain-specific modules
* `lib/`: low-level shared helpers and utilities
* `services/`: application services and external integration logic
* `server/`: server-only code, auth, database access, protected actions
* `hooks/`: reusable React hooks
* `types/`: shared interfaces, types, DTOs, and contracts
* `styles/`: global styles, design tokens, theme-related structure
* `config/`: centralized project configuration
* `seo/`: metadata builders, structured data helpers, SEO utilities
* `tests/`: test helpers and test suites

## 4.3 Architectural Boundaries

* UI must not directly own backend business rules.
* Route handlers must not become the entire business layer.
* Shared components must not depend on page-specific assumptions.
* Server-only logic must never leak into the client bundle.
* Data transformation logic should live near the domain that owns it.

## 4.4 Reuse Over Duplication

Before creating a new pattern, check whether:

* an existing component can be extended
* an existing utility can be reused
* an existing feature pattern should be preserved
* a shared contract already exists

Do not create parallel implementations of the same concept.

---

# 5. TypeScript and Code Standards

## 5.1 TypeScript Policy

* TypeScript strict mode is required.
* Avoid `any` unless there is a real and documented reason.
* Public interfaces must be explicitly typed.
* Repeated structures should use shared types.
* Important data shapes must never remain implicit.

## 5.2 Naming Rules

Use names that are:

* explicit
* descriptive
* domain-aware
* stable
* easy to scan

Avoid weak names such as:

* `data`
* `item`
* `value`
* `helper`
* `tmp`
* `misc`
* `newItem`

## 5.3 Function Rules

Functions should:

* do one thing well
* be easy to reason about
* have predictable inputs and outputs
* avoid hidden side effects
* be small enough to test and maintain

## 5.4 Error Handling Rules

* Never swallow errors silently.
* Handle expected errors intentionally.
* Keep server responses controlled and meaningful.
* Do not expose internal implementation details to the user.
* Log failures at the correct layer.

## 5.5 Comment Rules

Only comment when the comment explains:

* why something exists
* why a tradeoff was made
* why a non-obvious decision is necessary

Do not comment code that is already obvious.

---

# 6. Frontend Rules

## 6.1 Frontend Priorities

The frontend must be:

* responsive
* accessible
* fast
* consistent
* trustworthy
* easy to extend

## 6.2 Component Rules

All reusable components must:

* use TypeScript props interfaces
* remain as decoupled as possible
* avoid embedding domain logic unless truly feature-owned
* support responsive behavior where relevant
* handle visual states cleanly
* be split if they become too large or too broad

## 6.3 UI State Rules

Relevant interfaces must account for:

* loading state
* empty state
* success state
* error state
* disabled state when interaction requires it

## 6.4 Accessibility Rules

At minimum, ensure:

* semantic HTML
* meaningful labels
* keyboard support where applicable
* readable text contrast
* understandable feedback states
* accessible forms and controls

## 6.5 Styling Rules

* Use centralized design tokens.
* Do not invent one-off values unnecessarily.
* Preserve consistent spacing and typography.
* Avoid visual clutter.
* Favor professional clarity over decorative excess.

## 6.6 Animation Rules

Animation must:

* support comprehension
* feel subtle and premium
* not block usability
* not reduce performance noticeably

---

# 7. Backend and API Rules

## 7.1 Backend Priorities

The backend must be:

* typed
* validated
* secure
* predictable
* maintainable

## 7.2 Validation Rules

Validate all external input, including:

* request bodies
* route params
* query params
* filters
* pagination
* user-controlled text
* uploaded file metadata

## 7.3 Business Logic Placement

Do not place important business logic in:

* React components
* random helpers without domain ownership
* thin route handlers that become overloaded over time

Prefer service-layer or domain-layer organization when logic becomes meaningful.

## 7.4 API Contract Rules

All APIs should:

* return stable shapes
* provide meaningful status handling
* expose only what the client actually needs
* avoid inconsistent naming patterns
* keep success and error responses predictable

## 7.5 Database Rules

* Database access must stay in controlled layers.
* Preserve integrity and consistency.
* Use transactions when multi-step data integrity matters.
* Do not scatter database logic across unrelated files.
* Destructive actions must be explicit and traceable.

## 7.6 Auth and Authorization Rules

* Never trust the client to enforce permissions.
* Sensitive actions must be protected server-side.
* Auth checks must be explicit.
* Authorization checks must exist wherever role or ownership matters.

---

# 8. Security Rules

## 8.1 Secret Management

* Never hardcode secrets.
* Never expose secrets in frontend code.
* Centralize environment access patterns.
* Avoid leaking private configuration in logs or client responses.

## 8.2 Input Safety

* Validate before processing.
* Sanitize user-controlled content where relevant.
* Reject malformed or suspicious input early.
* Review attack surfaces for injection and rendering risks.

## 8.3 Sensitive Flows

Sensitive flows must be reviewed for:

* authentication
* authorization
* abuse potential
* rate limiting
* auditability where needed
* data exposure risk

## 8.4 Error Exposure

Users must not receive:

* stack traces
* raw ORM errors
* raw SQL errors
* secret values
* internal system details

## 8.5 Upload Safety

If the project handles file uploads:

* validate type
* validate size
* validate allowed usage
* avoid trusting only client-side metadata
* define safe handling and storage patterns

---

# 9. SEO and Content Rules

## 9.1 Semantic Structure

* Each page should have one clear H1.
* H2 and H3 usage must reflect true structure.
* Headings must not exist only for styling purposes.
* Public pages must preserve semantic clarity.

## 9.2 Metadata Rules

Where relevant, pages should define:

* title
* meta description
* canonical behavior
* open graph data
* structured data

## 9.3 Content Rules

Public-facing content must be:

* clear
* specific
* trustworthy
* aligned with search intent
* aligned with conversion intent where relevant

## 9.4 Internal Linking Rules

Internal links should support:

* navigation
* topic relationships
* authority flow
* conversion paths
* crawlability

## 9.5 URL Rules

URLs should be:

* readable
* stable
* descriptive
* clean

---

# 10. Design System Rules

## 10.1 Centralized Tokens

All design values should be centralized where possible, especially:

* colors
* spacing
* typography
* radius
* shadows
* container widths
* motion timing if standardized

## 10.2 Consistency Rules

* Reuse existing patterns before inventing new ones.
* Keep spacing rhythm consistent.
* Keep visual hierarchy predictable.
* Do not create arbitrary visual behavior page by page.

---

# 11. Data and Inventory Rules

## 11.1 Source of Truth

Every important data entity must have a clear source of truth.

Avoid:

* duplicated records without purpose
* conflicting values for the same business concept
* ambiguous ownership of fields or status

## 11.2 Schema Rules

Data models should be:

* explicit
* stable
* validated
* easy to evolve
* aligned with real business operations

## 11.3 Import and Export Rules

Import/export workflows must:

* define mappings clearly
* validate structure before processing
* fail safely
* report errors clearly
* avoid silent data corruption

## 11.4 Naming Consistency

Operational data such as patients, items, products, customers, or internal records must use consistent naming across the stack.

---

# 12. Testing and QA Rules

## 12.1 Minimum Quality Standard

Before a task is considered complete, verify where relevant:

* the intended flow works
* obvious edge cases were considered
* no major console errors remain
* responsive behavior is acceptable
* states are handled correctly
* key actions are not broken
* accessibility basics are covered

## 12.2 Regression Awareness

Changes that affect shared logic, layout, routing, data contracts, or SEO structure must consider possible regressions.

## 12.3 Bug Report Standard

A useful bug report should include:

* what happened
* what should happen
* steps to reproduce
* affected area
* likely severity

---

# 13. Documentation Rules

## 13.1 Documentation Must Stay Current

Update docs when changing:

* setup instructions
* architecture
* environment requirements
* routes or APIs
* major feature behavior
* deployment assumptions
* important constraints

## 13.2 Required Core Documentation

At minimum, the project should maintain:

* `README.md`
* `AGENTS.md`
* `PROJECT_RULES.md`
* architecture notes inside `docs/`

## 13.3 Documentation Style

Documentation should be:

* accurate
* concise
* useful
* easy to scan
* grounded in the actual codebase

---

# 14. Dependency Rules

## 14.1 Before Adding Any Dependency

Ask:

* does this solve a real recurring problem?
* can the current stack already solve it?
* what is the performance cost?
* what is the maintenance cost?
* what is the security risk?

## 14.2 Dependency Discipline

* Do not add packages for trivial tasks.
* Do not add libraries only because they are popular.
* Prefer fewer, high-quality dependencies over many narrow ones.

---

# 15. Git and Delivery Rules

## 15.1 Change Quality

Changes should be:

* scoped
* understandable
* reversible when possible
* aligned with a real unit of work

## 15.2 Breaking Changes

Breaking changes must be:

* explicit
* justified
* documented
* communicated clearly

## 15.3 Delivery Standard

A change is not ready simply because it compiles.

It must also be:

* coherent
* maintainable
* consistent with project architecture
* reviewed against the rules in this file

---

# 16. Definition of Done

A task is only done when:

* the requested scope is complete
* the implementation is typed
* the architecture remains coherent
* validation exists where needed
* error handling exists where needed
* obvious edge cases were considered
* required states are handled
* docs were updated if necessary
* no misleading shortcuts remain undocumented

---

# 17. Final Standard

If an implementation works but makes the project harder to understand, harder to secure, harder to scale, or harder to maintain, then it is not an acceptable implementation.


product data must not be frontend-owned
the frontend must not call the external product API directly
externally owned fields such as price and stock must be synchronized through backend-controlled flows
canonical ownership of synchronized fields must be documented and respected
manual editing of externally owned fields must be restricted or explicitly justified

---

# Version

**PROJECT_RULES.md v2.0**
Dermatologika Project Standards
