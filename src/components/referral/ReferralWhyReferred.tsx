import { PageSection, SectionHeading } from "../system";

export function ReferralWhyReferred() {
  return (
    <PageSection variant="loose" className="section-divider flex min-h-screen min-h-dvh flex-col justify-center bg-ori-section-alt">
      <SectionHeading
        title="Why You Were Referred"
        subtitle={
          <>
            You were referred because someone in your network trusts Ori to support business owners with funding and capital
            strategy. We help entrepreneurs, operators, and growing businesses move forward with greater clarity,
            structure, and confidence.
          </>
        }
      />
    </PageSection>
  );
}
