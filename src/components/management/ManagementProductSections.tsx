import { ArrowRight, CheckCircle2, CircleDot } from "lucide-react";
import { Link } from "react-router-dom";
import { PageSection } from "../system";
import { MANAGEMENT_MODULES } from "../../data/pillars";
import { CAPITAL_IMAGE_SET, MANAGEMENT_IMAGE_SET } from "../../constants/siteImagery";

const MANAGEMENT_SECTION_IMAGES = {
  formation: CAPITAL_IMAGE_SET[0]!.src,
  vault: MANAGEMENT_IMAGE_SET[0]!.src,
  builder: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=2000&q=90&auto=format&fit=crop",
  hosting: "https://images.unsplash.com/photo-1573497161079-f3fd25cc6b90?w=2000&q=90&auto=format&fit=crop",
  growth: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=2200&q=90&auto=format&fit=crop",
} as const;

function ProductIndex({ value }: { value: string }) {
  return (
    <div className="mb-4 flex items-center gap-4">
      <span className="font-display text-[3.2rem] font-semibold leading-none tracking-tight text-ori-foreground/22">{value}</span>
      <span className="h-px flex-1 bg-ori-accent/30" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ori-accent">Product</span>
    </div>
  );
}

function ProductCta({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-xl border border-ori-accent/55 px-7 py-3 text-sm font-semibold text-ori-accent transition-colors hover:bg-ori-accent/10"
    >
      {label}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </Link>
  );
}

function WindowChrome() {
  return (
    <div className="absolute left-4 right-4 top-4 z-10 flex items-center gap-2 rounded-lg bg-ori-black/75 px-3 py-2 backdrop-blur-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-ori-foreground/40" />
      <span className="h-1.5 w-1.5 rounded-full bg-ori-foreground/40" />
      <span className="h-1.5 w-1.5 rounded-full bg-ori-foreground/40" />
      <span className="ml-3 h-1.5 flex-1 rounded-full bg-ori-foreground/20" />
    </div>
  );
}

function MockLines({ widths }: { widths: string[] }) {
  return (
    <div className="space-y-2">
      {widths.map((width) => (
        <div key={width} className={`h-1.5 rounded-full bg-ori-border/70 ${width}`} />
      ))}
    </div>
  );
}

