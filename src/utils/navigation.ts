import type { NavigateFunction } from "react-router-dom";
import { config } from "../config";

/**
 * Canonical routes for the funnel. Use these everywhere for CTAs and links
 * so we have a single source of truth and scroll-to-top on route change (handled in App).
 */
export const ROUTES = {
  HOME: "/",
  ADMIN: "/admin",
  PARTNER_PORTAL: "/partner",
  /** Partner portal sign-in (alias for flows that reference `ROUTES.PARTNER`). */
  PARTNER: "/partner",
  PARTNER_REGISTER: "/partner/register",
  REFERRAL: "/referral",
  TESTIMONIAL: "/testimonial",

  MANAGEMENT: "/management",
  MANAGEMENT_FORMATION: "/management/formation",
  MANAGEMENT_BUSINESS_PROFILE: "/management/business-profile",
  MANAGEMENT_BUSINESS_BUILDER: "/management/business-builder",
  MANAGEMENT_HOSTING: "/management/hosting",
  MANAGEMENT_CRM_GROWTH: "/management/crm-growth",

  CONSULTING: "/consulting",
  CONSULTING_COACHING: "/consulting/coaching",
  CONSULTING_STRUCTURING: "/consulting/structuring",
  CONSULTING_CAPITAL_STRATEGY: "/consulting/capital-strategy",
  CONSULTING_PRODUCT_DEVELOPMENT: "/consulting/product-development",
  CONSULTING_BOOK: "/consulting/book",

  CAPITAL: "/capital",
  /** Capital as a pillar with Consulting & Management (legacy “Raise from leverage” hub). */
  CAPITAL_LEVERAGE: "/capital/leverage",
  FUNDING: "/funding",
  APPLY: "/apply",
  FUNDING_READINESS: "/funding-readiness",
  FUNDING_READINESS_INDIVIDUAL: "/funding-readiness/individual",
  FUNDING_READINESS_ENROLL: "/funding-readiness/enroll",
  FUNDING_READINESS_ENROLL_THREE_STEP: "/funding-readiness/enroll/three-step",
  FUNDING_READINESS_ENROLL_THREE_STEP_RETURN: "/funding-readiness/enroll/three-step/return",
  FUNDING_READINESS_SURVEY: "/funding-readiness-survey",

  /** Primary intake — discovery survey (same path as `FUNDING_READINESS_SURVEY`). */
  GET_STARTED: "/funding-readiness-survey",

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

/**
 * Builds an app-domain URL for authenticated routes when configured.
 * Returns null when no dedicated app origin is set.
 */
export function appRouteUrl(path: string): string | null {
  const origin = config.appOrigin;
  if (!origin) return null;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalizedPath}`;
}

/** Last non-contact SPA path, for contact-form attribution (sessionStorage). */
export const CONTACT_ATTRIBUTION_PRIOR_ROUTE_KEY = "ori_prior_route";
