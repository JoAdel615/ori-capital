import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  CircleEllipsis,
  CircleHelp,
  ClipboardCheck,
  Compass,
  FileWarning,
  Handshake,
  IdCard,
  Layers,
  Mail,
  MapPinned,
  MessageSquareMore,
  Route,
  Search,
  Settings2,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { PageSection, SectionHeading } from "../components/system";
import { Textarea } from "../components/Textarea";
import { CONSULTING_IMAGE_SET, HOME_HERO_BACKGROUND } from "../constants/siteImagery";
import {
  getLastReadinessSurveySnapshot,
  REFERRAL_OPTIONS,
  type ReferralOption,
} from "../data/contactSubmissions";
import { submitContactIntake } from "../lib/public/intake";
import { fetchReferralPartnerByCode } from "../lib/referral/lookupPartner";
import { resolveCheckoutReferralCode } from "../lib/referral/attribution";
import { CONTACT_ATTRIBUTION_PRIOR_ROUTE_KEY } from "../utils/navigation";

/** Hero visual — soft mesh so photography matches home / lifecycle marketing pages */
const contactHeroMeshStyle: CSSProperties = {
  background: `
    radial-gradient(ellipse 100% 80% at 50% -20%, color-mix(in srgb, var(--color-ori-accent) 16%, transparent), transparent 55%),
    radial-gradient(ellipse 55% 45% at 100% 55%, color-mix(in srgb, var(--color-ori-pillar-consulting-hint) 12%, transparent), transparent 48%),
    radial-gradient(ellipse 45% 40% at 0% 70%, color-mix(in srgb, var(--color-ori-pillar-capital-hint) 8%, transparent), transparent 42%)
  `,
};

const CONTACT_INTENTS = [
  "Start or structure a business",
  "Prepare for funding",
  "Explore funding options",
  "Get help with operations or systems",
  "Partnerships or collaboration",
  "Something else",
] as const;

type ContactIntent = (typeof CONTACT_INTENTS)[number];

const STAGE_OPTIONS = [
  "Just getting started",
  "Early stage / figuring things out",
  "Operating but not structured",
  "Looking for funding",
  "Already applied/denied",
  "Scaling or expanding",
] as const;

type StageOption = (typeof STAGE_OPTIONS)[number];

const INTENT_ICONS: Record<ContactIntent, LucideIcon> = {
  "Start or structure a business": Building2,
  "Prepare for funding": ClipboardCheck,
  "Explore funding options": Banknote,
  "Get help with operations or systems": Settings2,
  "Partnerships or collaboration": Handshake,
  "Something else": CircleHelp,
};

const STAGE_ICONS: Record<StageOption, LucideIcon> = {
  "Just getting started": Sparkles,
  "Early stage / figuring things out": Compass,
  "Operating but not structured": Layers,
  "Looking for funding": CircleDollarSign,
  "Already applied/denied": FileWarning,
  "Scaling or expanding": TrendingUp,
};

const REFERRAL_ICONS: Record<ReferralOption, LucideIcon> = {
  Search,
  Social: Share2,
  Referral: Users,
  "Event or content": CalendarDays,
  Email: Mail,
  Other: CircleEllipsis,
};

const REVENUE_RANGE_OPTIONS = [
  { value: "", label: "Prefer not to say" },
  { value: "under_100k", label: "Under $100k" },
  { value: "100k_500k", label: "$100k–$500k" },
  { value: "500k_2m", label: "$500k–$2M" },
  { value: "2m_10m", label: "$2M–$10M" },
  { value: "10m_plus", label: "$10M+" },
] as const;

const INDUSTRY_OPTIONS = [
  { value: "", label: "Select industry" },
  { value: "professional_services", label: "Professional services" },
  { value: "technology_saas", label: "Technology / SaaS" },
  { value: "retail_ecommerce", label: "Retail / eCommerce" },
  { value: "healthcare", label: "Healthcare" },
  { value: "construction_trades", label: "Construction / trades" },
  { value: "food_hospitality", label: "Food & hospitality" },
  { value: "real_estate", label: "Real estate" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "media_creative", label: "Media / creative" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "financial_services", label: "Financial services" },
  { value: "transportation_logistics", label: "Transportation / logistics" },
  { value: "agriculture", label: "Agriculture" },
  { value: "other", label: "Other" },
] as const;

