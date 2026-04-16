/**
 * Feature flags — central place for isFeatureEnabled and flag definitions.
 * Env vars: VITE_FEATURE_* (at build time). Default true in dev for funding gap illustration.
 */
const env = import.meta.env;

export const featureFlags = {
  /** Show the new Funding Gap illustration section on the home page. Default true in dev. */
  fundingGapIllustration:
    env.VITE_FEATURE_FUNDING_GAP_ILLUSTRATION === "0"
      ? false
      : (import.meta.env.DEV || env.VITE_FEATURE_FUNDING_GAP_ILLUSTRATION === "1"),
  /** Hidden by default; set `VITE_SHOW_FUNDING_COUNTER=1` to show. */
  showFundingCounter: env.VITE_SHOW_FUNDING_COUNTER === "1",
  showTestimonials: env.VITE_SHOW_TESTIMONIALS !== "0",
} as const;

export type FeatureFlagKey = keyof typeof featureFlags;

/** Check if a feature is enabled. Use for conditional rendering (e.g. home section). */
export function isFeatureEnabled(flag: FeatureFlagKey): boolean {
  return featureFlags[flag] === true;
}
