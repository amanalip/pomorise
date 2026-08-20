// Import Playwright's configuration helper and desktop browser profile for real-browser checks.
import { defineConfig, devices } from "@playwright/test";

// Export the browser-test configuration used locally and by the final verification suite.
export default defineConfig({
  // Find real-browser specifications only in the dedicated browser-test directory.
  testDir: "./src/tests/browser",
  // Run each test with a practical upper bound so a stalled page cannot hang verification.
  timeout: 30_000,
  // Prevent accidental focused tests from weakening continuous-integration coverage.
  forbidOnly: Boolean(process.env.CI),
  // Retry once in automation to retain evidence for a potentially intermittent browser failure.
  retries: process.env.CI ? 1 : 0,
  // Keep local output readable while GitHub Actions receives a compact machine-friendly list.
  reporter: process.env.CI ? "list" : "html",
  // Define behavior shared by every configured browser project.
  use: {
    // Open the built site at the same repository subpath used by GitHub Pages.
    baseURL: "http://127.0.0.1:4173/pomorise/",
    // Retain a trace only when a retry is needed so failures remain diagnosable without excess files.
    trace: "on-first-retry",
    // Close the shared browser options after defining the deployed-style base address.
  },
  // Begin with Chromium while leaving the configuration ready for later browser expansion.
  projects: [
    // Name the project so browser evidence identifies the engine and desktop profile clearly.
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // Close the browser-project list after the initial supported verification target.
  ],
  // Start Vite's production preview server automatically around the browser suite.
  webServer: {
    // Serve the already-built dist directory without exposing it to an external network interface.
    command: "npm run preview -- --host 127.0.0.1 --port 4173",
    // Wait for the actual repository-path page before beginning browser assertions.
    url: "http://127.0.0.1:4173/pomorise/",
    // Reuse a developer's matching local preview but create a clean server in automation.
    reuseExistingServer: !process.env.CI,
    // Close the preview-server lifecycle configuration.
  },
  // Close the complete Playwright configuration.
});
