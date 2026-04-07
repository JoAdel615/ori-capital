import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ReferralHero,
  ReferralWhatWeHelp,
  ReferralPathCards,
  ReferralHowOriSupports,
  ReferralWhyReferred,
  ReferralFinalCta,
} from "../components/referral";
import {
  normalizeReferralCode,
  persistReferralCode,
  trackReferralFunnelEvent,
} from "../lib/referral/attribution";

export function ReferralPage() {
  const [searchParams] = useSearchParams();
  const refFromUrl = useMemo(() => normalizeReferralCode(searchParams.get("ref")), [searchParams]);

  useEffect(() => {
    if (!refFromUrl) return;
    persistReferralCode(refFromUrl);
    trackReferralFunnelEvent({ referralCode: refFromUrl, event: "landing" });
  }, [refFromUrl]);

  const handleCta = (cta: string) => {
    if (refFromUrl) {
      trackReferralFunnelEvent({ referralCode: refFromUrl, event: "cta", cta });
    }
  };

  return (
    <div className="referral-landing">
      <ReferralHero refCode={refFromUrl} onCtaClick={handleCta} />
      <ReferralWhatWeHelp />
      <ReferralPathCards refCode={refFromUrl} onCardNavigate={handleCta} />
      <ReferralHowOriSupports />
      <ReferralWhyReferred />
      <ReferralFinalCta refCode={refFromUrl} onCtaClick={handleCta} />
    </div>
  );
}
