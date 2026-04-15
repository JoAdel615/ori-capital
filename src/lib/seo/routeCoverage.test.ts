import { describe, expect, it } from "vitest";
import { descriptionForPath } from "./routeDescriptions";

// Canonical app routes that should carry explicit, route-specific metadata.
// legacy explicit coverage list retained for readability; canonical governance lives in routeGovernance.test.ts
const EXPECTED_DESCRIBED_PATHS = [
  "/",
  "/management",
  "/management/formation",
  "/management/business-profile",
  "/management/business-builder",
  "/management/hosting",
  "/management/crm-growth",
  "/consulting",
  "/consulting/coaching",
  "/consulting/structuring",
  "/consulting/capital-strategy",
  "/consulting/product-development",
  "/consulting/book",
  "/consulting/lifecycle/sharpen-your-business-model",
  "/consulting/lifecycle/build-a-predictable-pipeline",
  "/consulting/lifecycle/systemize-your-operations",
  "/consulting/lifecycle/install-your-growth-engine",
  "/consulting/lifecycle/build-the-right-foundation",
  "/consulting/lifecycle/deploy-capital-strategically",
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
