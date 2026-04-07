import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Textarea } from "../components/Textarea";
import { PARTNER_TYPE_VALUES, PARTNER_TYPES } from "../lib/backoffice/partnerFormOptions";
import type { PartnerType } from "../lib/backoffice/types";
import {
  CLIENT_SEGMENT_OPTIONS,
  ESTIMATED_REFERRALS_OPTIONS,
  PARTNER_INTAKE_TYPE_OPTIONS,
  PARTNERSHIP_INTEREST_OPTIONS,
  validatePartnerIntakeRequired,
} from "../lib/partner/partnerRegistrationIntake";
import { completePartnerInvite, registerPartnerSelfService, validateInviteToken } from "../lib/partner/registerApi";
import { ROUTES } from "../utils/navigation";

const selectClass =
  "w-full rounded-lg border border-ori-border bg-ori-charcoal px-3 py-2 text-ori-foreground text-sm focus:border-ori-accent focus:outline-none";

type RegisterDoneState =
  | { flow: "self"; message: string }
  | { flow: "invite"; message: string; referralCode: string; referralLink: string; partnerPortalLink: string };

function partnerTypeLabel(code: string): string {
  const fromIntake = PARTNER_INTAKE_TYPE_OPTIONS.find((o) => o.value === code);
  if (fromIntake) return fromIntake.label;
  return PARTNER_TYPES.find((o) => o.value === code)?.label || code.replace(/_/g, " ");
}

