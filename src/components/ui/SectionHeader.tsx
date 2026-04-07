/**
 * Reusable section header: eyebrow, title, subtitle.
 * Enforces consistent spacing and readable line length.
 */

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  size?: "lg" | "md";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  size = "md",
  className = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";
  const titleSizeClass =
    size === "lg"
      ? "font-display text-3xl font-bold tracking-tight text-ori-foreground md:text-4xl lg:text-5xl"
      : "font-display text-2xl font-bold tracking-tight text-ori-foreground md:text-3xl";

  return (
    <header className={`${alignClass} ${className}`.trim()}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-wider text-ori-accent">
          {eyebrow}
        </p>
      )}
      <h2 className={eyebrow ? `mt-2 ${titleSizeClass}` : titleSizeClass}>{title}</h2>
      {subtitle && (
        <p className={`mt-3 ori-readable text-ori-muted leading-relaxed ${align === "center" ? "mx-auto text-lg" : "text-base"}`.trim()}>
          {subtitle}
        </p>
      )}
    </header>
  );
}
