import type { PartnerBootstrap, PartnerProfileUpdatePayload } from "../../lib/partner/api";
import { PartnerCollapsibleSection } from "./PartnerCollapsibleSection";
import { PartnerIdentityForm } from "./PartnerIdentityForm";
import { PartnerPasswordCard } from "./PartnerPasswordCard";
import { PartnerReferralShareCard } from "./PartnerReferralShareCard";

export type PartnerAccountPanelProps = {
  partner: PartnerBootstrap["partner"];
  needsPasswordSetup: boolean;
  onProfileSave: (payload: PartnerProfileUpdatePayload) => Promise<void>;
  onPasswordCommit: (password: string) => Promise<void>;
  /** Section spacing (e.g. separated at page bottom). */
  className?: string;
};

export function PartnerAccountPanel({
  partner,
  needsPasswordSetup,
  onProfileSave,
  onPasswordCommit,
  className = "mt-8 md:mt-10",
}: PartnerAccountPanelProps) {
  return (
    <PartnerCollapsibleSection
      id="partner-profile-heading"
      eyebrow="Account"
      title="Profile & account"
      subtitle="Update organization details, copy referral links, and manage your portal password."
      defaultOpen={needsPasswordSetup}
      density="compact"
      className={className}
      badge={
        needsPasswordSetup ? (
          <span className="max-w-[11rem] rounded-md border border-ori-accent/45 bg-ori-accent/10 px-2 py-1 text-center leading-tight ori-type-label text-ori-accent sm:max-w-none">
            Set password for email sign-in
          </span>
        ) : null
      }
    >
      <div className="mx-auto max-w-6xl space-y-6 lg:space-y-8">
        <PartnerIdentityForm embedded partner={partner} onSave={onProfileSave} />
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
          {partner.referralCode ? (
            <PartnerReferralShareCard referralCode={partner.referralCode} />
          ) : (
            <PartnerReferralPlaceholder />
          )}
          <PartnerPasswordCard needsPasswordSetup={needsPasswordSetup} onCommit={onPasswordCommit} />
        </div>
      </div>
    </PartnerCollapsibleSection>
  );
}

function PartnerReferralPlaceholder() {
  return (
    <div className="rounded-xl border border-dashed border-ori-border/90 bg-ori-surface-base/35 p-4 ring-1 ring-white/[0.03] sm:p-5">
      <h3 className="ori-type-subtitle text-ori-foreground">Referral &amp; sharing</h3>
      <p className="mt-2 text-sm leading-relaxed text-ori-text-secondary">
        No referral code on file yet. Ori will attach one when your partnership is fully activated.
      </p>
    </div>
  );
}
