import type { PartnerIntakePayload, PartnerType } from "../backoffice/types";

/** Public registration: partner category (maps to PartnerType). */
export const PARTNER_INTAKE_TYPE_OPTIONS: {
  value: PartnerType;
  label: string;
  hint?: string;
}[] = [
  {
    value: "ACCELERATOR_INCUBATOR",
    label: "Accelerator / Incubator",
    hint: "Cohort programs, incubators, and startup accelerators.",
  },
  {
    value: "BUSINESS_CONSULTANT_COACH",
    label: "Business Consultant / Coach",
    hint: "Advisory and coaching practices serving operators.",
  },
  {
    value: "ACCOUNTANT_BOOKKEEPER",
    label: "Accountant / CPA / Bookkeeper",
    hint: "Tax, accounting, and bookkeeping firms.",
  },
  {
    value: "ATTORNEY",
    label: "Attorney / Legal Advisor",
    hint: "Business, corporate, or startup legal practices.",
  },
  {
    value: "BANK_LENDER",
    label: "Lender / Bank / Credit Union",
    hint: "Institutional or alternative lending relationships.",
  },
  {
    value: "INVESTOR_VC_ANGEL",
    label: "Investor / Angel Network",
    hint: "Funds, angels, and investment groups.",
  },
  {
    value: "ECONOMIC_DEV_NONPROFIT",
    label: "Economic Development / Nonprofit",
    hint: "EDOs, chambers, and mission-driven organizations.",
  },
  {
    value: "COWORKING_OPERATOR",
    label: "Real Estate Broker / Business Broker",
    hint: "Brokers and real-estate partners supporting business transactions.",
  },
  {
    value: "AGENCY_SERVICE_PROVIDER",
    label: "Agency / Service Provider",
    hint: "Marketing, ops, or professional services at scale.",
  },
  { value: "OTHER", label: "Other", hint: "Describe in the notes if helpful." },
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
  { value: "STARTUPS", label: "Startups" },
  { value: "EARLY_STAGE_BUSINESSES", label: "Early-stage businesses" },
  { value: "SMALL_BUSINESSES", label: "Small businesses" },
  { value: "GROWTH_STAGE_COMPANIES", label: "Growth-stage companies" },
  { value: "INVESTORS_OPERATORS", label: "Investors / operators" },
  { value: "MIXED_CLIENT_BASE", label: "Mixed client base" },
] as const;

export const FUNDING_NEED_OPTIONS = [
  { value: "FREQUENTLY", label: "Frequently" },
  { value: "OCCASIONALLY", label: "Occasionally" },
  { value: "RARELY", label: "Rarely" },
  { value: "NOT_SURE", label: "Not sure" },
] as const;

export const PARTNERSHIP_INTEREST_OPTIONS = [
  { value: "REFERRING_CLIENTS", label: "Referring clients to Ori" },
  { value: "NETWORK_RESOURCE", label: "Offering Ori as a resource to my network" },
  { value: "STRATEGIC_PARTNERSHIP", label: "Exploring a strategic partnership" },
  { value: "LEARNING_MORE", label: "Learning more about how Ori works" },
  { value: "OTHER", label: "Other" },
] as const;

export const ESTIMATED_REFERRALS_OPTIONS = [
  { value: "1_5", label: "1-5" },
  { value: "5_10", label: "5-10" },
  { value: "10_25", label: "10-25" },
  { value: "25_PLUS", label: "25+" },
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
  const role = String(o.roleTitle || "").trim();
  const notes = String(o.additionalNotes || "").trim();
  const out: PartnerIntakePayload = {};
  if (role) out.roleTitle = role.slice(0, 200);
  if (segments.length) out.clientSegments = segments.slice(0, 20);
  if (funding) out.fundingNeedFrequency = funding.slice(0, 80);
  if (interest) out.partnershipInterest = interest.slice(0, 80);
  if (estimatedReferrals) out.estimatedReferralsPerMonth = estimatedReferrals.slice(0, 80);
  if (notes) out.additionalNotes = notes.slice(0, 4000);
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
      `Estimated referrals/month: ${
        REFERRALS_LABEL.get(i.estimatedReferralsPerMonth) || i.estimatedReferralsPerMonth
      }`
    );
  }
  if (i.additionalNotes) parts.push(`Notes: ${i.additionalNotes}`);
  return parts.join(" · ");
}
