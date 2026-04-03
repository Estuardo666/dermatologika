# COMPONENT_LIBRARY.md

# Dermatologika — Component Library

This document defines the reusable UI component library for Dermatologika.

It translates the visual direction from `DESIGN_SYSTEM.md` into a concrete, scalable, implementation-ready component system for both:

* the public brand/frontend experience
* the protected operational/admin experience

This library is designed for:

* Next.js
* React
* TypeScript
* Tailwind CSS
* Framer Motion

All components must be token-driven, typed, reusable, and consistent with the Dermatologika brand language.

---

# 1. Library Philosophy

The component library must support two related but distinct interface modes.

## 1.1 Brand / Public Mode

Priorities:

* premium cleanliness
* strong whitespace
* visual elegance
* trust and clarity
* emotionally polished presentation
* controlled motion

## 1.2 Admin / Operational Mode

Priorities:

* structure
* density control
* scannability
* predictability
* form efficiency
* table discipline

Both modes must share the same token foundations, but they do not need to look identical.

---

# 2. Global Component Rules

All components must follow these rules.

## 2.1 Technical Rules

* every component must be fully typed with TypeScript
* every reusable component must expose an explicit props interface
* components must rely on design tokens, not arbitrary hardcoded values
* state variants must be intentional and limited
* components must be composable
* components must avoid page-specific assumptions
* components must support accessibility requirements where relevant

## 2.2 Visual Rules

* rounded geometry is preferred
* whitespace must feel deliberate
* borders are preferred over heavy shadows
* motion must be subtle and premium
* hierarchy must stay clear at every breakpoint
* decorative brand motifs must remain restrained

## 2.3 Behavioral Rules

* all interactive components must define hover, focus, active, disabled states
* feedback must be explicit when actions succeed, fail, or are loading
* important actions must never feel ambiguous

---

# 3. Component API Philosophy

Reusable components should support controlled variants rather than ad hoc styling.

Preferred API dimensions:

* `variant`
* `size`
* `tone`
* `density`
* `state`
* `radius`
* `motion`

Example:

```tsx
<Button variant="primary" size="lg" density="brand" />
<Card tone="soft" radius="xl" shadow="sm" />
<SectionFrame variant="brand" accent="circle" />
```

Do not expose dozens of overlapping props when a simpler and more semantic API is enough.

---

# 4. Foundation Components

These are the primitives that should power the rest of the system.

## 4.1 Box

A low-level layout primitive for wrappers and semantic container styling.

### Use Cases

* layout wrappers
* surface containers
* spacing composition
* grid or flex wrappers

### Supports

* padding tokens
* radius tokens
* surface tone
* border tokens
* shadow tokens

### Must Not

* become a dumping ground for arbitrary styling

## 4.2 Stack

Vertical spacing utility.

### Use Cases

* forms
* card internals
* section content flow
* grouped text blocks

### Props

* `gap`
* `align`
* `as`

## 4.3 Inline

Horizontal layout utility.

### Use Cases

* button groups
* tag rows
* icon + label patterns
* toolbar layouts

### Props

* `gap`
* `align`
* `justify`
* `wrap`

## 4.4 Container

Constrains content width for public pages and app layouts.

### Variants

* `sm`
* `md`
* `lg`
* `xl`
* `2xl`
* `full`

## 4.5 Surface

Standardized visual wrapper for cards, modals, feature blocks, and form panels.

### Variants

* `default`
* `soft`
* `brandTint`
* `elevated`
* `outlined`

---

# 5. Typography Components

## 5.1 Text

Generic text primitive tied to typography tokens.

### Variants

* `bodyLg`
* `bodyMd`
* `bodySm`
* `labelLg`
* `labelMd`
* `labelSm`
* `caption`

### Tones

* `primary`
* `secondary`
* `muted`
* `brand`
* `inverse`

## 5.2 Heading

Semantic heading component.

### Levels

* `display`
* `headline`
* `section`
* `subsection`

### Rules

* must preserve semantic heading hierarchy
* must not be used only for visual size convenience

## 5.3 Eyebrow

Small label-like pre-title.

### Use Cases

* section labels
* category tags
* campaign context
* feature group labeling

### Style Direction

* uppercase optional
* modest tracking
* subtle brand or neutral tone

## 5.4 RichText / Prose

Used for CMS-like or marketing copy blocks.

### Rules

* protect semantic hierarchy
* preserve readable max-width
* maintain consistent paragraph rhythm

---

# 6. Action Components

## 6.1 Button

Core action component.

### Variants

* `primary`
* `secondary`
* `ghost`
* `link`
* `promo`
* `danger`

