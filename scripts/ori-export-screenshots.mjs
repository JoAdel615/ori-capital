#!/usr/bin/env node
/**
 * Homepage + main nav pillar hubs (Collaboration, Management, Funding, Partners):
 * full-page PNGs and viewport section captures.
 *
 * Usage (preview on 4173):
 *   ORI_SCREENSHOTS_DIR=/path node scripts/ori-export-screenshots.mjs https://localhost:4173
 *
 * Default output: ~/Developer/ori screenshots
 * Also clears *.png in ~/Developer/ori-homepage and ~/Developer/ori capital screenshots
 * so prior “ori” exports are replaced.
 *
 * One-shot: npm run screenshots:ori-export
 */
import { chromium } from "playwright";
import { mkdir, readdir, unlink } from "fs/promises";
import { join } from "path";
import { homedir } from "os";

const BASE_URL = (process.argv[2] || "http://localhost:5173").replace(/\/$/, "");
const DEV = join(homedir(), "Developer");
const OUT_DIR = process.env.ORI_SCREENSHOTS_DIR || join(DEV, "ori screenshots");
const LEGACY_DIRS = [join(DEV, "ori-homepage"), join(DEV, "ori capital screenshots")];

const vw = 1440;
const vh = 900;

/** Home: element ids from `HomeStaticLanding.tsx` */
const HOME_SECTIONS = [
  { file: "home-01-hero", id: "home-hero-heading" },
  { file: "home-02-friction", id: "home-reality-heading" },
  { file: "home-03-coordinated-progress", id: "home-shift-heading" },
  { file: "home-04-outcomes", id: "home-gain-heading" },
  { file: "home-05-simple-by-design", id: "how-it-works" },
  { file: "home-06-fit", id: "home-fit-heading" },
  { file: "home-07-philosophy", id: "home-quiet-heading" },
  { file: "home-08-built-for-outcomes", id: "home-value-heading" },
  { file: "home-09-final-cta", id: "home-final-heading" },
];

/** /consulting — Collaboration hub */
const COLLABORATION_HEADINGS = [
  { file: "collaboration-01-hero", name: "The right decision at the right time changes everything." },
  { file: "collaboration-02-support-stage", name: "Support that matches your stage" },
  { file: "collaboration-03-ori-method", name: "The Ori Method" },
  { file: "collaboration-04-judgment", name: "Judgment over noise." },
  { file: "collaboration-05-no-templates", name: "No cookie-cutter templates" },
  { file: "collaboration-06-cta", name: "Need a strategic plan before the next move?" },
];

/** /management */
const MANAGEMENT_IDS = [
  { file: "management-01-hero", id: null, heading: "More hustle isn't the answer. Structure is." },
  { file: "management-02-products", id: "management-products" },
  { file: "management-03-vault", id: "ori-vault" },
  { file: "management-04-builder", id: "ori-builder" },
  { file: "management-05-hosting", id: "ori-hosting" },
  { file: "management-06-growth", id: "ori-growth" },
  { file: "management-07-cta", heading: "Start with the system your business runs on" },
];

/** /capital — Funding hub */
const FUNDING_HEADINGS = [
  { file: "funding-01-hero", name: "Raise from leverage, not pressure." },
  { file: "funding-02-spectrum", selector: "#funding-spectrum-heading" },
  { file: "funding-03-three-ways", name: "There are only three ways to secure funding." },
  { file: "funding-04-qualify-demo", name: "Qualify before you apply" },
  { file: "funding-05-how-works", name: "How funding actually works" },
  { file: "funding-06-funders-review", name: "What funders actually review" },
  { file: "funding-07-why-not-funded", name: "Most businesses don't get funded. Here's why." },
  { file: "funding-08-cta", name: "Match the move to your position" },
];

/** /partners */
const PARTNER_HEADINGS = [
  { file: "partners-01-hero", name: "Add what your network is missing" },
  { file: "partners-02-where-fits", name: "Where Ori fits in your world" },
  { file: "partners-03-end-to-end", name: "Offer an end-to-end business resource to your clients" },
  { file: "partners-04-how-together", selector: "#how-partnership-works" },
  { file: "partners-05-expand", name: "Expand what you can deliver" },
  { file: "partners-06-models", name: "Flexible partnership models" },
  { file: "partners-07-best-fit", name: "Best fit partners" },
];

async function clearPngsInDir(dir) {
  let names = [];
  try {
    names = await readdir(dir);
  } catch {
    return;
  }
  await mkdir(dir, { recursive: true });
  for (const name of names) {
    if (name.endsWith(".png")) {
      await unlink(join(dir, name));
    }
  }
}

async function viewportClip(page, outName) {
  await page.waitForTimeout(400);
  await page.screenshot({
    path: join(OUT_DIR, outName),
    clip: { x: 0, y: 0, width: vw, height: vh },
    timeout: 90000,
  });
  console.log("Saved:", join(OUT_DIR, outName));
}

async function scrollToSelector(page, sel) {
  const loc = page.locator(sel).first();
  await loc.scrollIntoViewIfNeeded({ timeout: 15000 });
  await page.evaluate(() => window.scrollBy(0, -36));
}

