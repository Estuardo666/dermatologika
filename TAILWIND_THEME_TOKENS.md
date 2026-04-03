# TAILWIND_THEME_TOKENS.md

# Dermatologika — Tailwind Theme Tokens

This document defines the Tailwind theme token system for Dermatologika.

Its purpose is to translate `DESIGN_SYSTEM.md` into an implementation-ready token architecture for:

* Next.js
* React
* TypeScript
* Tailwind CSS
* Framer Motion

The token system must preserve the Dermatologika brand identity while keeping the **public frontend visually aligned with Apple HIG principles**:

* clarity
* hierarchy
* restraint
* whitespace
* calm premium presentation
* low visual friction

This file defines naming, structure, semantic roles, usage rules, and recommended Tailwind integration patterns.

---

# 1. Token Philosophy

## 1.1 Goals

The token system must:

* centralize visual decisions
* prevent arbitrary styling
* make components reusable
* support public and admin surfaces
* preserve consistent hierarchy
* scale without visual drift

## 1.2 Visual Priority

For the **public frontend**, tokens must be used in a way that supports Apple-HIG-like execution:

* generous whitespace
* quiet surfaces
* clear text hierarchy
* soft depth
* refined rounded geometry
* restrained color usage

This means the token system is not only about values, but about disciplined usage.

## 1.3 Semantic First

Use semantic names whenever possible.

Prefer:

* `surface.canvas`
* `text.primary`
* `brand.primary`
* `border.soft`

Instead of overusing raw palette names everywhere.

---

# 2. Token Architecture

Recommended token implementation structure:

```txt
tokens/
  color.ts
  spacing.ts
  typography.ts
  radius.ts
  shadow.ts
  motion.ts
  breakpoints.ts
  zIndex.ts
  opacity.ts
```

Recommended Tailwind mapping layers:

```txt
- primitive tokens
- semantic tokens
- component aliases when necessary
```

## 2.1 Primitive Tokens

Base scales such as:

* raw green palette
* raw neutral palette
* raw spacing values
* raw shadow definitions

## 2.2 Semantic Tokens

System-facing roles such as:

* `brand.primary`
* `surface.soft`
* `text.secondary`
* `status.success`

## 2.3 Component Tokens

Use sparingly when a component has a repeated design need that should not be rebuilt by hand.

Examples:

* `button.primary.background`
* `card.brand.surface`
* `header.backdrop`

Avoid creating component tokens too early unless the system truly needs them.

---

# 3. Color Tokens

## 3.1 Primitive Color Palette

### Brand Green

```txt
brand-green-50   = #F2F9E8
brand-green-100  = #E6F3D1
brand-green-200  = #CFEBA7
brand-green-300  = #B7DE74
brand-green-400  = #9BCD5F
brand-green-500  = #8BC34A
brand-green-600  = #72B255
brand-green-700  = #58A24E
brand-green-800  = #2D8D5F
brand-green-900  = #226F51
```

### Accent Lime

```txt
accent-lime-300  = #C8E45D
accent-lime-400  = #B7D94B
accent-lime-500  = #A7CF3F
```

### Champagne / Gold

```txt
gold-100 = #F6EFE0
gold-200 = #E6D6AF
gold-300 = #D9C48C
gold-400 = #C7B06B
gold-500 = #B89A54
```

### Warm Neutrals

```txt
neutral-0   = #FFFFFF
neutral-25  = #FCFBF8
neutral-50  = #F6F4EF
neutral-100 = #EFEBE3
neutral-200 = #E3DDD2
neutral-300 = #D4CCBE
neutral-400 = #BFB5A3
neutral-500 = #9B927F
neutral-600 = #6F675C
neutral-700 = #4B463F
neutral-800 = #2E2B27
neutral-900 = #171614
```

### Ink

```txt
ink-900 = #121212
ink-800 = #1E1E1E
ink-700 = #2A2A2A
```

## 3.2 Semantic Color Tokens

### Brand

