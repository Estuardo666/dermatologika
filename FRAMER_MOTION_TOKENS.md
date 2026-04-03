FRAMER_MOTION_TOKENS.md

Dermatologika — Framer Motion Tokens

This document defines the motion system for Dermatologika.

Its purpose is to create a motion language that feels:
	•	premium
	•	calm
	•	intentional
	•	spatially coherent
	•	polished
	•	consistent

The public frontend must follow a motion direction strongly influenced by Apple HIG sensibility:
	•	clean spatial logic
	•	refined transitions
	•	continuity between states
	•	hierarchy through motion
	•	no abrupt visual behavior
	•	no elements appearing from nowhere
	•	no elements disappearing without a believable exit

Everything should have an origin, a transition, and a destination.

This motion system is designed for:
	•	Next.js
	•	React
	•	TypeScript
	•	Framer Motion
	•	Tailwind CSS

⸻

1. Motion Philosophy

1.1 Core Principle

Motion is not decoration.

Motion exists to:
	•	explain change
	•	preserve continuity
	•	guide attention
	•	reinforce hierarchy
	•	make interactions feel natural
	•	reduce cognitive friction

1.2 Apple-HIG-Aligned Frontend Principle

The public frontend should never feel like elements are being injected randomly into the screen.

Every meaningful animated element must:
	•	come from somewhere
	•	move with a readable direction
	•	settle with intention
	•	exit with continuity

No important UI should:
	•	pop in from nowhere
	•	vanish instantly without purpose
	•	bounce excessively
	•	feel game-like
	•	feel noisy or attention-seeking

1.3 Public vs Admin Motion

Public Frontend

Priorities:
	•	elegance
	•	clarity
	•	spatial continuity
	•	subtle emotional polish
	•	premium transitions

Admin / Operational UI

Priorities:
	•	speed
	•	clarity
	•	minimum viable transition
	•	no animation that slows task completion

Public motion can be more expressive than admin motion, but both must remain controlled.

⸻

2. Motion Design Principles

2.1 Continuity

Motion must connect one interface state to the next.

The user should understand:
	•	what changed
	•	where it came from
	•	where it went
	•	what now has focus

2.2 Spatial Logic

Use directional movement intentionally.

Examples:
	•	a modal emerges from the visual center or a nearby focal area
	•	a drawer enters from the edge it logically belongs to
	•	an accordion expands from its trigger area
	•	a card hover rises slightly rather than jumping dramatically

2.3 Hierarchy Through Motion

Stronger elements may move first or settle more clearly.

Supporting elements should not compete for attention.

2.4 Restraint

The more premium the interface should feel, the less desperate the motion should be.

Use fewer animations, but make them better.

2.5 Predictability

Repeated patterns must animate consistently.

Buttons, cards, modals, accordions, drawers, and page sections should not all use different motion grammar without reason.

2.6 Responsive to Context

Motion intensity should adapt to context:
	•	large brand sections may use softer staged reveals
	•	admin tables should use minimal transitions
	•	destructive confirmations should feel stable and serious
	•	navigation changes should feel oriented, not flashy

2.7 Reduced Motion Respect

All meaningful motion must support reduced-motion preferences.

When reduced motion is requested:
	•	shorten or remove transform-heavy movement
	•	preserve clarity through opacity or instant state change
	•	maintain state continuity without theatrical transitions

⸻

3. Motion System Structure

Recommended implementation structure:

src/
  motion/
    tokens.ts
    transitions.ts
    presets.ts
    variants/
      fade.ts
      scale.ts
      hover.ts
      modal.ts
      drawer.ts
      accordion.ts
      page.ts
    hooks/
      useReducedMotion.ts

Recommended conceptual layers:
	•	motion tokens
	•	transition tokens
	•	reusable presets
	•	component-specific variants
	•	reduced-motion fallbacks

⸻

4. Duration Tokens

4.1 Core Durations

export const duration = {
  instant: 0.12,
  fast: 0.18,
  base: 0.24,
  moderate: 0.3,
  slow: 0.36,
  page: 0.42,
  emphasis: 0.52,
} as const

4.2 Usage Guidance
	•	instant: micro-feedback, hover, tiny state shifts
	•	fast: compact controls, button interaction, subtle icon motion
	•	base: standard card and section transitions
	•	moderate: slightly more expressive content reveal
	•	slow: modal and larger surface transitions
	•	page: page-section and route-level transitions
	•	emphasis: rare, only for hero or premium storytelling moments

