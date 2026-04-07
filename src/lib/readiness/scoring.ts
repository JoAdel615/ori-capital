/**
 * Funding Readiness Index™ scoring engine.
 * Client uses this for instant provisional score; server MUST recompute with same logic as source of truth.
 */

import type {
  ReadinessAnswers,
  ReadinessResult,
  ReadinessTier,
  ReadinessZone,
  ReadinessSignals,
} from "./types";

const TIER_BOUNDS: { min: number; tier: ReadinessTier }[] = [
  { min: 80, tier: "Strong Candidate" },
  { min: 65, tier: "Funding-Ready" },
  { min: 50, tier: "Emerging" },
  { min: 35, tier: "Foundation" },
  { min: 0, tier: "Early Stage" },
];

function getTier(score: number): ReadinessTier {
  const entry = TIER_BOUNDS.find((b) => score >= b.min);
  return entry ? entry.tier : "Early Stage";
}

/** Credit range to numeric max for comparison (750+ = 750, 700-749 = 700, etc.; Below 600 = 550, Unsure = 0) */
function creditRangeToNumber(
  range: ReadinessAnswers["credit_range"]
): number {
  if (!range) return 0;
  const map: Record<string, number> = {
    "750+": 750,
    "700–749": 700,
    "650–699": 650,
    "600–649": 600,
    "Below 600": 550,
    Unsure: 0,
  };
  return map[range] ?? 0;
}

/** Monthly revenue to numeric order for comparison */
function monthlyRevenueOrder(rev: ReadinessAnswers["monthly_revenue"]): number {
  if (!rev) return 0;
  const order: Record<string, number> = {
    "$0": 0,
    "$1–10k": 1,
    "$10–50k": 2,
    "$50–250k": 3,
    "$250k+": 4,
  };
  return order[rev] ?? 0;
}

function timeInBusinessOrder(
  t: ReadinessAnswers["time_in_business"]
): number {
  if (!t) return 0;
  const order: Record<string, number> = {
    "Not launched": 0,
    "<6 months": 1,
    "6–12 months": 2,
    "1–2 years": 3,
    "2+ years": 4,
  };
  return order[t] ?? 0;
}

function isPreRevenue(a: ReadinessAnswers): boolean {
  return (
    a.revenue_status === "Pre-revenue" ||
    a.monthly_revenue === "$0" ||
    !a.monthly_revenue
  );
}

/** Dynamic weights based on stage */
function getWeights(a: ReadinessAnswers): {
  revenue: number;
  credit: number;
  risk: number;
  structure: number;
} {
  const preRev = isPreRevenue(a);
  const revenueOrder = monthlyRevenueOrder(a.monthly_revenue);
  const timeOrder = timeInBusinessOrder(a.time_in_business);
  const mature =
    revenueOrder >= 2 && timeOrder >= 3; // $10–50k+ and 1–2 years+
  const early =
    revenueOrder < 2 || timeOrder < 3; // < $10k or < 1 year

  if (preRev) {
    return { revenue: 15, credit: 30, risk: 15, structure: 40 };
  }
  if (mature) {
    return { revenue: 35, credit: 20, risk: 20, structure: 25 };
  }
  if (early) {
    return { revenue: 25, credit: 30, risk: 20, structure: 25 };
  }
  return { revenue: 30, credit: 25, risk: 20, structure: 25 };
}

/** Dimension scores 0–100 */
function dimensionScores(a: ReadinessAnswers): {
  revenue: number;
  credit: number;
  risk: number;
  structure: number;
} {
  // Revenue: status, time, amount, consistency
  let revenue = 50;
  if (a.revenue_status === "Yes") revenue += 15;
  if (a.revenue_status === "Pre-revenue") revenue -= 10;
  const revOrder = monthlyRevenueOrder(a.monthly_revenue);
  revenue += revOrder * 8;
  if (a.revenue_consistency === "Consistent") revenue += 10;
  if (a.revenue_consistency === "Seasonal") revenue += 2;
  if (a.revenue_consistency === "Highly inconsistent") revenue -= 5;
  if (a.revenue_consistency === "None") revenue -= 8;
  const timeOrder = timeInBusinessOrder(a.time_in_business);
  revenue += timeOrder * 4;
  revenue = Math.max(0, Math.min(100, revenue));

  // Credit: range, delinquencies, utilization
  let credit = 50;
  const cr = creditRangeToNumber(a.credit_range);
  if (cr >= 750) credit = 92;
  else if (cr >= 700) credit = 85;
  else if (cr >= 650) credit = 75;
  else if (cr >= 600) credit = 65;
  else if (cr === 550) credit = 50;
  else if (a.credit_range === "Unsure") credit = 55;
  if (a.delinquencies_12mo === "Yes") credit -= 15;
  if (a.utilization === "<30%") credit += 5;
  if (a.utilization === "30–60%") credit -= 2;
  if (a.utilization === ">60%") credit -= 12;
  if (a.utilization === "Unsure") credit -= 5;
  credit = Math.max(0, Math.min(100, credit));

  // Risk: debt, obligations, collateral
  let risk = 70;
  if (a.business_debt === "None") risk = 90;
  else if (a.business_debt === "Light") risk = 80;
  else if (a.business_debt === "Moderate") risk = 65;
  else if (a.business_debt === "Heavy") risk = 45;
  if (a.obligations_cover === "Yes") risk += 5;
  if (a.obligations_cover === "Barely") risk -= 10;
  if (a.obligations_cover === "No") risk -= 25;
  const coll = a.collateral ?? [];
  if (coll.length > 0 && !coll.includes("None")) risk += 5;
  if (coll.includes("None") && coll.length === 1) risk -= 5;
  risk = Math.max(0, Math.min(100, risk));

  // Structure: registered, EIN+bank, credit file, financials
  let structure = 50;
  if (a.registered_good_standing === "Yes") structure += 15;
  if (a.registered_good_standing === "In progress") structure += 5;
  if (a.registered_good_standing === "No") structure -= 10;
  if (a.ein_and_bank === "Yes") structure += 15;
  if (a.ein_and_bank === "Partial") structure += 5;
  if (a.ein_and_bank === "No") structure -= 10;
  if (a.business_credit_file === "Yes") structure += 10;
  if (a.business_credit_file === "Minimal") structure += 2;
  if (a.business_credit_file === "No") structure -= 5;
  if (a.financials_ready === "Yes (P&L + balance sheet)") structure += 10;
  if (a.financials_ready === "Somewhat") structure += 2;
  if (a.financials_ready === "No") structure -= 8;
  structure = Math.max(0, Math.min(100, structure));

  return { revenue, credit, risk, structure };
}

