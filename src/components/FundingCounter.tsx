/**
 * Funding counter: capital deployed through Ori. Tone-aligned copy, hero-level layout.
 * Numbers count up when the section scrolls into view.
 * Values come from Back Office when the public API is available; otherwise local defaults + browser testimonial totals.
 * Toggle via config.featureFlags.showFundingCounter (off unless `VITE_SHOW_FUNDING_COUNTER=1`).
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { getFundingStats } from "../data/fundingStats";
import { getApprovedFundingTotal } from "../data/testimonials";
import { fetchPublicSiteContent } from "../lib/public/siteContent";

const FUNDING_PREFIX = "$";

const METRIC_LABELS = [
  "Deals sourced",
  "Equity taken",
  "New businesses funded",
  "Founders and owners supported",
] as const;

const DURATION_MS = 1400;
const EASING = (t: number) => 1 - Math.pow(1 - t, 3);

function useInView(opts?: { threshold?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: opts?.threshold ?? 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [opts?.threshold]);
  return { ref, inView };
}

function useCountUp(
  target: number,
  durationMs: number,
  start: boolean,
  preferReducedMotion: boolean
): number {
  const [current, setCurrent] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!start || preferReducedMotion) {
      setCurrent(target);
      return;
    }
    startRef.current = null;

    const tick = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = EASING(progress);
      setCurrent(eased * target);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [start, target, durationMs, preferReducedMotion]);

  return current;
}

function usePreferReducedMotion() {
  const [preferReducedMotion, setPreferReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPreferReducedMotion(mq.matches);
    const handler = () => setPreferReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return preferReducedMotion;
}

function DigitSegment({ char }: { char: string }) {
  return (
    <span
      className="inline-flex h-16 w-12 min-w-[3rem] items-center justify-center rounded-lg border border-ori-border bg-ori-charcoal/90 text-3xl font-semibold tabular-nums text-ori-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] md:h-20 md:w-14 md:min-w-[3.5rem] md:text-4xl"
      aria-hidden
    >
      {char}
    </span>
  );
}

function FundingDisplayStrip({
  displayValue,
  prefix,
  suffix,
}: {
  displayValue: string;
  prefix: string;
  suffix: string;
}) {
  const chars = [prefix, ...displayValue.split(""), suffix];
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-2.5 md:gap-3"
      role="img"
      aria-label={`${prefix}${displayValue}${suffix}`}
    >
      {chars.map((char, i) => (
        <DigitSegment key={`${char}-${i}`} char={char} />
      ))}
    </div>
  );
}

export function FundingCounter() {
  const { ref, inView } = useInView({ threshold: 0.2 });
  const preferReducedMotion = usePreferReducedMotion();
  const [publicContent, setPublicContent] = useState<Awaited<ReturnType<typeof fetchPublicSiteContent>>>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPublicSiteContent().then((data) => {
      if (!cancelled) setPublicContent(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    if (publicContent?.siteMetricConfig) {
      const c = publicContent.siteMetricConfig;
      return {
        totalFunding: publicContent.mainFundingDisplayValue,
        totalFundingUnit: publicContent.mainFundingUnit,
        dealsSourced: c.dealsSourcedValue,
        dealsSourcedSuffix: c.dealsSourcedSuffix,
        equityTaken: c.equityTakenValue,
        newBusinessesFunded: c.businessesFundedValue,
        newBusinessesSuffix: c.businessesFundedSuffix,
        foundersSupported: c.foundersSupportedValue,
        foundersSuffix: c.foundersSupportedSuffix,
      };
    }
    const local = getFundingStats();
    const approvedTotalDollars = getApprovedFundingTotal();
    const unit = local.totalFundingUnit ?? "M";
    const divisor = unit === "M" ? 1e6 : 1e3;
    return {
      ...local,
      totalFunding: local.totalFunding + approvedTotalDollars / divisor,
    };
  }, [publicContent]);

  const unit = stats.totalFundingUnit ?? "M";
  const combinedTotal = stats.totalFunding;

  const fundingNumber = useCountUp(
    combinedTotal,
    DURATION_MS,
    inView,
    preferReducedMotion
  );
  const fundingDisplay =
    combinedTotal % 1 === 0
      ? Math.round(fundingNumber).toString()
      : fundingNumber.toFixed(1);
  const fundingSuffix = unit;

  const metrics = [
    { label: METRIC_LABELS[0], numeric: stats.dealsSourced, suffix: stats.dealsSourcedSuffix },
    { label: METRIC_LABELS[1], numeric: stats.equityTaken, suffix: "" },
    { label: METRIC_LABELS[2], numeric: stats.newBusinessesFunded, suffix: stats.newBusinessesSuffix },
    { label: METRIC_LABELS[3], numeric: stats.foundersSupported, suffix: stats.foundersSuffix },
  ];

  return (
    <div ref={ref} className="mx-auto max-w-4xl">
      <div className="rounded-2xl border border-ori-border bg-ori-surface/95 p-8 shadow-xl md:p-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-stretch md:gap-12">
          {/* Left: main metric — prominent funding display */}
          <div className="flex flex-1 flex-col justify-center border-ori-border md:border-r md:pr-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-ori-accent">
              Funding deployed through Ori.
            </p>
            <p className="mt-2 text-sm text-ori-muted">
              Real businesses. Real structures.
              <br />
              No pitch theater.
            </p>
            <div className="mt-8">
              <FundingDisplayStrip
                displayValue={fundingDisplay}
                prefix={FUNDING_PREFIX}
                suffix={fundingSuffix}
              />
            </div>
            <p className="mt-5 text-sm text-ori-muted/80">
              Total funding deployed
            </p>
          </div>

          {/* Right: 2x2 grid of secondary metrics */}
          <div className="grid flex-1 grid-cols-2 gap-6 md:max-w-sm md:gap-8">
            {metrics.map((stat) => (
              <StatCell
                key={stat.label}
                label={stat.label}
                target={stat.numeric}
                suffix={stat.suffix}
                inView={inView}
                preferReducedMotion={preferReducedMotion}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCell({
  label,
  target,
  suffix,
  inView,
  preferReducedMotion,
}: {
  label: string;
  target: number;
  suffix: string;
  inView: boolean;
  preferReducedMotion: boolean;
}) {
  const current = useCountUp(target, DURATION_MS, inView, preferReducedMotion);
  const display = target === 0 ? "0" : Math.round(current).toString() + suffix;
  return (
    <div className="flex flex-col justify-center">
      <p className="font-display text-2xl font-bold text-ori-foreground md:text-3xl">
        {display}
      </p>
      <p className="mt-1.5 text-sm text-ori-muted">{label}</p>
    </div>
  );
}
