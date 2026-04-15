import { Button } from "../Button";
import { Accordion } from "../Accordion";
import { CtaBand } from "../compositions";
import { PageSection, SectionHeading } from "../system";

/** Which pillar this offering belongs to — drives accent band on the process section. */
export type PillarModulePillar = "consulting" | "management" | "capital";

const PILLAR_BAND: Record<PillarModulePillar, string> = {
  consulting: "ori-pillar-band-consulting",
  management: "ori-pillar-band-management",
  capital: "ori-pillar-band-capital",
};

interface PillarModulePageProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Defaults to `management` if omitted (legacy). Prefer setting explicitly per route. */
  pillar?: PillarModulePillar;
  includesTitle?: string;
  includes: string[];
  steps: string[];
  outcomes: string[];
  faq: { id: string; title: string; content: string }[];
  primaryCta: { label: string; to: string };
  secondaryCta?: { label: string; to: string };
  heroClassName?: string;
  heroImage?: string;
  heroImageAlt?: string;
  galleryImages?: { src: string; alt: string }[];
  /** Full-bleed image + gradient (default) vs split text / image on large screens. */
  heroLayout?: "overlay" | "split";
  /** Gallery grid: asymmetric “bento” first cell or three equal tiles. */
  galleryLayout?: "bento" | "equal";
  layoutVariant?: "standard" | "alternating";
  /** Surface behind FAQ: alternate rhythm vs body sections. */
  faqSurface?: "muted" | "base";
}

export function PillarModulePage({
  eyebrow,
  title,
  subtitle,
  pillar = "management",
  includesTitle = "What is included",
  includes,
  steps,
  outcomes,
  faq,
  primaryCta,
  secondaryCta,
  heroClassName = "bg-ori-section-alt border-b border-ori-border",
  heroImage,
  heroImageAlt = "",
  galleryImages = [],
  heroLayout = "overlay",
  galleryLayout = "bento",
  layoutVariant = "standard",
  faqSurface = "muted",
}: PillarModulePageProps) {
  const processBand = PILLAR_BAND[pillar];
  const heroActions = (
    <div className="mt-8 flex flex-wrap gap-3">
      <Button to={primaryCta.to} size="lg">
        {primaryCta.label}
      </Button>
      {secondaryCta && (
        <Button to={secondaryCta.to} size="lg" variant="outline">
          {secondaryCta.label}
        </Button>
      )}
    </div>
  );

  return (
    <>
      {heroLayout === "split" && heroImage ? (
        <section className={`border-b border-ori-border ${heroClassName}`}>
          <div className="ori-container grid gap-10 py-16 md:py-20 lg:grid-cols-2 lg:items-center lg:gap-14">
            <div>
              <p className="ori-type-eyebrow">{eyebrow}</p>
              <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold tracking-tight text-ori-foreground md:text-5xl">
                {title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-ori-muted md:text-lg">{subtitle}</p>
              {heroActions}
            </div>
            <div className="relative min-h-[240px] overflow-hidden rounded-2xl border border-ori-border/80 bg-ori-surface-panel shadow-[0_24px_80px_-32px_rgba(0,0,0,0.85)] md:min-h-[320px]">
              <img
                src={heroImage}
                alt={heroImageAlt}
                className="h-full min-h-[240px] w-full object-cover md:min-h-[320px]"
                fetchPriority="high"
                decoding="async"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ori-black/50 via-transparent to-ori-black/10" />
            </div>
          </div>
        </section>
      ) : (
        <section className={`relative overflow-hidden border-b border-ori-border ${heroClassName}`}>
          {heroImage ? (
            <img
              src={heroImage}
              alt={heroImageAlt}
              className="absolute inset-0 h-full w-full object-cover opacity-35"
              fetchPriority="high"
              decoding="async"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-ori-black via-ori-black/75 to-ori-black/45" />
          <div className="relative ori-container py-16 md:py-20">
            <p className="ori-type-eyebrow">{eyebrow}</p>
            <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold tracking-tight text-ori-foreground md:text-5xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ori-muted md:text-lg">{subtitle}</p>
            {heroActions}
          </div>
        </section>
      )}

      {galleryImages.length > 0 && (
        <PageSection className="bg-ori-section-alt">
          <div className="grid gap-4 md:grid-cols-3">
            {galleryImages.map((item, index) => (
              <img
                key={`${item.src}-${index}`}
                src={item.src}
                alt={item.alt}
                className={`w-full rounded-xl border border-ori-border object-cover ${
                  galleryLayout === "bento" && index === 0 ? "md:col-span-2 h-52 md:h-60" : "h-52 md:h-60"
                }`}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </PageSection>
      )}

      {layoutVariant === "alternating" ? (
        <>
          <PageSection>
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <SectionHeading title={includesTitle} align="left" />
                <ul className="grid gap-3">
                  {includes.map((item) => (
                    <li key={item} className="rounded-xl border border-ori-border bg-ori-surface-panel p-4 ori-type-body">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <SectionHeading title="Outcomes you should expect" align="left" />
                <ul className="space-y-3">
                  {outcomes.map((item) => (
                    <li key={item} className="rounded-xl border border-ori-border bg-ori-surface-panel p-4 ori-type-body-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </PageSection>

          <PageSection className={processBand}>
            <SectionHeading title="How it works" align="left" />
            <ol className="grid gap-3 md:grid-cols-4">
              {steps.map((step, index) => (
                <li key={step} className="rounded-xl border border-ori-border bg-ori-surface-panel p-4">
                  <p className="ori-type-label">Step {index + 1}</p>
                  <p className="mt-2 ori-type-body">{step}</p>
                </li>
              ))}
            </ol>
          </PageSection>
        </>
      ) : (
        <>
          <PageSection>
            <SectionHeading title={includesTitle} align="left" />
            <ul className="grid gap-3 md:grid-cols-2">
              {includes.map((item) => (
                <li key={item} className="rounded-xl border border-ori-border bg-ori-surface-panel p-4 ori-type-body">
                  {item}
                </li>
              ))}
            </ul>
          </PageSection>

          <PageSection className={processBand}>
            <SectionHeading title="How it works" align="left" />
            <ol className="grid gap-3 md:grid-cols-2">
              {steps.map((step, index) => (
                <li key={step} className="rounded-xl border border-ori-border bg-ori-surface-panel p-4">
                  <p className="ori-type-label">Step {index + 1}</p>
                  <p className="mt-2 ori-type-body">{step}</p>
                </li>
              ))}
            </ol>
          </PageSection>

          <PageSection>
            <SectionHeading title="Outcomes you should expect" align="left" />
            <ul className="space-y-3">
              {outcomes.map((item) => (
                <li key={item} className="rounded-xl border border-ori-border bg-ori-surface-panel p-4 ori-type-body-muted">
                  {item}
                </li>
              ))}
            </ul>
          </PageSection>
        </>
      )}

      <PageSection className={faqSurface === "base" ? "bg-ori-black" : "bg-ori-section-alt"}>
        <SectionHeading title="Frequently asked questions" align="left" />
        <Accordion
          items={faq.map((entry) => ({
            ...entry,
            content: <p>{entry.content}</p>,
          }))}
        />
      </PageSection>

      <CtaBand
        title="Ready for the next step?"
        body="Start with the right module now, then connect consulting or capital when it makes sense for your stage."
        actions={
          <>
            <Button to={primaryCta.to}>{primaryCta.label}</Button>
            {secondaryCta && (
              <Button to={secondaryCta.to} variant="secondary">
                {secondaryCta.label}
              </Button>
            )}
          </>
        }
      />
    </>
  );
}