```txt
color.brand.primary       = #72B255
color.brand.primaryHover  = #58A24E
color.brand.soft          = #E6F3D1
color.brand.accent        = #B7D94B
color.brand.gold          = #C7B06B
```

### Surfaces

```txt
color.surface.canvas      = #FFFFFF
color.surface.subtle      = #FCFBF8
color.surface.soft        = #F6F4EF
color.surface.elevated    = #FFFFFF
color.surface.brandTint   = #F2F9E8
color.surface.brandSoft   = #E6F3D1
```

### Text

```txt
color.text.primary        = #121212
color.text.secondary      = #4B463F
color.text.muted          = #9B927F
color.text.brand          = #58A24E
color.text.inverse        = #FFFFFF
```

### Borders

```txt
color.border.soft         = #EFEBE3
color.border.default      = #E3DDD2
color.border.strong       = #D4CCBE
color.border.brand        = #CFEBA7
```

### States

```txt
color.status.success      = #2E8B57
color.status.warning      = #D1A530
color.status.error        = #C94A4A
color.status.info         = #3D7EDB
```

## 3.3 Apple HIG Usage Guidance

For the public frontend:

* use white and soft-neutral surfaces as the default canvas
* use green as a controlled brand emphasis, not as a flood fill everywhere
* keep strong dark text on clean backgrounds
* use borders and tonal changes more often than loud contrast blocks
* reserve gold for subtle premium accents, separators, or framed details

Public UI should feel luminous and restrained, not overly saturated.

---

# 4. Typography Tokens

## 4.1 Font Family

```txt
fontFamily.sans = ["Google Sans", "Inter", "SF Pro Display", "Segoe UI", "sans-serif"]
```

## 4.2 Font Weight Tokens

```txt
fontWeight.regular = 400
fontWeight.medium  = 500
fontWeight.semibold = 600
fontWeight.bold    = 700
```

## 4.3 Type Scale Tokens

```txt
fontSize.display-xl   = ["64px", { lineHeight: "72px", letterSpacing: "-0.03em", fontWeight: "500" }]
fontSize.display-lg   = ["56px", { lineHeight: "64px", letterSpacing: "-0.03em", fontWeight: "500" }]
fontSize.headline-xl  = ["48px", { lineHeight: "56px", letterSpacing: "-0.025em", fontWeight: "500" }]
fontSize.headline-lg  = ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "500" }]
fontSize.headline-md  = ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "500" }]
fontSize.headline-sm  = ["28px", { lineHeight: "36px", letterSpacing: "-0.015em", fontWeight: "500" }]
fontSize.section-xl   = ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "500" }]
fontSize.section-lg   = ["20px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "500" }]
fontSize.section-md   = ["18px", { lineHeight: "26px", letterSpacing: "-0.005em", fontWeight: "500" }]
fontSize.body-lg      = ["18px", { lineHeight: "30px", letterSpacing: "0em", fontWeight: "400" }]
fontSize.body-md      = ["16px", { lineHeight: "28px", letterSpacing: "0em", fontWeight: "400" }]
fontSize.body-sm      = ["14px", { lineHeight: "22px", letterSpacing: "0em", fontWeight: "400" }]
fontSize.label-lg     = ["16px", { lineHeight: "24px", letterSpacing: "0.02em", fontWeight: "500" }]
fontSize.label-md     = ["14px", { lineHeight: "20px", letterSpacing: "0.02em", fontWeight: "500" }]
fontSize.label-sm     = ["12px", { lineHeight: "16px", letterSpacing: "0.04em", fontWeight: "500" }]
fontSize.caption      = ["11px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "500" }]
```

## 4.4 Typography Usage Rules

To stay aligned with Apple-HIG-like frontend quality:

* typography should do most of the hierarchy work
* do not rely on excessive color changes for importance
* keep headings elegant and moderately weighted
* use tracking carefully
* avoid heavy, cramped text stacks
* prefer sentence case over aggressive all caps

---

