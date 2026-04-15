import type { LucideIcon } from "lucide-react";
import { Building2, ClipboardCheck, ListTree, Map } from "lucide-react";
import { PageSection, SectionHeading } from "../system";

const steps: { title: string; copy: string; Icon: LucideIcon }[] = [
  {
    title: "Assess your current profile",
    copy: "We review your personal and business credit, structure, and key data points to understand where you stand today.",
    Icon: ClipboardCheck,
  },
  {
    title: "Identify gaps and priorities",
    copy: "We break down what's missing or misaligned and prioritize the areas that need to be addressed first.",
    Icon: ListTree,
  },
  {
    title: "Build and strengthen your profile",
    copy: "You work through the steps to improve your credit, structure your business properly, and align with funding requirements.",
    Icon: Building2,
  },
  {
    title: "Move forward with a plan",
    copy: "Once your profile is in place, you move forward with a clear approach to applying for funding.",
    Icon: Map,
  },
];

export function ReferralHowOriSupports() {
  return (
    <PageSection
      variant="loose"
      className="border-b border-ori-border bg-ori-section-alt ori-pillar-band-management section-divider"
      aria-labelledby="referral-how-heading"
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
        <div className="lg:col-span-5">
          <SectionHeading
            id="referral-how-heading"
            align="left"
            title="The process"
            subtitle="A structured approach to prepare you and your business for funding, without guesswork or unnecessary steps."
            subtitleClassName="max-w-xl text-pretty ori-type-body-muted"
            className="!mb-0"
          />
        </div>
        <div className="hidden lg:col-span-7 lg:block">
          <ol className="flex gap-0" aria-hidden>
            {steps.map((_, i) => (
              <li key={i} className="flex min-w-0 flex-1 items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ori-accent/35 bg-ori-accent/10 text-xs font-semibold text-ori-accent">
                  {i + 1}
                </span>
                {i < steps.length - 1 ? (
                  <span className="h-px min-w-[1rem] flex-1 bg-gradient-to-r from-ori-accent/40 via-ori-border to-ori-border xl:min-w-[2rem]" />
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <ol className="mt-12 grid gap-6 md:mt-14 md:gap-7 lg:mt-16 lg:grid-cols-4 lg:gap-0">
        {steps.map((step, i) => {
          const Icon = step.Icon;
          return (
            <li
              key={step.title}
              className={`lg:px-4 xl:px-5 motion-safe:lg:odd:translate-y-3 motion-safe:lg:even:translate-y-0 ${
                i > 0 ? "lg:border-l lg:border-ori-border/60" : ""
              }`}
            >
              <div className="h-full rounded-2xl border border-ori-border bg-ori-surface-panel/70 p-6 shadow-sm ring-1 ring-white/[0.04] md:p-7">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ori-accent/35 bg-ori-accent/10 text-xs font-bold text-ori-accent">
                    {i + 1}
                  </span>
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-ori-accent/25 bg-ori-accent/[0.08]"
                    aria-hidden
                  >
                    <Icon className="h-7 w-7 text-ori-accent" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="mt-6 font-display text-base font-semibold tracking-tight text-ori-foreground lg:text-lg">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ori-muted lg:text-[0.8125rem] lg:leading-relaxed xl:text-[0.9375rem]">
                  {step.copy}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </PageSection>
  );
}
