---
name: API Contract Review
description: Review API contracts for request and response shape consistency, validation clarity, naming stability, auth requirements, and frontend-backend alignment in the Dermatologika project.
---

# API Contract Review Skill

Use this skill when reviewing, designing, or refining API contracts between frontend and backend.

This skill is for contract quality, not full backend implementation.

## Goal

Ensure API contracts are:

- typed and explicit
- predictable
- stable
- easy for frontend to consume
- aligned with validation rules
- aligned with auth and permission requirements
- consistent across similar routes

## Check These Areas

### 1. Request Shape

Verify:

- request fields are explicit
- required vs optional fields are clear
- route params are clearly defined
- query params are clearly defined
- filters, sorting, and pagination inputs are predictable
- field names are consistent with project naming

### 2. Response Shape

Verify:

- response fields are explicit
- success responses are predictable
- error responses are predictable
- the frontend gets only what it actually needs
- similar endpoints do not return wildly different shapes without reason

### 3. Validation Clarity

Check whether:

- the contract makes validation expectations obvious
- malformed input can be rejected safely
- enums, IDs, dates, booleans, and numeric fields are unambiguous
- optional fields do not create hidden behavior

### 4. Auth and Authorization Awareness

Review whether:

- protected routes are clearly marked
- auth requirements are documented
- role or ownership constraints are clear where relevant
- sensitive fields are not exposed by default

### 5. Naming Consistency

Verify:

- field names are stable
- response naming is predictable
- the same business concept is not renamed across routes
- DTO names and payload names stay consistent across frontend and backend

### 6. Frontend Integration Friendliness

Check whether:

- the contract is easy to consume in typed frontend code
- loading, empty, success, and error states can be handled cleanly
- frontend code does not need ad hoc guessing
- the contract reduces coupling and confusion

## Output Format

When using this skill, return:

### Contract Summary
- short summary of quality and risks

### Issues Found
For each issue include:
- affected route or contract
- what is unclear or inconsistent
- why it is a problem
- severity

### Recommended Contract Shape
Provide a clean proposed request and response structure.

### Acceptance Checklist
Provide a short checklist for backend, frontend, and QA.

## Severity Levels

Use:
- high
- medium
- low

## Rules

- prefer explicit contracts over implicit assumptions
- do not accept inconsistent naming without reason
- do not approve ad hoc error payloads
- do not let route handlers define random response shapes
- do not expose sensitive fields that the client does not need
- do not rely on frontend assumptions to fill missing contract details

## Good Use Cases

- review a new API route before frontend integration
- refine CRUD response shapes
- standardize validation expectations
- clean up inconsistent payload naming
- review filters, pagination, and sorting contracts
- align frontend and backend on typed DTOs