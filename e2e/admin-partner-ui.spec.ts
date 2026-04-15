/**
 * Browser smoke for authenticated shells (complements API journeys in `backoffice-partner-journeys.spec.ts`).
 */
import { expect, test } from "@playwright/test";
import { adminLogin, authBearer } from "./http-helpers";

test("admin UI: password sign-in shows dashboard", async ({ page }) => {
  await page.goto("/admin");
  await page.getByLabel("Password", { exact: true }).fill("admin");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByText("Total leads", { exact: false })).toBeVisible({ timeout: 25_000 });
  await expect(page.getByRole("navigation", { name: "Back office sections" })).toBeVisible();
});

test("partner UI: access key sign-in shows portal header", async ({ page, request }) => {
  const token = await adminLogin(request);
  const email = `e2e-ui-partner-${Date.now().toString(36)}@example.com`;
  const org = "E2E UI Portal Partner Co";
  const create = await request.post("/api/backoffice/partners", {
    headers: authBearer(token),
    data: {
      type: "OTHER",
      organizationName: org,
      contactName: "UI Partner User",
      email,
      phone: "5555550166",
      partnerOnboarding: "ADMIN",
    },
  });
  expect(create.ok()).toBeTruthy();
  const partnerId = ((await create.json()) as { partner: { id: string } }).partner.id;

  const keyRes = await request.post(`/api/backoffice/partners/${partnerId}/portal-key`, {
    headers: authBearer(token),
    data: {},
  });
  expect(keyRes.ok()).toBeTruthy();
  const accessKey = ((await keyRes.json()) as { accessKey: string }).accessKey;

  await page.goto("/partner");
  await page.getByLabel("Access key", { exact: true }).fill(accessKey);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: org })).toBeVisible({ timeout: 25_000 });
  await expect(page.getByText("Partner portal", { exact: true })).toBeVisible();
});
