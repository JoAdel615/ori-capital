import { Button } from "../Button";
import { PageSection } from "../system";
import { externalUrlWithRef } from "../../lib/referral/attribution";
import { config } from "../../config";

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
      className="section-divider flex min-h-screen min-h-dvh flex-col justify-center bg-ori-black"
    >
      <header className="mx-auto w-full max-w-4xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-ori-foreground md:text-4xl">
          Schedule a Consultation
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ori-muted md:text-base">
          Get a focused 1:1 conversation to map your funding path, clarify your strongest next move, and avoid
          preventable application mistakes.
        </p>
        <div className="mt-10 flex justify-center sm:mt-12 md:mt-14">
          <Button href={consultHref} size="lg" className="min-h-[3rem] min-w-[260px]" onClick={() => onCtaClick?.("final_consult")}>
            Schedule Consultation
          </Button>
        </div>
      </header>
    </PageSection>
  );
}
