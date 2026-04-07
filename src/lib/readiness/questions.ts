/**
 * Survey question definitions for the Funding Readiness Survey.
 * Used to drive the 5-step adaptive UI.
 */

import type { ReadinessAnswers } from "./types";

export const STEP_LABELS = [
  "Business stage",
  "Credit profile",
  "Debt & risk",
  "Structure",
  "Capital intent",
] as const;

/** Micro-feedback shown after certain answers (neutral tone) */
export function getMicroFeedback(
  questionKey: keyof ReadinessAnswers,
  value: string | string[] | undefined,
  _answers: ReadinessAnswers
): string | null {
  if (value === undefined) return null;
  const v = Array.isArray(value) ? value.join(",") : value;
  switch (questionKey) {
    case "monthly_revenue":
      if (v === "$10–50k" || v === "$50–250k" || v === "$250k+") return "Strong revenue signal";
      break;
    case "credit_range":
      if (v === "750+" || v === "700–749") return "Solid credit profile";
      break;
    case "business_debt":
    case "obligations_cover":
      if (
        (questionKey === "business_debt" && (v === "Moderate" || v === "Heavy")) ||
        (questionKey === "obligations_cover" && v === "Barely")
      )
        return "Leverage may limit flexibility";
      break;
    case "registered_good_standing":
      if (v === "No") return "Structure improvement opportunity";
      break;
    case "ein_and_bank":
      if (v === "No" || v === "Partial") return "Structure improvement opportunity";
      break;
    case "business_credit_file":
      if (v === "No" || v === "Minimal") return "Structure improvement opportunity";
      break;
    case "financials_ready":
      if (v === "No" || v === "Somewhat") return "Structure improvement opportunity";
      break;
    default:
      break;
  }
  return null;
}

/** Whether to show Q17 (open_to_equity): only if pre-revenue OR Not launched OR <6 months */
export function shouldAskOpenToEquity(answers: ReadinessAnswers): boolean {
  if (answers.revenue_status === "Pre-revenue") return true;
  if (answers.time_in_business === "Not launched") return true;
  if (answers.time_in_business === "<6 months") return true;
  return false;
}
