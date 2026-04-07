import type { ReactNode } from "react";
import { PageSection } from "./PageSection";

interface PageHeroProps {
  /** Small label in ori-accent, uppercase tracking */
  eyebrow?: string;
  title: ReactNode;
  /** Short, 1–2 lines */
  subtitle?: ReactNode;
  /** Optional longer copy */
  body?: ReactNode;
  align?: "center" | "left";
  /** CTA buttons row */
  actions?: ReactNode;
  /** Helper line below actions (e.g. "Not sure? Take the survey") */
  helper?: ReactNode;
  /**
   * "home" = large type (text-4xl md:text-5xl lg:text-6xl);
   * "inner" = inner pages (text-3xl md:text-4xl)
   */
  size?: "home" | "inner";
  /** Extra section class (e.g. bg-ori-section-alt) */
  className?: string;
}

/**
 * Single reusable hero pattern for every page.
 * Spacing: eyebrow->title mt-4, title->subtitle/body mt-6, subtitle/body->actions mt-8, actions->helper mt-4.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  body,
  align = "center",
  actions,
  helper,
  size = "inner",
  className = "",
}: PageHeroProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";
  const titleClass =
    size === "home"
      ? "font-display font-bold tracking-tight text-ori-foreground text-4xl md:text-5xl lg:text-6xl"
      : "font-display font-bold tracking-tight text-ori-foreground text-3xl md:text-4xl";
  const subtitleMaxClass = align === "center" ? "max-w-2xl mx-auto" : "max-w-xl";
  const actionsClass =
    align === "center"
      ? "flex flex-wrap gap-3 items-center justify-center"
      : "flex flex-wrap gap-3 items-center justify-start";

  return (
    <PageSection variant="loose" container className={className}>
      <div className={size === "home" ? "-translate-y-6" : ""}>
      <header className={alignClass}>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-widest text-ori-accent">
            {eyebrow}
          </p>
        )}
        <h1 className={eyebrow ? `mt-4 ${titleClass}` : titleClass}>{title}</h1>
        {(subtitle || body) && (
          <div className={`mt-6 ori-lead text-ori-muted ${subtitleMaxClass}`}>
            {subtitle}
            {body}
          </div>
        )}
        {actions && (
          <div
            className={`${size === "home" ? "mt-16 md:mt-24" : "mt-8 md:mt-10"} ${actionsClass}`}
          >
            {actions}
          </div>
        )}
        {helper && <div className="mt-4 text-ori-muted text-sm">{helper}</div>}
      </header>
      </div>
    </PageSection>
  );
}
