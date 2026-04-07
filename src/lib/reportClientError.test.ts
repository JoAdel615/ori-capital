import { describe, expect, it, vi, afterEach } from "vitest";
import { reportClientError } from "./reportClientError";

describe("reportClientError", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("does not throw when reporting", () => {
    expect(() =>
      reportClientError({ error: new Error("test"), componentStack: "" })
    ).not.toThrow();
  });
});
