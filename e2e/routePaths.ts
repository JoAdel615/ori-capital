/**
 * Canonical SPA paths for E2E — derived from `App.tsx` + data modules so new routes stay covered.
 */
import { blogPosts } from "../src/data/blog";
import { CONSULTING_LIFECYCLE_LANDINGS } from "../src/data/consultingLifecycleLandings";
import { ROUTES } from "../src/utils/navigation";

/** Static routes from `src/App.tsx` (excluding redirects and catch-all). */
export const STATIC_APP_PATHS: string[] = [
  ROUTES.HOME,
  ROUTES.MANAGEMENT,
  ROUTES.MANAGEMENT_FORMATION,
  ROUTES.MANAGEMENT_BUSINESS_PROFILE,
  ROUTES.MANAGEMENT_BUSINESS_BUILDER,
  ROUTES.MANAGEMENT_HOSTING,
  ROUTES.MANAGEMENT_CRM_GROWTH,
  ROUTES.CONSULTING,
  ROUTES.CONSULTING_COACHING,
  ROUTES.CONSULTING_STRUCTURING,
  ROUTES.CONSULTING_CAPITAL_STRATEGY,
  ROUTES.CONSULTING_PRODUCT_DEVELOPMENT,
  ROUTES.CONSULTING_BOOK,
  ROUTES.CAPITAL_LEVERAGE,
  ROUTES.CAPITAL,
  ROUTES.FUNDING,
  ROUTES.APPLY,
  ROUTES.FUNDING_READINESS,
  ROUTES.FUNDING_READINESS_INDIVIDUAL,
  ROUTES.FUNDING_READINESS_ENROLL,
  `${ROUTES.FUNDING_READINESS_ENROLL_THREE_STEP}?sid=e2e-missing-session`,
  ROUTES.FUNDING_READINESS_ENROLL_THREE_STEP_RETURN,
  ROUTES.FUNDING_READINESS_SURVEY,
  ROUTES.INSIGHTS,
  ROUTES.PARTNERS,
  ROUTES.ABOUT,
  ROUTES.CONTACT,
  ROUTES.ADMIN,
  ROUTES.PARTNER_REGISTER,
  ROUTES.PARTNER_PORTAL,
  ROUTES.REFERRAL,
  ROUTES.TESTIMONIAL,
  ROUTES.LEGAL_PRIVACY,
  ROUTES.LEGAL_TERMS,
  ROUTES.LEGAL_DISCLOSURES,
  ...CONSULTING_LIFECYCLE_LANDINGS.map((e) => `/consulting/lifecycle/${e.slug}`),
  ...blogPosts.map((p) => `/insights/${p.slug}`),
];

/** Legacy paths that must redirect (see `App.tsx` `<Navigate />`). */
export const REDIRECT_CASES: { from: string; toPattern: RegExp }[] = [
  { from: "/access-capital", toPattern: /\/funding$/ },
  { from: "/pre-qualify", toPattern: /\/apply$/ },
  { from: "/capital-readiness", toPattern: /\/funding-readiness$/ },
  { from: "/readiness", toPattern: /\/funding-readiness$/ },
  { from: "/approach", toPattern: /\/consulting$/ },
  { from: "/strategy", toPattern: /\/consulting$/ },
  { from: "/model", toPattern: /\/consulting$/ },
  { from: "/capital-partners", toPattern: /\/partners$/ },
  { from: "/get-started", toPattern: /\/funding-readiness-survey$/ },
  { from: "/guided-path", toPattern: /\/funding-readiness-survey$/ },
  { from: "/pricing", toPattern: /\/$/ },
];
