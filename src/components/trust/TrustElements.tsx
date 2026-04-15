import type { ReactNode } from "react";
import { CheckCircle2, ChevronRight, type LucideIcon, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

type IntroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  align?: "left" | "center";
};

export function TrustSectionIntro({ eyebrow, title, subtitle, align = "left" }: IntroProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";
  const widthClass = align === "center" ? "mx-auto max-w-3xl" : "max-w-3xl";
  return (
    <header className={`mb-8 md:mb-10 ${alignClass} ${widthClass}`}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ori-accent">{eyebrow}</p>
      ) : null}
      <h2 className={`font-display text-3xl font-bold tracking-tight text-ori-foreground md:text-4xl ${eyebrow ? "mt-2" : ""}`}>
        {title}
      </h2>
      {subtitle ? (
        <div className="mt-4 space-y-3 text-base leading-relaxed text-ori-muted md:text-lg">
          {typeof subtitle === "string" ? <p>{subtitle}</p> : subtitle}
        </div>
      ) : null}
    </header>
  );
}

export function TrustStrip({ items }: { items: string[] }) {
  return (
    <div className="rounded-2xl border border-ori-border/80 bg-ori-surface/70 p-4 md:p-5">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2.5 rounded-xl border border-ori-border/70 bg-ori-charcoal/60 px-3 py-2.5 text-sm font-medium text-ori-foreground">
            <CheckCircle2 className="h-4 w-4 text-ori-accent" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export type StepItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function ProcessSteps({ items }: { items: StepItem[] }) {
  return (
    <ol className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <li key={item.title} className="relative rounded-2xl border border-ori-border bg-ori-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:border-ori-accent/35">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ori-accent/40 bg-ori-accent/10 text-sm font-semibold text-ori-accent">
              {index + 1}
            </span>
            <div className="mt-4 flex items-center gap-2.5">
              <Icon className="h-5 w-5 text-ori-accent" aria-hidden />
              <h3 className="font-display text-lg font-semibold text-ori-foreground">{item.title}</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ori-muted">{item.description}</p>
          </li>
        );
      })}
    </ol>
  );
}

export type CriteriaItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
  imageAlt: string;
  /** When set, the whole card links (e.g. module landing routes). */
  to?: string;
  /** Shown at bottom when `to` is set; defaults to “Explore module”. */
  ctaLabel?: string;
};

export function CriteriaGrid({ items, fourColumnRow }: { items: CriteriaItem[]; fourColumnRow?: boolean }) {
  const gridClass = fourColumnRow
    ? "grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
    : "grid gap-5 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={gridClass}>
      {items.map((item) => {
        const Icon = item.icon;
        const cta = item.ctaLabel ?? "Explore module";
        const descParts = item.description.split(/\n\n/).filter(Boolean);
        const body = (
          <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-ori-border bg-ori-surface/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-ori-accent/35">
            <div className="relative h-36 overflow-hidden bg-ori-charcoal sm:h-40">
              <img
                src={item.image}
                alt={item.imageAlt}
                className="h-full w-full object-cover opacity-[0.92]"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ori-black/90 via-ori-black/25 to-transparent" />
              <span className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-lg border border-ori-border/80 bg-ori-black/70 text-ori-accent backdrop-blur-sm">
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5 md:p-6">
              <h3 className="font-display text-lg font-semibold text-ori-foreground">{item.title}</h3>
              <div className="mt-3 space-y-2 text-sm leading-relaxed text-ori-muted">
                {descParts.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              {item.to ? (
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ori-accent">
                  {cta}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              ) : null}
            </div>
          </article>
        );
        return item.to ? (
          <Link
            key={item.title}
            to={item.to}
            className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ori-black"
          >
            {body}
          </Link>
        ) : (
          <div key={item.title} className="h-full">
            {body}
          </div>
        );
      })}
    </div>
  );
}

export function HonestyCallout({ title, subtitle, bullets }: { title: string; subtitle: string; bullets: string[] }) {
  return (
    <div className="rounded-3xl border border-ori-accent/35 bg-gradient-to-br from-ori-surface to-ori-charcoal p-7 md:p-10">
      <h3 className="font-display text-2xl font-semibold tracking-tight text-ori-foreground md:text-3xl">{title}</h3>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-ori-muted">{subtitle}</p>
      <ul className="mt-6 grid gap-3 md:grid-cols-3">
        {bullets.map((bullet) => (
          <li key={bullet} className="rounded-xl border border-ori-border bg-ori-black/30 px-4 py-3 text-sm text-ori-foreground">
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OutcomeSnapshotGrid({ items }: { items: string[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {items.map((item, idx) => (
        <article key={item} className="rounded-2xl border border-ori-border bg-ori-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ori-accent">Outcome {idx + 1}</p>
          <p className="mt-3 text-base font-medium leading-relaxed text-ori-foreground">{item}</p>
        </article>
      ))}
    </div>
  );
}

export type ResourceItem = {
  title: string;
  preview: string;
  category: string;
  to?: string;
  /** Card thumbnail (photo URL or bundled asset). */
  image?: string;
  imageAlt?: string;
};

export function ResourceCardGrid({ items }: { items: ResourceItem[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const card = (
          <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-ori-border bg-ori-surface transition-all duration-200 group-hover:-translate-y-1 group-hover:border-ori-accent/35">
            {item.image ? (
              <div className="relative h-40 shrink-0 overflow-hidden bg-ori-charcoal ring-1 ring-inset ring-white/[0.06]">
                <img
                  src={item.image}
                  alt={item.imageAlt ?? ""}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ori-surface/95 via-transparent to-transparent" />
              </div>
            ) : null}
            <div className="flex flex-1 flex-col p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ori-accent">{item.category}</p>
              <h3 className="mt-3 font-display text-lg font-semibold text-ori-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ori-muted">{item.preview}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ori-accent">
                Read more <ChevronRight className="h-4 w-4" aria-hidden />
              </span>
            </div>
          </article>
        );
        return item.to ? (
          <Link key={item.title} to={item.to} className="group">
            {card}
          </Link>
        ) : (
          <div key={item.title}>{card}</div>
        );
      })}
    </div>
  );
}

export function ContactTrustCards() {
  return (
    <div className="grid gap-4 md:max-w-md">
      <div className="rounded-2xl border border-ori-border bg-ori-surface p-5">
        <MapPin className="h-4 w-4 text-ori-accent" aria-hidden />
        <p className="mt-2 text-xs uppercase tracking-wider text-ori-muted">Visit us</p>
        <p className="mt-1 text-sm font-medium text-ori-foreground">611 Commerce Street, Suite 2611, Nashville, TN 37203</p>
      </div>
    </div>
  );
}
