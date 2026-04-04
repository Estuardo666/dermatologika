"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, Trash2, Minus, Plus, ShoppingBag, ShieldCheck, Truck } from "lucide-react";

import { motionTokens } from "@/motion/tokens";
import { useCart } from "../context/cart-context";
import type { CartItem } from "../types";

// ─── Price formatter ──────────────────────────────────────────────────────────

const priceFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
});

// ─── Cart item row ────────────────────────────────────────────────────────────

function CartItemRow({ item }: { item: CartItem }) {
  const { removeItem, updateQuantity } = useCart();
  const unitPrice = item.discountPrice ?? item.price ?? 0;

  return (
    <div className="flex items-start gap-3 py-4">
      {/* Product image */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border-soft bg-white">
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
      <div className="min-w-0 flex-1">
        <Link
          href={item.href}
          className="block text-body-sm font-medium leading-snug text-text-primary line-clamp-2 hover:text-text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1"
        >
          {item.name}
        </Link>
        <p className="mt-0.5 text-caption text-text-muted">{item.brand}</p>

        {/* Quantity stepper */}
        <div className="mt-2 inline-flex items-center gap-0 rounded-pill border border-border-soft bg-surface-subtle">
          <button
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-soft hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1"
            aria-label={`Reducir cantidad de ${item.name}`}
          >
            <Minus className="h-3 w-3" aria-hidden="true" />
          </button>
          <span
            className="w-7 text-center text-label-sm tabular-nums text-text-primary"
            aria-label={`Cantidad: ${item.quantity}`}
          >
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-soft hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1"
            aria-label={`Aumentar cantidad de ${item.name}`}
          >
            <Plus className="h-3 w-3" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Price + delete */}
      <div className="flex shrink-0 flex-col items-end gap-3">
        <span className="text-label-md font-semibold tabular-nums text-text-primary">
          {priceFormatter.format(unitPrice * item.quantity)}
        </span>
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

const itemVariants = {
  hidden: { opacity: 0, x: motionTokens.distance.sm },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: motionTokens.duration.base,
      ease: motionTokens.ease.soft,
      delay: i * 0.04,
    },
  }),
  exit: {
    opacity: 0,
    x: motionTokens.distance.md,
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
            className="fixed bottom-3 right-3 top-3 z-modal flex w-[calc(100%-24px)] max-w-sm flex-col overflow-hidden rounded-2xl bg-surface-canvas shadow-lg"
            initial={motionConfig.panelInitial}
            animate={motionConfig.panelAnimate}
            exit={motionConfig.panelExit}
            transition={panelTransition}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-border-soft px-5 py-4">
              <div className="flex items-center gap-2">
                <h2 className="text-headline-sm font-semibold text-text-primary">
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
            <div className="flex-1 overflow-y-auto overscroll-contain px-5">
              {items.length === 0 ? (
                <EmptyCartState />
              ) : (
                <ul aria-label="Productos en el carrito" className="divide-y divide-border-soft">
                  <AnimatePresence>
                    {items.map((item, i) => {
                      const isNewItem = item.id === lastAddedId;
                      return (
                        <motion.li
                          key={item.id}
                          layout
                          {...(isNewItem
                            ? {
                                initial: { opacity: 0 },
                                animate: { opacity: 1 },
                                exit: {
                                  opacity: 0,
                                  x: motionTokens.distance.md,
                                  transition: {
                                    duration: motionTokens.duration.fast,
                                    ease: motionTokens.ease.exit,
                                  },
                                },
                                transition: {
                                  duration: motionTokens.duration.moderate,
                                  delay: motionTokens.duration.moderate + 0.1,
                                  ease: motionTokens.ease.soft,
                                },
                              }
                            : {
                                custom: reduceMotion ? 0 : i,
                                variants: itemVariants,
                                initial: "hidden",
                                animate: "visible",
                                exit: "exit",
                              })}
                        >
                          <CartItemRow item={item} />
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
                {/* Subtotal row */}
                <div className="mb-4 flex items-baseline justify-between">
                  <span className="text-body-sm text-text-secondary">Subtotal</span>
                  <span className="text-headline-sm font-semibold tabular-nums text-text-primary">
                    {priceFormatter.format(subtotal)}
                  </span>
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
