/**
 * ModuleGrid — linked cards for pillars or modules. One card pattern only; use `ModuleCardItem` data shape.
 */
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { PageSection, SectionHeading } from "../system";

export interface ModuleCardItem {
  title: string;
  description: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
  /** Link label at card footer (default: "Explore module"). */
  ctaLabel?: string;
}

interface ModuleGridProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  items: ModuleCardItem[];
  className?: string;
  layout?: "mixed" | "uniform";
  /** Sets `id` on the outer `<section>` (e.g. in-page anchors). */
  sectionId?: string;
}

export function ModuleGrid({
  eyebrow,
  title,
  subtitle,
  items,
  className = "",
  layout = "mixed",
  sectionId,
}: ModuleGridProps) {
  return (
    <PageSection id={sectionId} className={className}>
      <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {items.map((item) => {
          const Icon = item.icon;
          const isFeature = layout === "mixed" && items.length >= 5 && item === items[0];
          const frameClass =
            item === items[1]
              ? "from-ori-accent/16 via-ori-surface-base to-ori-surface-panel"
              : item === items[2]
                ? "from-indigo-400/14 via-ori-surface-base to-ori-surface-panel"
                : "from-emerald-400/12 via-ori-surface-base to-ori-surface-panel";
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group flex h-full flex-col rounded-2xl border border-ori-border bg-ori-surface-panel p-6 transition-all hover:border-ori-accent/40 hover:shadow-[0_0_0_1px_rgba(201,243,29,0.12)] ${isFeature ? "md:col-span-2 xl:col-span-3" : "xl:col-span-2"}`}
            >
              {item.badge && (
                <p className="ori-type-label text-ori-accent">{item.badge}</p>
              )}
              <div
                className={`mt-3 h-24 overflow-hidden rounded-xl border border-ori-border bg-gradient-to-br ${frameClass} p-3`}
                aria-hidden
              >
                <div className="flex h-full items-end justify-between rounded-lg border border-ori-border/70 bg-ori-black/35 px-3 py-2">
                  <div className="space-y-2">
                    <div className="h-1.5 w-14 rounded-full bg-ori-foreground/50" />
                    <div className="h-1.5 w-10 rounded-full bg-ori-foreground/30" />
                    <div className="h-1.5 w-20 rounded-full bg-ori-foreground/20" />
                  </div>
                  <span className="rounded-lg border border-ori-border bg-ori-surface-base/80 p-2">
                    <Icon className="h-4 w-4 text-ori-accent" aria-hidden />
                  </span>
                </div>
              </div>
              <div className="mt-2 flex flex-1 items-start gap-3">
                <span className="rounded-lg border border-ori-border bg-ori-surface-base p-2">
                  <Icon className="h-5 w-5 text-ori-accent" aria-hidden />
                </span>
                <div className="min-w-0">
                  <h3 className="ori-type-subtitle">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ori-text-secondary">{item.description}</p>
                </div>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ori-accent">
                {item.ctaLabel ?? "Explore module"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          );
        })}
      </div>
    </PageSection>
  );
}
