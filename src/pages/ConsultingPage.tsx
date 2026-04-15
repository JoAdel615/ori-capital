import { Compass, Map, Rocket } from "lucide-react";
import { Button } from "../components/Button";
import { ConsultingLifecycleExplainer } from "../components/consulting/ConsultingLifecycleExplainer";
import { PageContainer, PageSection } from "../components/system";
import { CriteriaGrid, type CriteriaItem, TrustSectionIntro } from "../components/trust/TrustElements";
import { CONSULTING_IMAGE_SET, MANAGEMENT_IMAGE_SET } from "../constants/siteImagery";
import { CONSULTING_OFFERS } from "../data/pillars";
import { ROUTES } from "../utils/navigation";

const consultingEngagePoints = [
  {
    icon: Compass,
    title: "Discovery",
    body: "We get clear on what's actually happening—your model, constraints, and bottlenecks. Not surface-level symptoms, but root causes.",
  },
  {
    icon: Map,
    title: "Strategy",
    body: "We define the right sequence of moves—what to do, what not to do, and when. Prioritized for impact, not theory.",
  },
  {
    icon: Rocket,
    title: "Delivery",
    body: "We stay close to execution—working sessions, decision support, and hands-on guidance to move things forward.",
  },
] as const;

/** Image pairing for grid cards (order of CONSULTING_OFFERS may differ from CONSULTING_IMAGE_SET). */
const consultingOfferImageIndex: Record<string, number> = {
  [ROUTES.CONSULTING_COACHING]: 0,
  [ROUTES.CONSULTING_PRODUCT_DEVELOPMENT]: 3,
  [ROUTES.CONSULTING_CAPITAL_STRATEGY]: 1,
};

function consultingOfferImageAsset(to: string) {
  if (to === ROUTES.CONSULTING_STRUCTURING) return MANAGEMENT_IMAGE_SET[1]!;
  const imageIndex = consultingOfferImageIndex[to] ?? 0;
  return CONSULTING_IMAGE_SET[imageIndex]!;
}

const consultingOfferCards: CriteriaItem[] = CONSULTING_OFFERS.map((offer) => {
  const asset = consultingOfferImageAsset(offer.to);
  return {
    title: offer.title,
    description: offer.description,
    icon: offer.icon,
    image: asset.src,
    imageAlt: asset.alt,
    to: offer.to,
    ...(offer.ctaLabel ? { ctaLabel: offer.ctaLabel } : {}),
  };
});

