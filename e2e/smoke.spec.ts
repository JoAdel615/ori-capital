import { test, expect } from "@playwright/test";

test.describe("smoke", () => {
  test("home loads with Ori in title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Ori Capital/i);
  });

  test("unknown path shows 404 content", async ({ page }) => {
    await page.goto("/this-route-does-not-exist-ori");
    await expect(page.getByRole("heading", { name: /page not found/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /back to home/i })).toBeVisible();
  });
});
