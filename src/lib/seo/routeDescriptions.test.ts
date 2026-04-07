import { describe, expect, it } from "vitest";
import { descriptionForPath } from "./routeDescriptions";

describe("descriptionForPath", () => {
  it("returns known path copy", () => {
    expect(descriptionForPath("/contact")).toContain("Contact Ori Capital");
  });

  it("uses insights fallback for article paths", () => {
    expect(descriptionForPath("/insights/any-slug")).toContain("Guidance on funding");
  });

  it("defaults for unknown marketing paths", () => {
    expect(descriptionForPath("/unknown-page")).toContain("Ori Capital");
  });
});
