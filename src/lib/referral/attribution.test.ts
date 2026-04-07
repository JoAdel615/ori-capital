import { describe, it, expect } from "vitest";
import { pathWithRef, normalizeReferralCode } from "./attribution";

describe("normalizeReferralCode", () => {
  it("trims whitespace", () => {
    expect(normalizeReferralCode("  abc  ")).toBe("abc");
  });
});

describe("pathWithRef", () => {
  it("appends ref query", () => {
    expect(pathWithRef("/apply", "ABC")).toBe("/apply?ref=ABC");
  });

  it("merges with existing query", () => {
    expect(pathWithRef("/x?foo=1", "ABC")).toBe("/x?foo=1&ref=ABC");
  });

  it("returns path unchanged when ref empty", () => {
    expect(pathWithRef("/apply", "")).toBe("/apply");
  });
});
