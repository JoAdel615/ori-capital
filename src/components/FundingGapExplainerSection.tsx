import { useEffect, useRef, useState } from "react";
import { Landmark, Building2 } from "lucide-react";
import { Button } from "./Button";
import { ROUTES } from "../utils/navigation";

const bankBullets = [
  "Requires collateral",
  "Strong credit history",
  "Established revenue",
  "Conservative underwriting",
];

const ventureBullets = [
  "Requires high growth",
  "Traction metrics",
  "Equity exchange",
  "Exit-driven incentives",
];

const gapBullets = [
  "Growing revenue",
  "Tight cash flow",
  "Early traction",
  "Not VC-scale",
  "Not bank-ready",
];

/**
 * "The Gap Between Banks and Venture" — illustrated explainer section.
 * Communicates Ori's thesis: most operators live between traditional bank and VC criteria;
 * Ori structures capital in that gap. Serious, structured, financial tone.
 */
export function FundingGapExplainerSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const revealBase = "transition-all duration-500 ease-out";
  const revealHidden = "opacity-0 translate-y-4";
  const revealVisible = "opacity-100 translate-y-0";

  return (
    <section
      ref={sectionRef}
      className="relative py-28 bg-ori-black section-divider overflow-x-hidden"
      aria-labelledby="funding-gap-heading"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Headline + subtext */}
        <header className="text-center mb-16">
          <h2
            id="funding-gap-heading"
            className="font-display text-3xl font-bold tracking-tight text-ori-foreground md:text-4xl lg:text-[2.5rem]"
          >
            Most operators live in the gap.
          </h2>
          <p className="mx-auto mt-5 max-w-[640px] text-lg text-ori-muted leading-relaxed">
            Traditional banks require collateral and long track records.
            Venture capital requires hypergrowth and traction.
            Most builders sit somewhere in between.
          </p>
        </header>

        {/* 3-column layout + visual bridge */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
            {/* Left — Bank */}
            <div
              className={`${revealBase} ${visible ? revealVisible : revealHidden}`}
              style={{ transitionDelay: visible ? "0ms" : "0ms" }}
            >
              <div className="h-full rounded-2xl border border-ori-border bg-ori-surface p-8 flex flex-col">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-ori-charcoal border border-ori-border text-ori-muted" aria-hidden>
                  <Landmark className="w-5 h-5" strokeWidth={1.75} />
                </span>
                <h3 className="font-display text-xl font-semibold text-ori-foreground mt-5">
                  Traditional Bank
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-ori-muted flex-1">
                  {bankBullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mt-6 text-xs font-medium uppercase tracking-wider text-ori-muted/80">
                  Low risk tolerance
                </p>
              </div>
            </div>

            {/* Center — The Gap (highlighted) */}
            <div
              className={`${revealBase} ${visible ? revealVisible : revealHidden}`}
              style={{ transitionDelay: visible ? "150ms" : "0ms" }}
            >
              <div className="h-full rounded-2xl border-2 border-ori-accent/50 bg-ori-surface shadow-[0_0_32px_rgba(201,243,29,0.08)] p-8 flex flex-col md:-mx-1 md:scale-[1.02] z-10 relative">
                <span className="text-xs font-semibold uppercase tracking-widest text-ori-accent">
                  Where most operators live
                </span>
                <h3 className="font-display text-2xl font-semibold text-ori-foreground mt-4">
                  The Gap
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-ori-foreground">
                  {gapBullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-ori-border flex flex-col gap-4">
                  <p className="text-ori-accent font-semibold">
                    This is where Ori structures capital.
                  </p>
                  <Button to={ROUTES.APPLY} variant="outline" size="md" className="w-fit">
                    See Your Options
                  </Button>
                </div>
              </div>
            </div>

            {/* Right — Venture Capital */}
            <div
              className={`${revealBase} ${visible ? revealVisible : revealHidden}`}
              style={{ transitionDelay: visible ? "0ms" : "0ms" }}
            >
              <div className="h-full rounded-2xl border border-ori-border bg-ori-surface p-8 flex flex-col">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-ori-charcoal border border-ori-border text-ori-muted" aria-hidden>
                  <Building2 className="w-5 h-5" strokeWidth={1.75} />
                </span>
                <h3 className="font-display text-xl font-semibold text-ori-foreground mt-5">
                  Venture Capital
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-ori-muted flex-1">
                  {ventureBullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mt-6 text-xs font-medium uppercase tracking-wider text-ori-muted/80">
                  High growth expectation
                </p>
              </div>
            </div>
          </div>

          {/* Subtle horizontal bridge line (accent glow) between cards */}
          <div
            className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px pointer-events-none hidden md:block z-0"
            aria-hidden
          >
            <div className="h-full w-full bg-gradient-to-r from-transparent via-ori-accent/25 to-transparent" />
          </div>
        </div>

        {/* Bottom reinforcement copy */}
        <p className="mt-14 text-center text-sm text-ori-muted max-w-xl mx-auto leading-relaxed">
          Funding isn't broken. It's fragmented.
          We bring structure to the space between banks and venture.
        </p>
      </div>
    </section>
  );
}
