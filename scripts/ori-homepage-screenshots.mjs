#!/usr/bin/env node
/**
 * Ori homepage: full-page + viewport screenshots per major section.
 *
 * Usage (with preview already running on 4173):
 *   node scripts/ori-homepage-screenshots.mjs https://localhost:4173
 *
 * Output: ~/Developer/ori-homepage (override with ORI_SCREENSHOTS_DIR)
 * One-shot: npm run screenshots:ori-homepage
 */
import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import { join } from "path";
import { homedir } from "os";

const BASE_URL = (process.argv[2] || "http://localhost:5173").replace(/\/$/, "");
const OUT_DIR =
  process.env.ORI_SCREENSHOTS_DIR || join(homedir(), "Developer", "ori-homepage");

/** Scroll targets: element ids from `HomeStaticLanding.tsx` */
const SECTIONS = [
  { file: "ori-homepage-01-hero", id: "home-hero-heading" },
  { file: "ori-homepage-02-friction", id: "home-reality-heading" },
  { file: "ori-homepage-03-coordinated-progress", id: "home-shift-heading" },
  { file: "ori-homepage-04-outcomes", id: "home-gain-heading" },
  { file: "ori-homepage-05-simple-by-design", id: "how-it-works" },
  { file: "ori-homepage-06-fit", id: "home-fit-heading" },
  { file: "ori-homepage-07-philosophy", id: "home-quiet-heading" },
  { file: "ori-homepage-08-built-for-outcomes", id: "home-value-heading" },
  { file: "ori-homepage-09-final-cta", id: "home-final-heading" },
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.log("Output:", OUT_DIR);
  console.log("Base URL:", BASE_URL);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/`, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(1200);

  const fullPath = join(OUT_DIR, "ori-homepage-full-page.png");
  await page.screenshot({
    path: fullPath,
    fullPage: true,
    timeout: 120000,
  });
  console.log("Saved:", fullPath);

  const vw = 1440;
  const vh = 900;

  for (const spec of SECTIONS) {
    try {
      const loc = page.locator(`#${spec.id}`).first();
      await loc.scrollIntoViewIfNeeded({ timeout: 15000 });
      await page.evaluate(() => window.scrollBy(0, -36));
      await page.waitForTimeout(450);
      const pathOut = join(OUT_DIR, `${spec.file}.png`);
      await page.screenshot({
        path: pathOut,
        clip: { x: 0, y: 0, width: vw, height: vh },
        timeout: 60000,
      });
      console.log("Saved:", pathOut);
    } catch (err) {
      console.error(`Failed ${spec.file} (#${spec.id}):`, err.message);
    }
  }

  await browser.close();
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