### Sizes

* `sm`
* `md`
* `lg`
* `xl`

### Density

* `brand`
* `admin`

### Visual Direction

#### Primary

* brand green or deep ink fill depending on context
* white text
* pill or large rounded rectangle
* subtle hover lift

#### Secondary

* soft surface or white background
* border-based
* dark text
* restrained interaction

#### Ghost

* minimal surface
* brand or dark text
* used for secondary flows

#### Promo

Inspired by the printed promotion layout:

* large capsule shape
* strong central readability
* bold, clean hierarchy

### States

* default
* hover
* focus-visible
* active
* loading
* disabled

### Optional Features

* leading icon
* trailing icon
* loading spinner
* full width
* motion preset

### Accessibility

* must preserve visible focus state
* text label must remain explicit
* icon-only button requires aria-label

## 6.2 IconButton

Compact icon-based action.

### Use Cases

* toolbar actions
* carousel controls
* close actions
* small utility controls

### Rules

* target size must remain touch-friendly
* avoid cryptic icons without tooltip or context when needed

## 6.3 ButtonGroup

Group related actions.

### Modes

* horizontal
* vertical on small screens when necessary
* segmented when interaction pattern justifies it

---

# 7. Form Components

## 7.1 FieldWrapper

Standard wrapper for labels, helper text, and error display.

### Supports

* label
* required mark
* helper text
* error message
* success message

## 7.2 Input

Single-line text input.

### Variants

* `default`
* `filledSoft`
* `search`

### Sizes

* `md`
* `lg`

### States

* default
* hover
* focus
* disabled
* error
* success

### Style Direction

* soft rounded corners
* clean label alignment
* strong legibility
* high contrast against white surfaces

## 7.3 Textarea

Multi-line input.

### Rules

* must feel visually aligned with Input
* should support resize control decision explicitly

## 7.4 Select

Dropdown/select field.

### Rules

* keep arrow treatment clean and minimal
* must not visually collapse into text input ambiguity

## 7.5 Combobox / SearchSelect

For searchable options.

### Use Cases

* admin entity assignment
* product search
* tag lookup

## 7.6 Checkbox

### Style Direction

* clear check mark
* strong focus indication
* not overly decorative

## 7.7 RadioGroup

### Use Cases

* mutually exclusive settings
* shipping or preference choices
* controlled admin settings

## 7.8 Switch

### Use Cases

* enable/disable settings
* binary toggles

### Rules

* use only when immediate boolean state is appropriate
* do not replace explicit action buttons with switches carelessly

## 7.9 FormRow

Layout abstraction for:

* single-column fields
* two-column responsive field pairs
* aligned admin forms

## 7.10 SearchBar

Shared search component.

### Modes

* public search
* admin table search

### Public Mode

* larger, more breathable
* premium rounded styling

### Admin Mode

* more compact
* table-toolbar aligned

---

# 8. Feedback Components

## 8.1 Badge

Small, pill-shaped semantic label.

### Variants

* `neutral`
* `brand`
* `success`
* `warning`
* `error`
* `info`
* `promo`

### Use Cases

* stock status
* featured labels
* category markers
* campaign flags
* workflow states

## 8.2 Alert

Inline or block status message.

### Variants

* `info`
* `success`
* `warning`
* `error`

### Use Cases

* form submission outcomes
* admin notices
* validation summaries
* informative content blocks

## 8.3 Toast

Transient feedback.

### Rules

* use for lightweight confirmation or failure feedback
* avoid using toasts for critical information that requires persistence

## 8.4 EmptyState

Shared empty state component.

### Use Cases

* no products found
* no search results
* no inventory rows
* no saved items

### Structure

* icon or illustration
* title
* supporting text
* optional action

## 8.5 Skeleton

Loading placeholder system.

### Variants

* text lines
* avatar/media block
* card skeleton
* table row skeleton

### Rules

* should reflect actual layout structure
* avoid generic meaningless shimmer blocks

---

# 9. Navigation Components

## 9.1 Header

Public website header.

### Style Direction

* minimal
* airy
* premium
* clean alignment
* light surface

### Typical Slots

* logo
* primary navigation
* utility actions
* CTA

### Behavior

* sticky only if implemented elegantly
* transition on scroll must remain subtle

## 9.2 MobileNav

Mobile navigation sheet or drawer.

### Rules

* clear tap targets
* high contrast
* no cluttered nesting
* clean close action

## 9.3 SideNav

Admin navigation.

### Influence

* Atlassian / Carbon structural discipline

### Rules

* clear grouping
* icon + label alignment
* active state must be obvious
* collapsible patterns must remain readable

