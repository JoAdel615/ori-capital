import { describe, expect, it } from "vitest";
import { descriptionForPath } from "./routeDescriptions";

describe("descriptionForPath", () => {
  it("returns known path copy", () => {
    expect(descriptionForPath("/contact")).toContain("Ori Holdings");
    expect(descriptionForPath("/contact")).toContain("consulting");
  });

  it("returns management copy for lifecycle routes", () => {
    expect(descriptionForPath("/management")).toContain("formation");
  });

  it("uses insights fallback for article paths", () => {
    expect(descriptionForPath("/insights/any-slug")).toContain("Operator-first guidance");
  });

  it("defaults for unknown marketing paths", () => {
    expect(descriptionForPath("/unknown-page")).toContain("Ori Holdings");
  });
});
