#!/usr/bin/env node
/**
 * Capture full-page screenshots of all Ori Capital routes + home section viewports.
 *
 * Usage:
 *   npm run dev   # in another terminal, or use preview
 *   node scripts/screenshots.mjs [baseUrl]
 *
 * With local HTTPS preview (after `npm run build`): use https://localhost:4173
 * (Playwright may fail with 127.0.0.1 on some setups with basic-ssl.)
 *
 * Default output: ~/Developer/ori capital screenshots
 * Override: ORI_SCREENSHOTS_DIR=/path node scripts/screenshots.mjs
 *
 * One-shot: npm run screenshots:export
 */
import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import { join } from "path";
import { homedir } from "os";

const BASE_URL = process.argv[2] || "http://localhost:5173";
const OUT_DIR =
  process.env.ORI_SCREENSHOTS_DIR || join(homedir(), "Developer", "ori capital screenshots");

/** All in-app routes (sync with `src/App.tsx`). Redirect routes omitted — use canonical paths. */
const ROUTES = [
  { path: "/management", name: "management" },
  { path: "/management/formation", name: "management-formation" },
  { path: "/management/business-profile", name: "management-business-profile" },
  { path: "/management/business-builder", name: "management-business-builder" },
  { path: "/management/hosting", name: "management-hosting" },
  { path: "/management/crm-growth", name: "management-crm-growth" },
  { path: "/consulting", name: "consulting" },
  { path: "/consulting/coaching", name: "consulting-coaching" },
  { path: "/consulting/structuring", name: "consulting-structuring" },
  { path: "/consulting/capital-strategy", name: "consulting-capital-strategy" },
  { path: "/consulting/book", name: "consulting-book" },
  { path: "/capital", name: "capital" },
  { path: "/capital/leverage", name: "capital-leverage" },
  { path: "/funding", name: "access-capital" },
  { path: "/apply", name: "apply-prequalify" },
  { path: "/funding-readiness", name: "funding-readiness" },
  { path: "/funding-readiness/individual", name: "funding-readiness-individual" },
  { path: "/funding-readiness/enroll", name: "funding-readiness-enroll" },
  { path: "/funding-readiness/enroll/three-step", name: "funding-readiness-enroll-three-step" },
  { path: "/funding-readiness/enroll/three-step/return", name: "funding-readiness-enroll-three-step-return" },
  { path: "/funding-readiness-survey", name: "funding-readiness-survey" },
  { path: "/approach", name: "approach" },
  { path: "/insights", name: "insights" },
  { path: "/insights/what-lenders-look-at-before-approving-financing", name: "insights-what-lenders-look-at" },
  { path: "/insights/why-businesses-get-denied", name: "insights-why-denied" },
  { path: "/insights/business-credit-explained", name: "insights-business-credit" },
  { path: "/insights/funding-types-breakdown", name: "insights-funding-types" },
  { path: "/insights/how-to-become-more-fundable", name: "insights-more-fundable" },
  { path: "/partners", name: "partners" },
  { path: "/about", name: "about" },
  { path: "/contact", name: "contact" },
  { path: "/admin", name: "admin" },
  { path: "/partner/register", name: "partner-register" },
  { path: "/partner", name: "partner-portal" },
  { path: "/referral", name: "referral" },
  { path: "/testimonial", name: "testimonial" },
  { path: "/legal/privacy", name: "legal-privacy" },
  { path: "/legal/terms", name: "legal-terms" },
  { path: "/legal/disclosures", name: "legal-disclosures" },
  { path: "/get-started", name: "get-started" },
  { path: "/pricing", name: "pricing" },
  { path: "/__screenshot-not-found-route", name: "not-found" },
];

/** Home: viewport-sized section thumbnails (see `HomePage.tsx`). */
const HOME_SECTION_SCROLLS = [
  { name: "home-section-01-hero", scrollY: 0 },
  { name: "home-section-02-pillars", selector: "#pillars" },
  { name: "home-section-03-practice", role: "heading", roleName: "What this looks like in practice" },
  { name: "home-section-04-guided-path", role: "heading", roleName: "New business or existing business? Start with the right path." },
  { name: "home-section-05-solution-suite", role: "heading", roleName: "Choose your solution suite" },
  { name: "home-section-06-onramp", role: "heading", roleName: "How the Ori onramp works" },
  { name: "home-section-07-learn", role: "heading", roleName: "Learn before you buy" },
  { name: "home-section-08-partners", role: "heading", roleName: "Partner with Ori" },
  { name: "home-section-09-help", role: "heading", roleName: "Need help choosing the right path?" },
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.log("Output directory:", OUT_DIR);
  console.log("Base URL:", BASE_URL);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    ignoreHTTPSErrors: true,
  });

  for (const { path: routePath, name } of ROUTES) {
    const page = await context.newPage();
    const url = `${BASE_URL}${routePath}`;
    try {
      await page.goto(url, { waitUntil: "load", timeout: 30000 });
      await page.waitForTimeout(800);
      const safeName = name.replace(/[^a-z0-9-]/gi, "-");
      const fullPath = join(OUT_DIR, `${safeName}.png`);
      await page.screenshot({
        path: fullPath,
        fullPage: true,
        timeout: 120000,
      });
      console.log("Saved:", fullPath);
    } catch (err) {
      console.error(`Failed ${url}:`, err.message);
    } finally {
      await page.close();
    }
  }

  const homePage = await context.newPage();
  try {
    await homePage.goto(`${BASE_URL}/`, { waitUntil: "load", timeout: 30000 });
    await homePage.waitForTimeout(600);
    await homePage.screenshot({
      path: join(OUT_DIR, "home-full-page.png"),
      fullPage: true,
      timeout: 120000,
    });
    console.log("Saved:", join(OUT_DIR, "home-full-page.png"));

    const vw = 1440;
    const vh = 900;

    for (const spec of HOME_SECTION_SCROLLS) {
      try {
        if (spec.scrollY !== undefined) {
          await homePage.evaluate((y) => window.scrollTo(0, y), spec.scrollY);
        } else if (spec.selector) {
          const el = homePage.locator(spec.selector).first();
          await el.scrollIntoViewIfNeeded({ timeout: 5000 });
          await homePage.evaluate(() => window.scrollBy(0, -24));
        } else if (spec.role && spec.roleName) {
          await homePage.getByRole(spec.role, { name: spec.roleName }).first().scrollIntoViewIfNeeded({ timeout: 5000 });
          await homePage.evaluate(() => window.scrollBy(0, -24));
        }
        await homePage.waitForTimeout(350);
        const pathOut = join(OUT_DIR, `${spec.name}.png`);
        await homePage.screenshot({
          path: pathOut,
          clip: { x: 0, y: 0, width: vw, height: vh },
          timeout: 60000,
        });
        console.log("Saved:", pathOut);
      } catch (err) {
        console.error(`Home section ${spec.name}:`, err.message);
      }
    }
  } catch (err) {
    console.error("Home captures:", err.message);
  } finally {
    await homePage.close();
  }

  await browser.close();
  console.log("\nDone. Screenshots in:", OUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
