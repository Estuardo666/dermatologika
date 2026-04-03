---
name: UI Accessibility Review
description: Review UI components and pages for accessibility basics, semantic structure, keyboard usability, feedback clarity, and inclusive interaction quality in the Dermatologika project.
---

# UI Accessibility Review Skill

Use this skill when reviewing or improving UI for accessibility, semantic quality, and interaction clarity.

This skill is for focused accessibility review, not for broad visual redesign.

## Goal

Ensure the interface is:

- semantically clear
- keyboard-usable where relevant
- understandable for assistive technologies
- readable
- predictable
- inclusive in common interaction patterns

## Check These Areas

### 1. Semantic Structure

Verify:

- headings follow a meaningful hierarchy
- semantic HTML is used where appropriate
- buttons are buttons
- links are links
- forms use proper labels
- sections are logically structured

### 2. Labels and Form Clarity

Check whether:

- every input has a clear label
- placeholders are not the only label
- required fields are understandable
- validation feedback is clear
- error messages are specific enough to help users recover
- success feedback is visible and understandable

### 3. Keyboard Accessibility

Verify where relevant:

- interactive controls can be reached by keyboard
- focus order is logical
- focus is visible
- dialogs, menus, and drawers behave predictably
- users are not trapped or blocked unintentionally

### 4. Readability and Clarity

Review whether:

- text is readable
- contrast appears sufficient
- clickable targets are usable
- interface language is understandable
- visual hierarchy supports comprehension
- instructions are not ambiguous

### 5. State Communication

Verify that users can understand:

- loading state
- disabled state
- error state
- success state
- empty state

States should not rely only on subtle visual changes.

### 6. Interactive Behavior

Check whether:

- controls communicate their purpose clearly
- icon-only controls have accessible naming
- repeated actions are distinguishable
- hover-only behavior is not the only way to understand an action
- custom controls still behave like expected UI controls

## Output Format

When using this skill, return:

### Accessibility Summary
- short summary of overall accessibility quality

### Issues Found
For each issue include:
- affected component or page
- what is wrong
- why it matters
- severity

### Recommended Fixes
Provide concrete improvements.

### Acceptance Checklist
Provide a short checklist for implementation and QA.

## Severity Levels

Use:
- high
- medium
- low

## Rules

- do not confuse visual polish with accessibility
- do not rely on placeholders as labels
- do not approve ambiguous feedback states
- do not use headings only for styling
- do not ignore keyboard use for interactive UI
- do not assume custom controls are accessible by default

## Good Use Cases

- review a form before release
- audit a page for semantic issues
- check modals, drawers, or menus
- review loading and error feedback
- improve accessibility of shared components
- verify that new UI respects basic accessibility expectations