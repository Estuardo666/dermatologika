"use client";

import { useState } from "react";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";

import { ProductBadge } from "@/components/ui/product-badge";
import { motionTokens } from "@/motion/tokens";
import type { MediaAsset } from "@/types/media";
import type { PublicCatalogCategoryReference } from "@/types/public-catalog";

interface PublicProductCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    href: string;
    price: number | null;
    discountPrice: number | null;
    badge?: string;
    badgeColor?: string;
    media: MediaAsset | null;
    category: PublicCatalogCategoryReference | null;
  };
}

const storefrontPriceFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
});

const addToCartButtonVariants: Variants = {
  initial: {
    opacity: 0,
    y: motionTokens.distance.xs,
    scale: motionTokens.scale.enterSoft,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: motionTokens.duration.base,
      ease: motionTokens.ease.soft,
    },
  },
  exit: {
    opacity: 0,
    y: motionTokens.distance.micro,
    scale: motionTokens.scale.enterSoft,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.ease.exit,
    },
  },
};

export function PublicProductCard({ product }: PublicProductCardProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [showAddToCart, setShowAddToCart] = useState(false);
  const mediaLabel = product.media?.altText?.trim() || product.name;
  const basePrice = product.price;
  const hasPrice = basePrice !== null;
  const hasDiscount =
    basePrice !== null &&
    product.discountPrice !== null &&
    product.discountPrice < basePrice;
  const displayPrice = hasDiscount && product.discountPrice !== null
    ? product.discountPrice
    : basePrice;
  const discountPercentage = hasDiscount && basePrice !== null && product.discountPrice !== null
    ? Math.max(1, Math.round(((basePrice - product.discountPrice) / basePrice) * 100))
    : null;

  return (
    <Link
      href={product.href}
      onPointerEnter={() => setShowAddToCart(true)}
      onPointerLeave={() => setShowAddToCart(false)}
      onFocus={() => setShowAddToCart(true)}
      onBlur={() => setShowAddToCart(false)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-soft bg-white shadow-sm transition-[border-color,box-shadow,background-color] duration-200 ease-soft hover:border-[#d9d6ce] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
    >
      {/* Image area */}
      <div className="relative bg-white">
        <div className="relative aspect-square w-full p-6">
          {product.media?.url ? (
            // eslint-disable-next-line @next/next/no-img-element -- R2 assets use native img
            <img
              src={product.media.url}
              alt={mediaLabel}
              className="h-full w-full object-contain transition-transform duration-300 ease-soft group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 text-label-md text-neutral-500">
                {product.name.slice(0, 1).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="absolute right-3 top-3 flex max-w-[70%] flex-col items-end gap-2">
          {product.badge ? (
            <ProductBadge
              label={product.badge}
              color={product.badgeColor}
              className="max-w-full rounded-full border px-1 py-0.5 text-[0.58rem] leading-none scale-90 origin-top-right"
            />
          ) : null}

          {discountPercentage !== null ? (
            <span className="rounded-full bg-[#e35d5d] px-3 py-1 text-[0.74rem] font-medium leading-none text-white">
              -{discountPercentage}%
            </span>
          ) : null}
        </div>

        <AnimatePresence initial={false}>
          {showAddToCart ? (
            reduceMotion ? (
              <motion.div
                key="add-to-cart"
                className="pointer-events-auto absolute inset-x-3 bottom-3 hidden cursor-pointer md:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#5bb446] px-3 py-2 text-white transition-colors duration-200 ease-soft hover:bg-[#499038] sm:gap-3 sm:px-4">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[0.78rem] font-normal tracking-[0.02em] sm:gap-2 sm:text-[0.84rem] sm:tracking-[0.03em]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                      aria-hidden="true"
                    >
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    Agregar al carrito
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="add-to-cart"
                className="pointer-events-auto absolute inset-x-3 bottom-3 hidden cursor-pointer md:block"
                variants={addToCartButtonVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#5bb446] px-3 py-2 text-white transition-colors duration-200 ease-soft hover:bg-[#499038] sm:gap-3 sm:px-4">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[0.78rem] font-normal tracking-[0.02em] sm:gap-2 sm:text-[0.84rem] sm:tracking-[0.03em]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                      aria-hidden="true"
                    >
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    Agregar al carrito
                  </span>
                </div>
              </motion.div>
            )
          ) : null}
        </AnimatePresence>
      </div>

      {/* Info area */}
      <div className="flex flex-1 flex-col bg-[#f1f1f1] p-[6px] pb-4 pt-4 sm:p-4">
        <div className="flex items-baseline justify-between gap-3">
          {product.category ? (
            <p className="min-w-0 text-[0.74rem] font-normal leading-[1.1] tracking-[-0.015em] text-text-primary sm:text-body-sm sm:tracking-normal">
              {product.category.name}
            </p>
          ) : null}

          {hasDiscount && hasPrice && displayPrice !== null ? (
            <span className="flex shrink-0 items-baseline gap-2 whitespace-nowrap">
              <span className="text-[0.72rem] font-light leading-none text-neutral-400 line-through sm:text-[0.83rem]">
                {storefrontPriceFormatter.format(basePrice)}
              </span>
              <span className="text-[0.95rem] font-semibold leading-none text-ink-700 sm:text-[1rem]">
                {storefrontPriceFormatter.format(displayPrice)}
              </span>
            </span>
          ) : displayPrice !== null ? (
            <span className="shrink-0 whitespace-nowrap text-[0.95rem] font-semibold leading-none text-ink-700 sm:text-[1rem]">
              {storefrontPriceFormatter.format(displayPrice)}
            </span>
          ) : (
            <span className="shrink-0 whitespace-nowrap text-[0.78rem] font-semibold leading-none text-ink-700 sm:text-[0.84rem]">
              Consultar precio
            </span>
          )}
        </div>

        <h2 className="mt-3 w-full text-[0.98rem] font-medium leading-[1.15] text-text-primary line-clamp-3 sm:w-4/5 sm:text-[1.04rem] sm:leading-[1.2rem]">
          {product.name}
        </h2>

        <p className="mt-2 text-body-sm font-normal leading-[1.12] text-text-secondary">
          {product.brand}
        </p>

        <div className="mt-auto pt-4 md:hidden">
          <div className="flex w-full min-h-11 items-center justify-center gap-2 rounded-full bg-[#5bb446] px-3 py-2 text-white transition-colors duration-200 ease-soft hover:bg-[#499038]">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[0.78rem] font-normal tracking-[0.02em]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Agregar al carrito
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}