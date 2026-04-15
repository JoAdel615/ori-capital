/**
 * LifecycleStrip — horizontal journey stages for pillar hubs and home.
 * Do not use for dense prose; keep `stages` short labels per PLATFORM_LIFECYCLE_SPEC §7.6 A1.
 */
import { CheckCircle2 } from "lucide-react";
import { PageSection, SectionHeading } from "../system";

interface LifecycleStripProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  stages: string[];
  className?: string;
}

export function LifecycleStrip({
  eyebrow = "Lifecycle",
  title,
  subtitle,
  stages,
  className = "",
}: LifecycleStripProps) {
  return (
    <PageSection className={className}>
      <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {stages.map((stage, index) => (
          <li
            key={stage}
            className="group relative overflow-hidden rounded-xl border border-ori-border bg-ori-surface-panel p-4 text-sm text-ori-text-primary"
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-r from-ori-accent/12 via-transparent to-transparent"
              aria-hidden
            />
            <div className="relative">
              <p className="flex items-center gap-2 text-ori-type-label text-ori-text-secondary">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-ori-accent/35 bg-ori-accent/10">
                  <CheckCircle2 className="h-3.5 w-3.5 text-ori-accent" aria-hidden />
                </span>
                Step {index + 1}
              </p>
              <p className="mt-3 font-semibold text-ori-text-primary">{stage}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ori-black/45">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-ori-accent/65 to-ori-accent/20 transition-all duration-300 group-hover:from-ori-accent group-hover:to-ori-accent/35"
                  style={{ width: `${Math.max(18, ((index + 1) / stages.length) * 100)}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </PageSection>
  );
}
