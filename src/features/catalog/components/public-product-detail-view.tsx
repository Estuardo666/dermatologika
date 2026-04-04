"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";

import { ProductBadge } from "@/components/ui/product-badge";
import { motionTokens } from "@/motion/tokens";
import type { PublicProductDetailData } from "@/types/public-catalog";

import { PublicProductCarousel } from "./public-product-carousel";
import { PublicProductGrid } from "./public-product-grid";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const { duration, ease } = motionTokens;

const priceFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
});

type StockStatus = { label: string; textColor: string; dotColor: string };

function deriveStockStatus(stock: number): StockStatus {
  if (stock === 0) return { label: "Sin stock", textColor: "text-[#cc5533]", dotColor: "bg-[#cc5533]" };
  if (stock <= 5) return { label: "Últimas unidades", textColor: "text-[#b38b00]", dotColor: "bg-[#d4ac1a]" };
  return { label: "En stock", textColor: "text-[#3a8c2e]", dotColor: "bg-[#4ea843]" };
}

// ─── Framer Motion variants ───────────────────────────────────────────────────

const cartIdleVariants: Variants = {
  initial: { opacity: 0, y: 7, scale: 0.96 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: duration.base, ease: ease.soft },
  },
  exit: {
    opacity: 0,
    y: -5,
    scale: 0.97,
    transition: { duration: duration.fast, ease: ease.exit },
  },
};

