import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "mobile-chrome",
      testMatch: /mobile-story-paging\.spec\.ts/,
      use: {
        ...devices["iPhone 13"],
        browserName: "chromium",
        reducedMotion: "no-preference",
      },
    },
    {
      name: "desktop-chrome",
      testMatch: /(?:desktop-story-timing|floating-surfaces|narrative-scenes)\.spec\.ts/,
      use: {
        browserName: "chromium",
        viewport: { width: 1440, height: 900 },
        isMobile: false,
        hasTouch: false,
        deviceScaleFactor: 1,
        reducedMotion: "no-preference",
      },
    },
  ],
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
