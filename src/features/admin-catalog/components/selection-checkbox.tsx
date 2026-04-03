"use client";

import { motion } from "framer-motion";

import { cx } from "@/lib/utils";

interface SelectionCheckboxProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  srLabel: string;
}

export function SelectionCheckbox({ checked, onChange, disabled = false, srLabel }: SelectionCheckboxProps) {
  return (
    <label className="relative inline-flex h-4 w-4 items-center justify-center">
      <span className="sr-only">{srLabel}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="peer sr-only"
      />

      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{
          scale: checked ? 1 : 0.96,
        }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className={cx(
          "flex h-4 w-4 items-center justify-center rounded-full border shadow-[inset_0_0_0_1px_rgba(0,0,0,0.01)] transition-[background-color,border-color] duration-[180ms] ease-soft peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-border-brand peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-canvas",
          checked ? "border-border-brand bg-brand-primary" : "border-border-default bg-surface-canvas",
          disabled ? "opacity-50" : "cursor-pointer",
        )}
      >
        <motion.span
          initial={false}
          animate={{
            opacity: checked ? 1 : 0,
            scale: checked ? 1 : 0.4,
          }}
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="h-1.5 w-1.5 rounded-full bg-surface-canvas"
        />
      </motion.span>
    </label>
  );
}
