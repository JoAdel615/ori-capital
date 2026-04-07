/**
 * Contact form submissions — persisted in localStorage for admin dashboard.
 * Same-browser model as testimonials / funding stats; replace with API when backend exists.
 */

import type { ReadinessAnswers, ReadinessResult } from "../lib/readiness/types";

export const CONTACT_SUBMISSIONS_KEY = "ori_contact_submissions";
export const READINESS_LAST_SNAPSHOT_KEY = "ori_readiness_survey_last_snapshot";

export const REFERRAL_OPTIONS = [
  "Google or search engine",
  "Social media",
  "Podcast, webinar, or event",
  "Accelerator, investor, or partner",
  "Email or newsletter",
  "Other",
] as const;

export type ReferralOption = (typeof REFERRAL_OPTIONS)[number];

export interface SurveySnapshot {
  completedAt: string;
  answers: ReadinessAnswers;
  result: Pick<ReadinessResult, "score" | "tier" | "zone">;
}

export interface ContactSubmission {
  id: string;
  submittedAt: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  message: string;
  quickReason: string | null;
  referralSource: ReferralOption | string;
  /** When referral is "Other", user-specified referrer name or detail */
  referralOtherDetail: string;
  surveySnapshot: SurveySnapshot | null;
}

const READINESS_FIELD_LABELS: Partial<Record<keyof ReadinessAnswers, string>> = {
  revenue_status: "Generating revenue",
  time_in_business: "Time in business",
  monthly_revenue: "Monthly revenue",
  revenue_consistency: "Revenue consistency",
  credit_range: "Credit range",
  delinquencies_12mo: "Delinquencies (12 mo)",
  utilization: "Credit utilization",
  business_debt: "Business debt",
  obligations_cover: "Obligations coverage",
  collateral: "Collateral",
  registered_good_standing: "Registered / good standing",
  ein_and_bank: "EIN & business bank",
  business_credit_file: "Business credit file",
  financials_ready: "Financials ready",
  funding_purpose: "Funding purpose",
  amount: "Amount sought",
  open_to_equity: "Open to equity",
};

export function formatSurveyAnswersForAdmin(answers: ReadinessAnswers): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];
  (Object.keys(answers) as (keyof ReadinessAnswers)[]).forEach((key) => {
    const v = answers[key];
    if (v === undefined) return;
    const label = READINESS_FIELD_LABELS[key] ?? key;
    const value = Array.isArray(v) ? v.join(", ") : String(v);
    rows.push({ label, value });
  });
  return rows;
}

function generateId(): string {
  return `ct_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function getLastReadinessSurveySnapshot(): SurveySnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(READINESS_LAST_SNAPSHOT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SurveySnapshot;
    if (!parsed?.answers || !parsed?.result || !parsed?.completedAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveLastReadinessSurveySnapshot(snapshot: SurveySnapshot): void {
  try {
    localStorage.setItem(READINESS_LAST_SNAPSHOT_KEY, JSON.stringify(snapshot));
  } catch {
    /* ignore */
  }
}

export function getContactSubmissions(): ContactSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CONTACT_SUBMISSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as ContactSubmission[];
  } catch {
    return [];
  }
}

function setSubmissions(list: ContactSubmission[]): void {
  try {
    localStorage.setItem(CONTACT_SUBMISSIONS_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export function addContactSubmission(
  entry: Omit<ContactSubmission, "id" | "submittedAt">
): ContactSubmission {
  const row: ContactSubmission = {
    ...entry,
    id: generateId(),
    submittedAt: new Date().toISOString(),
  };
  const list = getContactSubmissions();
  list.unshift(row);
  setSubmissions(list);
  return row;
}

export function removeContactSubmission(id: string): void {
  setSubmissions(getContactSubmissions().filter((s) => s.id !== id));
}
