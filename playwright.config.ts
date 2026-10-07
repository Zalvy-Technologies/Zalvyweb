import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 60_000,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.1,
    },
  },
  webServer: {
    // Production build + standalone server: deterministic and fast, unlike
    // `next dev`, whose on-demand compiles make hydration timing unreliable.
    command: process.env.CI ? "node scripts/e2e-server.mjs" : "npm run build && node scripts/e2e-server.mjs",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});