/** Count "Unsure" (and similar) answers for confidence penalty */
function countUnsure(a: ReadinessAnswers): number {
  let n = 0;
  if (a.credit_range === "Unsure") n++;
  if (a.utilization === "Unsure") n++;
  if (a.funding_purpose === "Unsure") n++;
  if (a.business_credit_file === "Not sure") n++;
  return n;
}

function confidencePenalty(unsureCount: number): number {
  if (unsureCount <= 1) return 0;
  if (unsureCount <= 3) return 2;
  if (unsureCount <= 5) return 5;
  return 8;
}

/** Zone after overrides (e.g. no Traditional if credit < 600 or revenue $0) */
function getZone(score: number, a: ReadinessAnswers): ReadinessZone {
  const preRev = isPreRevenue(a);
  if (preRev) return "Equity / Grants / Competitions";
  const cr = creditRangeToNumber(a.credit_range);
  const noTraditional = cr < 600 || a.monthly_revenue === "$0";
  if (score >= 80 && cr >= 700 && !noTraditional)
    return "Traditional Lending";
  if (score >= 65 && score <= 79) return "Hybrid / Revenue-Based";
  if (score >= 50 && score <= 64) return "Smaller Facilities / Short-Term";
  return "Funding Readiness Path";
}

/** Build 3 strength and 3 improvement signals from dimension scores */
function buildSignals(
  dims: { revenue: number; credit: number; risk: number; structure: number }
): ReadinessSignals {
  const entries = [
    { name: "Revenue", score: dims.revenue },
    { name: "Credit", score: dims.credit },
    { name: "Risk", score: dims.risk },
    { name: "Structure", score: dims.structure },
  ].sort((x, y) => y.score - x.score);

  const strengthLabels: Record<string, string> = {
    Revenue: "Strong revenue profile and consistency",
    Credit: "Solid credit profile and utilization",
    Risk: "Manageable debt and coverage",
    Structure: "Business structure and financials in place",
  };
  const improvementLabels: Record<string, string> = {
    Revenue: "Build or stabilize revenue track record",
    Credit: "Strengthen credit score and reduce utilization",
    Risk: "Reduce leverage or improve obligation coverage",
    Structure: "Formalize business structure and financials",
  };

  const strengths: [string, string, string] = [
    strengthLabels[entries[0].name] ?? entries[0].name,
    strengthLabels[entries[1].name] ?? entries[1].name,
    strengthLabels[entries[2].name] ?? entries[2].name,
  ];
  const improvements: [string, string, string] = [
    improvementLabels[entries[3].name] ?? entries[3].name,
    improvementLabels[entries[2].name] ?? entries[2].name,
    improvementLabels[entries[1].name] ?? entries[1].name,
  ];
  return { strengths, improvements };
}

/**
 * Compute Funding Readiness Index™ score, tier, zone, signals, confidence penalty, and overrides.
 * Deterministic; use same function on server for verification.
 */
export function calculateReadiness(answers: ReadinessAnswers): ReadinessResult {
  const overridesApplied: string[] = [];
  const weights = getWeights(answers);
  const dims = dimensionScores(answers);
  let score =
    (dims.revenue * weights.revenue +
      dims.credit * weights.credit +
      dims.risk * weights.risk +
      dims.structure * weights.structure) /
    100;
  score = Math.round(score);

  // Override: credit Below 600 -> cap 72
  if (answers.credit_range === "Below 600") {
    if (score > 72) {
      score = 72;
      overridesApplied.push("Score capped at 72 (credit below 600)");
    }
    overridesApplied.push("Zone cannot be Traditional Lending (credit below 600)");
  }

  // Override: heavy debt + cannot cover -> cap 64
  if (
    answers.business_debt === "Heavy" &&
    answers.obligations_cover === "No"
  ) {
    if (score > 64) {
      score = 64;
      overridesApplied.push("Score capped at 64 (heavy debt, cannot cover obligations)");
    }
  }

  // Override: revenue $0 -> no Traditional Lending (handled in getZone)
  if (answers.monthly_revenue === "$0") {
    overridesApplied.push("Zone cannot be Traditional Lending ($0 revenue)");
  }

  const unsureCount = countUnsure(answers);
  const penalty = confidencePenalty(unsureCount);
  score = Math.max(0, Math.min(100, score - penalty));
  if (penalty > 0) overridesApplied.push(`Confidence penalty: -${penalty} (${unsureCount} unsure answers)`);

  const tier = getTier(score);
  const zone = getZone(score, answers);
  const signals = buildSignals(dims);

  return {
    score,
    tier,
    zone,
    signals,
    confidencePenalty: penalty,
    overridesApplied,
  };
}
