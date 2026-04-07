import type { PartnerRecord } from "./types";

/** Full list for admin and server validation (includes legacy types). */
export const PARTNER_TYPES: { value: PartnerRecord["type"]; label: string }[] = [
  { value: "ACCELERATOR_INCUBATOR", label: "Accelerator / Incubator" },
  { value: "BUSINESS_CONSULTANT_COACH", label: "Business Consultant / Coach" },
  { value: "ACCOUNTANT_BOOKKEEPER", label: "Accountant / CPA / Bookkeeper" },
  { value: "ATTORNEY", label: "Attorney (Business / Startup)" },
  { value: "BANK_LENDER", label: "Lender / Bank / Credit Union" },
  { value: "INVESTOR_VC_ANGEL", label: "Investor / VC / Angel" },
  { value: "ECONOMIC_DEV_NONPROFIT", label: "Economic Development / Nonprofit" },
  { value: "COWORKING_OPERATOR", label: "Coworking / Community Operator" },
  { value: "AGENCY_SERVICE_PROVIDER", label: "Agency / Service Provider" },
  { value: "OTHER", label: "Other" },
  { value: "ENTREPRENEUR_CENTER", label: "Entrepreneur center (legacy)" },
  { value: "COMMUNITY_ORG", label: "Community org (legacy)" },
  { value: "AFFILIATE", label: "Affiliate (legacy)" },
  { value: "INTERNAL_MANUAL", label: "Internal / manual" },
];

export const PARTNER_TYPE_VALUES = PARTNER_TYPES.map((t) => t.value);

export const COMMISSION_PCT_OPTIONS = Array.from({ length: 51 }, (_, i) => ({
  value: i / 100,
  label: `${i}%`,
}));
