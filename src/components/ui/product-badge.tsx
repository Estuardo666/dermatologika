import { cx } from "@/lib/utils";
import { getProductBadgeTokens } from "@/lib/product-badges";

interface ProductBadgeProps {
  label: string;
  color?: string | null | undefined;
  className?: string;
}

export function ProductBadge({ label, color, className }: ProductBadgeProps) {
  const tokens = getProductBadgeTokens(color);

  return (
    <span
      className={cx(
        "inline-flex items-center justify-center whitespace-nowrap rounded-full border px-3 py-1 font-normal uppercase tracking-[0.14em] text-[0.62rem] sm:text-[0.7rem]",
        className,
      )}
      style={{
        backgroundColor: tokens.backgroundColor,
        borderColor: tokens.borderColor,
        color: tokens.textColor,
        boxShadow: `0 10px 18px -18px ${tokens.shadowColor}`,
      }}
    >
      {label}
    </span>
  );
}