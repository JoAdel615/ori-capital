import type { PartnerIntakePayload, PartnerType } from "../backoffice/types";

/** Public registration: partner category (maps to PartnerType). */
export const PARTNER_INTAKE_TYPE_OPTIONS: {
  value: PartnerType;
  label: string;
  hint?: string;
}[] = [
  {
    value: "ACCELERATOR_INCUBATOR",
    label: "Accelerators & Incubators",
    hint: "Cohort programs, incubators, and startup accelerators.",
  },
  {
    value: "INVESTOR_VC_ANGEL",
    label: "Investors & Angel Networks",
    hint: "Funds, angels, and investment groups.",
  },
  {
    value: "ACCOUNTANT_BOOKKEEPER",
    label: "CPAs, Accountants & Bookkeepers",
    hint: "Tax, accounting, and bookkeeping firms.",
  },
  {
    value: "ATTORNEY",
    label: "Attorneys & Advisors",
    hint: "Business, corporate, or startup legal practices.",
  },
  {
    value: "BUSINESS_CONSULTANT_COACH",
    label: "Consultants & Coaches",
    hint: "Advisory and coaching practices serving operators.",
  },
  {
    value: "COWORKING_OPERATOR",
    label: "Real Estate & Business Brokers",
    hint: "Brokers and real-estate partners supporting business transactions.",
  },
  {
    value: "ECONOMIC_DEV_NONPROFIT",
    label: "Economic Development Organizations",
    hint: "EDOs, chambers, and mission-driven organizations.",
  },
  {
    value: "AGENCY_SERVICE_PROVIDER",
    label: "Agencies & Service Providers",
    hint: "Marketing, ops, or professional services at scale.",
  },
  { value: "OTHER", label: "Other", hint: "Describe in notes if needed." },
];

export const ROLE_TITLE_OPTIONS = [
  { value: "Founder", label: "Founder" },
  { value: "Partner", label: "Partner" },
  { value: "Advisor", label: "Advisor" },
  { value: "Director", label: "Director" },
  { value: "Manager", label: "Manager" },
  { value: "OTHER", label: "Other" },
] as const;

export const CLIENT_SEGMENT_OPTIONS = [
  { value: "STARTUPS", label: "Founders (pre-launch)" },
  { value: "EARLY_STAGE_BUSINESSES", label: "Early-stage businesses" },
  { value: "SMALL_BUSINESSES", label: "Operating small businesses" },
  { value: "GROWTH_STAGE_COMPANIES", label: "Growth-stage companies" },
  { value: "INVESTORS_OPERATORS", label: "Investors / operators" },
  { value: "MIXED_CLIENT_BASE", label: "Mixed" },
] as const;

export const FUNDING_NEED_OPTIONS = [
  { value: "FREQUENTLY", label: "Frequently" },
  { value: "OCCASIONALLY", label: "Occasionally" },
  { value: "RARELY", label: "Rarely" },
  { value: "NOT_SURE", label: "Not sure" },
] as const;

export const PARTNERSHIP_INTEREST_OPTIONS = [
  { value: "REFERRING_CLIENTS", label: "Refer clients for funding readiness" },
  { value: "EXTEND_SERVICES_WITH_PLATFORM", label: "Extend my services with Ori's platform" },
  { value: "COLLABORATE_ON_CLIENT_DELIVERY", label: "Collaborate on client delivery" },
  { value: "PROGRAM_OR_PORTFOLIO_OFFERING", label: "Offer Ori as part of my program or portfolio" },
  { value: "REVENUE_SHARING_OPPORTUNITIES", label: "Explore revenue-sharing opportunities" },
  { value: "NOT_SURE_YET", label: "Not sure yet" },
] as const;

export const ESTIMATED_REFERRALS_OPTIONS = [
  { value: "OCCASIONALLY", label: "Occasionally" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "FREQUENTLY", label: "Frequently" },
  { value: "CORE_TO_OUR_WORK", label: "Core to what we do" },
] as const;

