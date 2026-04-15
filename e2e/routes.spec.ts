import { expect, test } from "@playwright/test";
import { expectSpaPathLoads } from "./helpers";
import { STATIC_APP_PATHS } from "./routePaths";

test.describe("SPA routes", () => {
  for (const path of STATIC_APP_PATHS) {
    test(`loads ${path}`, async ({ page }) => {
      await expectSpaPathLoads(page, path);
    });
  }

  test("unknown slug on consulting lifecycle redirects to consulting hub", async ({ page }) => {
    await page.goto("/consulting/lifecycle/does-not-exist-ori-e2e", { waitUntil: "load" });
    await expect(page).toHaveURL(/\/consulting$/);
    await expect(page.locator("#main")).toBeVisible();
  });

  test("unknown insight slug shows not-found article state", async ({ page }) => {
    await expectSpaPathLoads(page, "/insights/not-a-real-slug-e2e");
    await expect(page.getByRole("heading", { name: /article not found/i })).toBeVisible();
  });
});
