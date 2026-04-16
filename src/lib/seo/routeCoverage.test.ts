import { describe, expect, it } from "vitest";
import { descriptionForPath } from "./routeDescriptions";

// Canonical app routes that should carry explicit, route-specific metadata.
// legacy explicit coverage list retained for readability; canonical governance lives in routeGovernance.test.ts
const EXPECTED_DESCRIBED_PATHS = [
  "/",
  "/tools",
  "/tools/formation",
  "/tools/business-profile",
  "/tools/business-builder",
  "/tools/hosting",
  "/tools/crm-growth",
  "/services",
  "/services/coaching",
  "/services/structuring",
  "/services/capital-strategy",
  "/services/product-development",
  "/services/book",
  "/services/lifecycle/sharpen-your-business-model",
  "/services/lifecycle/build-a-predictable-pipeline",
  "/services/lifecycle/systemize-your-operations",
  "/services/lifecycle/install-your-growth-engine",
  "/services/lifecycle/build-the-right-foundation",
  "/services/lifecycle/deploy-capital-strategically",
  "/capital",
  "/capital/leverage",
  "/funding",
  "/apply",
  "/funding-readiness",
  "/funding-readiness/individual",
  "/funding-readiness/enroll",
  "/funding-readiness/enroll/three-step",
  "/funding-readiness/enroll/three-step/return",
  "/funding-readiness-survey",
  "/insights",
  "/partners",
  "/about",
  "/contact",
  "/admin",
  "/partner/register",
  "/partner",
  "/referral",
  "/testimonial",
  "/legal/privacy",
  "/legal/terms",
  "/legal/disclosures",
] as const;

describe("SEO route coverage", () => {
  it("has specific metadata for every canonical route", () => {
    const fallback = descriptionForPath("/__unknown_route__");

    for (const path of EXPECTED_DESCRIBED_PATHS) {
      const description = descriptionForPath(path);
      expect(description).not.toBe(fallback);
      expect(description.length).toBeGreaterThan(10);
    }
  });

  it("keeps dynamic insights routes on the insights fallback", () => {
    expect(descriptionForPath("/insights/some-slug")).toContain("Operator-first guidance");
  });
});