const SEGMENT_LABEL = new Map<string, string>(CLIENT_SEGMENT_OPTIONS.map((o) => [o.value, o.label]));
const FUNDING_LABEL = new Map<string, string>(FUNDING_NEED_OPTIONS.map((o) => [o.value, o.label]));
const INTEREST_LABEL = new Map<string, string>(PARTNERSHIP_INTEREST_OPTIONS.map((o) => [o.value, o.label]));
const REFERRALS_LABEL = new Map<string, string>(ESTIMATED_REFERRALS_OPTIONS.map((o) => [o.value, o.label]));

export function parsePartnerIntakePayload(raw: unknown): PartnerIntakePayload | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as Record<string, unknown>;
  const segments = Array.isArray(o.clientSegments)
    ? o.clientSegments.map((x) => String(x).trim()).filter(Boolean)
    : [];
  const funding = String(o.fundingNeedFrequency || "").trim();
  const interest = String(o.partnershipInterest || "").trim();
  const estimatedReferrals = String(o.estimatedReferralsPerMonth || "").trim();
  const currentClientGap = String(o.currentClientGap || "").trim();
  const role = String(o.roleTitle || "").trim();
  const notes = String(o.additionalNotes || "").trim();
  const sourcePage = String(o.source_page || "").trim();
  const entryCta = String(o.entry_cta || "").trim();
  const partnerTypePreselected = String(o.partner_type_preselected || "").trim();
  const utmSource = String(o.utm_source || "").trim();
  const utmCampaign = String(o.utm_campaign || "").trim();
  const referralPartner = String(o.referral_partner || "").trim();
  const out: PartnerIntakePayload = {};
  if (role) out.roleTitle = role.slice(0, 200);
  if (segments.length) out.clientSegments = segments.slice(0, 20);
  if (funding) out.fundingNeedFrequency = funding.slice(0, 80);
  if (interest) out.partnershipInterest = interest.slice(0, 80);
  if (estimatedReferrals) out.estimatedReferralsPerMonth = estimatedReferrals.slice(0, 80);
  if (currentClientGap) out.currentClientGap = currentClientGap.slice(0, 1000);
  if (notes) out.additionalNotes = notes.slice(0, 4000);
  if (sourcePage) out.source_page = sourcePage.slice(0, 200);
  if (entryCta) out.entry_cta = entryCta.slice(0, 120);
  if (partnerTypePreselected) out.partner_type_preselected = partnerTypePreselected.slice(0, 120);
  if (utmSource) out.utm_source = utmSource.slice(0, 120);
  if (utmCampaign) out.utm_campaign = utmCampaign.slice(0, 160);
  if (referralPartner) out.referral_partner = referralPartner.slice(0, 200);
  return Object.keys(out).length ? out : undefined;
}

export function validatePartnerIntakeRequired(
  intake: PartnerIntakePayload | undefined
): { ok: true } | { ok: false; error: string } {
  if (!intake?.clientSegments?.length) {
    return { ok: false, error: "Select at least one option for who you typically work with." };
  }
  if (!intake.partnershipInterest) {
    return { ok: false, error: "Please describe your interest in partnering with Ori." };
  }
  return { ok: true };
}

export function formatPartnerIntakeSummary(i: PartnerIntakePayload | undefined): string {
  if (!i) return "";
  const parts: string[] = [];
  if (i.roleTitle) parts.push(`Role: ${i.roleTitle}`);
  if (i.clientSegments?.length) {
    const labs = i.clientSegments.map((s) => SEGMENT_LABEL.get(s) || s);
    parts.push(`Audiences: ${labs.join("; ")}`);
  }
  if (i.fundingNeedFrequency) {
    parts.push(`Funding need: ${FUNDING_LABEL.get(i.fundingNeedFrequency) || i.fundingNeedFrequency}`);
  }
  if (i.partnershipInterest) {
    parts.push(`Interest: ${INTEREST_LABEL.get(i.partnershipInterest) || i.partnershipInterest}`);
  }
  if (i.estimatedReferralsPerMonth) {
    parts.push(
      `How often this comes up: ${
        REFERRALS_LABEL.get(i.estimatedReferralsPerMonth) || i.estimatedReferralsPerMonth
      }`
    );
  }
  if (i.currentClientGap) parts.push(`Where clients get stuck: ${i.currentClientGap}`);
  if (i.additionalNotes) parts.push(`Notes: ${i.additionalNotes}`);
  return parts.join(" · ");
}
