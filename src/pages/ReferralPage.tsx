import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ReferralHero,
  ReferralWhatWeHelp,
  ReferralHowOriSupports,
  ReferralWhyReferred,
  ReferralFinalCta,
} from "../components/referral";
import {
  normalizeReferralCode,
  persistReferralCode,
  trackReferralFunnelEvent,
} from "../lib/referral/attribution";
import { fetchReferralPartnerByCode } from "../lib/referral/lookupPartner";

export function ReferralPage() {
  const [searchParams] = useSearchParams();
  const refFromUrl = useMemo(() => normalizeReferralCode(searchParams.get("ref")), [searchParams]);
  const [partnerDisplayName, setPartnerDisplayName] = useState<string | null>(null);

  useEffect(() => {
    if (!refFromUrl) return;
    persistReferralCode(refFromUrl);
    trackReferralFunnelEvent({ referralCode: refFromUrl, event: "landing" });
  }, [refFromUrl]);

  useEffect(() => {
    if (!refFromUrl) {
      setPartnerDisplayName(null);
      return;
    }
    let cancelled = false;
    void fetchReferralPartnerByCode(refFromUrl).then((p) => {
      if (!cancelled) setPartnerDisplayName(p?.displayName ?? null);
    });
    return () => {
      cancelled = true;
    };
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
      <ReferralHowOriSupports />
      <ReferralWhyReferred partnerDisplayName={partnerDisplayName} />
      <ReferralFinalCta refCode={refFromUrl} onCtaClick={handleCta} />
    </div>
  );
}
