#!/usr/bin/env node
/**
 * Single full-page capture of /partners for design/export (high DPR for zoom).
 *
 * Usage (with preview running): node scripts/export-partners-page-screenshot.mjs [baseUrl]
 * Default baseUrl: https://localhost:4173
 *
 * Output: ~/Developer/ori-partners-page.png (override with ORI_PARTNERS_SCREENSHOT)
 */
import { chromium } from "playwright";
import { join } from "path";
import { homedir } from "os";

const BASE_URL = process.argv[2] || "https://localhost:4173";
const OUT =
  process.env.ORI_PARTNERS_SCREENSHOT || join(homedir(), "Developer", "ori-partners-page.png");

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 3,
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();
  const url = `${BASE_URL.replace(/\/$/, "")}/partners`;
  await page.goto(url, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: OUT,
    fullPage: true,
    type: "png",
    timeout: 180000,
  });
  await browser.close();
  console.log("Saved:", OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