const cartAddedVariants: Variants = {
  initial: { opacity: 0, scale: 0.88, y: 6 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.soft },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -4,
    transition: { duration: duration.fast, ease: ease.exit },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface PublicProductDetailViewProps {
  data: PublicProductDetailData;
}

export function PublicProductDetailView({ data }: PublicProductDetailViewProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const { product, brandProducts, recommendedProducts } = data;

  const [quantity, setQuantity] = useState(1);
  const [cartState, setCartState] = useState<"idle" | "added">("idle");
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHeartBeating, setIsHeartBeating] = useState(false);
  const cartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Price logic
  const hasPrice = typeof product.price === "number" && product.price > 0;
  const hasDiscount =
    hasPrice &&
    product.discountPrice !== null &&
    product.discountPrice < product.price;
  const displayPrice =
    hasDiscount && product.discountPrice !== null
      ? product.discountPrice
      : hasPrice
        ? product.price
        : null;
  const discountPercent =
    hasDiscount && product.discountPrice !== null
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : null;

  const outOfStock = product.stock === 0;
  const stockStatus = deriveStockStatus(product.stock);

  const handleAddToCart = useCallback(() => {
    if (cartState !== "idle" || outOfStock) return;
    // Haptic feedback — Android Chrome; graceful no-op on iOS/desktop
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([12, 60, 18]);
    }
    setCartState("added");
    cartTimerRef.current = setTimeout(() => setCartState("idle"), 2200);
  }, [cartState, outOfStock]);

  useEffect(() => {
    return () => {
      if (cartTimerRef.current) clearTimeout(cartTimerRef.current);
      if (heartTimerRef.current) clearTimeout(heartTimerRef.current);
    };
  }, []);

  const handleFavorite = useCallback(() => {
    setIsFavorited((prev) => {
      const next = !prev;
      if (next) {
        setIsHeartBeating(true);
        if (heartTimerRef.current) clearTimeout(heartTimerRef.current);
        heartTimerRef.current = setTimeout(() => setIsHeartBeating(false), 2100);
      } else {
        setIsHeartBeating(false);
        if (heartTimerRef.current) clearTimeout(heartTimerRef.current);
      }
      return next;
    });
  }, []);

  return (
    <div className="container py-10 sm:py-14">
      <div className="space-y-12">

        {/* ── Product layout ──────────────────────────────────────────────── */}
        <section
          aria-label="Detalle del producto"
          className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)] lg:items-stretch"
        >
          {/* Left: product image */}
          <div className="group relative min-h-[360px] overflow-hidden rounded-2xl border border-border-soft bg-white sm:min-h-[480px]">
            {product.media?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.media.url}
                alt={product.media.altText?.trim() || product.name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-contain p-8 transition-transform duration-500 ease-soft group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center p-8">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-label-lg text-text-muted">
                  {product.name.slice(0, 1).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Right: info panel */}
          <div className="flex flex-col gap-5">

            {/* Breadcrumbs + Stock status */}
            <div className="flex items-start justify-between gap-3">
              <nav aria-label="Breadcrumb" className="text-body-sm text-text-secondary">
                <ol className="flex flex-wrap items-center gap-2">
                  <li>
                    <Link href="/" className="transition hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
                      Inicio
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link href="/productos" className="transition hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
                      Productos
                    </Link>
                  </li>
                  {product.category ? (
                    <>
                      <li aria-hidden="true">/</li>
                      <li aria-current="page">
                        <Link href={product.category.href} className="transition hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
                          {product.category.name}
                        </Link>
                      </li>
                    </>
                  ) : null}
                </ol>
              </nav>
              <div className="flex shrink-0 items-center gap-1.5 opacity-75">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${stockStatus.dotColor}`}
                  aria-hidden="true"
                />
                <span className={`text-body-sm font-medium ${stockStatus.textColor}`}>
                  {stockStatus.label}
                </span>
              </div>
            </div>

            {/* Badge */}
            {product.badge ? (
              <div>
                <ProductBadge
                  label={product.badge}
                  color={product.badgeColor}
                  className="rounded-pill border px-2.5 py-0.5 text-[0.68rem]"
                />
              </div>
            ) : null}

            {/* Name + Brand */}
            <div className="space-y-3">
              <h1 className="text-headline-md leading-tight text-text-primary sm:text-headline-lg">
                {product.name}
              </h1>
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-soft bg-surface-subtle text-[0.6rem] font-semibold uppercase text-text-muted"
                  aria-hidden="true"
                >
                  {product.brand.slice(0, 2)}
                </span>
                <span className="text-body-md font-medium text-text-secondary">
                  {product.brand}
                </span>
              </div>
            </div>

            {/* Rating — static placeholder */}
            <div
              className="flex items-center gap-2"
              aria-label="Calificación: 4.5 de 5 estrellas, 3 reseñas"
            >
              <div className="flex items-center gap-0.5" aria-hidden="true">
                {[1, 2, 3, 4].map((i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4 text-[#f5a623]"
                    aria-hidden="true"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
                {/* Half star */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 text-[#f5a623]" aria-hidden="true">
                  <defs>
                    <linearGradient id="half-star-detail">
                      <stop offset="50%" stopColor="#f5a623" />
                      <stop offset="50%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                    fill="url(#half-star-detail)"
                    stroke="#f5a623"
                    strokeWidth="1"
                  />
                </svg>
              </div>
              <span className="text-body-sm font-semibold text-text-primary">4.5</span>
              <span className="text-body-sm text-text-secondary">(3 reseñas)</span>
            </div>

            {/* Description */}
            <p className="text-body-md leading-relaxed text-text-secondary">
              {product.description}
            </p>

            {/* ── Purchase area ──────────────────────────────────────────── */}
            <div className="space-y-4">

              {/* Price */}
              {hasPrice ? (
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-[1.45rem] font-semibold leading-none text-ink-700">
                    {priceFormatter.format(displayPrice!)}
                  </span>
                  {hasDiscount ? (
                    <>
                      <span className="text-body-md font-light text-neutral-400 line-through">
                        {priceFormatter.format(product.price)}
                      </span>
                      {discountPercent !== null ? (
                        <span className="rounded-full bg-[#e35d5d] px-2.5 py-0.5 text-[0.72rem] font-medium text-white">
                          -{discountPercent}%
                        </span>
                      ) : null}
                    </>
                  ) : null}
                </div>
              ) : (
                <p className="text-body-sm font-medium text-text-secondary">Consultar precio</p>
              )}

              {/* Quantity selector */}
              <div className="flex items-center gap-3">
                <span className="text-body-sm text-text-secondary sm:text-body-sm">Cantidad</span>
                <div className="flex items-center overflow-hidden rounded-full border border-border-soft bg-surface-canvas">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || outOfStock}
                    aria-label="Reducir cantidad"
                    className="flex h-11 w-11 items-center justify-center text-text-secondary transition hover:bg-surface-soft hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-primary sm:h-9 sm:w-9"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4 sm:h-3.5 sm:w-3.5" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <span
                    className="w-11 text-center text-[1rem] font-semibold tabular-nums text-text-primary sm:w-9 sm:text-[0.9rem]"
                    aria-live="polite"
                    aria-label={`Cantidad: ${quantity}`}
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={outOfStock || quantity >= product.stock}
                    aria-label="Aumentar cantidad"
                    className="flex h-11 w-11 items-center justify-center text-text-secondary transition hover:bg-surface-soft hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-primary sm:h-9 sm:w-9"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4 sm:h-3.5 sm:w-3.5" aria-hidden="true">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Cart + Favorites row */}
              <div className="flex items-center gap-3">

                {/* ── Add to cart — Framer Motion post-click ───────────── */}
                <motion.button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={outOfStock || cartState === "added"}
                  whileTap={reduceMotion ? {} : { scale: 0.975, transition: { duration: 0.1 } }}
                  className={[
                    "relative flex h-12 flex-1 items-center justify-center overflow-hidden rounded-full px-5 text-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
                    outOfStock
                      ? "cursor-not-allowed bg-neutral-400"
                      : cartState === "added"
                        ? "cursor-default bg-[#3d9c2a]"
                        : "cursor-pointer bg-[#5bb446] hover:bg-[#499038]",
                  ].join(" ")}
                  aria-label={
                    cartState === "added"
                      ? "Producto agregado al carrito"
                      : outOfStock
                        ? "Producto sin stock"
                        : `Agregar ${quantity} unidad${quantity !== 1 ? "es" : ""} al carrito`
                  }
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {cartState === "idle" ? (
                      <motion.span
                        key="idle"
                        className="flex w-full items-center justify-between gap-2 px-1"
                        variants={reduceMotion ? {} : cartIdleVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <span className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[1.05rem] w-[1.05rem] shrink-0" aria-hidden="true">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                          </svg>
                          <span className="text-[1.05rem] font-medium tracking-[0.01em]">
                            {outOfStock ? "Sin stock" : "Agregar al carrito"}
                          </span>
                        </span>
                        {displayPrice !== null && !outOfStock ? (
                          <>
                            <span className="h-4 w-px shrink-0 bg-white/40" aria-hidden="true" />
                            <span className="shrink-0 tabular-nums text-[1.05rem] font-semibold tracking-[0.01em]">
                              {priceFormatter.format(displayPrice * quantity)}
                            </span>
                          </>
                        ) : null}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="added"
                        className="flex items-center justify-center gap-2"
                        variants={reduceMotion ? {} : cartAddedVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-[1.05rem] w-[1.05rem] shrink-0" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="text-[0.97rem] font-medium">¡Agregado!</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* ── Favorites — Framer Motion heart toggle ───────────── */}
                <div className="group relative">
                  <motion.button
                    type="button"
                    onClick={handleFavorite}
                    whileTap={reduceMotion ? {} : { scale: 0.85, transition: { duration: 0.1 } }}
                    className={[
                      "flex h-12 w-12 items-center justify-center rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
                      isFavorited
                        ? "border-rose-200 bg-rose-50"
                        : "border-border-soft bg-surface-canvas hover:border-rose-200 hover:bg-rose-50",
                    ].join(" ")}
                    aria-label={isFavorited ? "Quitar de favoritos" : "Añadir a mis favoritos"}
                    aria-pressed={isFavorited}
                  >
                    {/* Heartbeat 2s on activate, spring return on deactivate */}
                    <motion.div
                      animate={
                        reduceMotion
                          ? {}
                          : isHeartBeating
                            ? { scale: [1, 1.42, 0.9, 1.3, 0.96, 1.2, 0.98, 1.1, 1.0, 1.0] }
                            : { scale: 1 }
                      }
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : isHeartBeating
                            ? {
                                duration: 2,
                                times: [0, 0.06, 0.15, 0.23, 0.31, 0.41, 0.48, 0.56, 0.63, 1],
                                ease: "easeInOut",
                              }
                            : { type: "spring", stiffness: 300, damping: 20 }
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <motion.path
                          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          animate={{
                            fill: isFavorited ? "#ef4444" : "rgba(0,0,0,0)",
                            stroke: isFavorited ? "#ef4444" : "#9ca3af",
                          }}
                          transition={
                            reduceMotion
                              ? { duration: 0 }
                              : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
                          }
                        />
                      </svg>
                    </motion.div>
                  </motion.button>

                  {/* Tooltip */}
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute bottom-full left-1/2 z-tooltip mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink-700 px-2.5 py-1 text-[0.72rem] font-medium text-white opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100"
                  >
                    {isFavorited ? "Quitar de favoritos" : "Añadir a mis favoritos"}
                  </span>
                </div>

              </div>
            </div>

            {/* Product ID */}
            <p className="text-[0.7rem] tracking-[0.04em] text-text-muted">
              ID: {product.id}
            </p>

          </div>
        </section>

        {/* ── More from this brand ────────────────────────────────────────── */}
        {brandProducts.length > 0 ? (
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-section-xl text-text-primary">Más de esta marca</h2>
              <p className="text-body-md text-text-secondary">
                Explora más productos de {product.brand} disponibles en el catálogo.
              </p>
            </div>
            <PublicProductCarousel items={brandProducts} />
          </section>
        ) : null}

        {/* ── Recomendados para ti ────────────────────────────────────────── */}
        {recommendedProducts.length > 0 ? (
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-section-xl text-text-primary">Recomendados para ti</h2>
              <p className="text-body-md text-text-secondary">
                {product.category
                  ? `Más productos de ${product.category.name} que podrían interesarte.`
                  : "Otros productos que podrían interesarte."}
              </p>
            </div>
            <PublicProductCarousel items={recommendedProducts} />
          </section>
        ) : null}

      </div>
    </div>
  );
}