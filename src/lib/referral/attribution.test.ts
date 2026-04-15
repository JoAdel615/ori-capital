import { afterEach, describe, expect, it, vi } from "vitest";
import {
  pathWithRef,
  normalizeReferralCode,
  REFERRAL_STORAGE_KEY,
  resolveCheckoutReferralCode,
} from "./attribution";

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

describe("resolveCheckoutReferralCode", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("prefers ref from input over sessionStorage", () => {
    const store = new Map<string, string>([[REFERRAL_STORAGE_KEY, "STORED"]]);
    vi.stubGlobal(
      "window",
      {
        sessionStorage: {
          getItem: (k: string) => store.get(k) ?? null,
          setItem: vi.fn(),
          removeItem: vi.fn(),
          clear: vi.fn(),
          key: vi.fn(),
          length: 0,
        },
      } as unknown as Window
    );

    expect(resolveCheckoutReferralCode({ ref: "  URLREF  " })).toBe("URLREF");
  });

  it("accepts referral alias when ref missing", () => {
    expect(resolveCheckoutReferralCode({ referral: "ALIAS" })).toBe("ALIAS");
  });

  it("falls back to sessionStorage when URL params empty", () => {
    const store = new Map<string, string>([[REFERRAL_STORAGE_KEY, "FALLBACK"]]);
    vi.stubGlobal(
      "window",
      {
        sessionStorage: {
          getItem: (k: string) => store.get(k) ?? null,
          setItem: vi.fn(),
          removeItem: vi.fn(),
          clear: vi.fn(),
          key: vi.fn(),
          length: 0,
        },
      } as unknown as Window
    );

    expect(resolveCheckoutReferralCode({})).toBe("FALLBACK");
  });
});