## 9.4 Breadcrumb

### Use Cases

* deep internal flows
* category hierarchies
* admin sections

## 9.5 Pagination

### Modes

* compact admin mode
* public listing mode

---

# 10. Layout and Section Components

## 10.1 Section

High-level page section wrapper.

### Variants

* `default`
* `soft`
* `brandTint`
* `accent`
* `split`

### Props

* `paddingY`
* `container`
* `background`
* `density`

## 10.2 SectionHeader

Reusable section heading block.

### Structure

* eyebrow
* title
* description
* actions optional

### Rules

* must support left-aligned and centered usage
* must preserve strong typographic rhythm

## 10.3 Hero

Primary landing section component.

### Variants

* `brand`
* `service`
* `product`
* `campaign`

### Allowed Elements

* headline
* support copy
* CTA group
* media or product cluster
* trust strip
* decorative circle or arch frame

### Motion

* gentle staged reveal only
* no aggressive hero animation

## 10.4 SplitSection

Two-column content layout.

### Use Cases

* service explanation
* image + text
* benefit breakdown
* promotional feature storytelling

## 10.5 SectionFrame

Signature Dermatologika visual wrapper.

### Visual Characteristics

* large radius
* optional circular outline accent
* soft green-tinted or neutral background
* premium internal spacing

### Use Cases

* featured product area
* brand story block
* campaign callout
* curated collection module

## 10.6 TrustStrip

Compact row for:

* trust signals
* certification markers
* policy highlights
* service guarantees

---

# 11. Commerce and Catalog Components

## 11.1 ProductCard

Core product display unit.

### Structure

* media zone
* brand or category label
* title
* short supporting text or skin concern
* price area when relevant
* action area

### Variants

* `grid`
* `featured`
* `compact`
* `shelf`

### Style Direction

Should feel inspired by premium retail shelving:

* bright surface
* clear separation
* elegant product placement
* minimal visual noise

## 11.2 ProductGrid

Responsive layout for collections and listings.

### Rules

* should scale cleanly across breakpoints
* spacing must remain premium, not cramped

## 11.3 ProductShelf

Signature retail-inspired module.

### Use Cases

* featured brands
* category highlights
* curated routines
* campaign collections

### Visual Direction

Borrows from the store shelving language:

* vertical rhythm
* framed grouping
* clear section titles
* premium spacing

## 11.4 BrandCard

Used for laboratory or brand showcase.

### Use Cases

* ACM-style campaigns
* featured partner laboratories
* brand landing navigation

## 11.5 PriceBlock

Reusable price presentation.

### Supports

* current price
* previous price
* discount badge
* finance or stock note if needed

## 11.6 PromoBanner

Campaign-driven component.

### Structure

* brand mark or supporting label
* strong campaign headline
* optional product cluster
* CTA
* disclaimer/support text

### Rules

* should feel clean, not loud
* promotional typography can be stronger than the rest of the site, but still elegant

---

# 12. Content Components

## 12.1 FeatureCard

Used for:

* benefits
* brand differentiators
* service highlights
* process steps

## 12.2 InfoCard

Calm content panel for:

* educational content
* category summaries
* skin routine guidance
* clinic trust messaging

## 12.3 TestimonialCard

### Structure

* quote
* author
* role or context
* optional rating or image

### Rules

* avoid noisy testimonial styling
* keep it premium and readable

## 12.4 ArticleCard

For blog or editorial content.

### Variants

* `standard`
* `featured`
* `compact`

## 12.5 StatCard

Use for operational or marketing metrics.

### Public Mode

* softer hierarchy
* premium spacing

### Admin Mode

* denser, more utility-driven

---

# 13. Media Components

## 13.1 MediaFrame

Shared media wrapper.

### Variants

* `rounded`
* `circle`
* `arch`
* `softRect`

### Use Cases

* brand imagery
* service images
* product clusters
* testimonial photos

## 13.2 Avatar

### Use Cases

* testimonials
* staff references
* admin user presence

## 13.3 LogoLockup

Brand logo usage abstraction.

### Supports

* horizontal logo
* mark + wordmark
* inverse version
* monochrome version

---

# 14. Overlay Components

## 14.1 Modal

Standard modal component.

### Variants

* `default`
* `confirm`
* `form`
* `image`

### Rules

* large radius
* clean structure
* action area must be obvious
* should trap focus properly

## 14.2 Drawer

Side drawer or bottom drawer.

### Use Cases

* mobile navigation
* filters
* quick details
* admin side forms

## 14.3 Popover

### Use Cases

* inline actions
* help content
* contextual settings

