import Link from "next/link";

import { cx } from "@/lib/utils";

interface AdminBreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminBreadcrumbsProps {
  items: AdminBreadcrumbItem[];
  className?: string;
}

export function AdminBreadcrumbs({ items, className }: AdminBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cx("overflow-x-auto pb-1 text-body-sm text-text-secondary", className)}>
      <ol className="flex min-w-max items-center gap-2 whitespace-nowrap">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex shrink-0 items-center gap-2">
              {item.href && !isCurrent ? (
                <Link href={item.href} className="rounded-lg px-1 py-0.5 transition-[color,background-color,border-color] duration-[200ms] ease-soft hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas">
                  {item.label}
                </Link>
              ) : (
                <span className={isCurrent ? "text-text-primary" : undefined}>{item.label}</span>
              )}

              {!isCurrent ? <span aria-hidden="true" className="text-text-muted">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}