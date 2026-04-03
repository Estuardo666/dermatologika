"use client";

import { useEffect, useState } from "react";

import { motion, useReducedMotion } from "framer-motion";

import { motionTokens } from "@/motion/tokens";
import type { PublicCatalogProductSummary } from "@/types/public-catalog";

import { PublicProductCard } from "./public-product-card";

interface PublicProductGridProps {
  items: PublicCatalogProductSummary[];
  mobileColumns?: 1 | 2;
}

const ROW_STAGGER_DELAY = 0.08;

function resolveColumnCount(width: number, mobileColumns: 1 | 2): number {
  if (width >= 1280) {
    return 5;
  }

  if (width >= 1024) {
    return 4;
  }

  if (width >= 768) {
    return 3;
  }

  if (width >= 640) {
    return 2;
  }

  return mobileColumns;
}

export function PublicProductGrid({ items, mobileColumns = 1 }: PublicProductGridProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [columnCount, setColumnCount] = useState<number>(mobileColumns);

  useEffect(() => {
    const updateColumnCount = () => {
      setColumnCount(resolveColumnCount(window.innerWidth, mobileColumns));
    };

    updateColumnCount();
    window.addEventListener("resize", updateColumnCount);

    return () => {
      window.removeEventListener("resize", updateColumnCount);
    };
  }, [mobileColumns]);

  return (
    <ul
      className={mobileColumns === 2
        ? "grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        : "grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"}
    >
      {items.map((product, index) => {
        const rowIndex = Math.floor(index / columnCount);

        return (
          <motion.li
            key={product.id}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: motionTokens.distance.sm,
                    filter: "blur(10px)",
                  }
            }
            whileInView={
              reduceMotion
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }
            }
            viewport={{ once: true, amount: 0.22 }}
            transition={{
              duration: reduceMotion ? motionTokens.duration.fast : motionTokens.duration.moderate,
              delay: rowIndex * ROW_STAGGER_DELAY,
              ease: motionTokens.ease.standard,
            }}
          >
            <PublicProductCard product={product} />
          </motion.li>
        );
      })}
    </ul>
  );
}