export function ManagementProductSections() {
  const [formation, vault, builder, hosting, growth] = MANAGEMENT_MODULES;
  if (!formation || !vault || !builder || !hosting || !growth) return null;

  return (
    <div className="section-divider bg-[radial-gradient(120%_90%_at_50%_0%,rgba(201,243,29,0.06),transparent_62%),linear-gradient(to_bottom,#040506,#040506)]">
      <PageSection id="management-products" className="pt-16 md:pt-20">
        <article className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="border-l border-ori-accent/45 pl-7">
            <ProductIndex value="01" />
            <h2 className="font-display text-5xl font-semibold tracking-tight text-ori-foreground">{formation.title}</h2>
            <p className="mt-3 max-w-xl text-lg leading-relaxed text-ori-muted">{formation.description}</p>
            <ul className="mt-6 space-y-3">
              {["Entity formation & structure", "EIN and state filings", "Compliance baseline you can maintain"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-base text-ori-muted">
                  <CheckCircle2 className="h-4 w-4 text-ori-accent" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <ProductCta to={formation.to} label={formation.ctaLabel || "View product"} />
            </div>
          </div>
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-ori-border/85 bg-ori-black shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
              <WindowChrome />
              <img
                src={MANAGEMENT_SECTION_IMAGES.formation}
                alt="Business formation paperwork and signatures at a desk"
                className="h-[290px] w-full object-cover md:h-[360px]"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute -bottom-4 left-5 right-5 rounded-xl border border-ori-border/85 bg-ori-black/92 p-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-ori-border/80 bg-ori-surface-panel/50 text-ori-accent">
                  <CircleDot className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <MockLines widths={["w-11/12", "w-4/5"]} />
                </div>
              </div>
            </div>
          </div>
        </article>
      </PageSection>

      <PageSection id="ori-vault" className="pt-8 md:pt-12">
        <article className="overflow-hidden rounded-[28px] border border-ori-border bg-ori-black/88 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          <div className="grid lg:grid-cols-[0.46fr_0.54fr]">
            <div className="relative min-h-[340px]">
              <img
                src={MANAGEMENT_SECTION_IMAGES.vault}
                alt="Team reviewing records and registrations"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-ori-black/55" />
            </div>
            <div className="p-7 lg:p-10">
              <ProductIndex value="02" />
              <h2 className="font-display text-5xl font-semibold tracking-tight text-ori-foreground">{vault.title}</h2>
              <p className="mt-3 text-lg leading-relaxed text-ori-muted">{vault.description}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {["Identity & registrations", "Ownership & control", "Documents & filings", "Compliance status"].map((item) => (
                  <div key={item} className="rounded-xl border border-ori-border/80 bg-ori-surface-panel/30 px-4 py-3 text-sm text-ori-foreground">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <ProductCta to={vault.to} label={vault.ctaLabel || "View product"} />
              </div>
            </div>
          </div>
        </article>
      </PageSection>

      <PageSection id="ori-builder" className="pt-10 md:pt-14">
        <article className="rounded-[28px] border border-ori-border bg-ori-black/88 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.45)] lg:p-10">
          <div className="relative mb-7 overflow-hidden rounded-2xl border border-ori-border/85">
            <WindowChrome />
            <img
              src={MANAGEMENT_SECTION_IMAGES.builder}
              alt="Workshop wall with product planning notes"
              className="h-[230px] w-full object-cover md:h-[300px]"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="grid gap-7 lg:grid-cols-[1fr_0.95fr]">
            <div>
              <ProductIndex value="03" />
              <h2 className="font-display text-5xl font-semibold tracking-tight text-ori-foreground">{builder.title}</h2>
              <p className="mt-3 max-w-lg text-lg leading-relaxed text-ori-muted">{builder.description}</p>
              <div className="mt-8">
                <ProductCta to={builder.to} label={builder.ctaLabel || "View product"} />
              </div>
            </div>
            <div className="relative pl-8">
              <div className="absolute bottom-5 left-2 top-4 w-px bg-ori-accent/25" />
              <ol className="space-y-3">
                {["Model & offer", "Ideal customer", "Value proposition"].map((item, i) => (
                  <li key={item} className="relative rounded-xl border border-ori-border/80 bg-ori-surface-panel/28 p-4">
                    <span className="absolute -left-[2.1rem] top-4 inline-flex h-4 w-4 items-center justify-center rounded-full border border-ori-accent/45 bg-ori-black text-[10px] font-semibold text-ori-accent">
                      {i + 1}
                    </span>
                    <div className="flex items-center gap-2 text-base font-medium text-ori-foreground">
                      <CircleDot className="h-3 w-3 text-ori-accent" aria-hidden />
                      {item}
                    </div>
                    <div className="mt-3">
                      <MockLines widths={["w-full", "w-4/5"]} />
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </article>
      </PageSection>

      <PageSection id="ori-hosting" className="pt-10 md:pt-14">
        <article className="relative overflow-visible lg:min-h-[460px]">
          <div className="overflow-hidden rounded-[28px] border border-ori-border bg-ori-black/88 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <img
              src={MANAGEMENT_SECTION_IMAGES.hosting}
              alt="Team collaborating around a laptop"
              className="h-[280px] w-full object-cover md:h-[420px]"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="relative z-10 mt-6 rounded-[24px] border border-ori-border/85 bg-ori-black/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)] lg:absolute lg:bottom-10 lg:right-0 lg:mt-0 lg:w-[46%] lg:p-8">
            <ProductIndex value="04" />
            <h2 className="font-display text-5xl font-semibold tracking-tight text-ori-foreground">{hosting.title}</h2>
            <p className="mt-3 text-lg leading-relaxed text-ori-muted">{hosting.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Web", "Email", "Social", "Mobile"].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 rounded-md border border-ori-border/80 bg-ori-surface-panel/45 px-3 py-1 text-xs uppercase tracking-[0.12em] text-ori-foreground"
                >
                  <CircleDot className="h-3 w-3 text-ori-accent" aria-hidden />
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-ori-border/70 bg-ori-surface-panel/25 p-2">
                <MockLines widths={["w-full", "w-5/6"]} />
              </div>
              <div className="rounded-lg border border-ori-border/70 bg-ori-surface-panel/25 p-2">
                <MockLines widths={["w-full", "w-4/5"]} />
              </div>
            </div>
            <div className="mt-7">
              <ProductCta to={hosting.to} label={hosting.ctaLabel || "View product"} />
            </div>
          </div>
        </article>
      </PageSection>

      <PageSection id="ori-growth" className="pt-10 md:pt-14">
        <article className="overflow-hidden rounded-[28px] border border-ori-border bg-ori-black/88 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.45)] lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <ProductIndex value="05" />
              <h2 className="font-display text-5xl font-semibold tracking-tight text-ori-foreground">{growth.title}</h2>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ori-muted">{growth.description}</p>
            </div>
            <ProductCta to={growth.to} label={growth.ctaLabel || "View product"} />
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-ori-border/85">
            <img
              src={MANAGEMENT_SECTION_IMAGES.growth}
              alt="CRM and revenue dashboard on a laptop"
              className="h-[260px] w-full object-cover md:h-[360px]"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="border-x border-b border-ori-border/85">
            <p className="border-t border-ori-border/85 px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-ori-muted">Pipeline</p>
            <div className="grid md:grid-cols-4">
              {["Lead", "Qualified", "Proposal", "Won"].map((stage) => (
                <div key={stage} className="border-t border-ori-border/85 px-4 py-3 md:border-l md:first:border-l-0 md:border-t-0">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-ori-muted">{stage}</p>
                  <div className="mt-2 flex items-center gap-2 text-ori-accent">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                    <div className="h-1.5 w-8 rounded-full bg-ori-border/70" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>
      </PageSection>
    </div>
  );
}
