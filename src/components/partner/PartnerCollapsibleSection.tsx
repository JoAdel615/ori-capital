import { useCallback, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export type PartnerCollapsibleSectionProps = {
  /** For `aria-labelledby` / in-page anchors */
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Tighter typography and padding (dashboard-style panels). */
  density?: "default" | "compact";
};

/**
 * Premium disclosure pattern for partner dashboard bands — matches elevated panels
 * elsewhere (ring, surface-panel, typography) with motion-safe chevron affordance.
 */
export function PartnerCollapsibleSection({
  id,
  eyebrow = "Portal",
  title,
  subtitle,
  defaultOpen = false,
  badge,
  children,
  className = "",
  density = "default",
}: PartnerCollapsibleSectionProps) {
  const setDetailsRef = useCallback(
    (node: HTMLDetailsElement | null) => {
      if (node && defaultOpen) node.open = true;
    },
    [defaultOpen],
  );
  const compact = density === "compact";
  const summaryPad = compact ? "px-5 py-3.5 md:px-6 md:py-4" : "px-5 py-5 md:px-8 md:py-6";
  const titleClass = compact
    ? "mt-1 font-display text-lg font-semibold tracking-tight text-ori-foreground"
    : "mt-2 font-display text-xl font-bold tracking-tight text-ori-foreground md:text-2xl";
  const subtitleClass = compact
    ? "mt-1 max-w-2xl text-pretty text-xs leading-relaxed text-ori-text-secondary sm:text-sm"
    : "mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-ori-text-secondary md:text-base md:leading-relaxed";
  const bodyPad = compact ? "px-5 py-5 md:px-6 md:py-6" : "px-5 py-8 md:px-8 md:py-10";
  const chevronWrap = compact
    ? "flex h-8 w-8 items-center justify-center rounded-lg border border-ori-border bg-ori-surface-base/70 text-ori-muted motion-safe:transition-colors motion-safe:duration-200 group-open:border-ori-accent/40 group-open:text-ori-accent"
    : "flex h-10 w-10 items-center justify-center rounded-xl border border-ori-border bg-ori-surface-base/70 text-ori-muted motion-safe:transition-colors motion-safe:duration-200 group-open:border-ori-accent/40 group-open:text-ori-accent";
  const chevronIcon = compact ? "h-4 w-4" : "h-5 w-5";

  return (
    <section
      className={`overflow-hidden rounded-[1.25rem] border border-ori-border bg-ori-surface-panel shadow-sm ring-1 ring-white/[0.04] motion-safe:transition-shadow ${className}`.trim()}
    >
      <details ref={setDetailsRef} className="group">
        <summary
          className={`flex cursor-pointer list-none items-center justify-between gap-3 marker:content-none motion-safe:transition-colors motion-safe:duration-200 hover:bg-ori-surface-raised/30 [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ori-accent ${summaryPad}`.trim()}
        >
          <div className="min-w-0 flex-1 text-left">
            <p className="ori-type-eyebrow text-ori-accent">{eyebrow}</p>
            <h2 id={id} className={titleClass}>
              {title}
            </h2>
            {subtitle ? <p className={subtitleClass}>{subtitle}</p> : null}
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {badge}
            <span className={chevronWrap} aria-hidden>
              <ChevronDown
                className={`${chevronIcon} motion-safe:transition-transform motion-safe:duration-200 group-open:rotate-180`.trim()}
              />
            </span>
          </div>
        </summary>
        <div
          className={`border-t border-ori-border/80 bg-gradient-to-b from-ori-surface-base/40 via-ori-surface-base/60 to-ori-surface-base/80 ${bodyPad}`.trim()}
        >
          {children}
        </div>
      </details>
    </section>
  );
}
