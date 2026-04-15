import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageSection, SectionHeading } from "../system";
import type { ModuleCardItem } from "../compositions";

type PillarBridgeLinksProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: ModuleCardItem[];
  className?: string;
};

/**
 * Slim list navigation across the three pillars — alternative rhythm to a second ModuleGrid on hub pages.
 */
export function PillarBridgeLinks({ eyebrow, title, subtitle, items, className = "" }: PillarBridgeLinksProps) {
  return (
    <PageSection className={`bg-ori-black section-divider ${className}`.trim()}>
      <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <ul className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-ori-border bg-ori-surface-panel/30">
        {items.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <li key={pillar.to} className="border-b border-ori-border/80 last:border-b-0">
              <Link
                to={pillar.to}
                className="flex items-start gap-4 px-5 py-5 transition-colors hover:bg-ori-surface-panel/50 md:items-center md:justify-between"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-ori-border/80 bg-ori-black/40 text-ori-accent">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-lg font-semibold text-ori-foreground">{pillar.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ori-muted">{pillar.description}</p>
                  </div>
                </div>
                <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-ori-muted sm:mt-0" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
    </PageSection>
  );
}
