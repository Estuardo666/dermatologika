"use client";

import type { ReactNode } from "react";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

import { motionTokens } from "@/motion/tokens";

interface AdminContentShellProps {
  children: ReactNode;
}

export function AdminContentShell({ children }: AdminContentShellProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      key={pathname}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          duration: reduceMotion ? motionTokens.duration.fast : motionTokens.duration.slow,
          ease: motionTokens.ease.standard,
        },
      }}
      className="min-w-0 flex-1"
    >
      {children}
    </motion.div>
  );
}