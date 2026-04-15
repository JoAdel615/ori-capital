import { ArrowRight, BookOpen, Layers, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/navigation";
import { PartnerCollapsibleSection } from "./PartnerCollapsibleSection";

const SERVICE_CARDS = [
  {
    to: ROUTES.CONSULTING_COACHING,
    title: "Startup coaching workshops",
    description: "Explore playbooks and workshop tracks you can reference for client delivery.",
    cta: "Open coaching services",
    icon: BookOpen,
    frameClass: "from-ori-accent/18 via-ori-surface-base to-ori-surface-panel",
  },
  {
    to: ROUTES.CONSULTING_PRODUCT_DEVELOPMENT,
    title: "Product development",
    description: "Project intake for design, build, and content support when you coordinate with Ori.",
    cta: "Open project interest",
    icon: Layers,
    frameClass: "from-indigo-400/16 via-ori-surface-base to-ori-surface-panel",
  },
  {
    to: ROUTES.CONTACT,
    title: "Management advisory",
    description: "Advisory meetings and ongoing support requests routed through Ori.",
    cta: "Advisory & contact",
    icon: MessageCircle,
    frameClass: "from-emerald-400/14 via-ori-surface-base to-ori-surface-panel",
  },
] as const;

export function PartnerServicesSection() {
  return (
    <PartnerCollapsibleSection
      eyebrow="Collaboration"
      title="Services"
      subtitle="Pathways across coaching, product, and advisory—same journeys your clients see on the public site."
      className="mt-6 md:mt-8"
    >
      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {SERVICE_CARDS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="group flex h-full flex-col rounded-2xl border border-ori-border bg-ori-surface-panel p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] ring-1 ring-white/[0.04] motion-safe:transition-all motion-safe:duration-200 hover:border-ori-accent/40 hover:shadow-[0_0_0_1px_rgba(201,243,29,0.12)] md:p-7"
            >
              <div
                className={`h-[4.5rem] overflow-hidden rounded-xl border border-ori-border bg-gradient-to-br ${item.frameClass} p-3`}
                aria-hidden
              >
                <div className="flex h-full items-end justify-between rounded-lg border border-ori-border/70 bg-ori-black/30 px-3 py-2">
                  <div className="space-y-1.5">
                    <div className="h-1 w-12 rounded-full bg-ori-foreground/45" />
                    <div className="h-1 w-8 rounded-full bg-ori-foreground/25" />
                  </div>
                  <span className="rounded-lg border border-ori-border bg-ori-surface-base/85 p-2">
                    <Icon className="h-4 w-4 text-ori-accent" aria-hidden />
                  </span>
                </div>
              </div>
              <div className="mt-4 flex flex-1 items-start gap-3">
                <span className="rounded-lg border border-ori-border bg-ori-surface-base p-2">
                  <Icon className="h-5 w-5 text-ori-accent" aria-hidden />
                </span>
                <div className="min-w-0">
                  <h3 className="ori-type-subtitle text-ori-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ori-text-secondary">{item.description}</p>
                </div>
              </div>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ori-accent">
                {item.cta}
                <ArrowRight className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-200 group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          );
        })}
      </div>
    </PartnerCollapsibleSection>
  );
}