4.3 Timing Rules

Public frontend should prefer:
	•	fast enough to feel responsive
	•	slow enough to feel deliberate

Do not make premium motion feel sluggish.

Do not make it snap so hard that it feels mechanical.

⸻

5. Easing Tokens

5.1 Core Easings

export const ease = {
  standard: [0.22, 1, 0.36, 1],
  soft: [0.16, 1, 0.3, 1],
  settle: [0.2, 0.9, 0.2, 1],
  exit: [0.4, 0, 1, 1],
  emphasis: [0.18, 1, 0.22, 1],
} as const

5.2 Easing Guidance
	•	standard: default premium transition
	•	soft: gentle entrance and hover transitions
	•	settle: elements that should land calmly
	•	exit: elements leaving the screen or collapsing away
	•	emphasis: rare, for more noticeable but still elegant movement

5.3 Easing Rules

Avoid:
	•	aggressive elastic motion
	•	childish bounce curves
	•	spring settings that call attention to themselves

The public frontend should feel refined, not playful.

⸻

6. Distance Tokens

Motion distance must be controlled and repeatable.

export const distance = {
  micro: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  drawer: 40,
} as const

Usage Guidance
	•	micro: hover, icon shift, tiny emphasis
	•	xs: subtle text or button transitions
	•	sm: card and badge reveal
	•	md: standard section fade-up
	•	lg: hero and larger content blocks
	•	xl: stronger staged reveal when justified
	•	drawer: sheet/drawer entry offset

Public frontend should prefer small to moderate distances.

If the motion distance becomes obvious, it is probably too large.

⸻

7. Opacity and Scale Tokens

export const opacity = {
  hidden: 0,
  soft: 0.72,
  visible: 1,
} as const

export const scale = {
  hover: 1.01,
  press: 0.985,
  enterSoft: 0.985,
  modalEnter: 0.97,
  modalExit: 0.985,
} as const

Usage Rules
	•	hover scale should be almost imperceptible
	•	enter scale should support settling, not feel zoomy
	•	avoid large scale animations on text blocks
	•	scale is strongest on modals, cards, and media, not on body copy

⸻

8. Motion State Model

Every reusable animation preset should define a meaningful state model.

Preferred state vocabulary:
	•	initial
	•	animate
	•	exit
	•	whileHover
	•	whileTap
	•	closed
	•	open
	•	collapsed
	•	expanded

No component should rely on ambiguous or ad hoc variant naming if a reusable system exists.

⸻

9. Entry and Exit Principles

9.1 Entry Rule

Nothing important should simply appear.

Acceptable entry behavior usually combines:
	•	slight directional movement
	•	opacity transition
	•	subtle settling
	•	occasionally very soft scale

9.2 Exit Rule

Nothing important should simply disappear.

Acceptable exit behavior usually combines:
	•	fade out
	•	directional departure or controlled collapse
	•	reduced scale only when spatially logical
	•	slightly faster exit than entrance

9.3 Entry/Exit Balance
	•	entry should feel welcoming and readable
	•	exit should feel efficient and coherent
	•	exit may be slightly faster than entry
	•	entry and exit should feel related, not unrelated animations

⸻

10. Core Motion Presets

10.1 fadeUpSoft

Standard content reveal for cards, text groups, and section content.

export const fadeUpSoft = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
  },
}

Use Cases
	•	content blocks
	•	cards
	•	section headers
	•	feature lists

10.2 fadeDownSoft

Use when an element should descend into place logically.

export const fadeDownSoft = {
  initial: { opacity: 0, y: -12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
  },
}

Use Cases
	•	dropdowns
	•	toolbars
	•	top-attached popovers

10.3 fadeInSoft

For cases where directional movement is unnecessary.

export const fadeInSoft = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.16, ease: [0.4, 0, 1, 1] },
  },
}

Use Cases
	•	subtle supporting copy
	•	overlays that already have strong spatial context
	•	tiny state swaps

10.4 scaleInSoft

For cards, panels, and emphasized surfaces.

export const scaleInSoft = {
  initial: { opacity: 0, scale: 0.985, y: 8 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.26, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.99,
    y: 4,
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
  },
}

Use Cases
	•	premium cards
	•	floating panels
	•	image modules
	•	compact dialogs

10.5 staggerChildrenSoft

Container preset for progressive reveal.

