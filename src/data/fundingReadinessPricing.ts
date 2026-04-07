/**
 * Funding Readiness Accelerator — pricing and plan copy.
 * Business: Business Core / Business Pro (weekly, monthly, or pay in full).
 * Individual: Individual Core / Individual Plus standalone, or bundled with business at checkout via `businessAddOn`.
 */

export const PRODUCT_SUITE_NAME = "Funding Readiness Accelerator";

export type BillingType = "weekly" | "monthly" | "full";

export const BILLING_TYPES: { value: BillingType; label: string; microcopy: string }[] = [
  { value: "weekly", label: "Weekly", microcopy: "Spread payments week by week" },
  { value: "monthly", label: "Monthly", microcopy: "Flexible monthly enrollment" },
  { value: "full", label: "Pay in Full", microcopy: "Best for committed applicants" },
];

export type TierId = "core" | "strategy";

export interface BusinessPlanPricing {
  weekly: { setup: number; weeklyPrice: number; weeks: number; durationNote: string };
  monthly: { setup: number; monthlyPrice: number; months: number; durationNote: string };
  full: { price: number; durationNote: string };
}

export interface PlanConfig {
  id: TierId;
  tier: string;
  displayName: string;
  badge?: string;
  pricing: { business: BusinessPlanPricing };
  features: { business: string[] };
  featuresPrefix?: { business?: string };
  descriptor: { business: string };
}

export const PLANS: PlanConfig[] = [
  {
    id: "core",
    tier: "Core",
    displayName: "Business Core",
    pricing: {
      business: {
        weekly: {
          setup: 499,
          weeklyPrice: 169,
          weeks: 24,
          durationNote: "24-week plan",
        },
        monthly: {
          setup: 499,
          monthlyPrice: 625,
          months: 6,
          durationNote: "6-month plan",
        },
        full: { price: 2999, durationNote: "Full program" },
      },
    },
    features: {
      business: [
        "See exactly where your business stands for funding",
        "Set up your business the right way for lenders and credit",
        "Get your business visible to credit bureaus",
        "Build business credit step-by-step",
        "Add the right accounts and tradelines to strengthen your profile",
        "Know what lenders are looking for and how to meet it",
        "Follow a clear plan to move toward approval",
      ],
    },
    descriptor: {
      business:
        "Designed for businesses that need the right foundation, stronger credibility, and a clearer path to capital.",
    },
  },
  {
    id: "strategy",
    tier: "Pro",
    displayName: "Business Pro",
    badge: "Most support",
    pricing: {
      business: {
        weekly: {
          setup: 499,
          weeklyPrice: 255,
          weeks: 24,
          durationNote: "24-week plan",
        },
        monthly: {
          setup: 499,
          monthlyPrice: 949,
          months: 6,
          durationNote: "6-month plan",
        },
        full: { price: 4499, durationNote: "Full program" },
      },
    },
    features: {
      business: [
        "Everything in Business Core, plus advanced support:",
        "1:1 support to guide your funding strategy",
        "A personalized plan based on your business and goals",
        "Help positioning your business for approvals",
        "Review and improve your credit, cash flow, and overall profile",
        "Know exactly when and how to apply for funding",
        "Support during your next funding attempt",
      ],
    },
    featuresPrefix: {
      business: "Everything in Business Core, plus advanced support:",
    },
    descriptor: {
      business:
        "Designed for businesses that want deeper strategic guidance, stronger funding positioning, and more hands-on support.",
    },
  },
];

/** Individual Readiness add-on — pay-in-full anchor $899; weekly/monthly scale from prior $599-based add-on. */
const ADDON_FULL = 899;
const ADDON_FROM_599 = 899 / 599;

export const INDIVIDUAL_READINESS_ADDON_PRICING = {
  full: ADDON_FULL,
  monthly: { price: Math.round(125 * ADDON_FROM_599), months: 6 },
  weekly: { price: Math.round(35 * ADDON_FROM_599), weeks: 24 },
} as const;