const US_STATE_OPTIONS = [
  { value: "", label: "Select state" },
  { value: "AL", label: "AL" }, { value: "AK", label: "AK" }, { value: "AZ", label: "AZ" }, { value: "AR", label: "AR" },
  { value: "CA", label: "CA" }, { value: "CO", label: "CO" }, { value: "CT", label: "CT" }, { value: "DE", label: "DE" },
  { value: "FL", label: "FL" }, { value: "GA", label: "GA" }, { value: "HI", label: "HI" }, { value: "ID", label: "ID" },
  { value: "IL", label: "IL" }, { value: "IN", label: "IN" }, { value: "IA", label: "IA" }, { value: "KS", label: "KS" },
  { value: "KY", label: "KY" }, { value: "LA", label: "LA" }, { value: "ME", label: "ME" }, { value: "MD", label: "MD" },
  { value: "MA", label: "MA" }, { value: "MI", label: "MI" }, { value: "MN", label: "MN" }, { value: "MS", label: "MS" },
  { value: "MO", label: "MO" }, { value: "MT", label: "MT" }, { value: "NE", label: "NE" }, { value: "NV", label: "NV" },
  { value: "NH", label: "NH" }, { value: "NJ", label: "NJ" }, { value: "NM", label: "NM" }, { value: "NY", label: "NY" },
  { value: "NC", label: "NC" }, { value: "ND", label: "ND" }, { value: "OH", label: "OH" }, { value: "OK", label: "OK" },
  { value: "OR", label: "OR" }, { value: "PA", label: "PA" }, { value: "RI", label: "RI" }, { value: "SC", label: "SC" },
  { value: "SD", label: "SD" }, { value: "TN", label: "TN" }, { value: "TX", label: "TX" }, { value: "UT", label: "UT" },
  { value: "VT", label: "VT" }, { value: "VA", label: "VA" }, { value: "WA", label: "WA" }, { value: "WV", label: "WV" },
  { value: "WI", label: "WI" }, { value: "WY", label: "WY" }, { value: "DC", label: "DC" },
] as const;

const selectClass =
  "w-full rounded-lg border border-ori-border bg-ori-charcoal px-3 py-2.5 text-sm text-ori-foreground focus:border-ori-accent focus:outline-none focus:ring-1 focus:ring-ori-accent";

const chipGroupClass = "flex flex-wrap gap-2";

const chipBase =
  "rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-colors min-h-[2.85rem] flex items-center gap-2.5 motion-reduce:transition-none";
const chipSelected =
  "border-ori-accent bg-ori-glow text-ori-accent shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-ori-accent)_35%,transparent)]";
const chipIdle =
  "border-ori-border bg-ori-charcoal/80 text-ori-foreground hover:border-ori-muted hover:bg-ori-surface-panel/60";

const cardShell =
  "rounded-2xl border border-ori-border bg-ori-surface-panel/70 p-6 shadow-sm ring-1 ring-white/[0.04] md:p-7";

