import type { NavigateFunction } from "react-router-dom";

/**
 * Canonical routes for the funnel. Use these everywhere for CTAs and links
 * so we have a single source of truth and scroll-to-top on route change (handled in App).
 */
export const ROUTES = {
  HOME: "/",
  ADMIN: "/admin",
  PARTNER_PORTAL: "/partner",
  PARTNER_REGISTER: "/partner/register",
  REFERRAL: "/referral",
  TESTIMONIAL: "/testimonial",
  FUNDING: "/funding",
  APPLY: "/apply",
  FUNDING_READINESS: "/funding-readiness",
  FUNDING_READINESS_INDIVIDUAL: "/funding-readiness/individual",
  FUNDING_READINESS_ENROLL: "/funding-readiness/enroll",
  FUNDING_READINESS_ENROLL_THREE_STEP: "/funding-readiness/enroll/three-step",
  FUNDING_READINESS_ENROLL_THREE_STEP_RETURN: "/funding-readiness/enroll/three-step/return",
  FUNDING_READINESS_SURVEY: "/funding-readiness-survey",
  APPROACH: "/approach",
  INSIGHTS: "/insights",
  PARTNERS: "/partners",
  ABOUT: "/about",
  CONTACT: "/contact",
  LEGAL_PRIVACY: "/legal/privacy",
  LEGAL_TERMS: "/legal/terms",
  LEGAL_DISCLOSURES: "/legal/disclosures",
} as const;

/**
 * Navigate to a path and optionally scroll to a hash anchor.
 * Scroll-to-top on plain path change is handled by ScrollToTopOnRouteChange in App.
 */
export function navigateTo(
  navigate: NavigateFunction,
  path: string,
  opts?: { hash?: string }
): void {
  const hash = opts?.hash;
  navigate(hash ? `${path}#${hash}` : path);
  if (hash) {
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.getElementById(hash);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    });
  }
}
