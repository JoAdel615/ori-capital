import { PageContainer } from "../system";
import { SECTION_Y_LOOSE } from "../system/rhythm";
import { REFERRAL_TRUST_INTRO_BACKDROP } from "../../constants/siteImagery";

type ReferralWhyReferredProps = {
  /** Resolved from `?ref=` when the public API returns a partner display name */
  partnerDisplayName?: string | null;
};

export function ReferralWhyReferred({ partnerDisplayName }: ReferralWhyReferredProps) {
  const name = partnerDisplayName?.trim();
  const body =
    name && name.length > 0
      ? `You're here because ${name} trusts Ori to help you prepare for funding the right way. This isn't about pushing a product, it's about making sure you actually qualify before you apply.`
      : "You're here because someone in your network trusts Ori to help you prepare for funding the right way. This isn't about pushing a product, it's about making sure you actually qualify before you apply.";

  return (
    <section className="relative isolate overflow-hidden border-b border-ori-border section-divider" aria-labelledby="referral-why-heading">
      <img
        src={REFERRAL_TRUST_INTRO_BACKDROP}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-ori-black/82" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_40%,color-mix(in_srgb,var(--color-ori-accent)_12%,transparent),transparent_55%)]"
        aria-hidden
      />

      <div className={`relative z-10 ${SECTION_Y_LOOSE}`}>
        <PageContainer maxWidth="max-w-2xl">
          <div className="rounded-3xl border border-white/[0.12] bg-ori-black/45 px-7 py-11 backdrop-blur-md md:px-12 md:py-14 ring-1 ring-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <header className="text-center">
              <p className="ori-type-eyebrow">Why you are here</p>
              <h2
                id="referral-why-heading"
                className="mt-5 font-display text-2xl font-bold tracking-tight text-ori-text-primary md:text-[2rem] md:leading-snug"
              >
                Trust, transferred—not sold
              </h2>
              <p className="mx-auto mt-8 max-w-xl text-pretty text-center text-base leading-relaxed text-ori-text-secondary md:text-lg md:leading-relaxed">
                {body}
              </p>
            </header>
          </div>
        </PageContainer>
      </div>
    </section>
  );
}