# 5. Spacing Tokens

## 5.1 Base Spacing Scale

```txt
spacing.0  = 0px
spacing.1  = 4px
spacing.2  = 8px
spacing.3  = 12px
spacing.4  = 16px
spacing.5  = 20px
spacing.6  = 24px
spacing.8  = 32px
spacing.10 = 40px
spacing.12 = 48px
spacing.16 = 64px
spacing.20 = 80px
spacing.24 = 96px
spacing.32 = 128px
```

## 5.2 Usage Guidance

For the public frontend:

* prefer larger spacing steps for sections and cards
* avoid cramped vertical rhythm
* keep hero and premium sections especially breathable
* prioritize optical calm over density

For admin screens:

* spacing can be tighter
* but should still remain clean and scannable

---

# 6. Radius Tokens

## 6.1 Radius Scale

```txt
radius.none = 0px
radius.xs   = 8px
radius.sm   = 12px
radius.md   = 16px
radius.lg   = 20px
radius.xl   = 24px
radius.2xl  = 32px
radius.pill = 999px
```

## 6.2 Usage Guidance

The public frontend should reflect the store’s architectural softness:

* buttons: pill or lg radius
* inputs: md or lg
* cards: lg or xl
* hero frames: xl or 2xl
* modals: xl

Avoid sharp or boxy UI unless a dense admin control truly benefits from it.

---

# 7. Shadow Tokens

## 7.1 Shadow Scale

```txt
shadow.xs = 0 1px 2px rgba(18,18,18,0.04)
shadow.sm = 0 4px 12px rgba(18,18,18,0.06)
shadow.md = 0 12px 24px rgba(18,18,18,0.08)
shadow.lg = 0 20px 40px rgba(18,18,18,0.10)
```

## 7.2 Usage Guidance

To preserve the Apple-HIG-inspired frontend feeling:

* prefer soft depth
* prefer shadow + border combinations over strong shadow-only effects
* use shadow sparingly on public surfaces
* avoid heavy floating cards everywhere

The interface should feel refined, not “effect-heavy.”

---

# 8. Border Tokens

## 8.1 Border Width

```txt
borderWidth.DEFAULT = 1px
borderWidth.0       = 0px
borderWidth.2       = 2px
```

## 8.2 Border Radius Mapping

Map semantic radius tokens into Tailwind `borderRadius` keys.

Recommended naming:

```txt
rounded-xs
rounded-sm
rounded-md
rounded-lg
rounded-xl
rounded-2xl
rounded-pill
```

## 8.3 Border Usage Guidance

* borders should do more work than loud drop shadows
* use soft warm-neutral borders on cards and inputs
* selected states may use brand border accents
* avoid harsh gray borders on bright public layouts

---

# 9. Breakpoint Tokens

## 9.1 Breakpoints

```txt
screen.xs   = 480px
screen.sm   = 640px
screen.md   = 768px
screen.lg   = 1024px
screen.xl   = 1280px
screen.2xl  = 1440px
```

## 9.2 Layout Guidance

Public frontend should preserve:

* readable width
* generous gutters
* calm scaling of hero and content blocks

Do not cram desktop density into tablet-sized layouts.

---

# 10. Container Tokens

Recommended max-widths:

```txt
container.sm  = 640px
container.md  = 768px
container.lg  = 1024px
container.xl  = 1200px
container.2xl = 1320px
```

Usage:

* marketing content: `container-xl` or `container-2xl`
* dense text blocks: `container-md` or `container-lg`
* admin pages: controlled layout width, often `container-xl`

---

# 11. Z-Index Tokens

Use a small disciplined z-index scale.

```txt
zIndex.base      = 0
zIndex.dropdown  = 20
zIndex.sticky    = 30
zIndex.overlay   = 40
zIndex.modal     = 50
zIndex.toast     = 60
zIndex.tooltip   = 70
```

Do not improvise large z-index numbers across the codebase.

---

# 12. Opacity Tokens

