import { defineConfig, devices } from "@playwright/test";

/**
 * E2E smoke tests against production build (`vite preview`).
 * Matches local HTTPS preview (basic-ssl plugin).
 */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "https://127.0.0.1:4173",
    ignoreHTTPSErrors: true,
  },
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4173",
    url: "https://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    ignoreHTTPSErrors: true,
    // Preview runs with NODE_ENV=production; relax only for automated smoke (never on real hosts).
    env: { ...process.env, BACKOFFICE_RELAX_AUTH: "1" },
  },
});
