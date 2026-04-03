import { motionTokens } from './tokens'

type MotionState = Record<string, unknown>
export type Variants = Record<string, MotionState>

const { duration, ease, distance, scale } = motionTokens

export const fadeUpSoft: Variants = {
  initial: { opacity: 0, y: distance.md },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.standard },
  },
  exit: {
    opacity: 0,
    y: distance.xs,
    transition: { duration: duration.fast, ease: ease.exit },
  },
}

export const fadeDownSoft: Variants = {
  initial: { opacity: 0, y: -distance.sm },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.standard },
  },
  exit: {
    opacity: 0,
    y: -distance.xs,
    transition: { duration: duration.fast, ease: ease.exit },
  },
}

export const fadeInSoft: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.2, ease: ease.standard },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.16, ease: ease.exit },
  },
}

export const scaleInSoft: Variants = {
  initial: { opacity: 0, scale: scale.enterSoft, y: distance.xs },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.26, ease: ease.soft },
  },
  exit: {
    opacity: 0,
    scale: 0.99,
    y: distance.micro,
    transition: { duration: duration.fast, ease: ease.exit },
  },
}

export const headerReveal: Variants = {
  initial: { opacity: 0, y: -distance.sm },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.standard },
  },
  exit: {
    opacity: 0,
    y: -distance.xs,
    transition: { duration: duration.fast, ease: ease.exit },
  },
}

export const dropdownReveal: Variants = {
  initial: { opacity: 0, y: -distance.xs, scale: 0.985 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: ease.soft },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.99,
    transition: { duration: 0.16, ease: ease.exit },
  },
}

export const navDrawerRight: Variants = {
  initial: { opacity: 0, x: distance.drawer },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.moderate, ease: ease.soft },
  },
  exit: {
    opacity: 0,
    x: 24,
    transition: { duration: 0.2, ease: ease.exit },
  },
}

export const navDrawerLeft: Variants = {
  initial: { opacity: 0, x: -distance.drawer },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.moderate, ease: ease.soft },
  },
  exit: {
    opacity: 0,
    x: -24,
    transition: { duration: 0.2, ease: ease.exit },
  },
}

export const overlayFade: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.2, ease: ease.standard },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.16, ease: ease.exit },
  },
}

export const modalFadeScale: Variants = {
  initial: { opacity: 0, scale: scale.modalEnter, y: 12 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.28, ease: ease.soft },
  },
  exit: {
    opacity: 0,
    scale: scale.modalExit,
    y: 8,
    transition: { duration: duration.fast, ease: ease.exit },
  },
}

export const sheetBottomReveal: Variants = {
  initial: { opacity: 0, y: distance.xl },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.moderate, ease: ease.soft },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2, ease: ease.exit },
  },
}

export const pageContentReveal: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.standard },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.2, ease: ease.exit },
  },
}

export const sectionFrameReveal: Variants = {
  initial: { opacity: 0, y: distance.md, scale: 0.992 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: duration.moderate, ease: ease.soft },
  },
  exit: {
    opacity: 0,
    y: distance.xs,
    scale: 0.996,
    transition: { duration: duration.fast, ease: ease.exit },
  },
}

export const cardReveal: Variants = {
  initial: { opacity: 0, y: distance.sm, scale: 0.992 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: duration.base, ease: ease.standard },
  },
  exit: {
    opacity: 0,
    y: 6,
    scale: 0.996,
    transition: { duration: 0.16, ease: ease.exit },
  },
}

export const heroRevealSequence = {
  container: {
    animate: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.04,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1,
      },
    },
  } satisfies Variants,
  item: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.32, ease: ease.soft },
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: { duration: duration.fast, ease: ease.exit },
    },
  } satisfies Variants,
} as const

export const accordionReveal: Variants = {
  collapsed: {
    opacity: 0,
    height: 0,
    y: -distance.micro,
    transition: {
      opacity: { duration: 0.16 },
      height: { duration: 0.2, ease: ease.exit },
      y: { duration: 0.16 },
    },
  },
  expanded: {
    opacity: 1,
    height: 'auto',
    y: 0,
    transition: {
      opacity: { duration: 0.2, delay: 0.02 },
      height: { duration: duration.base, ease: ease.standard },
      y: { duration: 0.2 },
    },
  },
}

export const buttonMotion = {
  whileHover: {
    y: -1,
    scale: scale.hover,
    transition: { duration: duration.fast, ease: ease.soft },
  },
  whileTap: {
    y: 0,
    scale: scale.press,
    transition: { duration: duration.instant, ease: ease.standard },
  },
} as const

export const hoverLiftSoft = {
  whileHover: {
    y: -2,
    scale: scale.hover,
    transition: { duration: duration.fast, ease: ease.soft },
  },
  whileTap: {
    scale: scale.press,
    y: 0,
    transition: { duration: duration.instant, ease: ease.standard },
  },
} as const

export const iconShiftSoft = {
  rest: { x: 0 },
  hover: {
    x: 3,
    transition: { duration: duration.fast, ease: ease.soft },
  },
  exit: {
    x: 0,
    transition: { duration: duration.instant, ease: ease.exit },
  },
} as const

export const layoutTransition = {
  type: 'tween',
  duration: duration.base,
  ease: ease.standard,
} as const

export const reducedMotionFade: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: duration.instant },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 },
  },
}

export const motionPresets = {
  fadeUpSoft,
  fadeDownSoft,
  fadeInSoft,
  scaleInSoft,
  headerReveal,
  dropdownReveal,
  navDrawerRight,
  navDrawerLeft,
  overlayFade,
  modalFadeScale,
  sheetBottomReveal,
  pageContentReveal,
  sectionFrameReveal,
  cardReveal,
  accordionReveal,
  heroRevealSequence,
  buttonMotion,
  hoverLiftSoft,
  iconShiftSoft,
  layoutTransition,
  reducedMotionFade,
} as const

export const motionPrinciples = {
  appleHigFrontend: [
    'Nothing important should appear from nowhere.',
    'Nothing important should disappear without a coherent exit.',
    'Motion should preserve continuity between states.',
    'Directional movement must match spatial logic.',
    'Premium motion is calm, precise, and restrained.',
    'Hierarchy should be reinforced through timing and settlement, not spectacle.',
  ],
  admin: [
    'Use faster and quieter transitions.',
    'Prioritize clarity and task speed over decorative motion.',
    'Avoid heavy stagger and expressive scale in dense operational screens.',
  ],
} as const

export type MotionPresets = typeof motionPresets