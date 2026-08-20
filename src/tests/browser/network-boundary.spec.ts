// Import axe so the first browser test can detect serious structural accessibility regressions.
import AxeBuilder from "@axe-core/playwright";
// Import Playwright's browser fixture and assertions for deployed-style verification.
import { expect, test } from "@playwright/test";

// Verify that the initial shell stays inside Pomorise's no-third-party-runtime boundary.
test("loads the foundation without unexpected runtime requests", async ({ page, baseURL }) => {
  // Fail clearly if a future configuration removes the base address needed for origin checks.
  if (!baseURL) {
    // Throwing prevents a missing test input from silently weakening the privacy assertion.
    throw new Error("Playwright requires a baseURL for the network-boundary test.");
    // Close the configuration guard after proving the expected address exists.
  }

  // Parse the trusted local preview origin once so every observed request uses the same boundary.
  const trustedOrigin = new URL(baseURL).origin;
  // Collect any request that leaves the trusted application origin for an evidence-rich failure.
  const unexpectedRequests: string[] = [];

  // Observe requests without changing them so the test measures the application's real behavior.
  page.on("request", (request) => {
    // Identify the requested address before comparing it with the approved local origin.
    const requestUrl = new URL(request.url());
    // Record any future analytics, font, script, image, or API request to another origin.
    if (requestUrl.origin !== trustedOrigin) {
      // Preserve the full unexpected address so a privacy failure can be diagnosed precisely.
      unexpectedRequests.push(request.url());
      // Close the cross-origin branch after recording the unexpected runtime request.
    }
    // Close the request observer after defining the origin boundary check.
  });

  // Load the production-style repository path served from the built dist directory.
  await page.goto("./");
  // Protect the public heading so this privacy check also proves React rendered successfully.
  await expect(page.getByRole("heading", { name: "Rise into focus." })).toBeVisible();
  // Require the complete runtime request list to contain no third-party origin.
  expect(unexpectedRequests).toEqual([]);
  // Close the network-boundary test after asserting both rendering and request privacy.
});

// Verify the foundation has no automatically detected serious or critical accessibility issue.
test("has no serious automated accessibility findings", async ({ page }) => {
  // Load the same production-style repository path exercised by the privacy boundary test.
  await page.goto("./");
  // Analyze the rendered page while limiting the gate to release-blocking impact levels.
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  // Protect the shell from known serious or critical axe violations at this implementation stage.
  expect(
    results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
  // Close the accessibility test after preserving its automated release-blocking boundary.
});