export const staggerChildrenSoft = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
}

Use Cases
	•	hero content groups
	•	card grids
	•	section item lists

Rules
	•	keep stagger subtle
	•	do not create long theatrical cascades

10.6 hoverLiftSoft

Micro-interaction for buttons, cards, and surface affordances.

export const hoverLiftSoft = {
  whileHover: {
    y: -2,
    scale: 1.01,
    transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
  },
  whileTap: {
    scale: 0.985,
    y: 0,
    transition: { duration: 0.12, ease: [0.22, 1, 0.36, 1] },
  },
}

Rules
	•	use sparingly on premium surfaces
	•	avoid excessive vertical motion on dense interfaces

⸻

11. Navigation Motion Presets

11.1 headerReveal

For sticky headers and top bars.

export const headerReveal = {
  initial: { opacity: 0, y: -12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
  },
}

11.2 navDrawerRight / navDrawerLeft

For side navigation panels and mobile drawers.

export const navDrawerRight = {
  initial: { opacity: 0, x: 40 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    x: 24,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
}

Rules
	•	drawers must enter from their logical edge
	•	overlay should fade independently but in sync
	•	exit must follow the same spatial logic as entry

11.3 dropdownReveal

For menus and compact floating surfaces.

export const dropdownReveal = {
  initial: { opacity: 0, y: -8, scale: 0.985 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.99,
    transition: { duration: 0.16, ease: [0.4, 0, 1, 1] },
  },
}


⸻

12. Modal and Overlay Presets

12.1 modalFadeScale

Primary modal preset.

export const modalFadeScale = {
  initial: { opacity: 0, scale: 0.97, y: 12 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.985,
    y: 8,
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
  },
}

Rules
	•	modal should feel centered and grounded
	•	never snap open abruptly
	•	exit should feel clean and slightly faster

12.2 overlayFade

For backdrops and page scrims.

export const overlayFade = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.16, ease: [0.4, 0, 1, 1] },
  },
}

12.3 sheetBottomReveal

For bottom sheets and mobile panels.

export const sheetBottomReveal = {
  initial: { opacity: 0, y: 32 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
}


⸻

13. Accordion and Expand/Collapse Presets

13.1 accordionReveal

export const accordionReveal = {
  collapsed: {
    opacity: 0,
    height: 0,
    y: -4,
    transition: {
      opacity: { duration: 0.16 },
      height: { duration: 0.2, ease: [0.4, 0, 1, 1] },
      y: { duration: 0.16 },
    },
  },
  expanded: {
    opacity: 1,
    height: 'auto',
    y: 0,
    transition: {
      opacity: { duration: 0.2, delay: 0.02 },
      height: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
      y: { duration: 0.2 },
    },
  },
}

Rules
	•	expansion must feel attached to its trigger
	•	content should not suddenly appear at full opacity before space exists
	•	collapse should feel efficient and clean

⸻

14. Page and Section Motion

14.1 pageContentReveal

For route-level content wrappers.

export const pageContentReveal = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
}

Rules
	•	route transitions must remain calm
	•	avoid dramatic full-page slide animations for standard browsing
	•	route motion should preserve a sense of continuity, not show off animation

14.2 heroRevealSequence

For hero text and media.

export const heroRevealSequence = {
  container: {
    animate: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.04,
      },
    },
  },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
    },
  },
}

Rules
	•	hero staging must feel premium, not cinematic
	•	stagger must remain tight
	•	media should not animate independently in a distracting way

14.3 sectionFrameReveal

Useful for signature framed sections.

export const sectionFrameReveal = {
  initial: { opacity: 0, y: 16, scale: 0.992 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.996,
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
  },
}


⸻

15. Card and List Motion

15.1 cardReveal

export const cardReveal = {
  initial: { opacity: 0, y: 12, scale: 0.992 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: 6,
    scale: 0.996,
    transition: { duration: 0.16, ease: [0.4, 0, 1, 1] },
  },
}

15.2 listReorderSoft

For sortable or filtered lists.

Rules
	•	use layout animations gently
	•	preserve user orientation during reorder
	•	avoid chaotic reshuffling with strong spring effects

Recommended transition:

export const layoutTransition = {
  type: 'tween',
  duration: 0.24,
  ease: [0.22, 1, 0.36, 1],
}


⸻

16. Button and Microinteraction Motion

16.1 buttonPress

