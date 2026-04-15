import type { ReactNode } from "react";

interface SectionHeadingProps {
  /** For `aria-labelledby` on the parent section */
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Merged into the subtitle wrapper (e.g. `max-w-3xl text-pretty`). */
  subtitleClassName?: string;
  align?: "center" | "left";
  className?: string;
}

/**
 * Standard section heading for in-page blocks (e.g. "Choosing the Right Funding", "What We Do").
 * Consistent spacing: mb-10 md:mb-12.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  subtitle,
  subtitleClassName = "",
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";
  const subtitleClass =
    align === "center" ? "mx-auto max-w-2xl" : "max-w-xl";

  return (
    <header className={`mb-10 md:mb-12 ${alignClass} ${className}`.trim()}>
      {eyebrow && (
        <p className="text-ori-accent text-xs font-semibold uppercase tracking-widest">
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className={`font-display text-2xl font-bold tracking-tight text-ori-foreground md:text-3xl ${eyebrow ? "mt-2" : ""}`.trim()}
      >
        {title}
      </h2>
      {subtitle && (
        <div
          className={`mt-4 text-ori-muted leading-relaxed ${subtitleClass} ${subtitleClassName}`.trim()}
        >
          {subtitle}
        </div>
      )}
    </header>
  );
}