/** Standalone Individual Core — list pricing: $599 full, $129/mo × 6, $35/wk × 24 (no separate setup). */
export const INDIVIDUAL_READINESS_STANDALONE_PRICING: BusinessPlanPricing = {
  weekly: {
    setup: 0,
    weeklyPrice: 35,
    weeks: 24,
    durationNote: "24-week plan",
  },
  monthly: {
    setup: 0,
    monthlyPrice: 129,
    months: 6,
    durationNote: "6-month plan",
  },
  full: { price: 599, durationNote: "Pay in full" },
};

/** Standalone Individual Plus — list pricing: $1,099 full, $239/mo × 6, $65/wk × 24 (no separate setup). */
export const INDIVIDUAL_READINESS_STANDALONE_PLUS_PRICING: BusinessPlanPricing = {
  weekly: {
    setup: 0,
    weeklyPrice: 65,
    weeks: 24,
    durationNote: "24-week plan",
  },
  monthly: {
    setup: 0,
    monthlyPrice: 239,
    months: 6,
    durationNote: "6-month plan",
  },
  full: { price: 1099, durationNote: "Pay in full" },
};

/** @deprecated Use INDIVIDUAL_READINESS_STANDALONE_PLUS_PRICING */
export const INDIVIDUAL_READINESS_STANDALONE_PRO_PRICING = INDIVIDUAL_READINESS_STANDALONE_PLUS_PRICING;

/** Marketing / card copy for standalone Individual Core. */
export const INDIVIDUAL_READINESS_STANDALONE_FEATURES: string[] = [
  "Clarify how your personal credit affects funding eligibility",
  "Roadmap to strengthen utilization, history, and profile signals",
  "Align personal credit behavior with what lenders review",
  "Step-by-step support focused on individual readiness—not business entity work",
  "Check-ins so you know what to do next before you apply",
];

export const INDIVIDUAL_READINESS_STANDALONE_DESCRIPTOR =
  "Funding readiness for your personal credit profile—without the business accelerator.";

/** Individual Plus — extra support layer. */
export const INDIVIDUAL_READINESS_STANDALONE_PLUS_FEATURES: string[] = [
  "Everything in Individual Core, plus:",
  "1:1 guidance on personal credit and funding positioning",
  "A tailored plan for your goals and timeline",
  "Deeper review of utilization, inquiries, and profile signals",
  "Help prioritizing what to fix before you apply",
  "Support through your next funding or credit milestone",
];

export const INDIVIDUAL_READINESS_STANDALONE_PLUS_DESCRIPTOR =
  "For applicants who want hands-on support and strategic depth on individual funding readiness.";

/** @deprecated Use INDIVIDUAL_READINESS_STANDALONE_PLUS_FEATURES */
export const INDIVIDUAL_READINESS_STANDALONE_PRO_FEATURES = INDIVIDUAL_READINESS_STANDALONE_PLUS_FEATURES;
/** @deprecated Use INDIVIDUAL_READINESS_STANDALONE_PLUS_DESCRIPTOR */
export const INDIVIDUAL_READINESS_STANDALONE_PRO_DESCRIPTOR = INDIVIDUAL_READINESS_STANDALONE_PLUS_DESCRIPTOR;

export function getIndividualStandalonePricing(tier: TierId): BusinessPlanPricing {
  return tier === "strategy" ? INDIVIDUAL_READINESS_STANDALONE_PLUS_PRICING : INDIVIDUAL_READINESS_STANDALONE_PRICING;
}

