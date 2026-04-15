import { expect, type Page } from "@playwright/test";

/**
 * Navigate and wait for the shell layout + lazy route to finish (Suspense fallback in `App.tsx`).
 */
export async function expectSpaPathLoads(page: Page, path: string): Promise<void> {
  const response = await page.goto(path, { waitUntil: "load" });
  expect(response, `expected response for ${path}`).toBeTruthy();
  expect(response!.ok(), `${path} HTTP ${response!.status()}`).toBeTruthy();
  await expect(page.locator("#main")).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText("Loading page...")).toHaveCount(0, { timeout: 30_000 });
}
