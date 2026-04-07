/**
 * Funding Readiness Survey — answer and result types.
 * Used by client scoring and server verification (shared contract).
 */

/** Step 1 — Business stage */
export type RevenueStatus = "Yes" | "Pre-revenue";
export type TimeInBusiness =
  | "Not launched"
  | "<6 months"
  | "6–12 months"
  | "1–2 years"
  | "2+ years";
export type MonthlyRevenue =
  | "$0"
  | "$1–10k"
  | "$10–50k"
  | "$50–250k"
  | "$250k+";
export type RevenueConsistency =
  | "Consistent"
  | "Seasonal"
  | "Highly inconsistent"
  | "None";

/** Step 2 — Credit profile */
export type CreditRange =
  | "750+"
  | "700–749"
  | "650–699"
  | "600–649"
  | "Below 600"
  | "Unsure";
export type Delinquencies12mo = "No" | "Yes";
export type Utilization = "<30%" | "30–60%" | ">60%" | "Unsure";

/** Step 3 — Debt & risk */
export type BusinessDebt = "None" | "Light" | "Moderate" | "Heavy";
export type ObligationsCover = "Yes" | "Barely" | "No";
export type CollateralOption = "Equipment" | "Receivables" | "Inventory" | "None";

/** Step 4 — Structure */
export type RegisteredGoodStanding = "Yes" | "In progress" | "No";
export type EinAndBank = "Yes" | "Partial" | "No";
export type BusinessCreditFile = "Yes" | "Minimal" | "No" | "Not sure";
export type FinancialsReady =
  | "Yes (P&L + balance sheet)"
  | "Somewhat"
  | "No";

/** Step 5 — Capital intent */
export type FundingPurpose =
  | "Working capital"
  | "Inventory"
  | "Equipment"
  | "Hiring"
  | "Expansion"
  | "Refinance"
  | "Unsure";
export type Amount = "< $25k" | "$25–100k" | "$100–500k" | "$500k+";
export type OpenToEquity = "Yes" | "Maybe" | "No";

export interface ReadinessAnswers {
  revenue_status?: RevenueStatus;
  time_in_business?: TimeInBusiness;
  monthly_revenue?: MonthlyRevenue;
  revenue_consistency?: RevenueConsistency;
  credit_range?: CreditRange;
  delinquencies_12mo?: Delinquencies12mo;
  utilization?: Utilization;
  business_debt?: BusinessDebt;
  obligations_cover?: ObligationsCover;
  collateral?: CollateralOption[];
  registered_good_standing?: RegisteredGoodStanding;
  ein_and_bank?: EinAndBank;
  business_credit_file?: BusinessCreditFile;
  financials_ready?: FinancialsReady;
  funding_purpose?: FundingPurpose;
  amount?: Amount;
  open_to_equity?: OpenToEquity;
}

export type ReadinessTier =
  | "Strong Candidate"
  | "Funding-Ready"
  | "Emerging"
  | "Foundation"
  | "Early Stage";

export type ReadinessZone =
  | "Equity / Grants / Competitions"
  | "Traditional Lending"
  | "Hybrid / Revenue-Based"
  | "Smaller Facilities / Short-Term"
  | "Funding Readiness Path";

export interface ReadinessSignals {
  strengths: [string, string, string];
  improvements: [string, string, string];
}

export interface ReadinessResult {
  score: number;
  tier: ReadinessTier;
  zone: ReadinessZone;
  signals: ReadinessSignals;
  confidencePenalty: number;
  overridesApplied: string[];
}

/** Verified result from server (same shape + assessmentId when persisted) */
export interface VerifiedReadinessResult extends ReadinessResult {
  assessmentId?: string;
}
