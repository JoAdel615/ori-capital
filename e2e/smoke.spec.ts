import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("home loads with Ori in title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Ori Holdings/i);
  });

  test("lifecycle hubs render primary headings", async ({ page }) => {
    // Match hero H1 copy (eyebrows are separate; H1s evolve with messaging).
    await page.goto("/management");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/structure|hustle|management|run your business/i);

    await page.goto("/consulting");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/decision|consulting|guidance|right time/i);

    await page.goto("/capital");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/capital|funding|leverage|raise/i);
  });

  test("utility routes include noindex robots", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/i);

    await page.goto("/partner");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/i);
  });

  test("unknown path shows 404 content", async ({ page }) => {
    await page.goto("/this-route-does-not-exist-ori");
    await expect(page.getByRole("heading", { name: /page not found/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /back to home/i })).toBeVisible();
  });
});
