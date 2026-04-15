/**
 * Ori Capital — App configuration
 * API and external URLs for forms; can be overridden via env at build time.
 */
const env = import.meta.env;
import { apiUrl } from "./lib/apiBase";
import { featureFlags } from "./config/features";

export { featureFlags, isFeatureEnabled } from "./config/features";
export type { FeatureFlagKey } from "./config/features";

export const config = {
  /** Optional app origin for authenticated experiences (e.g. https://app.oricapitalholdings.com). */
  appOrigin: (env.VITE_APP_ORIGIN || "").trim().replace(/\/+$/, ""),
  /** Apply for Capital form: POST to this API or use external URL */
  applyApiUrl: env.VITE_APPLY_API_URL || apiUrl("/api/apply"),
  /** If set, redirect to this URL on "Apply" CTA instead of embedded form (keeps experience embedded until submit) */
  applyExternalUrl: env.VITE_APPLY_EXTERNAL_URL || "",
  /** Capital Partners interest form endpoint */
  capitalPartnersApiUrl: env.VITE_CAPITAL_PARTNERS_API_URL || apiUrl("/api/capital-partners"),
  /** Newsletter / email capture endpoint */
  newsletterApiUrl: env.VITE_NEWSLETTER_API_URL || apiUrl("/api/newsletter"),
  /** Optional public social URLs (footer). Empty = that icon is omitted. */
  socialXUrl: (env.VITE_SOCIAL_X_URL || "").trim(),
  socialLinkedinUrl: (env.VITE_SOCIAL_LINKEDIN_URL || "").trim(),
  socialInstagramUrl: (env.VITE_SOCIAL_INSTAGRAM_URL || "").trim(),
  socialFacebookUrl: (env.VITE_SOCIAL_FACEBOOK_URL || "").trim(),
  socialYoutubeUrl: (env.VITE_SOCIAL_YOUTUBE_URL || "").trim(),
  /** Optional main line for footer `tel:` link */
  contactPhoneDisplay: (env.VITE_CONTACT_PHONE_DISPLAY || "").trim(),
  contactPhoneTel: (env.VITE_CONTACT_PHONE_TEL || "").trim(),
  /** Strategy call booking URL */
  strategyCallUrl: env.VITE_STRATEGY_CALL_URL || "#contact",
  /** Public Calendly scheduling page for embeds (e.g. https://calendly.com/ori/consultation). Never put API tokens here. */
  calendlyUrl: (env.VITE_CALENDLY_URL || "").trim(),
  /** Site base URL for OG and canonical */
  siteUrl: env.VITE_SITE_URL || "https://oricapital.com",
  /** POST target for client-side error payloads (empty = reporting disabled except dev console + window hook). */
  clientErrorReportUrl: (env.VITE_CLIENT_ERROR_REPORT_URL || "").trim(),
  /** GA4 measurement ID; empty disables GA (see `Analytics` component). */
  gaMeasurementId: (env.VITE_GA_MEASUREMENT_ID || "").trim(),
  /** Meta Pixel ID; empty disables Pixel (see `Analytics` component). */
  metaPixelId: (env.VITE_META_PIXEL_ID || "").trim(),
  featureFlags,
} as const;
