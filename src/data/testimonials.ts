/**
 * Testimonials — editable via admin dashboard.
 * Persisted in localStorage; public site reads from here with fallback to defaults.
 */

const STORAGE_KEY = "ori_testimonials";

export interface TestimonialEntry {
  name: string;
  location?: string;
  company?: string;
  industry?: string;
  industryOther?: string;
  fundingAmount?: string;
  businessStage?: string;
  feedback: string;
  /** When true, this testimonial's funding amount is included in the landing page funding counter. */
  approvedForFundingCounter?: boolean;
}

/** Parse a funding amount string (e.g. "$50,000", "50000") to a number in dollars. */
export function parseFundingAmount(value: string | undefined): number {
  if (!value || typeof value !== "string") return 0;
  const cleaned = value.replace(/[$,]\s*/g, "");
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : 0;
}

/** Sum of funding amounts (in dollars) for testimonials approved for the funding counter. */
export function getApprovedFundingTotal(): number {
  const list = getTestimonials();
  return list.reduce((sum, t) => {
    if (!t.approvedForFundingCounter || !t.fundingAmount) return sum;
    return sum + parseFundingAmount(t.fundingAmount);
  }, 0);
}

export const DEFAULT_TESTIMONIALS: TestimonialEntry[] = [
  {
    name: "Operator, services business",
    location: "Nashville",
    feedback:
      "I stopped guessing. Ori showed me exactly which capital tool matched my cash flow—and we got to a decision fast.",
  },
  {
    name: "Founder",
    company: "SaaS",
    feedback:
      "I didn't need a pitch deck. I needed structure. The consult saved me from taking the wrong money.",
  },
  {
    name: "Small business owner",
    company: "Logistics",
    feedback:
      "They didn't just 'find funding.' They helped me protect ownership while stacking capital responsibly.",
  },
];

function parseStorage(raw: string | null): TestimonialEntry[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function getTestimonials(): TestimonialEntry[] {
  if (typeof window === "undefined") return DEFAULT_TESTIMONIALS;
  const raw = localStorage.getItem(STORAGE_KEY);
  const stored = parseStorage(raw);
  if (stored && stored.length > 0) return stored;
  return DEFAULT_TESTIMONIALS;
}

export function setTestimonials(list: TestimonialEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function addTestimonial(entry: TestimonialEntry): void {
  const list = getTestimonials();
  setTestimonials([...list, entry]);
}