export function individualTierDisplayName(tier: TierId): "Individual Core" | "Individual Plus" {
  return tier === "strategy" ? "Individual Plus" : "Individual Core";
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getPlanPriceDisplay(
  plan: PlanConfig,
  billingType: BillingType
): { primary: string; secondary?: string; durationNote: string } {
  const pricing = plan.pricing.business[billingType];

  if (billingType === "weekly" && "weeklyPrice" in pricing) {
    const p = pricing as { setup: number; weeklyPrice: number; weeks: number; durationNote: string };
    const primary = `${formatPrice(p.weeklyPrice)}/wk`;
    const durationNote =
      p.setup > 0
        ? `${p.durationNote}. One-time ${formatPrice(p.setup)} setup fee.`
        : p.durationNote;
    return { primary, durationNote };
  }

  if (billingType === "monthly" && "monthlyPrice" in pricing) {
    const p = pricing as { setup: number; monthlyPrice: number; months: number; durationNote: string };
    const primary = `${formatPrice(p.monthlyPrice)}/mo`;
    const durationNote =
      p.setup > 0
        ? `${p.durationNote}. One-time ${formatPrice(p.setup)} setup fee.`
        : p.durationNote;
    return { primary, durationNote };
  }

  if (billingType === "full" && "price" in pricing) {
    const p = pricing as { price: number; durationNote: string };
    return {
      primary: formatPrice(p.price),
      durationNote: p.durationNote,
    };
  }

  return { primary: "", durationNote: "" };
}

/** Price display for standalone Individual Core / Plus (same shape as business tier cards). */
export function getIndividualStandalonePriceDisplay(
  billingType: BillingType,
  tier: TierId = "core"
): {
  primary: string;
  durationNote: string;
} {
  const pricing = getIndividualStandalonePricing(tier);
  const plan: PlanConfig = {
    id: tier,
    tier: tier === "strategy" ? "Plus" : "Core",
    displayName: individualTierDisplayName(tier),
    pricing: { business: pricing },
    features: { business: [] },
    descriptor: { business: "" },
  };
  return getPlanPriceDisplay(plan, billingType);
}

export function getIndividualReadinessAddOnDisplay(billingType: BillingType): {
  primary: string;
  durationNote: string;
} {
  if (billingType === "weekly") {
    const p = INDIVIDUAL_READINESS_ADDON_PRICING.weekly;
    return {
      primary: `${formatPrice(p.price)}/wk`,
      durationNote: `${p.weeks} weeks`,
    };
  }
  if (billingType === "monthly") {
    const p = INDIVIDUAL_READINESS_ADDON_PRICING.monthly;
    return {
      primary: `${formatPrice(p.price)}/mo`,
      durationNote: `${p.months} months`,
    };
  }
  return {
    primary: formatPrice(INDIVIDUAL_READINESS_ADDON_PRICING.full),
    durationNote: "Pay once",
  };
}

export interface EnrollmentSelection {
  tier: TierId;
  billing: BillingType;
}

export type SelectedEnrollments = {
  business?: EnrollmentSelection;
  /** @deprecated Legacy add-on at business checkout; prefer individual product page. Kept for order summary compatibility. */
  individualReadinessAddOn?: boolean;
  /**
   * Individual funding readiness only (Core or Plus). Mutually exclusive with top-level `business`.
   * Optional `businessAddOn` adds a business plan at the same billing cadence.
   */
  individualStandalone?: { tier: TierId; billing: BillingType };
  /** With `individualStandalone`, optionally add Business Core or Pro at the same billing cadence. */
  businessAddOn?: { tier: TierId };
};

export interface OrderSummaryLine {
  label: string;
  amount: string;
  dueToday?: number;
  recurring?: string;
  isSetupFee?: boolean;
}

export interface OrderSummaryResult {
  lines: OrderSummaryLine[];
  dueTodayTotal: number;
  hasRecurring: boolean;
  recurringNote: string | null;
}

export function computeOrderSummary(
  enrollments: Partial<SelectedEnrollments> | null | undefined
): OrderSummaryResult {
  const lines: OrderSummaryLine[] = [];
  let dueTodayTotal = 0;
  let hasRecurring = false;
  const recurringParts: string[] = [];

  const standalone = enrollments?.individualStandalone;
  if (standalone) {
    const bill = standalone.billing;
    const pricing = getIndividualStandalonePricing(standalone.tier);
    const displayName = individualTierDisplayName(standalone.tier);

    if (bill === "weekly") {
      const p = pricing.weekly;
      const setupNote = p.setup > 0 ? ` One-time ${formatPrice(p.setup)} setup fee.` : "";
      lines.push({
        label: displayName,
        amount: `${formatPrice(p.weeklyPrice)}/wk × ${p.weeks} weeks.${setupNote}`,
        dueToday: p.weeklyPrice + p.setup,
        recurring: `${formatPrice(p.weeklyPrice)}/wk for ${p.weeks} weeks`,
      });
      dueTodayTotal += p.setup + p.weeklyPrice;
      hasRecurring = true;
      recurringParts.push(`${displayName}: ${formatPrice(p.weeklyPrice)}/wk`);
    } else if (bill === "monthly") {
      const p = pricing.monthly;
      const setupNote = p.setup > 0 ? ` One-time ${formatPrice(p.setup)} setup fee.` : "";
      lines.push({
        label: displayName,
        amount: `${formatPrice(p.monthlyPrice)}/mo × ${p.months} months.${setupNote}`,
        dueToday: p.monthlyPrice + p.setup,
        recurring: `${formatPrice(p.monthlyPrice)}/mo for ${p.months} months`,
      });
      dueTodayTotal += p.setup + p.monthlyPrice;
      hasRecurring = true;
      recurringParts.push(`${displayName}: ${formatPrice(p.monthlyPrice)}/mo`);
    } else {
      const p = pricing.full;
      lines.push({ label: displayName, amount: formatPrice(p.price), dueToday: p.price });
      dueTodayTotal += p.price;
    }

    const bundle = enrollments?.businessAddOn;
    if (bundle) {
      const bPlan = PLANS.find((p) => p.id === bundle.tier);
      if (bPlan) {
        const bPricing = bPlan.pricing.business[bill];
        const bLabel = bPlan.displayName;

        if (bill === "weekly" && "weeklyPrice" in bPricing) {
          const p = bPricing as { setup: number; weeklyPrice: number; weeks: number; durationNote: string };
          const setupNote = p.setup > 0 ? ` One-time ${formatPrice(p.setup)} setup fee.` : "";
          lines.push({
            label: bLabel,
            amount: `${formatPrice(p.weeklyPrice)}/wk × ${p.weeks} weeks.${setupNote}`,
            dueToday: p.weeklyPrice + p.setup,
            recurring: `${formatPrice(p.weeklyPrice)}/wk for ${p.weeks} weeks`,
          });
          dueTodayTotal += p.setup + p.weeklyPrice;
          hasRecurring = true;
          recurringParts.push(`${bLabel}: ${formatPrice(p.weeklyPrice)}/wk`);
        } else if (bill === "monthly" && "monthlyPrice" in bPricing) {
          const p = bPricing as { setup: number; monthlyPrice: number; months: number; durationNote: string };
          const setupNote = p.setup > 0 ? ` One-time ${formatPrice(p.setup)} setup fee.` : "";
          lines.push({
            label: bLabel,
            amount: `${formatPrice(p.monthlyPrice)}/mo × ${p.months} months.${setupNote}`,
            dueToday: p.monthlyPrice + p.setup,
            recurring: `${formatPrice(p.monthlyPrice)}/mo for ${p.months} months`,
          });
          dueTodayTotal += p.setup + p.monthlyPrice;
          hasRecurring = true;
          recurringParts.push(`${bLabel}: ${formatPrice(p.monthlyPrice)}/mo`);
        } else if (bill === "full" && "price" in bPricing) {
          const p = bPricing as { price: number; durationNote: string };
          lines.push({ label: bLabel, amount: formatPrice(p.price), dueToday: p.price });
          dueTodayTotal += p.price;
        }
      }
    }

    return {
      lines,
      dueTodayTotal,
      hasRecurring,
      recurringNote: recurringParts.length > 0 ? recurringParts.join(" · ") : null,
    };
  }

  const business = enrollments?.business;
  if (!business) {
    return { lines: [], dueTodayTotal: 0, hasRecurring: false, recurringNote: null };
  }

  const plan = PLANS.find((p) => p.id === business.tier);
  if (!plan) {
    return { lines: [], dueTodayTotal: 0, hasRecurring: false, recurringNote: null };
  }
  const bill = business.billing;
  const pricing = plan.pricing.business[bill];
  const displayName = plan.displayName;

  if (bill === "weekly" && "weeklyPrice" in pricing) {
    const p = pricing as { setup: number; weeklyPrice: number; weeks: number; durationNote: string };
    const setupNote = p.setup > 0 ? ` One-time ${formatPrice(p.setup)} setup fee.` : "";
    lines.push({
      label: displayName,
      amount: `${formatPrice(p.weeklyPrice)}/wk × ${p.weeks} weeks.${setupNote}`,
      dueToday: p.weeklyPrice + p.setup,
      recurring: `${formatPrice(p.weeklyPrice)}/wk for ${p.weeks} weeks`,
    });
    dueTodayTotal += p.setup + p.weeklyPrice;
    hasRecurring = true;
    recurringParts.push(`Business: ${formatPrice(p.weeklyPrice)}/wk`);
  } else if (bill === "monthly" && "monthlyPrice" in pricing) {
    const p = pricing as { setup: number; monthlyPrice: number; months: number; durationNote: string };
    const setupNote = p.setup > 0 ? ` One-time ${formatPrice(p.setup)} setup fee.` : "";
    lines.push({
      label: displayName,
      amount: `${formatPrice(p.monthlyPrice)}/mo × ${p.months} months.${setupNote}`,
      dueToday: p.monthlyPrice + p.setup,
      recurring: `${formatPrice(p.monthlyPrice)}/mo for ${p.months} months`,
    });
    dueTodayTotal += p.setup + p.monthlyPrice;
    hasRecurring = true;
    recurringParts.push(`Business: ${formatPrice(p.monthlyPrice)}/mo`);
  } else if (bill === "full" && "price" in pricing) {
    const p = pricing as { price: number; durationNote: string };
    lines.push({ label: displayName, amount: formatPrice(p.price), dueToday: p.price });
    dueTodayTotal += p.price;
  }

  if (enrollments?.individualReadinessAddOn) {
    if (bill === "weekly") {
      const addOn = INDIVIDUAL_READINESS_ADDON_PRICING.weekly;
      lines.push({
        label: "Individual Core (add-on)",
        amount: `${formatPrice(addOn.price)}/wk × ${addOn.weeks} weeks`,
        dueToday: addOn.price,
        recurring: `${formatPrice(addOn.price)}/wk for ${addOn.weeks} weeks`,
      });
      dueTodayTotal += addOn.price;
      hasRecurring = true;
      recurringParts.push(`Individual: ${formatPrice(addOn.price)}/wk`);
    } else if (bill === "monthly") {
      const addOn = INDIVIDUAL_READINESS_ADDON_PRICING.monthly;
      lines.push({
        label: "Individual Core (add-on)",
        amount: `${formatPrice(addOn.price)}/mo × ${addOn.months} months`,
        dueToday: addOn.price,
        recurring: `${formatPrice(addOn.price)}/mo for ${addOn.months} months`,
      });
      dueTodayTotal += addOn.price;
      hasRecurring = true;
      recurringParts.push(`Individual: ${formatPrice(addOn.price)}/mo`);
    } else {
      const addOn = INDIVIDUAL_READINESS_ADDON_PRICING.full;
      lines.push({
        label: "Individual Core (add-on)",
        amount: formatPrice(addOn),
        dueToday: addOn,
      });
      dueTodayTotal += addOn;
    }
  }

  return {
    lines,
    dueTodayTotal,
    hasRecurring,
    recurringNote: recurringParts.length > 0 ? recurringParts.join(" · ") : null,
  };
}
