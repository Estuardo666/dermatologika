---
name: QA Regression Check
description: Review implemented features for functional correctness, UI state coverage, responsiveness, accessibility basics, and regression risk in the Dermatologika project.
---

# QA Regression Check Skill

Use this skill when validating a completed or nearly completed feature for correctness, regressions, usability, and release readiness.

This skill is for focused verification, not for architecture planning or broad product design.

## Goal

Ensure that a feature works as expected and does not introduce obvious regressions in:

- core functionality
- UI states
- responsiveness
- accessibility basics
- linked flows
- visual and interaction consistency

## Check These Areas

### 1. Happy Path

Verify:

- the intended main flow works
- primary actions complete successfully
- the feature behaves as the request described
- there are no obvious blocking issues

### 2. Edge Cases

Check whether:

- missing data is handled safely
- optional data does not break the UI
- invalid or unexpected states are handled
- repeated actions behave predictably
- boundary conditions create failures

### 3. UI States

Verify relevant states such as:

- loading
- empty
- error
- success
- disabled

Do not assume a feature is complete if only the happy path exists.

### 4. Responsiveness

Review whether:

- layout holds up across breakpoints
- text does not overflow or collide
- interactive elements remain usable
- spacing and hierarchy remain clear
- mobile-first behavior still feels intentional

### 5. Accessibility Basics

Check whether:

- headings are meaningful
- labels exist where needed
- forms provide understandable feedback
- keyboard interaction works where relevant
- controls are identifiable and not ambiguous
- semantics are reasonable for the interface

### 6. Console and Runtime Cleanliness

Check for:

- obvious console errors
- obvious warnings that indicate broken behavior
- missing assets or broken interactions
- client-side crashes or hydration-related issues where relevant

### 7. Regression Risk

Review whether the change may have affected:

- shared components
- shared layouts
- routes
- data contracts
- public SEO structure
- auth-sensitive flows
- existing forms or CRUD behavior

### 8. Broken Links and Broken Actions

Verify:

- buttons do what they claim
- links resolve correctly
- forms submit correctly
- actions have visible feedback
- no dead-end UI paths were introduced

## Output Format

When using this skill, return:

### QA Summary
- short summary of overall status

### Issues Found
For each issue include:
- what happened
- what should happen
- severity
- affected area

### Reproduction Steps
Provide simple reproduction steps for each real issue.

### Regression Risk Notes
Call out any areas that need follow-up checks.

### Acceptance Checklist
Provide a short checklist for final validation.

## Severity Levels

Use:
- critical
- high
- medium
- low

## Rules

- do not claim something was tested if it was not actually checked
- do not silently change scope during QA
- do not ignore edge cases because the happy path works
- do not mark a feature as ready if important states are missing
- do not confuse visual polish with functional correctness

## Good Use Cases

- verify a new page or section
- review a completed frontend feature
- test a form flow
- check CRUD behavior after refactor
- review responsive behavior
- audit a feature before merge or release