```txt
opacity.disabled = 0.5
opacity.subtle   = 0.72
opacity.soft     = 0.88
```

Use opacity carefully.

Apple-HIG-like clarity depends more on hierarchy and spacing than on over-faded content.

---

# 13. Motion Token Mapping

Even though motion is usually defined separately, Tailwind token usage should remain compatible with Framer Motion.

## 13.1 Duration Tokens

```txt
duration.instant = 120ms
duration.fast    = 180ms
duration.base    = 240ms
duration.slow    = 320ms
duration.page    = 420ms
```

## 13.2 Easing Tokens

```txt
ease.standard = cubic-bezier(0.22, 1, 0.36, 1)
ease.soft     = cubic-bezier(0.16, 1, 0.3, 1)
ease.exit     = cubic-bezier(0.4, 0, 1, 1)
```

## 13.3 Motion Usage Guidance

On the public frontend:

* motion should be calm and premium
* transitions should feel almost invisible
* hover states should be soft
* section reveals should not feel theatrical

---

# 14. Tailwind Theme Extension Structure

Recommended conceptual structure:

```ts
export const theme = {
  extend: {
    colors: {
      brand: {
        primary: '#72B255',
        primaryHover: '#58A24E',
        soft: '#E6F3D1',
        accent: '#B7D94B',
        gold: '#C7B06B',
      },
      surface: {
        canvas: '#FFFFFF',
        subtle: '#FCFBF8',
        soft: '#F6F4EF',
        elevated: '#FFFFFF',
        brandTint: '#F2F9E8',
        brandSoft: '#E6F3D1',
      },
      text: {
        primary: '#121212',
        secondary: '#4B463F',
        muted: '#9B927F',
        inverse: '#FFFFFF',
        brand: '#58A24E',
      },
      border: {
        soft: '#EFEBE3',
        DEFAULT: '#E3DDD2',
        strong: '#D4CCBE',
        brand: '#CFEBA7',
      },
      status: {
        success: '#2E8B57',
        warning: '#D1A530',
        error: '#C94A4A',
        info: '#3D7EDB',
      },
      neutral: {
        0: '#FFFFFF',
        25: '#FCFBF8',
        50: '#F6F4EF',
        100: '#EFEBE3',
        200: '#E3DDD2',
        300: '#D4CCBE',
        400: '#BFB5A3',
        500: '#9B927F',
        600: '#6F675C',
        700: '#4B463F',
        800: '#2E2B27',
        900: '#171614',
      },
    },
    fontFamily: {
      sans: ['Google Sans', 'Inter', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
    },
    fontSize: {
      'display-xl': ['64px', { lineHeight: '72px', letterSpacing: '-0.03em', fontWeight: '500' }],
      'display-lg': ['56px', { lineHeight: '64px', letterSpacing: '-0.03em', fontWeight: '500' }],
      'headline-xl': ['48px', { lineHeight: '56px', letterSpacing: '-0.025em', fontWeight: '500' }],
      'headline-lg': ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '500' }],
      'headline-md': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '500' }],
      'headline-sm': ['28px', { lineHeight: '36px', letterSpacing: '-0.015em', fontWeight: '500' }],
      'section-xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '500' }],
      'section-lg': ['20px', { lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: '500' }],
      'section-md': ['18px', { lineHeight: '26px', letterSpacing: '-0.005em', fontWeight: '500' }],
      'body-lg': ['18px', { lineHeight: '30px', letterSpacing: '0em', fontWeight: '400' }],
      'body-md': ['16px', { lineHeight: '28px', letterSpacing: '0em', fontWeight: '400' }],
      'body-sm': ['14px', { lineHeight: '22px', letterSpacing: '0em', fontWeight: '400' }],
      'label-lg': ['16px', { lineHeight: '24px', letterSpacing: '0.02em', fontWeight: '500' }],
      'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.02em', fontWeight: '500' }],
      'label-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.04em', fontWeight: '500' }],
      caption: ['11px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '500' }],
    },
    spacing: {
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
      16: '64px',
      20: '80px',
      24: '96px',
      32: '128px',
    },
    borderRadius: {
      xs: '8px',
      sm: '12px',
      md: '16px',
      lg: '20px',
      xl: '24px',
      '2xl': '32px',
      pill: '999px',
    },
    boxShadow: {
      xs: '0 1px 2px rgba(18,18,18,0.04)',
      sm: '0 4px 12px rgba(18,18,18,0.06)',
      md: '0 12px 24px rgba(18,18,18,0.08)',
      lg: '0 20px 40px rgba(18,18,18,0.10)',
    },
    maxWidth: {
      'container-sm': '640px',
      'container-md': '768px',
      'container-lg': '1024px',
      'container-xl': '1200px',
      'container-2xl': '1320px',
    },
    zIndex: {
      base: '0',
      dropdown: '20',
      sticky: '30',
      overlay: '40',
      modal: '50',
      toast: '60',
      tooltip: '70',
    },
    transitionDuration: {
      instant: '120ms',
      fast: '180ms',
      base: '240ms',
      slow: '320ms',
      page: '420ms',
    },
    transitionTimingFunction: {
      standard: 'cubic-bezier(0.22, 1, 0.36, 1)',
      soft: 'cubic-bezier(0.16, 1, 0.3, 1)',
      exit: 'cubic-bezier(0.4, 0, 1, 1)',
    },
  },
}
```

