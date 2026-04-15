import { FileText, Landmark, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { CtaBand, LifecycleStrip, ModuleGrid } from "../components/compositions";
import { PillarBridgeLinks } from "../components/pillars/PillarBridgeLinks";
import { PageSection } from "../components/system";
import { CAPITAL_IMAGE_SET } from "../constants/siteImagery";
import { LIFECYCLE_STAGES, PILLAR_OVERVIEW_CARDS } from "../data/pillars";
import { ROUTES } from "../utils/navigation";

const capitalCards = [
  {
    title: "Funding options",
    description: "Explore capital pathways and structures that fit your stage and ownership goals.",
    to: ROUTES.FUNDING,
    icon: Landmark,
  },
  {
    title: "Funding readiness",
    description: "Assess and improve your profile before applying so you enter conversations with leverage.",
    to: ROUTES.FUNDING_READINESS,
    icon: ShieldCheck,
  },
  {
    title: "Apply",
    description: "Start your application when you are ready to move into active capital conversations.",
    to: ROUTES.APPLY,
    icon: FileText,
  },
];

/**
 * Secondary funding view: Ori as a pillar alongside Consulting & Management,
 * with the “Raise from leverage, not pressure” hero and pathway modules.
 */
export function CapitalLeveragePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-ori-border bg-ori-black">
        <img
          src={CAPITAL_IMAGE_SET[0]!.src}
          alt={CAPITAL_IMAGE_SET[0]!.alt}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ori-black/70 via-ori-black/70 to-ori-black" />
        <div className="relative ori-container py-20 md:py-28">
          <p className="ori-type-eyebrow">Funding</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-ori-foreground md:text-5xl">
            Raise from leverage, not pressure.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ori-muted md:text-lg">
            Ori Capital helps you pursue funding with readiness, structure, and a clean operator story.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to={ROUTES.FUNDING_READINESS} size="lg">
              Check readiness
            </Button>
            <Button to={ROUTES.FUNDING} size="lg" variant="outline">
              Explore funding
            </Button>
          </div>
          <p className="mt-6 text-sm text-ori-muted">
            Main funding experience:{" "}
            <Link to={ROUTES.CAPITAL} className="font-semibold text-ori-accent hover:underline">
              Funding home
            </Link>
          </p>
        </div>
      </section>

      <ModuleGrid
        eyebrow="Funding pathways"
        title="Funding is a pillar, not a shortcut"
        subtitle="Use these paths when model, operations, and profile are actually aligned."
        items={capitalCards}
        className="ori-pillar-band-capital"
      />

      <LifecycleStrip
        title="Where funding fits in the lifecycle"
        subtitle="Funding works best when it supports validated operations and measured growth."
        stages={LIFECYCLE_STAGES}
        className="bg-ori-section-alt"
      />

      <PageSection className="bg-ori-black section-divider">
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-ori-border bg-ori-surface-panel p-6">
            <p className="ori-type-label text-ori-accent">Funding snapshot</p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-ori-foreground">Funding looks better when the story is visual and clean.</h3>
            <p className="mt-3 text-sm leading-relaxed text-ori-muted">
              Build investor and lender confidence with proof: operational signal, cash flow clarity, and a clear use of funds.
            </p>
            <div className="mt-5 rounded-xl border border-ori-border bg-ori-black/40 p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Readiness", "82%"],
                  ["Cash Signal", "Stable"],
                  ["Docs", "Complete"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-ori-border bg-ori-surface px-3 py-2">
                    <p className="text-xs uppercase tracking-[0.14em] text-ori-muted">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-ori-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>
          <div className="grid gap-5 sm:grid-cols-2">
            {CAPITAL_IMAGE_SET.map((item) => (
              <article
                key={item.src}
                className={`overflow-hidden rounded-2xl border border-ori-border bg-ori-surface-panel ${item === CAPITAL_IMAGE_SET[0] ? "sm:col-span-2" : ""}`}
              >
                <img src={item.src} alt={item.alt} className="h-40 w-full object-cover sm:h-44" loading="lazy" decoding="async" />
              </article>
            ))}
          </div>
        </div>
      </PageSection>

      <PillarBridgeLinks
        eyebrow="Full stack"
        title="Funding connects to the rest of Ori"
        subtitle="Funding conversations land better when Consulting has shaped your plan and Management has cleaned your operating story."
        items={PILLAR_OVERVIEW_CARDS}
      />

      <CtaBand
        title="Prepare first, then move with confidence"
        body="If timing is early, deepen Consulting and Management first—then come back with stronger odds and better terms."
        actions={
          <>
            <Button to={ROUTES.FUNDING_READINESS}>Start readiness</Button>
            <Button to={ROUTES.MANAGEMENT} variant="secondary">
              Strengthen operations
            </Button>
          </>
        }
      />
    </>
  );
}
