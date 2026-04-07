import { config } from "../../config";

/**
 * Optional custom events for GA4 + Meta (Meta uses trackCustom).
 * Safe to call anytime; no-ops when analytics IDs are unset or scripts not loaded.
 */
export function trackAnalyticsEvent(
  name: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  const p = params ?? {};
  if (config.gaMeasurementId && typeof window.gtag === "function") {
    window.gtag("event", name, p);
  }
  if (config.metaPixelId && typeof window.fbq === "function") {
    window.fbq("trackCustom", name, p);
  }
}
