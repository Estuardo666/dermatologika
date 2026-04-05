"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, Trash2, Minus, Plus, ShoppingBag, ShieldCheck, Tag, Truck } from "lucide-react";

import { motionTokens } from "@/motion/tokens";
import { useCheckoutPricingPreview } from "@/features/checkout/hooks/use-checkout-pricing-preview";
import type { CheckoutPricingLine } from "@/types/checkout-pricing";
import { useCart } from "../context/cart-context";
import type { CartItem } from "../types";

// ─── Price formatter ──────────────────────────────────────────────────────────

const priceFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
});

// ─── Cart item row ────────────────────────────────────────────────────────────

function CartItemRow({ item, pricingLine, isPricingPending }: {
  item: CartItem;
  pricingLine: CheckoutPricingLine | null;
  isPricingPending: boolean;
}) {
  const { removeItem, updateQuantity } = useCart();
  const unitPrice = item.discountPrice ?? item.price ?? 0;
  const baseSubtotal = unitPrice * item.quantity;
  const finalSubtotal = pricingLine?.finalSubtotal ?? baseSubtotal;
  const hasPromotionDiscount = (pricingLine?.discountTotal ?? 0) > 0;

  return (
    <div className="flex items-start gap-3 py-4">
      {/* Product image */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border-soft bg-white">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- R2 assets use native img
          <img
            src={item.imageUrl}
            alt={item.imageAlt}
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-soft">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-label-sm text-neutral-500">
              {item.name.slice(0, 1).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Info + stepper */}
      <div className="min-w-0 flex-1 pr-2">
        <Link
          href={item.href}
          className="block text-[0.9rem] font-medium leading-snug text-text-primary line-clamp-2 hover:text-text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1 sm:text-[0.85rem]"
        >
          {item.name}
        </Link>
        <p className="mt-0.5 text-caption text-text-muted">{item.brand}</p>

        {/* Quantity stepper */}
        <div className="mt-2 inline-flex items-center gap-0 rounded-pill border border-border-soft bg-surface-subtle">
          <button
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="flex h-[1.6rem] w-[1.6rem] items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-soft hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1"
            aria-label={`Reducir cantidad de ${item.name}`}
          >
            <Minus className="h-2.5 w-2.5" aria-hidden="true" />
          </button>
          <span
            className="w-6 text-center text-label-sm tabular-nums text-text-primary"
            aria-label={`Cantidad: ${item.quantity}`}
          >
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="flex h-[1.6rem] w-[1.6rem] items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-soft hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1"
            aria-label={`Aumentar cantidad de ${item.name}`}
          >
            <Plus className="h-2.5 w-2.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Price + delete */}
      <div className="flex w-[86px] shrink-0 flex-col items-end gap-3">
        <div className="min-h-[2.5rem] w-full text-right">
          <AnimatePresence mode="wait" initial={false}>
            {isPricingPending && pricingLine === null ? (
              <motion.span
                key="price-loading"
                className="block text-[0.72rem] text-text-muted"
                variants={contentFadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                Calculando...
              </motion.span>
            ) : (
              <motion.div
                key="price-final"
                variants={contentFadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {hasPromotionDiscount ? (
                  <span className="block text-[0.72rem] tabular-nums text-text-muted line-through">
                    {priceFormatter.format(baseSubtotal)}
                  </span>
                ) : (
                  <span className="block text-[0.72rem] opacity-0" aria-hidden="true">
                    {priceFormatter.format(baseSubtotal)}
                  </span>
                )}
                <span className="text-label-md font-semibold tabular-nums text-text-primary">
                  {priceFormatter.format(finalSubtotal)}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          type="button"
          onClick={() => removeItem(item.id)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-status-error/10 hover:text-status-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-error focus-visible:ring-offset-1"
          aria-label={`Eliminar ${item.name} del carrito`}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyCartState() {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-soft">
        <ShoppingBag className="h-8 w-8 text-text-muted" aria-hidden="true" />
      </div>
      <p className="text-body-md font-medium text-text-primary">
        Tu carrito está vacío
      </p>
      <p className="mt-1 text-body-sm text-text-muted">
        Agrega productos para comenzar
      </p>
    </div>
  );
}

// ─── CartSidebar ──────────────────────────────────────────────────────────────

const panelTransition = {
  duration: motionTokens.duration.moderate,
  ease: motionTokens.ease.soft,
} as const;

const backdropTransition = {
  duration: motionTokens.duration.base,
  ease: motionTokens.ease.standard,
} as const;

const ITEM_EXIT_DURATION = motionTokens.duration.slow;
const ITEM_COLLAPSE_EASE = [0.25, 0.8, 0.25, 1] as const;

const contentFadeVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: motionTokens.duration.base,
      ease: motionTokens.ease.soft,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.ease.exit,
    },
  },
} as const;

export function CartSidebar() {
  const { isOpen, closeCart, items, itemCount, subtotal, lastAddedId } = useCart();
  const reduceMotion = useReducedMotion() ?? false;
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const { preview: pricingPreview, isLoading: isPricingPreviewLoading } = useCheckoutPricingPreview({
    items,
    shippingMethod: "standard",
    enabled: isOpen,
  });
  const activePromotionLabels = [...new Set(
    pricingPreview?.appliedPromotions.map((promotion) => promotion.shortLabel).filter(Boolean) ?? [],
  )];
  const linePreviewById = new Map(pricingPreview?.lines.map((line) => [line.productId, line]) ?? []);
  const discountedSubtotal = pricingPreview
    ? pricingPreview.lines.reduce((sum, line) => sum + line.finalSubtotal, 0)
    : subtotal;
  const showSubtotalPending = isPricingPreviewLoading && pricingPreview === null;

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, closeCart]);

  // Focus the close button on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => closeButtonRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const motionConfig = reduceMotion
    ? { panelInitial: { opacity: 0 }, panelAnimate: { opacity: 1 }, panelExit: { opacity: 0 } }
    : {
        panelInitial: { x: "calc(100% + 16px)" },
        panelAnimate: { x: 0 },
        panelExit: { x: "calc(100% + 16px)" },
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            className="fixed inset-0 z-overlay bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            key="cart-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compras"
            className="fixed inset-y-3 left-3 right-3 z-modal flex flex-col overflow-x-hidden overflow-y-hidden rounded-2xl bg-surface-canvas shadow-lg sm:left-auto sm:w-[22rem]"
            initial={motionConfig.panelInitial}
            animate={motionConfig.panelAnimate}
            exit={motionConfig.panelExit}
            transition={panelTransition}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-border-soft px-5 py-4">
              <div className="flex items-center gap-2">
                <h2 className="text-body-md font-semibold text-text-primary">
                  Carrito
                </h2>
                {itemCount > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-primary px-1.5 text-[0.65rem] font-semibold leading-none text-white tabular-nums">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeCart}
                className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-soft hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1"
                aria-label="Cerrar carrito"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Items — scrollable */}
            <div className="flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-5">
              {items.length === 0 ? (
                <EmptyCartState />
              ) : (
                <ul aria-label="Productos en el carrito" className="divide-y divide-border-soft">
                  <AnimatePresence>
                    {items.map((item) => {
                      const isNewItem = item.id === lastAddedId;
                      return (
                        <motion.li
                          key={item.id}
                          className="min-w-0 overflow-hidden"
                          initial={isNewItem ? { opacity: 0, height: 0 } : false}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{
                            opacity: 0,
                            height: 0,
                            transition: {
                              opacity: { duration: motionTokens.duration.fast, ease: motionTokens.ease.exit },
                              height: { duration: ITEM_EXIT_DURATION, ease: ITEM_COLLAPSE_EASE },
                            },
                          }}
                          {...(isNewItem && {
                            transition: {
                              opacity: {
                                duration: motionTokens.duration.moderate,
                                delay: motionTokens.duration.moderate + 0.25,
                                ease: motionTokens.ease.soft,
                              },
                              height: {
                                duration: motionTokens.duration.fast,
                                delay: motionTokens.duration.moderate + 0.15,
                                ease: motionTokens.ease.soft,
                              },
                            },
                          })}
                        >
                          <CartItemRow
                            item={item}
                            pricingLine={linePreviewById.get(item.id) ?? null}
                            isPricingPending={isPricingPreviewLoading}
                          />
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="shrink-0 border-t border-border-soft bg-surface-canvas p-5 pb-safe-bottom">
                <AnimatePresence mode="wait" initial={false}>
                  {isPricingPreviewLoading ? (
                    <motion.div
                      key="promo-loading"
                      className="mb-3 flex items-center gap-2 text-[0.72rem] text-text-muted"
                      variants={contentFadeVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Tag className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>Validando promociones activas...</span>
                    </motion.div>
                  ) : activePromotionLabels.length > 0 ? (
                    <motion.div
                      key="promo-final"
                      className="mb-3 flex items-start gap-2 text-[0.72rem] leading-relaxed text-text-secondary"
                      variants={contentFadeVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Tag className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700" aria-hidden="true" />
                      <p>
                        Promociones activas: <span className="font-medium text-text-primary">{activePromotionLabels.join(" · ")}</span>
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                {/* Subtotal row */}
                <div className="mb-4 flex items-baseline justify-between">
                  <span className="text-body-sm text-text-secondary">Subtotal</span>
                  <div className="min-h-[2.5rem] min-w-[96px] text-right">
                    <AnimatePresence mode="wait" initial={false}>
                      {showSubtotalPending ? (
                        <motion.span
                          key="subtotal-loading"
                          className="text-body-sm text-text-muted"
                          variants={contentFadeVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          Calculando...
                        </motion.span>
                      ) : (
                        <motion.div
                          key="subtotal-final"
                          variants={contentFadeVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          {discountedSubtotal < subtotal ? (
                            <span className="block text-[0.72rem] tabular-nums text-text-muted line-through">
                              {priceFormatter.format(subtotal)}
                            </span>
                          ) : (
                            <span className="block text-[0.72rem] opacity-0" aria-hidden="true">
                              {priceFormatter.format(subtotal)}
                            </span>
                          )}
                          <span className="text-[1.1rem] font-semibold tabular-nums text-text-primary">
                            {priceFormatter.format(discountedSubtotal)}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex min-h-12 w-full items-center justify-center rounded-pill bg-brand-primary px-6 py-3 text-label-md font-semibold text-white shadow-sm transition-colors duration-base ease-soft hover:bg-brand-primaryHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                >
                  Ir al checkout
                </Link>

                {/* Shipping note */}
                <p className="mt-2.5 text-center text-caption text-text-muted">
                  Envío será calculado en el checkout
                </p>

                {/* Trust badges */}
                <div className="mt-4 flex items-center justify-center gap-5">
                  <div className="flex items-center gap-1.5 text-text-muted">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
                    <span className="text-[0.7rem] leading-none">Pago seguro</span>
                  </div>
                  <div className="h-3 w-px bg-border-soft" aria-hidden="true" />
                  <div className="flex items-center gap-1.5 text-text-muted">
                    <Truck className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
                    <span className="text-[0.7rem] leading-none">Envío protegido</span>
                  </div>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
