---
name: Documentation Update
description: Update documentation when features, architecture, APIs, or workflows change in the Dermatologika project.
---

# Documentation Update Skill

Use this skill whenever code changes require documentation updates.

This includes:

- new features
- changed behavior
- new APIs
- changed APIs
- new environment variables
- architecture changes
- new folders or modules
- workflow changes

Documentation must evolve with the code.

## Goal

Ensure documentation stays:

- accurate
- minimal but complete
- aligned with architecture
- useful for future development
- consistent with project standards

## Check These Areas

### 1. Feature Documentation

Check whether the change requires documenting:

- new feature behavior
- usage instructions
- configuration
- limitations
- dependencies

If yes, update:

- README.md
- feature docs
- architecture notes

### 2. Architecture Changes

If structure changed, update:

- folder structure documentation
- ARCHITECTURE.md
- module ownership
- data flow explanation

Never allow architecture drift between docs and code.

### 3. API Changes

If backend or server logic changed, document:

- route
- method
- request format
- response format
- validation rules
- auth requirements

Example:

```txt
POST /api/leads

Body:
{
  name: string
  phone: string
}

Response:
{
  success: boolean
}

4. Environment Variables

If new environment variables are added, update:

.env.example
README setup section
deployment notes

Example:

DATABASE_URL=
R2_BUCKET=
NEXT_PUBLIC_SITE_URL=
5. Folder / Module Changes

If new modules appear, document:

purpose
ownership
responsibilities

Example:

src/services/leads/
Handles lead creation logic
Output Format

When using this skill, return:

Documentation Needed

List what must be updated.

Files To Update

Example:

README.md
ARCHITECTURE.md
feature docs
Proposed Documentation

Provide ready-to-copy documentation text.

Rules
keep documentation concise
avoid redundant explanations
avoid outdated information
keep examples realistic
match project naming conventions
keep documentation developer-friendly
Good Use Cases
new feature added
new API route created
new folder introduced
new data model added
new integration added
refactor that changes behavior
Anti-Patterns

Do not:

write long theoretical docs
document obvious code
duplicate comments already in code
leave stale documentation

Documentation must stay useful, not verbose.