---

# 15. Recommended Semantic Utility Usage

Prefer class combinations that reflect meaning, not accidental color picking.

Examples:

```txt
bg-surface-canvas
bg-surface-soft
text-text-primary
text-text-secondary
border-border-soft
bg-brand-primary
text-text-inverse
rounded-xl
shadow-sm
```

Avoid patterns like:

```txt
bg-green-500
text-gray-700
border-gray-200
```

because they weaken the system and make visual drift more likely.

---

# 16. Public Frontend Usage Rules

To keep the frontend aligned with Apple HIG sensitivity:

* default to `bg-surface-canvas`
* use `text-text-primary` for main reading content
* keep card surfaces bright and quiet
* prefer `rounded-xl` and `rounded-2xl` over small harsh corners
* use `shadow-sm` or `shadow-xs` before `shadow-md`
* use green on actions, accents, selected states, and highlights
* avoid large green panels unless the section is intentionally branded
* let spacing and typography create the premium feel

The system should feel polished through restraint, not through decoration.

---

# 17. Admin Usage Rules

The admin surface should inherit tokens but use them differently:

* tighter spacing
* more compact controls
* more reliance on borders and row dividers
* less decorative framing
* more operational density

Admin UI should be cleaner and more structured than branded.

---

# 18. Token Governance Rules

## 18.1 Do Not

* do not add arbitrary values without justification
* do not hardcode random hex colors in components
* do not use raw Tailwind gray/green utilities when semantic tokens exist
* do not invent per-page spacing systems
* do not override typography casually

## 18.2 Only Add New Tokens When

* a real pattern repeats
* the value has cross-component relevance
* it improves consistency
* it aligns with the brand system

---

# 19. Suggested Supporting Files

Recommended implementation support:

```txt
src/
  styles/
    tokens/
      colors.ts
      typography.ts
      spacing.ts
      radius.ts
      shadows.ts
      motion.ts
```

Optional companion documents:

* `FRAMER_MOTION_TOKENS.md`
* `TAILWIND_COMPONENT_PATTERNS.md`
* `THEME_USAGE_EXAMPLES.md`

---

# 20. Final Standard

A Tailwind token setup is correct only if it helps the public frontend feel:

* clean
* premium
* calm
* structured
* readable
* consistent
* Apple-HIG-influenced in presentation quality

If the tokens technically exist but still allow random styling drift, the theme system is incomplete.

---

# Version

**TAILWIND_THEME_TOKENS.md v1.0**
Dermatologika Tailwind Theme Spec
