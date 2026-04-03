export const motionTokens = {
  duration: {
    instant: 0.12,
    fast: 0.18,
    base: 0.24,
    moderate: 0.3,
    slow: 0.36,
    page: 0.42,
    emphasis: 0.52,
  },
  ease: {
    standard: [0.22, 1, 0.36, 1] as const,
    soft: [0.16, 1, 0.3, 1] as const,
    settle: [0.2, 0.9, 0.2, 1] as const,
    exit: [0.4, 0, 1, 1] as const,
    emphasis: [0.18, 1, 0.22, 1] as const,
  },
  distance: {
    micro: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    drawer: 40,
  },
  opacity: {
    hidden: 0,
    soft: 0.72,
    visible: 1,
  },
  scale: {
    hover: 1.01,
    press: 0.985,
    enterSoft: 0.985,
    modalEnter: 0.97,
    modalExit: 0.985,
  },
} as const

export type MotionTokens = typeof motionTokens