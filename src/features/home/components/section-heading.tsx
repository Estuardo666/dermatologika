import { cx } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={cx("space-y-4", align === "center" && "text-center")}>
      <span className="inline-flex rounded-pill border border-border-brand bg-brand-soft px-3 py-1 text-caption uppercase tracking-[0.14em] text-text-brand">
        {eyebrow}
      </span>
      <div className="space-y-3">
        <h2 className="text-headline-sm text-text-primary sm:text-headline-md">{title}</h2>
        <p className="max-w-prose text-body-md text-text-secondary">{description}</p>
      </div>
    </div>
  );
}