export const buttonPress = {
  whileHover: {
    y: -1,
    scale: 1.01,
    transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
  },
  whileTap: {
    y: 0,
    scale: 0.985,
    transition: { duration: 0.12, ease: [0.22, 1, 0.36, 1] },
  },
}

Rules
	•	button motion must be subtle
	•	avoid exaggerated bounce on hover or press
	•	motion should reinforce tactility, not novelty

16.2 iconShiftSoft

For directional affordance on buttons and links.

export const iconShiftSoft = {
  rest: { x: 0 },
  hover: {
    x: 3,
    transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    x: 0,
    transition: { duration: 0.12, ease: [0.4, 0, 1, 1] },
  },
}


⸻

17. Scroll and In-View Motion Rules

17.1 In-View Principle

In-view reveals should be used for premium pacing, not for every single block.

17.2 Use In-View For
	•	hero supporting groups
	•	feature card rows
	•	editorial blocks
	•	image/text split sections
	•	signature framed sections

17.3 Avoid In-View For
	•	every paragraph in a long article
	•	dense admin data tables
	•	repetitive micro-elements
	•	controls the user must access instantly

17.4 Viewport Configuration Guidance

Recommended defaults:
	•	once: true for most marketing sections
	•	margin: slightly negative threshold for early reveal when needed
	•	amount: 0.2 to 0.35 depending on block size

⸻

18. Route Transition Principles

18.1 Route Motion Philosophy

Route transitions should preserve continuity without overwhelming navigation.

For the public frontend:
	•	use soft page-content reveal
	•	allow persistent layout regions to remain stable
	•	avoid whole-screen theatrical transitions
	•	preserve navigation orientation

18.2 What Should Stay Stable

Whenever possible, keep stable:
	•	header
	•	navigation shell
	•	persistent page chrome
	•	footer when appropriate

The content region can transition more than the full application shell.

⸻

19. Admin Motion Rules

The admin interface must be more restrained than the public frontend.

Admin Motion Should Favor
	•	instant feedback
	•	soft opacity changes
	•	small panel transitions
	•	controlled table and filter motion
	•	efficient expand/collapse behavior

Avoid In Admin
	•	decorative section reveals
	•	long staggered entrances
	•	noticeable scale animation on dense data views
	•	anything that slows frequent operations

Admin motion is operational, not theatrical.

⸻

20. Reduced Motion Strategy

20.1 Rule

If reduced motion is enabled, preserve clarity while minimizing movement.

20.2 Strategy

Replace:
	•	long directional movement
	•	scale transitions
	•	large stagger sequences

With:
	•	quick opacity transitions
	•	height-only changes where necessary
	•	instant layout resolution when appropriate

20.3 Example Reduced Motion Fallback

export const reducedMotionFade = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.12 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 },
  },
}


⸻

21. Motion Governance Rules

21.1 Do Not
	•	do not animate everything
	•	do not use motion without spatial logic
	•	do not mix unrelated easing styles randomly
	•	do not use spring motion unless it is tightly tuned and justified
	•	do not let elements appear or disappear without continuity
	•	do not slow down critical interactions for visual drama

21.2 Only Add New Motion Presets When
	•	a real repeated pattern exists
	•	current presets do not fit the use case
	•	the new motion supports clarity and continuity
	•	the new motion remains consistent with the premium brand language

⸻

22. Recommended Export Structure

export const motionTokens = {
  duration,
  ease,
  distance,
  opacity,
  scale,
}

export const motionPresets = {
  fadeUpSoft,
  fadeDownSoft,
  fadeInSoft,
  scaleInSoft,
  staggerChildrenSoft,
  hoverLiftSoft,
  headerReveal,
  navDrawerRight,
  dropdownReveal,
  modalFadeScale,
  overlayFade,
  sheetBottomReveal,
  accordionReveal,
  pageContentReveal,
  heroRevealSequence,
  sectionFrameReveal,
  cardReveal,
  buttonPress,
  iconShiftSoft,
}


⸻

23. Final Standard

A Dermatologika motion system is correct only if it feels:
	•	continuous
	•	spatially believable
	•	premium
	•	calm
	•	deliberate
	•	elegant
	•	never abrupt

If an element appears from nowhere, disappears without a meaningful exit, or moves without a clear spatial reason, then the motion is not aligned with this system.

⸻

Version

FRAMER_MOTION_TOKENS.md v1.0
Dermatologika Motion System