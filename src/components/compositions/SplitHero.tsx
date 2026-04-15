/**
 * SplitHero — two-column hero (copy + visual slot). Use for module landings or pillar pages
 * when a single centered PageHero is not enough. Do not nest another full-width hero inside.
 */
import type { ReactNode } from "react";
import { PageSection } from "../system";
interface SplitHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  /** Right column on lg+ (or left if visualPosition=left) */
  visual: ReactNode;
  visualPosition?: "left" | "right";
  className?: string;
}

export function SplitHero({
  eyebrow,
  title,
  subtitle,
  actions,
  visual,
  visualPosition = "right",
  className = "",
}: SplitHeroProps) {
  const copy = (
    <div className="flex flex-col justify-center">
      {eyebrow && <p className="ori-type-eyebrow">{eyebrow}</p>}
      <h1 className={`font-display font-bold tracking-tight text-ori-foreground text-3xl md:text-4xl ${eyebrow ? "mt-4" : ""}`}>
        {title}
      </h1>
      {subtitle && <div className="mt-6 ori-lead text-ori-muted max-w-xl">{subtitle}</div>}
      {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
    </div>
  );

  const visualBlock = <div className="relative w-full">{visual}</div>;

  return (
    <PageSection variant="loose" className={`border-b border-ori-border ${className}`.trim()}>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div className={visualPosition === "left" ? "lg:order-2" : undefined}>{copy}</div>
        <div className={visualPosition === "left" ? "lg:order-1" : undefined}>{visualBlock}</div>
      </div>
    </PageSection>
  );
}
