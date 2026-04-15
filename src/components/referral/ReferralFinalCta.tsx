import { Button } from "../Button";
import { PageContainer, PageSection } from "../system";
import { externalUrlWithRef } from "../../lib/referral/attribution";
import { config } from "../../config";
import { MODULE_HERO_BACKGROUNDS } from "../../constants/siteImagery";

type ReferralFinalCtaProps = {
  refCode: string;
  onCtaClick?: (cta: string) => void;
};

export function ReferralFinalCta({ refCode, onCtaClick }: ReferralFinalCtaProps) {
  const calendlyBase = config.calendlyUrl || "https://calendly.com/biz-oricapitalholdings/30min?month=2026-03";
  const consultHref = externalUrlWithRef(calendlyBase, refCode);

  return (
    <PageSection
      variant="loose"
      container={false}
      className="relative isolate overflow-hidden border-t border-ori-border bg-ori-surface-base"
    >
      <img
        src={MODULE_HERO_BACKGROUNDS.capital}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.22] motion-reduce:opacity-[0.18]"
        loading="lazy"
        decoding="async"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ori-surface-base via-ori-surface-base/97 to-ori-surface-base" aria-hidden />

      <PageContainer maxWidth="max-w-3xl" className="relative z-10">
        <div
          className="rounded-2xl border border-ori-border bg-ori-surface-panel p-8 shadow-sm ring-1 ring-white/[0.04] md:p-10"
          aria-labelledby="referral-final-cta-heading"
        >
          <div className="mx-auto max-w-xl text-center">
            <p className="ori-type-eyebrow text-ori-accent">Talk with us</p>
            <h2
              id="referral-final-cta-heading"
              className="mt-3 font-display text-2xl font-bold tracking-tight text-ori-foreground md:text-3xl"
            >
              Schedule a consultation
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-ori-muted md:text-base md:leading-relaxed">
              A focused conversation to map your funding path, clarify your strongest next move, and avoid preventable
              application mistakes.
            </p>
            <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
              <Button
                href={consultHref}
                size="lg"
                className="min-h-[3rem] rounded-full px-10 sm:min-w-[260px]"
                onClick={() => onCtaClick?.("final_consult")}
              >
                Schedule consultation
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    </PageSection>
  );
}
