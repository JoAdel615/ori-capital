/**
 * Ori custom analytics events (GA4 `gtag` + Meta `fbq` trackCustom when loaded).
 * Stable names per docs/PLATFORM_LIFECYCLE_SPEC.md §9.2 — see docs/ANALYTICS_EVENTS.md.
 */

export const ORI_EVENTS = {
  VIEW_PILLAR_MANAGEMENT: "ori_view_pillar_management",
  VIEW_PILLAR_CONSULTING: "ori_view_pillar_consulting",
  VIEW_PILLAR_CAPITAL: "ori_view_pillar_capital",
  VIEW_MANAGEMENT_MODULE: "ori_view_management_module",
  VIEW_CONSULTING_OFFER: "ori_view_consulting_offer",
  VIEW_GET_STARTED: "ori_view_get_started",
  VIEW_PRICING: "ori_view_pricing",
  VIEW_APPLY: "ori_view_apply",
  APPLY_SUBMIT_ATTEMPT: "ori_apply_submit_attempt",
  APPLY_SUBMIT_SUCCESS: "ori_apply_submit_success",
  GET_STARTED_JOURNEY_SELECT: "ori_get_started_journey_select",
  PRICING_TIER_CTA: "ori_pricing_tier_cta",
  HOME_PRIMARY_CTA: "ori_home_primary_cta",
  /** Partner funnel: apply, scroll anchors, audience segment cards (params: `cta`, optional `segment`). */
  PARTNER_FUNNEL_CTA: "ori_partner_funnel_cta",
  PARTNER_ADD_CLIENT_CLICKED: "partner_add_client_clicked",
  PARTNER_ASSIGN_SERVICE_CLICKED: "partner_assign_service_clicked",
  PARTNER_SCHEDULE_WORKSHOP_CLICKED: "partner_schedule_workshop_clicked",
  PARTNER_CLIENT_OPENED: "partner_client_opened",
  PARTNER_COPY_REFERRAL_LINK_CLICKED: "partner_copy_referral_link_clicked",
} as const;

export type OriEventParams = Record<string, string | number | boolean | undefined>;

/**
 * Fire a custom event to GA4 and Meta Pixel when those APIs exist.
 */
export function trackOriEvent(eventName: string, params?: OriEventParams): void {
  const payload = params
    ? Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined)
      ) as Record<string, string | number | boolean>
    : undefined;

  if (typeof window !== "undefined") {
    window.gtag?.("event", eventName, payload);
    if (payload && Object.keys(payload).length > 0) {
      window.fbq?.("trackCustom", eventName, payload);
    } else {
      window.fbq?.("trackCustom", eventName);
    }
  }
}
