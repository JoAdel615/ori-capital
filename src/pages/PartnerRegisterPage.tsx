import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { ArrowRight, CalendarDays, CheckCircle2, Handshake, Mail, PlugZap, TrendingUp } from "lucide-react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Textarea } from "../components/Textarea";
import { HOME_HERO_BACKGROUND } from "../constants/siteImagery";
import { config } from "../config";
import { PARTNER_TYPES } from "../lib/backoffice/partnerFormOptions";
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
import { PageSection, SectionHeading } from "../components/system";

const selectClass =
  "w-full rounded-lg border border-ori-border bg-ori-charcoal px-3 py-2 text-ori-foreground text-sm focus:border-ori-accent focus:outline-none";
const cardShell = "rounded-2xl border border-ori-border bg-ori-surface px-5 py-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] md:px-6";
const contactEmail = "info@oricapitalholdings.com";
const DEFAULT_BOOKING_URL = "https://calendly.com/biz-oricapitalholdings/30min?month=2026-03";
const stateOptions = [
  "",
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI",
  "MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT",
  "VT","VA","WA","WV","WI","WY","DC",
] as const;
const partnerUnlocks = [
  {
    title: "Expand your offering without new infrastructure",
    copy: "Embed execution and funding pathways into what you already deliver.",
    Icon: PlugZap,
    band: "from-ori-accent/15 to-transparent",
  },
  {
    title: "Keep clients moving instead of losing momentum",
    copy: "Reduce handoff friction between strategy, operations, and capital decisions.",
    Icon: TrendingUp,
    band: "from-ori-pillar-consulting-hint/20 to-transparent",
  },
  {
    title: "Add readiness and capital pathways to your stack",
    copy: "Bring structured funding readiness into your current client lifecycle.",
    Icon: CalendarDays,
    band: "from-ori-pillar-capital-hint/20 to-transparent",
  },
  {
    title: "Stay focused on your core work-we handle the rest",
    copy: "Your team keeps leading client relationships while Ori extends delivery depth.",
    Icon: Handshake,
    band: "from-ori-accent/12 to-transparent",
  },
] as const;

const partnerHeroMeshStyle: React.CSSProperties = {
  background:
    "radial-gradient(120% 80% at 20% 20%, color-mix(in srgb, var(--color-ori-accent) 14%, transparent), transparent 60%), radial-gradient(80% 55% at 80% 15%, color-mix(in srgb, var(--color-ori-pillar-consulting-hint) 11%, transparent), transparent 62%)",
};

type RegisterDoneState =
  | { flow: "self"; message: string }
  | { flow: "invite"; message: string; referralCode: string; referralLink: string; partnerPortalLink: string };

function partnerTypeLabel(code: string): string {
  const fromIntake = PARTNER_INTAKE_TYPE_OPTIONS.find((o) => o.value === code);
  if (fromIntake) return fromIntake.label;
  return PARTNER_TYPES.find((o) => o.value === code)?.label || code.replace(/_/g, " ");
}

