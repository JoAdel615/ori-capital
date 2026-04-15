import { PageSection, SectionHeading } from "../system";
import { REFERRAL_FUNDING_EVAL_PANEL } from "../../constants/siteImagery";

const points: { title: string; body: string }[] = [
  {
    title: "A clear view of how funders see you",
    body: "Understand your personal and business profile the way lenders and underwriters evaluate it.",
  },
  {
    title: "The factors that make or break approval",
    body: "Identify the specific signals, like structure, credit, and identity, that determine whether you get approved or declined.",
  },
  {
    title: "What to fix and how to fix it",
    body: "From credit issues to profile gaps, you'll know exactly what's holding you back and how to resolve it without guesswork.",
  },
  {
    title: "When to apply and when not to",
    body: "Apply at the right time, in the right order, so you don't trigger denials, damage your profile, or settle for worse terms.",
  },
];

const panel = REFERRAL_FUNDING_EVAL_PANEL;

export function ReferralWhatWeHelp() {
  return (
    <PageSection
      variant="loose"
      className="border-b border-ori-border bg-ori-surface-base ori-pillar-band-capital section-divider"
      aria-labelledby="referral-what-heading"
    >
      <SectionHeading
        id="referral-what-heading"
        align="left"
        title="What actually determines whether you get funded"
      />

      <div className="mt-12 grid gap-12 lg:mt-14 lg:grid-cols-12 lg:items-start lg:gap-14">
        <figure className="relative isolate overflow-hidden rounded-3xl border border-ori-border bg-ori-surface-panel shadow-[0_24px_70px_rgba(0,0,0,0.22)] ring-1 ring-white/[0.06] lg:col-span-5 lg:sticky lg:top-28">
          <div className="relative aspect-[5/4] min-h-[240px] sm:aspect-[16/10] lg:aspect-[4/5] lg:min-h-[420px]">
            <img
              src={panel.src}
              alt={panel.alt}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ori-black/88 via-ori-black/25 to-transparent"
              aria-hidden
            />
          </div>
          <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <p className="font-display text-lg font-semibold tracking-tight text-ori-text-primary">
              Funding-ready posture
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ori-text-secondary md:text-[0.9375rem]">
              Documentation and narrative funders expect—without the guesswork.
            </p>
          </figcaption>
        </figure>

        <ol
          className="flex flex-col gap-5 lg:col-span-7 lg:gap-6"
          aria-label="What determines funding outcomes"
        >
          {points.map(({ title, body }, i) => (
            <li
              key={title}
              className="group relative rounded-2xl border border-ori-border/90 bg-ori-surface-panel/45 p-6 pl-6 shadow-sm ring-1 ring-white/[0.04] transition-colors motion-safe:duration-200 md:p-7 md:pl-8 lg:pl-9 motion-safe:hover:border-ori-accent/25 motion-safe:hover:bg-ori-surface-panel/70"
            >
              <div
                className="absolute left-0 top-6 bottom-6 w-1 rounded-full bg-gradient-to-b from-ori-accent/80 via-ori-accent/35 to-transparent opacity-90 md:top-7 md:bottom-7"
                aria-hidden
              />
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-ori-accent/90">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-ori-foreground md:text-xl md:leading-tight">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ori-muted md:mt-3.5 md:text-base md:leading-relaxed">
                    {body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </PageSection>
  );
}
