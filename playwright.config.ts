import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: "http://127.0.0.1:4328",
    headless: true,
    screenshot: "only-on-failure",
    launchOptions: existsSync(chrome) ? { executablePath: chrome } : {},
  },
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4328",
    port: 4328,
    reuseExistingServer: !process.env.CI,
  },
  reporter: [["list"]],
});