function SelectField({
  id,
  label,
  hint,
  value,
  onChange,
  required,
  "aria-required": ariaRequired,
  options,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  "aria-required"?: boolean;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ori-text-primary" htmlFor={id}>
        {label}
      </label>
      {hint ? <p className="mb-2 text-xs text-ori-muted">{hint}</p> : null}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${selectClass} appearance-none pr-10`}
          required={required}
          aria-required={ariaRequired}
        >
          {options.map((o) => (
            <option key={o.value || "unset"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ori-muted"
          aria-hidden
          strokeWidth={2}
        />
      </div>
    </div>
  );
}

function FormStepCard({
  step,
  title,
  subtitle,
  icon: Icon,
  className = "",
  children,
}: {
  step: number;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`${cardShell} ${className}`.trim()}
      aria-labelledby={`contact-step-${step}-title`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ori-accent/35 bg-ori-accent/10 text-xs font-bold text-ori-accent">
            {step}
          </span>
          <div className="min-w-0 flex-1">
            <h2
              id={`contact-step-${step}-title`}
              className="font-display text-lg font-semibold tracking-tight text-ori-text-primary md:text-xl"
            >
              {title}
            </h2>
            {subtitle ? <p className="mt-2 max-w-prose text-sm leading-relaxed text-ori-muted">{subtitle}</p> : null}
          </div>
        </div>
        <div
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-ori-accent/25 bg-ori-accent/[0.08]"
          aria-hidden
        >
          <Icon className="h-5 w-5 text-ori-accent" strokeWidth={1.6} />
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function ContactRoutingAside() {
  const accent = CONSULTING_IMAGE_SET[0];
  const pillars = [
    { label: "Consulting", hint: "Strategy, structure, and clarity" },
    { label: "Tools", hint: "Systems, compliance, and operations" },
    { label: "Capital", hint: "Funding paths when you’re ready" },
  ] as const;

  return (
    <aside className="hidden lg:block lg:col-span-4" aria-label="How Ori routes inquiries">
      <div className="sticky top-24 space-y-6">
        <div className="overflow-hidden rounded-2xl border border-ori-border bg-ori-charcoal ring-1 ring-white/[0.04]">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <img src={accent.src} alt={accent.alt} className="h-full w-full object-cover" loading="lazy" />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ori-black/85 via-ori-black/25 to-transparent"
              aria-hidden
            />
          </div>
          <ul className="divide-y divide-ori-border/80 border-t border-ori-border bg-ori-surface-panel/40 p-1">
            {pillars.map((p) => (
              <li key={p.label} className="flex gap-3 px-4 py-3.5">
                <span
                  className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-ori-accent shadow-[0_0_12px_color-mix(in_srgb,var(--color-ori-accent)_45%,transparent)]"
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-semibold text-ori-text-primary">{p.label}</p>
                  <p className="mt-0.5 text-xs text-ori-muted">{p.hint}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

function MobileRoutingStrip() {
  return (
    <div
      className={`mb-8 ${cardShell} lg:hidden`}
      role="note"
      aria-label="How inquiries are routed across Ori"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-ori-accent">How routing works</p>
      <p className="mt-2 text-sm text-ori-muted">
        Your answers map to <span className="text-ori-text-primary">Consulting</span>, then{" "}
        <span className="text-ori-text-primary">Tools</span>, then{" "}
        <span className="text-ori-text-primary">Capital</span>—in that order—so follow-up matches what you need.
      </p>
    </div>
  );
}

function matchIntentFromParam(param: string | null): ContactIntent | null {
  if (!param) return null;
  const raw = param.trim();
  if (!raw) return null;
  const p = raw.toLowerCase().replace(/\+/g, " ");
  const bySlug: Record<string, ContactIntent> = {
    start: CONTACT_INTENTS[0],
    start_structure: CONTACT_INTENTS[0],
    structure: CONTACT_INTENTS[0],
    business: CONTACT_INTENTS[0],
    prepare_funding: CONTACT_INTENTS[1],
    readiness: CONTACT_INTENTS[1],
    explore_funding: CONTACT_INTENTS[2],
    funding: CONTACT_INTENTS[2],
    operations: CONTACT_INTENTS[3],
    systems: CONTACT_INTENTS[3],
    management: CONTACT_INTENTS[3],
    partnerships: CONTACT_INTENTS[4],
    collaboration: CONTACT_INTENTS[4],
    other: CONTACT_INTENTS[5],
  };
  if (bySlug[p]) return bySlug[p];
  const full = CONTACT_INTENTS.find((i) => i.toLowerCase() === p);
  return full ?? null;
}

function readSessionPriorRoute(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(CONTACT_ATTRIBUTION_PRIOR_ROUTE_KEY);
  } catch {
    return null;
  }
}

type ContactLocationState = {
  sourcePage?: string;
  from?: string;
  entryCta?: string;
};

export function ContactPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const intentParamInitial =
    searchParams.get("intent")?.trim() || searchParams.get("topic")?.trim() || null;

  const [intent, setIntent] = useState<ContactIntent | null>(() => matchIntentFromParam(intentParamInitial));
  const [intentPreselectedSnapshot] = useState<string | null>(() => intentParamInitial);

  const [stage, setStage] = useState<StageOption | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [revenueRange, setRevenueRange] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [message, setMessage] = useState("");
  const [referralSource, setReferralSource] = useState<ReferralOption | null>(null);
  const [referralOtherDetail, setReferralOtherDetail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const referralCode = useMemo(
    () =>
      resolveCheckoutReferralCode({
        ref: searchParams.get("ref"),
        referral: searchParams.get("referral"),
      }),
    [searchParams]
  );
  const [referrerPartnerName, setReferrerPartnerName] = useState("");

  useEffect(() => {
    if (!referralCode) {
      setReferrerPartnerName("");
      return;
    }
    let cancelled = false;
    void fetchReferralPartnerByCode(referralCode).then((p) => {
      if (!cancelled) setReferrerPartnerName(p?.displayName?.trim() || "");
    });
    return () => {
      cancelled = true;
    };
  }, [referralCode]);

  function toggleIntent(next: ContactIntent) {
    setIntent((prev) => (prev === next ? null : next));
    setFormError(null);
  }

  function toggleStage(next: StageOption) {
    setStage((prev) => (prev === next ? null : next));
    setFormError(null);
  }

  function selectReferral(option: ReferralOption) {
    setReferralSource(option);
    if (option !== "Other") setReferralOtherDetail("");
    setFormError(null);
  }

  function resolveAttribution(): Record<string, string | null> {
    const state = (location.state || null) as ContactLocationState | null;
    const fromParam = (searchParams.get("from") || searchParams.get("source_page") || "").trim();
    const fromState = (state?.sourcePage || state?.from || "").trim();
    const sessionPrior = (readSessionPriorRoute() || "").trim();
    const refUrl = typeof document !== "undefined" ? document.referrer.trim() : "";

    const source_page =
      fromParam ||
      (fromState.startsWith("/") ? fromState : "") ||
      sessionPrior ||
      refUrl ||
      null;

    const entry_cta =
      (searchParams.get("entry_cta") || searchParams.get("cta") || state?.entryCta || "").trim() || null;

    const utm_source = (searchParams.get("utm_source") || "").trim() || null;
    const utm_campaign = (searchParams.get("utm_campaign") || "").trim() || null;

    return {
      source_page,
      entry_cta,
      intent_preselected: intentPreselectedSnapshot,
      referrer_partner: referrerPartnerName || referralCode || null,
      utm_source,
      utm_campaign,
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!intent) {
      setFormError("Choose what you’re trying to do so we can route your inquiry.");
      return;
    }
    if (!stage) {
      setFormError("Tell us where you are right now.");
      return;
    }
    if (!message.trim()) {
      setFormError("Add a short note so we can respond with the right next step.");
      return;
    }
    if (!referralSource) {
      setFormError("Tell us how you found Ori.");
      return;
    }
    if (referralSource === "Other" && !referralOtherDetail.trim()) {
      setFormError("Please add a brief detail for “Other.”");
      return;
    }

    const surveySnapshot = getLastReadinessSurveySnapshot();
    const attr = resolveAttribution();

    const inferredSubjectType: "individual" | "business" =
      businessName.trim() || industry.trim() || revenueRange.trim() ? "business" : "individual";

    setSubmitting(true);
    const ok = await submitContactIntake({
      name: `${firstName.trim()} ${lastName.trim()}`.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      state: stateRegion.trim(),
      city_state: [city.trim(), stateRegion.trim()].filter(Boolean).join(", "),
      companyName: businessName.trim(),
      message: message.trim(),
      quickReason: intent,
      stage,
      subjectType: inferredSubjectType,
      industry: industry.trim(),
      revenueRange: revenueRange.trim(),
      referralSource,
      referralOtherDetail: referralSource === "Other" ? referralOtherDetail.trim() : "",
      surveySnapshot,
      ...(referralCode ? { referralCode, ref: referralCode } : {}),
      source_page: attr.source_page,
      entry_cta: attr.entry_cta,
      intent_preselected: attr.intent_preselected,
      referrer_partner: attr.referrer_partner,
      utm_source: attr.utm_source,
      utm_campaign: attr.utm_campaign,
    });
    setSubmitting(false);
    if (!ok) {
      setFormError("We could not save your message. Please try again or email us directly.");
      return;
    }
    setSubmitted(true);
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
        <div className="pointer-events-none absolute inset-0 bg-ori-black/78 md:bg-ori-black/72" aria-hidden />
        <div className="pointer-events-none absolute inset-0" style={contactHeroMeshStyle} aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.32]"
          style={{
            backgroundImage:
              "linear-gradient(to right, color-mix(in srgb, var(--color-ori-foreground) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-ori-foreground) 6%, transparent) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
          aria-hidden
        />
        <PageSection variant="loose" className="relative z-[1] bg-transparent">
          <div className="max-w-3xl text-center md:text-left">
            <h1 className="font-display text-3xl font-bold tracking-tight text-ori-foreground md:text-4xl">
              Start the conversation
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ori-foreground/85">
              Whether you’re building, preparing for funding, or figuring out what’s next—tell us where you are, and
              we’ll point you in the right direction.
            </p>
          </div>
        </PageSection>
      </section>

      <PageSection
        variant="loose"
        className="relative border-b border-ori-border bg-ori-surface-base section-divider"
      >
        <div
          className="pointer-events-none absolute -right-12 top-0 h-72 w-72 rounded-full gradient-orb-accent opacity-[0.42] motion-reduce:opacity-25 md:right-[6%]"
          aria-hidden
        />
        <div>
          {submitted ? (
            <div
              className={`mx-auto max-w-lg text-center ${cardShell}`}
              role="status"
              aria-live="polite"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-ori-accent/40 bg-ori-accent/10">
                <CheckCircle2 className="h-7 w-7 text-ori-accent" strokeWidth={1.75} aria-hidden />
              </div>
              <p className="mt-6 font-display text-xl font-semibold text-ori-text-primary">
                Thanks for reaching out.
              </p>
              <p className="mt-3 text-sm text-ori-muted">We&apos;ll review your note and follow up shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="space-y-8 lg:col-span-8">
                <MobileRoutingStrip />

                <SectionHeading
                  align="left"
                  className="!mb-6 md:!mb-8"
                  title="Shape your request"
                  subtitle="Five quick steps. Your answers route the right team—consulting first, then management as the operational spine, then capital when it fits."
                  subtitleClassName="max-w-2xl text-pretty"
                />
                <FormStepCard
                  step={1}
                  icon={Route}
                  title="What are you trying to do?"
                  subtitle="Pick the closest match—we use this to route your inquiry across consulting, management, and capital."
                >
                  <div className={chipGroupClass} role="group" aria-label="Contact intent">
                    {CONTACT_INTENTS.map((label) => {
                      const selected = intent === label;
                      const Icon = INTENT_ICONS[label];
                      return (
                        <button
                          key={label}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => toggleIntent(label)}
                          className={`${chipBase} ${selected ? chipSelected : chipIdle}`}
                        >
                          <Icon
                            className={`h-4 w-4 shrink-0 ${selected ? "text-ori-accent" : "text-ori-accent/70"}`}
                            aria-hidden
                            strokeWidth={1.75}
                          />
                          <span className="text-pretty">{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </FormStepCard>

                <FormStepCard
                  step={2}
                  icon={MapPinned}
                  title="Where are you right now?"
                  subtitle="Lifecycle context helps us follow up with the right playbook."
                >
                  <div className={chipGroupClass} role="group" aria-label="Business stage">
                    {STAGE_OPTIONS.map((label) => {
                      const selected = stage === label;
                      const Icon = STAGE_ICONS[label];
                      return (
                        <button
                          key={label}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => toggleStage(label)}
                          className={`${chipBase} ${selected ? chipSelected : chipIdle}`}
                        >
                          <Icon
                            className={`h-4 w-4 shrink-0 ${selected ? "text-ori-accent" : "text-ori-accent/70"}`}
                            aria-hidden
                            strokeWidth={1.75}
                          />
                          <span className="text-pretty">{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </FormStepCard>

                <FormStepCard step={3} icon={IdCard} title="Contact" subtitle="How we should reach you.">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="First name"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                    />
                    <Input
                      label="Last name"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="family-name"
                    />
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                      placeholder="Optional"
                    />
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Input
                      label="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      autoComplete="address-level2"
                      placeholder="Optional"
                    />
                    <SelectField
                      id="contact-state"
                      label="State"
                      value={stateRegion}
                      onChange={(v) => setStateRegion(v)}
                      options={US_STATE_OPTIONS}
                    />
                  </div>
                </FormStepCard>

                <FormStepCard
                  step={4}
                  icon={Building2}
                  title="About"
                  subtitle="Tell us about you and your business if applicable."
                >
                  <Input
                    label="Business name (optional)"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    autoComplete="organization"
                    placeholder="If you have one"
                  />

                  <div className="mt-6 grid gap-6 md:grid-cols-2 md:gap-5">
                    <SelectField
                      id="contact-industry"
                      label="Industry"
                      hint="Optional—helps us match you with the right specialists."
                      value={industry}
                      onChange={(v) => {
                        setIndustry(v);
                        setFormError(null);
                      }}
                      options={INDUSTRY_OPTIONS}
                    />
                    <SelectField
                      id="contact-revenue"
                      label="Revenue range"
                      hint="Optional—useful when exploring funding or scale paths."
                      value={revenueRange}
                      onChange={(v) => setRevenueRange(v)}
                      options={REVENUE_RANGE_OPTIONS}
                    />
                  </div>
                </FormStepCard>

                <FormStepCard
                  step={5}
                  icon={MessageSquareMore}
                  title="Notes"
                  subtitle="A short message plus attribution helps us respond with the right next step."
                  className="mt-10"
                >
                  <Textarea
                    label="Tell us a bit more so we can respond with the right next step."
                    required
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      setFormError(null);
                    }}
                    placeholder="What are you trying to do, and where are you getting stuck?"
                  />

                  <div className="mt-8">
                    <p className="mb-1 block text-sm font-medium text-ori-text-primary">How did you find us?</p>
                    <p className="mb-3 text-xs text-ori-muted">Helps us understand what&apos;s working.</p>
                    <div className={chipGroupClass} role="radiogroup" aria-label="How did you find Ori">
                      {REFERRAL_OPTIONS.map((option) => {
                        const selected = referralSource === option;
                        const Icon = REFERRAL_ICONS[option];
                        return (
                          <button
                            key={option}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => selectReferral(option)}
                            className={`${chipBase} ${selected ? chipSelected : chipIdle}`}
                          >
                            <Icon
                              className={`h-4 w-4 shrink-0 ${selected ? "text-ori-accent" : "text-ori-accent/70"}`}
                              aria-hidden
                              strokeWidth={1.75}
                            />
                            {option}
                          </button>
                        );
                      })}
                    </div>
                    {referralSource === "Other" ? (
                      <div className="mt-4">
                        <Input
                          label="Please specify"
                          value={referralOtherDetail}
                          onChange={(e) => {
                            setReferralOtherDetail(e.target.value);
                            setFormError(null);
                          }}
                          placeholder="Brief detail"
                          autoComplete="off"
                        />
                      </div>
                    ) : null}
                  </div>

                  {formError && (
                    <p className="mt-6 text-sm text-red-400" role="alert">
                      {formError}
                    </p>
                  )}

                  <div className="mt-8 flex flex-col gap-4 border-t border-ori-border/80 pt-8 sm:flex-row sm:items-center sm:justify-between">
                    <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
                      {submitting ? "Submitting…" : "Submit inquiry"}
                    </Button>
                  </div>
                </FormStepCard>
              </div>

              <ContactRoutingAside />
            </form>
          )}
        </div>
      </PageSection>
    </>
  );
}
