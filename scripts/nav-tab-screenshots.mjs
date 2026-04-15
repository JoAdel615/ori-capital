#!/usr/bin/env node
/**
 * Full-page + viewport section captures for main nav hubs:
 * Collaboration (/consulting), Management (/management), Funding (/funding), Partners (/partners).
 *
 * Usage:
 *   ORI_SCREENSHOTS_DIR=~/Developer node scripts/nav-tab-screenshots.mjs [baseUrl]
 *
 * Default baseUrl: http://localhost:5173
 * Default output: ~/Developer (screens prefixed ori-capital-tab-*)
 */
import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import { join } from "path";
import { homedir } from "os";

const BASE_URL = process.argv[2] || "http://localhost:5173";
const OUT_DIR = process.env.ORI_SCREENSHOTS_DIR || join(homedir(), "Developer");

const VW = 1440;
const VH = 900;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** @typedef {{ name: string, scrollY?: number, selector?: string, role?: string, roleName?: string }} SectionSpec */

/** @type {{ tab: string, path: string, sections: SectionSpec[], partnerModelTabs?: boolean }[]} */
const TABS = [
  {
    tab: "collaboration",
    path: "/consulting",
    sections: [
      { name: "01-hero", scrollY: 0 },
      { name: "02-support-stage", role: "heading", roleName: "Support that matches your stage" },
      { name: "03-ori-method", role: "heading", roleName: "The Ori Method" },
      { name: "04-judgment", selector: "#consulting-judgment-heading" },
      { name: "05-no-templates", role: "heading", roleName: "No cookie-cutter templates" },
      { name: "06-accountability", role: "heading", roleName: "Accountability and execution" },
      { name: "07-cta", role: "heading", roleName: "Need a strategic plan before the next move?" },
    ],
  },
  {
    tab: "management",
    path: "/management",
    sections: [
      { name: "01-hero", scrollY: 0 },
      { name: "02-products-grid", selector: "#management-products" },
      { name: "03-ori-vault", selector: "#ori-vault" },
      { name: "04-ori-builder", selector: "#ori-builder" },
      { name: "05-ori-hosting", selector: "#ori-hosting" },
      { name: "06-ori-growth", selector: "#ori-growth" },
      { name: "07-cta", role: "heading", roleName: "Start with the system your business runs on" },
    ],
  },
  {
    tab: "funding",
    path: "/funding",
    sections: [
      { name: "01-hero", scrollY: 0 },
      { name: "02-funding-types", role: "heading", roleName: "Funding types explained clearly" },
      { name: "03-find-fit", role: "heading", roleName: "Find the right fit" },
      { name: "04-what-you-need", role: "heading", roleName: "What you will need" },
      { name: "05-prequal-cta", role: "heading", roleName: "See what funding may fit your business" },
      { name: "06-faq", role: "heading", roleName: "Frequently asked questions" },
    ],
  },
  {
    tab: "partners",
    path: "/partners",
    sections: [
      { name: "01-hero", scrollY: 0 },
      { name: "02-where-ori-fits", role: "heading", roleName: "Where Ori fits in your world" },
      { name: "03-end-to-end", role: "heading", roleName: "Offer an end-to-end business resource to your clients" },
      { name: "04-how-we-work", selector: "#how-partnership-works" },
      { name: "05-expand-deliver", role: "heading", roleName: "Expand what you can deliver" },
      { name: "06-partnership-models", role: "heading", roleName: "Flexible partnership models" },
      { name: "07-best-fit", role: "heading", roleName: "Best fit partners" },
    ],
    partnerModelTabs: true,
  },
];

async function scrollSection(page, spec) {
  if (spec.scrollY !== undefined) {
    await page.evaluate((y) => window.scrollTo(0, y), spec.scrollY);
  } else if (spec.selector) {
    const el = page.locator(spec.selector).first();
    await el.scrollIntoViewIfNeeded({ timeout: 8000 });
    await page.evaluate(() => window.scrollBy(0, -24));
  } else if (spec.role && spec.roleName) {
    await page.getByRole(spec.role, { name: spec.roleName }).first().scrollIntoViewIfNeeded({ timeout: 8000 });
    await page.evaluate(() => window.scrollBy(0, -24));
  }
}

async function captureTab(page, def) {
  const url = `${BASE_URL}${def.path}`;
  await page.goto(url, { waitUntil: "load", timeout: 45000 });
  await sleep(900);

  const fullName = `ori-capital-tab-${def.tab}-full.png`;
  const fullPath = join(OUT_DIR, fullName);
  await page.screenshot({ path: fullPath, fullPage: true, timeout: 120000 });
  console.log("Saved:", fullPath);

  for (const spec of def.sections) {
    try {
      await scrollSection(page, spec);
      await sleep(400);
      const out = join(OUT_DIR, `ori-capital-tab-${def.tab}-section-${spec.name}.png`);
      await page.screenshot({
        path: out,
        clip: { x: 0, y: 0, width: VW, height: VH },
        timeout: 60000,
      });
      console.log("Saved:", out);
    } catch (err) {
      console.error(`${def.tab} section ${spec.name}:`, err.message);
    }
  }

  if (def.partnerModelTabs) {
    try {
      await page.getByRole("heading", { name: "Flexible partnership models" }).scrollIntoViewIfNeeded({ timeout: 8000 });
      await page.evaluate(() => window.scrollBy(0, -24));
      await sleep(350);
      const tablist = page.getByRole("tablist", { name: "Partnership models" });
      const labels = ["referral", "embedded", "strategic"];
      for (let i = 0; i < labels.length; i++) {
        await tablist.getByRole("tab").nth(i).click();
        await sleep(450);
        const out = join(OUT_DIR, `ori-capital-tab-partners-model-${labels[i]}.png`);
        await page.screenshot({
          path: out,
          clip: { x: 0, y: 0, width: VW, height: VH },
          timeout: 60000,
        });
        console.log("Saved:", out);
      }
    } catch (err) {
      console.error("Partner model tabs:", err.message);
    }
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.log("Output directory:", OUT_DIR);
  console.log("Base URL:", BASE_URL);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: VW, height: VH },
    deviceScaleFactor: 2,
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  for (const tab of TABS) {
    try {
      await captureTab(page, tab);
    } catch (err) {
      console.error(`Tab ${tab.tab}:`, err.message);
    }
  }

  await browser.close();
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
