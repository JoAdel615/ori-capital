import { expect, test } from "@playwright/test";
import { REDIRECT_CASES } from "./routePaths";

test.describe("Legacy redirects", () => {
  for (const { from, toPattern } of REDIRECT_CASES) {
    test(`${from} → ${toPattern}`, async ({ page }) => {
      const response = await page.goto(from, { waitUntil: "load" });
      expect(response?.ok()).toBeTruthy();
      await page.waitForURL(toPattern, { timeout: 15_000 });
      expect(page.url()).toMatch(toPattern);
    });
  }
});