export function PartnerRegisterPage() {
  const [params] = useSearchParams();
  const tokenFromUrl = params.get("token") || "";
  const isInviteFlow = Boolean(tokenFromUrl);

  const [inviteLoading, setInviteLoading] = useState(isInviteFlow);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<RegisterDoneState | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [partnerType, setPartnerType] = useState<PartnerType>("ACCELERATOR_INCUBATOR");
  const [invitePartnerType, setInvitePartnerType] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [clientSegments, setClientSegments] = useState<string[]>([]);
  const [partnershipInterest, setPartnershipInterest] = useState("");
  const [estimatedReferralsPerMonth, setEstimatedReferralsPerMonth] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  /** Honeypot — leave empty (server rejects bots that fill hidden fields). */
  const [partnerHoneypot, setPartnerHoneypot] = useState("");

  const toggleSegment = (value: string) => {
    setClientSegments((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
  };

  useEffect(() => {
    if (!tokenFromUrl) {
      setInviteLoading(false);
      return;
    }
    let cancelled = false;
    setInviteLoading(true);
    setError(null);
    validateInviteToken(tokenFromUrl).then((r) => {
      if (cancelled) return;
      if (r.error === "expired") {
        setError("This invite is no longer valid. You can still submit an open partner application below.");
      } else if (r.valid) {
        setOrganizationName(r.organizationName || "");
        setReferralCode(r.referralCode || "");
        setInvitePartnerType(r.partnerType || "");
        if (r.partnerType && PARTNER_TYPE_VALUES.includes(r.partnerType as PartnerType)) {
          setPartnerType(r.partnerType as PartnerType);
        }
      } else {
        setError("This invite is not valid. You can still submit an open partner application below.");
      }
      setInviteLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [tokenFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!organizationName.trim() || !contactName.trim() || !email.trim()) {
      setError("Organization name, full name, and email are required.");
      return;
    }

    const partnerIntake = {
      roleTitle: roleTitle.trim() || undefined,
      clientSegments,
      partnershipInterest: partnershipInterest || undefined,
      estimatedReferralsPerMonth: estimatedReferralsPerMonth || undefined,
      additionalNotes: additionalNotes.trim() || undefined,
    };
    const v = validatePartnerIntakeRequired(partnerIntake);
    if (!v.ok) {
      setError(v.error);
      return;
    }

    setSubmitting(true);
    if (isInviteFlow) {
      const res = await completePartnerInvite({
        token: tokenFromUrl,
        organizationName: organizationName.trim(),
        contactName: contactName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        partnerIntake,
        partnerHoneypot,
      });
      setSubmitting(false);
      if (!res.ok) {
        setError(res.error || "Could not submit your application.");
        return;
      }
      setDone({
        flow: "invite",
        message:
          res.message || "Thank you for your interest in partnering with Ori. We’ll follow up with next steps.",
        referralCode: res.referralCode || "",
        referralLink: res.referralLink || "",
        partnerPortalLink: res.partnerPortalLink || "",
      });
      return;
    }

    const res = await registerPartnerSelfService({
      type: partnerType,
      organizationName: organizationName.trim(),
      contactName: contactName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      partnerIntake,
      partnerHoneypot,
    });
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error || "Could not submit your application.");
      return;
    }
    setDone({
      flow: "self",
      message:
        "Thank you for your interest in partnering with Ori. We’ll review your submission and follow up with next steps.",
    });
  };

  if (done) {
    return (
      <div className="ori-container ori-section mx-auto max-w-xl space-y-6 text-center">
        <h1 className="font-display text-2xl font-bold text-ori-foreground md:text-3xl">Application received</h1>
        <p className="text-sm leading-relaxed text-ori-muted">{done.message}</p>
        {done.flow === "invite" ? (
          <div className="rounded-2xl border border-ori-border bg-ori-surface p-4 text-left">
            <p className="text-xs text-ori-muted">Referral code</p>
            <p className="mt-1 font-mono text-sm text-ori-accent">{done.referralCode || "—"}</p>
            <p className="mt-4 text-xs text-ori-muted">Referral link</p>
            <p className="mt-1 break-all font-mono text-xs text-ori-accent">{done.referralLink || "—"}</p>
          </div>
        ) : null}
        <Link to={ROUTES.PARTNERS} className="inline-block text-ori-accent hover:underline">
          Back to partner page →
        </Link>
      </div>
    );
  }

  return (
    <div className="ori-container ori-section mx-auto max-w-3xl">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ori-foreground md:text-4xl">Apply to Partner</h1>
        <p className="mt-4 text-sm leading-relaxed text-ori-muted">
          Tell us a bit about your organization or practice and how you support founders or business owners. We&apos;ll
          review your submission and follow up with next steps.
        </p>
        {isInviteFlow ? (
          <p className="mt-3 text-sm leading-relaxed text-ori-muted">
            You opened a pre-provisioned invite from Ori. Complete the application below to finish setup.
          </p>
        ) : null}
      </header>

      <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-ori-border bg-ori-surface p-5 md:p-6">
        {inviteLoading ? (
          <p className="text-center text-sm text-ori-muted">Checking invite…</p>
        ) : (
          <form onSubmit={handleSubmit} className="relative space-y-4" aria-busy={submitting}>
            <div
              className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
              aria-hidden="true"
            >
              <label htmlFor="partner-honeypot">Company website</label>
              <input
                id="partner-honeypot"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={partnerHoneypot}
                onChange={(e) => setPartnerHoneypot(e.target.value)}
              />
            </div>
            {error ? (
              <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">
                {error}
              </div>
            ) : null}

            <div>
              <label className="mb-1 block text-sm font-medium text-ori-foreground" htmlFor="partner-type">
                Partner Type
              </label>
              {isInviteFlow && invitePartnerType ? (
                <div id="partner-type" className="rounded-lg border border-ori-border bg-ori-charcoal px-3 py-2 text-sm text-ori-foreground">
                  {partnerTypeLabel(invitePartnerType)}
                </div>
              ) : (
                <select
                  id="partner-type"
                  value={partnerType}
                  onChange={(e) => setPartnerType(e.target.value as PartnerType)}
                  className={selectClass}
                  required
                >
                  {PARTNER_INTAKE_TYPE_OPTIONS.map((pt) => (
                    <option key={pt.value} value={pt.value}>
                      {pt.label}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <Input
              label="Organization Name"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              autoComplete="organization"
              required
            />
            <Input label="Full Name" value={contactName} onChange={(e) => setContactName(e.target.value)} autoComplete="name" required />
            <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" type="email" required />
            <Input label="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" type="tel" />
            <Input label="Role / Title (optional)" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} />

            <fieldset>
              <legend className="mb-2 block text-sm font-medium text-ori-foreground">Who do you typically work with?</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {CLIENT_SEGMENT_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex cursor-pointer items-start gap-2 rounded-lg border border-ori-border bg-ori-charcoal/30 px-3 py-2 text-sm text-ori-foreground hover:border-ori-accent/50"
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 rounded border-ori-border text-ori-accent focus:ring-ori-accent"
                      checked={clientSegments.includes(opt.value)}
                      onChange={() => toggleSegment(opt.value)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label className="mb-1 block text-sm font-medium text-ori-foreground" htmlFor="interest">
                What best describes your interest?
              </label>
              <select
                id="interest"
                value={partnershipInterest}
                onChange={(e) => setPartnershipInterest(e.target.value)}
                className={selectClass}
                required
              >
                <option value="">Select</option>
                {PARTNERSHIP_INTEREST_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-ori-foreground" htmlFor="referrals">
                Estimated referrals per month (optional)
              </label>
              <select
                id="referrals"
                value={estimatedReferralsPerMonth}
                onChange={(e) => setEstimatedReferralsPerMonth(e.target.value)}
                className={selectClass}
              >
                <option value="">Select</option>
                {ESTIMATED_REFERRALS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <Textarea
              label="Anything we should know? (optional)"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={4}
            />

            {isInviteFlow && referralCode ? <p className="text-xs text-ori-muted">Invite code: <span className="font-mono text-ori-accent">{referralCode}</span></p> : null}

            <Button type="submit" className="w-full md:w-auto" disabled={submitting}>
              {submitting ? "Submitting…" : "Apply to Partner"}
            </Button>
          </form>
        )}
      </div>

      <p className="mt-5 text-center text-sm text-ori-muted">
        Looking for funding for your business?{" "}
        <Link to={ROUTES.APPLY} className="text-ori-accent hover:underline">
          Apply for funding
        </Link>
      </p>
    </div>
  );
}
