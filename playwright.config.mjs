import { defineConfig } from "@playwright/test";

const baseURL = process.env.TEST_BASE_URL || "http://127.0.0.1:8788";

export default defineConfig({
  testDir: "./tests",
  testMatch: "browser.test.mjs",
  use: { baseURL, browserName: "chromium", permissions: ["screen-wake-lock"] },
  webServer: process.env.TEST_BASE_URL
    ? undefined
    : {
        command:
          "pnpm exec wrangler dev --local --ip 127.0.0.1 --port 8788 --inspector-port 0",
        url: baseURL,
        reuseExistingServer: false,
      },
});