async function scrollToRoleName(page, role, name) {
  await page.getByRole(role, { name }).first().scrollIntoViewIfNeeded({ timeout: 15000 });
  await page.evaluate(() => window.scrollBy(0, -36));
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await clearPngsInDir(OUT_DIR);
  for (const d of LEGACY_DIRS) {
    await clearPngsInDir(d);
  }

  console.log("Output:", OUT_DIR);
  console.log("Base URL:", BASE_URL);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: vw, height: vh },
    deviceScaleFactor: 2,
    ignoreHTTPSErrors: true,
  });

  async function fullPage(url, basename) {
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: "load", timeout: 60000 });
      await page.waitForTimeout(1200);
      const pathOut = join(OUT_DIR, `${basename}.png`);
      await page.screenshot({ path: pathOut, fullPage: true, timeout: 120000 });
      console.log("Saved:", pathOut);
    } catch (err) {
      console.error(`Full page ${url}:`, err.message);
    } finally {
      await page.close();
    }
  }

  // --- Home ---
  await fullPage(`${BASE_URL}/`, "home-full-page");
  {
    const page = await context.newPage();
    try {
      await page.goto(`${BASE_URL}/`, { waitUntil: "load", timeout: 60000 });
      await page.waitForTimeout(1200);
      for (const spec of HOME_SECTIONS) {
        try {
          await scrollToSelector(page, `#${spec.id}`);
          await viewportClip(page, `${spec.file}.png`);
        } catch (err) {
          console.error(`Home ${spec.file}:`, err.message);
        }
      }
    } finally {
      await page.close();
    }
  }

  // --- Collaboration ---
  await fullPage(`${BASE_URL}/consulting`, "collaboration-full-page");
  {
    const page = await context.newPage();
    try {
      await page.goto(`${BASE_URL}/consulting`, { waitUntil: "load", timeout: 60000 });
      await page.waitForTimeout(1200);
      for (const spec of COLLABORATION_HEADINGS) {
        try {
          await scrollToRoleName(page, "heading", spec.name);
          await viewportClip(page, `${spec.file}.png`);
        } catch (err) {
          console.error(`Collaboration ${spec.file}:`, err.message);
        }
      }
    } finally {
      await page.close();
    }
  }

  // --- Management ---
  await fullPage(`${BASE_URL}/management`, "management-full-page");
  {
    const page = await context.newPage();
    try {
      await page.goto(`${BASE_URL}/management`, { waitUntil: "load", timeout: 60000 });
      await page.waitForTimeout(1200);
      for (const spec of MANAGEMENT_IDS) {
        try {
          if (spec.id) {
            await scrollToSelector(page, `#${spec.id}`);
          } else if (spec.heading) {
            await scrollToRoleName(page, "heading", spec.heading);
          }
          await viewportClip(page, `${spec.file}.png`);
        } catch (err) {
          console.error(`Management ${spec.file}:`, err.message);
        }
      }
    } finally {
      await page.close();
    }
  }

  // --- Funding (capital hub) ---
  await fullPage(`${BASE_URL}/capital`, "funding-full-page");
  {
    const page = await context.newPage();
    try {
      await page.goto(`${BASE_URL}/capital`, { waitUntil: "load", timeout: 60000 });
      await page.waitForTimeout(1200);
      for (const spec of FUNDING_HEADINGS) {
        try {
          if (spec.selector) {
            await scrollToSelector(page, spec.selector);
          } else {
            await scrollToRoleName(page, "heading", spec.name);
          }
          await viewportClip(page, `${spec.file}.png`);
        } catch (err) {
          console.error(`Funding ${spec.file}:`, err.message);
        }
      }
    } finally {
      await page.close();
    }
  }

  // --- Partners (+ tab panel states) ---
  await fullPage(`${BASE_URL}/partners`, "partners-full-page");
  {
    const page = await context.newPage();
    try {
      await page.goto(`${BASE_URL}/partners`, { waitUntil: "load", timeout: 60000 });
      await page.waitForTimeout(1200);
      for (const spec of PARTNER_HEADINGS) {
        try {
          if (spec.selector) {
            await scrollToSelector(page, spec.selector);
          } else {
            await scrollToRoleName(page, "heading", spec.name);
          }
          await viewportClip(page, `${spec.file}.png`);
        } catch (err) {
          console.error(`Partners ${spec.file}:`, err.message);
        }
      }

      // Partnership model tabs: capture panel after each selection
      await scrollToRoleName(page, "heading", "Flexible partnership models");
      await page.waitForTimeout(300);
      const tabLabels = ["Referral", "Embedded", "Strategic"];
      for (let i = 0; i < tabLabels.length; i++) {
        try {
          await page.locator(`#partner-model-tab-${i}`).click({ timeout: 5000 });
          await page.waitForTimeout(450);
          await viewportClip(page, `partners-tab-model-${i + 1}-${tabLabels[i].toLowerCase()}.png`);
        } catch (err) {
          console.error(`Partners tab ${i}:`, err.message);
        }
      }
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log("\nDone. Screenshots in:", OUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
