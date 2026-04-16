import type { CSSProperties } from "react";
import { PageContainer } from "../system/PageContainer";
import { HOME_HERO_BACKGROUND } from "../../constants/siteImagery";

const hairline = "border-white/[0.08]";

/** Subtle engineering grid — suggests structure without competing with type */
const gridPlaneStyle: CSSProperties = {
  backgroundImage: `
    linear-gradient(to right, color-mix(in srgb, var(--color-ori-foreground) 5%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--color-ori-foreground) 5%, transparent) 1px, transparent 1px)
  `,
  backgroundSize: "56px 56px",
};

const meshHeroStyle: CSSProperties = {
  background: `
    radial-gradient(ellipse 100% 80% at 50% -20%, color-mix(in srgb, var(--color-ori-accent) 18%, transparent), transparent 55%),
    radial-gradient(ellipse 60% 50% at 100% 60%, color-mix(in srgb, var(--color-ori-pillar-consulting-hint) 12%, transparent), transparent 45%),
    radial-gradient(ellipse 50% 45% at 0% 70%, color-mix(in srgb, var(--color-ori-pillar-capital-hint) 10%, transparent), transparent 42%)
  `,
};

/** Static home: hero only (site footer is omitted on `/` in Layout). */
export function HomeStaticLanding() {
  return (
    <div className="bg-ori-surface-base text-ori-text-primary">
      <section
        className={`relative flex h-[calc(100dvh-4.75rem)] flex-col justify-center overflow-hidden border-b ${hairline}`}
        aria-labelledby="home-hero-heading"
      >
        <img
          src={HOME_HERO_BACKGROUND}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-ori-black/72 md:bg-ori-black/65"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 opacity-[0.4]" style={gridPlaneStyle} aria-hidden />
        <div className="pointer-events-none absolute inset-0" style={meshHeroStyle} aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ori-black/50 via-ori-black/55 to-ori-surface-base"
          aria-hidden
        />

        <div className="pointer-events-none absolute left-4 top-4 h-10 w-10 border-l border-t border-white/[0.12] sm:left-6 sm:top-6 lg:left-10 lg:top-10" aria-hidden />
        <div className="pointer-events-none absolute right-4 top-4 h-10 w-10 border-r border-t border-white/[0.12] sm:right-6 sm:top-6 lg:right-10 lg:top-10" aria-hidden />
        <div className="pointer-events-none absolute bottom-4 left-4 h-10 w-10 border-b border-l border-white/[0.12] sm:bottom-6 sm:left-6 lg:bottom-10 lg:left-10" aria-hidden />
        <div className="pointer-events-none absolute bottom-4 right-4 h-10 w-10 border-b border-r border-white/[0.12] sm:bottom-6 sm:right-6 lg:bottom-10 lg:right-10" aria-hidden />

        <PageContainer maxWidth="max-w-5xl" className="relative z-10 py-12 text-center md:py-16">
          <h1
            id="home-hero-heading"
            className="mx-auto max-w-[22ch] font-display text-[2.125rem] font-semibold leading-[1.05] tracking-[-0.035em] text-ori-text-primary sm:max-w-none sm:text-5xl md:text-6xl md:leading-[1.02] lg:text-[3.75rem] lg:tracking-[-0.04em]"
          >
            <span className="block text-ori-text-secondary md:inline md:text-ori-text-primary/85">The </span>
            <span className="text-ori-accent">operating system</span>
            <span className="block pt-1 text-ori-text-primary sm:pt-2 md:inline md:pt-0">
              {" "}
              for building and running a business
            </span>
          </h1>
          <p className="ori-type-lead mx-auto mt-6 max-w-2xl text-pretty text-ori-text-secondary md:mt-8 md:text-xl md:leading-relaxed">
            Ori supports founders and operators at every stage, so you can start, fund, and grow your business in one
            place.
          </p>
        </PageContainer>
      </section>
    </div>
  );
}
