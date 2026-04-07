/**
 * Funding counter stats — editable via admin dashboard.
 * Persisted in localStorage; public site reads from here with fallback to defaults.
 */

const STORAGE_KEY = "ori_funding_stats";

export type FundingAmountUnit = "M" | "K";

export interface FundingStats {
  totalFunding: number;
  totalFundingUnit: FundingAmountUnit;
  dealsSourced: number;
  dealsSourcedSuffix: string;
  equityTaken: number;
  newBusinessesFunded: number;
  newBusinessesSuffix: string;
  foundersSupported: number;
  foundersSuffix: string;
}

export const DEFAULT_FUNDING_STATS: FundingStats = {
  totalFunding: 2.4,
  totalFundingUnit: "M",
  dealsSourced: 50,
  dealsSourcedSuffix: "+",
  equityTaken: 0,
  newBusinessesFunded: 50,
  newBusinessesSuffix: "+",
  foundersSupported: 100,
  foundersSuffix: "+",
};

function parseStorage<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function getFundingStats(): FundingStats {
  if (typeof window === "undefined") return DEFAULT_FUNDING_STATS;
  const raw = localStorage.getItem(STORAGE_KEY);
  const stored = parseStorage<Partial<FundingStats>>(raw, {});
  return {
    ...DEFAULT_FUNDING_STATS,
    ...stored,
  };
}

export function setFundingStats(stats: FundingStats): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}
