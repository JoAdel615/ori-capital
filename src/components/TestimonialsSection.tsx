/**
 * On-brand testimonials: builder outcomes, clarity, ownership.
 * Prefers approved entries from the Back Office public API; falls back to local defaults.
 * Toggle via config.featureFlags.showTestimonials.
 */
import { useEffect, useMemo, useState } from "react";
import { Card } from "./Card";
import { getTestimonials, parseFundingAmount, type TestimonialEntry } from "../data/testimonials";
import { fetchPublicSiteContent, type PublicTestimonialCard } from "../lib/public/siteContent";

function fromLocal(t: TestimonialEntry): PublicTestimonialCard {
  return {
    name: t.name,
    quote: t.feedback,
    company: t.company,
    location: t.location,
    fundingAmount: t.fundingAmount ? parseFundingAmount(t.fundingAmount) : undefined,
    businessType: t.businessStage,
  };
}

export function TestimonialsSection() {
  const [remote, setRemote] = useState<PublicTestimonialCard[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPublicSiteContent().then((data) => {
      if (cancelled || !data?.testimonialsForHomepage?.length) return;
      setRemote(data.testimonialsForHomepage);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => {
    if (remote && remote.length > 0) return remote;
    return getTestimonials().map(fromLocal);
  }, [remote]);

  return (
    <section className="mx-auto max-w-5xl">
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((t, i) => (
          <Card key={`${t.name}-${i}`} variant="bordered" className="flex h-full flex-col">
            <p className="flex-1 text-ori-foreground leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-5 border-t border-ori-border pt-4">
              <p className="text-sm font-medium text-ori-accent">{t.name}</p>
              <p className="text-xs text-ori-muted">
                {[t.location, t.company].filter(Boolean).join(" · ")}
              </p>
              {(t.fundingAmount != null || t.businessType) && (
                <p className="text-xs text-ori-muted mt-1">
                  {[
                    t.fundingAmount != null
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        }).format(t.fundingAmount)
                      : null,
                    t.businessType,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