export function PartnerRegisterPage() {
  const location = useLocation();
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [clientSegments, setClientSegments] = useState<string[]>([]);
  const [partnershipInterest, setPartnershipInterest] = useState("");
  const [estimatedReferralsPerMonth, setEstimatedReferralsPerMonth] = useState("");
  const [currentClientGap, setCurrentClientGap] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  /** Honeypot — leave empty (server rejects bots that fill hidden fields). */
  const [partnerHoneypot, setPartnerHoneypot] = useState("");

  const typeFromUrl = params.get("type");
  const bookingUrl = config.calendlyUrl || DEFAULT_BOOKING_URL;

  useEffect(() => {
    if (tokenFromUrl) return;
    if (typeFromUrl && PARTNER_INTAKE_TYPE_OPTIONS.some((option) => option.value === typeFromUrl)) {
      setPartnerType(typeFromUrl as PartnerType);
    }
  }, [tokenFromUrl, typeFromUrl]);

  const toggleSegment = (value: string) => {
    setClientSegments((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
  };

  const resolveAttribution = () => {
    const sourcePage =
      (params.get("source_page") || params.get("from") || "").trim() ||
      (location.state &&
      typeof location.state === "object" &&
      "sourcePage" in location.state &&
      typeof location.state.sourcePage === "string"
        ? location.state.sourcePage.trim()
        : "") ||
      (typeof document !== "undefined" ? document.referrer.trim() : "") ||
      ROUTES.PARTNERS;

    const entryCta =
      (params.get("entry_cta") || params.get("cta") || "").trim() ||
      (location.state &&
      typeof location.state === "object" &&
      "entryCta" in location.state &&
      typeof location.state.entryCta === "string"
        ? location.state.entryCta.trim()
        : "") ||
      "become_partner";

    const emptyToUndef = (s: string) => (s.trim() ? s.trim() : undefined);
    return {
      source_page: sourcePage || undefined,
      entry_cta: entryCta || undefined,
      partner_type_preselected: typeFromUrl ? typeFromUrl.trim() : undefined,
      utm_source: emptyToUndef(params.get("utm_source") || ""),
      utm_campaign: emptyToUndef(params.get("utm_campaign") || ""),
      referral_partner: emptyToUndef(params.get("referral_partner") || params.get("ref") || ""),
    };
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
        if (r.partnerType && PARTNER_INTAKE_TYPE_OPTIONS.some((option) => option.value === r.partnerType)) {
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

    if (!organizationName.trim() || !firstName.trim() || !lastName.trim() || !email.trim()) {
      setError("Organization name, first name, last name, and email are required.");
      return;
    }
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    const partnerIntake = {
      roleTitle: roleTitle.trim() || undefined,
      clientSegments,
      partnershipInterest: partnershipInterest || undefined,
      estimatedReferralsPerMonth: estimatedReferralsPerMonth || undefined,
      currentClientGap: currentClientGap.trim() || undefined,
      additionalNotes: additionalNotes.trim() || undefined,
      ...resolveAttribution(),
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
        contactName: fullName,
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        state: stateRegion.trim(),
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
      contactName: fullName,
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      state: stateRegion.trim(),
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
      <>
        <section className="relative overflow-hidden border-b border-ori-border">
          <img
            src={HOME_HERO_BACKGROUND}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
          <div className="pointer-events-none absolute inset-0 bg-ori-black/80" aria-hidden />
          <div className="pointer-events-none absolute inset-0" style={partnerHeroMeshStyle} aria-hidden />
          <PageSection variant="loose" className="relative z-[1] bg-transparent">
            <div className="mx-auto max-w-2xl text-center">
              <div className={`${cardShell} py-8`}>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-ori-accent/40 bg-ori-accent/10">
                  <CheckCircle2 className="h-7 w-7 text-ori-accent" strokeWidth={1.8} aria-hidden />
                </div>
                <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-ori-foreground md:text-3xl">
                  Submission received
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-ori-muted">{done.message}</p>
                {done.flow === "invite" ? (
                  <div className="mt-6 rounded-xl border border-ori-border bg-ori-charcoal/60 p-4 text-left">
                    <p className="text-xs text-ori-muted">Referral code</p>
                    <p className="mt-1 font-mono text-sm text-ori-accent">{done.referralCode || "—"}</p>
                    <p className="mt-4 text-xs text-ori-muted">Referral link</p>
                    <p className="mt-1 break-all font-mono text-xs text-ori-accent">{done.referralLink || "—"}</p>
                  </div>
                ) : null}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Button to={ROUTES.PARTNERS} variant="outline">
                    Back to partner page
                  </Button>
                  <Button to={`${ROUTES.CONTACT}?source_page=${encodeURIComponent(ROUTES.PARTNER_REGISTER)}&entry_cta=partner_submission_complete`}>
                    Schedule a call
                  </Button>
                </div>
              </div>
            </div>
          </PageSection>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-ori-border">
        <img
          src={HOME_HERO_BACKGROUND}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-0 bg-ori-black/82 md:bg-ori-black/76" aria-hidden />
        <div className="pointer-events-none absolute inset-0" style={partnerHeroMeshStyle} aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage:
              "linear-gradient(to right, color-mix(in srgb, var(--color-ori-foreground) 7%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-ori-foreground) 7%, transparent) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
          aria-hidden
        />
        <PageSection variant="loose" className="relative z-[1] bg-transparent">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-ori-accent">Partner intake</p>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ori-foreground md:text-5xl">
              Extend your offering, without building it yourself
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-ori-foreground/85 md:text-lg">
              Ori plugs into your existing work to help clients move from idea to operations to funding, without gaps,
              guesswork, or handoffs.
            </p>
            {isInviteFlow ? (
              <p className="mt-4 inline-flex rounded-full border border-ori-accent/40 bg-ori-accent/10 px-3 py-1 text-xs text-ori-accent">
                Invite flow detected: complete this form to activate your partner profile.
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#partner-fit-form" size="lg">
                Complete registration
              </Button>
              <Button href={bookingUrl} target="_blank" rel="noopener noreferrer" variant="outline" size="lg">
                Schedule call
              </Button>
            </div>
          </div>
        </PageSection>
      </section>

      <PageSection variant="normal" className="relative border-b border-ori-border bg-ori-surface-base section-divider">
        <div
          className="pointer-events-none absolute -right-12 top-0 h-72 w-72 rounded-full gradient-orb-accent opacity-[0.34] motion-reduce:opacity-20 md:right-[10%]"
          aria-hidden
        />
        <div className="relative">
          <SectionHeading
            align="left"
            title="What partnering with Ori unlocks"
            subtitle="This is not a handoff. It is an extension layer that fits into your existing delivery model."
            className="max-w-3xl"
          />
          <div className="grid gap-4 md:grid-cols-2">
            {partnerUnlocks.map(({ title, copy, Icon, band }) => (
              <article key={title} className="relative overflow-hidden rounded-2xl border border-ori-border bg-ori-surface p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] md:p-6">
                <div className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${band}`} aria-hidden />
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ori-accent/35 bg-ori-accent/10 text-ori-accent">
                    <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ori-foreground">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ori-muted">{copy}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection
        id="partner-fit-form"
        variant="normal"
        className="relative border-b border-ori-border bg-ori-black section-divider scroll-mt-24"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_8%,color-mix(in_srgb,var(--color-ori-accent)_4%,transparent)_42%,transparent_84%)] opacity-70"
          aria-hidden
        />
        <div className="relative grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <div className={`${cardShell} md:p-7`}>
              {inviteLoading ? (
                <p className="py-8 text-center text-sm text-ori-muted">Checking invite…</p>
              ) : (
                <form onSubmit={handleSubmit} className="relative space-y-8" aria-busy={submitting}>
                  <header>
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-ori-foreground">
                      Tell us what&apos;s going on
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-ori-muted">
                      Answer a few quick questions so we can route you to the right team and next step.
                    </p>
                  </header>
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

                  <section className="space-y-4 border-b border-ori-border/70 pb-7">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-ori-accent">Organization</h3>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-ori-foreground" htmlFor="partner-type">
                        What best describes your organization?
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
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Organization Name"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        autoComplete="organization"
                        required
                      />
                      <Input label="Role / Title (optional)" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} />
                    </div>
                  </section>

                  <section className="space-y-4 border-b border-ori-border/70 pb-7">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-ori-accent">Contact</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" required />
                      <Input label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" required />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" type="email" required />
                      <Input label="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" type="tel" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input label="City (optional)" value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" />
                      <div>
                        <label className="mb-1 block text-sm font-medium text-ori-foreground" htmlFor="partner-state">
                          State (optional)
                        </label>
                        <select
                          id="partner-state"
                          value={stateRegion}
                          onChange={(e) => setStateRegion(e.target.value)}
                          className={selectClass}
                          autoComplete="address-level1"
                        >
                          {stateOptions.map((state) => (
                            <option key={state || "blank"} value={state}>
                              {state || "Select"}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4 border-b border-ori-border/70 pb-7">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-ori-accent">Fit</h3>
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
                        How do you see Ori fitting into your work?
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
                        How often would this come up for your clients? (optional)
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
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-ori-accent">Context</h3>
                    <Textarea
                      label="Where do your clients typically get stuck? (optional)"
                      value={currentClientGap}
                      onChange={(e) => setCurrentClientGap(e.target.value)}
                      placeholder="What breaks down-structure, execution, funding, follow-through, etc."
                      rows={3}
                    />
                    <Textarea
                      label="Anything else we should know? (optional)"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="Context, goals, or how you're thinking about working together."
                      rows={4}
                    />
                    {isInviteFlow && referralCode ? (
                      <p className="text-xs text-ori-muted">
                        Invite code: <span className="font-mono text-ori-accent">{referralCode}</span>
                      </p>
                    ) : null}
                    <div className="flex flex-col gap-3 border-t border-ori-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
                      <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
                        {submitting ? "Submitting…" : "Submit"}
                      </Button>
                    </div>
                  </section>
                </form>
              )}
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="space-y-4 lg:sticky lg:top-24">
              <div className={cardShell}>
                <h3 className="font-display text-lg font-semibold tracking-tight text-ori-foreground">Schedule a call</h3>
                <p className="mt-2 text-sm leading-relaxed text-ori-muted">
                  If you&apos;d rather discuss fit before submitting, start with a quick conversation.
                </p>
                <div className="mt-4 space-y-2">
                  <Button href={bookingUrl} target="_blank" rel="noopener noreferrer" variant="outline" className="w-full justify-between">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" aria-hidden />
                      Schedule a call
                    </span>
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Button>
                  <Button href={`mailto:${contactEmail}`} variant="secondary" className="w-full justify-between">
                    <span className="inline-flex items-center gap-2">
                      <Mail className="h-4 w-4" aria-hidden />
                      Email us
                    </span>
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </PageSection>

    </>
  );
}
