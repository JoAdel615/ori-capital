import { computeOrderSummary, type SelectedEnrollments } from "../data/fundingReadinessPricing";

type PromoKind = "fixed" | "percent";

interface PromoRule {
  code: string;
  kind: PromoKind;
  value: number;
  description: string;
}

const PROMO_RULES: PromoRule[] = [
  { code: "READY100", kind: "fixed", value: 100, description: "$100 off enrollment" },
  { code: "READY10", kind: "percent", value: 10, description: "10% off enrollment" },
];

export interface PromoCalculation {
  inputCode: string;
  appliedCode: string | null;
  description: string | null;
  discountAmount: number;
  dueTodayBeforeDiscount: number;
  dueTodayAfterDiscount: number;
}

function normalizeCode(code?: string | null): string {
  return String(code || "").trim().toUpperCase();
}

export function calculatePromo(
  dueTodayBeforeDiscount: number,
  promoCode?: string | null
): PromoCalculation {
  const normalized = normalizeCode(promoCode);
  if (!normalized) {
    return {
      inputCode: "",
      appliedCode: null,
      description: null,
      discountAmount: 0,
      dueTodayBeforeDiscount,
      dueTodayAfterDiscount: dueTodayBeforeDiscount,
    };
  }

  const rule = PROMO_RULES.find((r) => r.code === normalized);
  if (!rule) {
    return {
      inputCode: normalized,
      appliedCode: null,
      description: null,
      discountAmount: 0,
      dueTodayBeforeDiscount,
      dueTodayAfterDiscount: dueTodayBeforeDiscount,
    };
  }

  const rawDiscount =
    rule.kind === "fixed" ? rule.value : Math.round((dueTodayBeforeDiscount * rule.value) / 100);
  const discountAmount = Math.max(0, Math.min(dueTodayBeforeDiscount, rawDiscount));
  return {
    inputCode: normalized,
    appliedCode: normalized,
    description: rule.description,
    discountAmount,
    dueTodayBeforeDiscount,
    dueTodayAfterDiscount: dueTodayBeforeDiscount - discountAmount,
  };
}

export function getCheckoutPricing(enrollments: SelectedEnrollments, promoCode?: string | null) {
  const summary = computeOrderSummary(enrollments);
  const promo = calculatePromo(summary.dueTodayTotal, promoCode);
  return {
    summary,
    promo,
    dueTodayTotal: promo.dueTodayAfterDiscount,
  };
}