export function ConsultingPage() {
  return (
    <>
      <section className="relative flex min-h-[100dvh] min-h-screen flex-col justify-center overflow-hidden border-b border-ori-border bg-ori-black">
        <img
          src={CONSULTING_IMAGE_SET[0]!.src}
          alt={CONSULTING_IMAGE_SET[0]!.alt}
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ori-black via-ori-black/82 to-ori-black/55" />
        <div className="relative ori-container flex min-h-0 flex-1 flex-col justify-center py-16 md:py-24">
          <p className="ori-type-eyebrow">Collaboration</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-ori-foreground md:text-5xl lg:text-6xl">
            The right decision at the right time changes everything.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ori-muted md:text-lg">
            The hardest part isn&apos;t doing the work, it&apos;s deciding what to do next. We work with you to frame the
            problem, sequence correctly, and execute strategically.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to={ROUTES.CONTACT} size="lg">
              Get in touch
            </Button>
            <Button href="#consulting-stage-support" size="lg" variant="outline">
              Learn more
            </Button>
          </div>
        </div>
      </section>

      <PageSection id="consulting-stage-support" className="bg-ori-black scroll-mt-24">
        <TrustSectionIntro
          title="Support that matches your stage"
          subtitle="Work in focused sprints or ongoing engagements, depending on what the business actually needs. Each path is defined by clear scope, priorities, and outcomes, so the business moves forward in measurable ways."
        />
        <div className="mt-10">
          <CriteriaGrid items={consultingOfferCards} fourColumnRow />
        </div>
      </PageSection>

      <ConsultingLifecycleExplainer />

      <PageSection
        container={false}
        variant="loose"
        className="section-divider relative isolate overflow-hidden border-b border-ori-border bg-ori-black"
        aria-labelledby="consulting-judgment-heading"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <img
            src={CONSULTING_IMAGE_SET[1]!.src}
            alt=""
            className="h-full w-full object-cover object-[55%_40%] opacity-[0.38] motion-reduce:opacity-[0.32]"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-ori-black/65" />
          <div className="absolute inset-0 bg-gradient-to-r from-ori-black via-ori-black/[0.88] to-ori-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-ori-black/35 via-transparent to-ori-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_90%_35%,rgba(201,243,29,0.11),transparent_58%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_85%,rgba(201,243,29,0.06),transparent_42%)]" />
        </div>

        <PageContainer className="relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
            <header className="lg:col-span-5">
              <h2
                id="consulting-judgment-heading"
                className="font-display text-4xl font-bold tracking-tight text-ori-foreground md:text-5xl lg:text-[2.85rem] lg:leading-[1.06]"
              >
                Judgment over noise.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-ori-muted md:text-lg">
                Cut through what sounds good and focus on what works. We focus on the business decisions that create real
                progress.
              </p>
            </header>

            <div className="relative mx-auto w-full max-w-lg lg:col-span-7 lg:mx-0 lg:max-w-none">
              <div className="relative aspect-[3/4] min-h-[280px] sm:aspect-[5/4] sm:min-h-[320px] lg:aspect-[16/11] lg:min-h-[380px]">
                <div className="absolute inset-[6%_4%_10%_14%] overflow-hidden rounded-3xl border border-ori-border/50 shadow-[0_32px_64px_-28px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.06]">
                  <img
                    src={CONSULTING_IMAGE_SET[2]!.src}
                    alt={CONSULTING_IMAGE_SET[2]!.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-ori-black/85 via-ori-black/15 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ori-black/55 via-transparent to-ori-black/25" />
                  <p className="absolute bottom-5 left-5 right-8 font-display text-xs font-semibold uppercase tracking-[0.2em] text-white/90 drop-shadow-md md:bottom-6 md:left-6 md:text-[0.7rem]">
                    Collaborate
                  </p>
                </div>

                <div className="absolute left-0 top-[4%] z-20 w-[44%] max-w-[220px] sm:max-w-[260px]">
                  <div className="relative overflow-hidden rounded-2xl border border-ori-border/60 bg-ori-black/20 shadow-[0_20px_48px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.08] backdrop-blur-[2px]">
                    <img
                      src={CONSULTING_IMAGE_SET[3]!.src}
                      alt={CONSULTING_IMAGE_SET[3]!.alt}
                      className="aspect-[4/3] h-auto w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ori-black/80 via-ori-black/10 to-transparent" />
                    <p className="absolute bottom-2.5 left-3 text-[0.65rem] font-medium uppercase tracking-wider text-white/85 md:bottom-3 md:text-xs">
                      Build
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-[6%] right-0 z-20 w-[42%] max-w-[200px] sm:max-w-[240px]">
                  <div className="relative overflow-hidden rounded-2xl border border-ori-border/60 bg-ori-black/20 shadow-[0_20px_48px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.08] backdrop-blur-[2px]">
                    <img
                      src={CONSULTING_IMAGE_SET[1]!.src}
                      alt={CONSULTING_IMAGE_SET[1]!.alt}
                      className="aspect-[4/3] h-auto w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ori-black/80 via-ori-black/15 to-transparent" />
                    <p className="absolute bottom-2.5 left-3 text-[0.65rem] font-medium uppercase tracking-wider text-white/85 md:bottom-3 md:text-xs">
                      impact
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </PageSection>

      <PageSection className="bg-ori-section-alt section-divider">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ori-foreground md:text-4xl">No cookie-cutter templates</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-ori-muted md:text-lg">
              <p>We work as operators, not advisors.</p>
              <p>We work with you to make decisions, solve problems, and move the business forward.</p>
              <p>Hands-on, in the work, where it actually counts.</p>
              <p>No theory. No slides. Just progress.</p>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-ori-border/80 bg-gradient-to-br from-ori-surface-panel/90 via-ori-black/50 to-ori-surface-panel/80 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_28px_56px_-36px_rgba(0,0,0,0.65)] md:p-8">
            <div
              className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-ori-accent/40 to-transparent md:inset-x-10"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-ori-accent/[0.07] blur-3xl"
              aria-hidden
            />
            <p className="relative ori-type-label text-ori-accent">How we engage</p>
            <ul className="relative mt-6 space-y-5">
              {consultingEngagePoints.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-ori-border/70 bg-ori-black/55 text-ori-accent shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="font-display text-sm font-semibold text-ori-foreground md:text-base">{title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ori-muted md:text-base">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PageSection>
    </>
  );
}
