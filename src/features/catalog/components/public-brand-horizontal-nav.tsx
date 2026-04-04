"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cx } from "@/lib/utils";
import type { PublicCatalogBrandOption } from "@/types/public-catalog";

interface PublicBrandHorizontalNavProps {
  brands: PublicCatalogBrandOption[];
}

export function PublicBrandHorizontalNav({ brands }: PublicBrandHorizontalNavProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const element = scrollerRef.current;
    if (!element) {
      setIsScrollable(false);
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const containerWidth = containerRef.current?.clientWidth ?? element.clientWidth;
    const overflowAmount = element.scrollWidth - containerWidth;
    const scrollable = overflowAmount > 4;

    const maxScrollLeft = Math.max(0, element.scrollWidth - element.clientWidth);

    setIsScrollable(scrollable);
    setCanScrollLeft(scrollable && element.scrollLeft > 4);
    setCanScrollRight(scrollable && element.scrollLeft < maxScrollLeft - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    const element = scrollerRef.current;
    if (!element) {
      return;
    }

    const onScroll = () => updateScrollState();
    element.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      element.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [brands.length, updateScrollState]);

  const scrollByOneItem = (direction: "left" | "right") => {
    const element = scrollerRef.current;
    if (!element) {
      return;
    }

    const items = Array.from(element.children) as HTMLElement[];
    if (items.length === 0) {
      return;
    }

    const currentLeft = element.scrollLeft;
    const viewportRight = currentLeft + element.clientWidth;
    const maxScrollLeft = Math.max(0, element.scrollWidth - element.clientWidth);

    if (direction === "right") {
      // Reveal the first clipped item on the right without moving it to the start.
      const cut = items.find(
        (item) => item.offsetLeft + item.offsetWidth > viewportRight + 4,
      );
      if (cut) {
        const targetLeft = Math.min(
          maxScrollLeft,
          cut.offsetLeft + cut.offsetWidth - element.clientWidth,
        );

        if (targetLeft > currentLeft + 4) {
          element.scrollTo({ left: targetLeft, behavior: "smooth" });
        }
      }
    } else {
      // Find the last item that starts before the current scroll position
      const prev = [...items].reverse().find((item) => item.offsetLeft < currentLeft - 4);
      if (prev) {
        element.scrollTo({ left: prev.offsetLeft, behavior: "smooth" });
      }
    }
  };

  if (brands.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Marcas disponibles">
      <div ref={containerRef} className="flex items-center gap-1.5 sm:gap-2">
        {isScrollable ? (
          <button
            type="button"
            aria-label="Desplazar marcas hacia la izquierda"
            onClick={() => scrollByOneItem("left")}
            disabled={!canScrollLeft}
            className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full border border-border-default bg-surface-canvas text-text-primary shadow-xs transition hover:border-border-brand hover:bg-brand-soft hover:text-text-brand disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle"
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
          </button>
        ) : null}

        <div
          ref={scrollerRef}
          className={cx(
            "relative min-w-0 flex-1 flex gap-3 overflow-x-auto pb-1 scrollbar-none sm:gap-5",
            isScrollable ? "justify-start" : "justify-center",
          )}
          style={{ scrollbarWidth: "none" }}
        >
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex shrink-0 flex-col items-center gap-2"
              title={brand.name}
            >
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border-soft bg-surface-canvas shadow-xs sm:h-16 sm:w-16">
                {brand.logoUrl ? (
                  <Image
                    src={brand.logoUrl}
                    alt={brand.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <span className="select-none text-label-sm font-medium text-ink-700">
                    {brand.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="max-w-[72px] truncate text-center text-[0.65rem] text-ink-700 sm:max-w-[80px]">
                {brand.name}
              </span>
            </div>
          ))}
        </div>

        {isScrollable ? (
          <button
            type="button"
            aria-label="Desplazar marcas hacia la derecha"
            onClick={() => scrollByOneItem("right")}
            disabled={!canScrollRight}
            className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full border border-border-default bg-surface-canvas text-text-primary shadow-xs transition hover:border-border-brand hover:bg-brand-soft hover:text-text-brand disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle"
          >
            <ChevronRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
          </button>
        ) : null}
      </div>
    </nav>
  );
}