## 14.4 Tooltip

### Rules

* use for clarification, not essential content
* keep copy short

---

# 15. Data Display Components

## 15.1 DataTable

Primary admin data table.

### Influence

* Atlassian and Carbon structure, not their visual branding

### Must Support

* column definitions
* sorting when relevant
* row selection when relevant
* pagination
* empty state
* loading state
* status cells
* action cells

### Visual Rules

* clean header row
* readable density
* subtle row dividers
* obvious hover and selected states

## 15.2 DataToolbar

Toolbar for tables and index pages.

### Typical Slots

* title or count
* search
* filters
* view toggles
* primary action

## 15.3 FilterBar

Reusable filters row.

### Use Cases

* product filtering
* admin list filtering
* category and stock filters

## 15.4 KeyValueList

Used for compact metadata display.

### Use Cases

* order summaries
* product details
* customer attributes
* admin side panels

## 15.5 StatusPill

A stronger status badge for workflows and operational state.

---

# 16. Admin Workflow Components

## 16.1 AppShell

Admin layout shell.

### Areas

* side navigation
* top bar
* page content
* optional secondary panel

## 16.2 PageToolbar

Admin page header and action area.

### Contains

* title
* subtitle
* breadcrumbs optional
* key actions
* filters optional

## 16.3 DetailPanel

Panel for showing record details.

### Use Cases

* customer details
* item metadata
* stock context
* workflow summary

## 16.4 ConfirmDialog

Used for destructive or high-risk actions.

### Rules

* must state consequence clearly
* primary destructive action should be explicit
* avoid vague wording

## 16.5 Stepper / ProgressFlow

Use for multi-step flows such as:

* imports
* onboarding
* checkout-like forms
* admin setup flows

---

# 17. Motion Presets By Component

## 17.1 Shared Motion Presets

Recommended presets:

* `fadeUpSoft`
* `scaleInSoft`
* `staggerChildrenSoft`
* `accordionReveal`
* `hoverLift`
* `modalFadeScale`

## 17.2 Good Motion Usage

* hero content staged reveal
* section cards entering on scroll
* modal opening and closing
* drawer transitions
* button micro-interaction
* table filter panel reveal

## 17.3 Motion Restraint

Avoid using motion on:

* every list item in dense admin tables
* every paragraph in a long page
* critical actions where delay harms usability

---

# 18. Density Modes

## 18.1 Brand Density

Characteristics:

* larger padding
* bigger radii
* softer spacing
* stronger visual breathability
* more emotional polish

## 18.2 Admin Density

Characteristics:

* tighter spacing
* more compact controls
* stronger information density
* less decorative framing
* more immediate utility

Component APIs may support this explicitly:

```tsx
<Card density="brand" />
<DataTable density="admin" />
<Button density="admin" size="sm" />
```

---

# 19. Accessibility Requirements By Library

All core components must support accessibility where relevant.

At minimum:

* keyboard navigation
* visible focus states
* semantic roles
* readable labels
* aria labels for icon-only controls
* reduced motion support for animated components
* clear state messaging for forms and errors

---

# 20. Suggested File Structure

```txt
src/
  components/
    ui/
      box/
      stack/
      inline/
      container/
      surface/
      text/
      heading/
      button/
      icon-button/
      badge/
      input/
      textarea/
      select/
      checkbox/
      switch/
      modal/
      drawer/
      tooltip/
      skeleton/
      empty-state/
      table/
    brand/
      hero/
      section/
      section-header/
      section-frame/
      trust-strip/
      product-card/
      product-grid/
      product-shelf/
      promo-banner/
      brand-card/
      article-card/
      testimonial-card/
      media-frame/
    admin/
      app-shell/
      side-nav/
      page-toolbar/
      data-toolbar/
      filter-bar/
      detail-panel/
      confirm-dialog/
      status-pill/
```

---

# 21. Component Readiness Checklist

A reusable component is ready only when:

* the props interface is clear
* the variants are intentional
* design tokens are used
* loading and disabled states exist where needed
* accessibility is covered
* responsive behavior was considered
* the component is not tightly coupled to one page
* motion is optional and controlled
* naming is consistent with the system

---

# 22. Final Standard

A Dermatologika component is correct only if it is:

* reusable
* elegant
* readable
* token-driven
* scalable
* accessible
* aligned with the public/admin split
* visually faithful to the brand language

If a component works but introduces visual inconsistency, weak hierarchy, tight coupling, or styling improvisation, it is not ready for the system.

---

# Version

**COMPONENT_LIBRARY.md v1.0**
Dermatologika UI Components
