// Import axe so the first browser test can detect serious structural accessibility regressions.
import AxeBuilder from "@axe-core/playwright";
// Import Playwright's browser fixture and assertions for deployed-style verification.
import { expect, test } from "@playwright/test";

// Verify that the initial shell stays inside Pomorise's no-third-party-runtime boundary.
test("loads the themed shell without unexpected runtime requests", async ({ page, baseURL }) => {
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
  // Protect the public heading so this privacy check also proves the Phase 2 shell rendered.
  await expect(page.getByRole("heading", { name: "Make space for one thing." })).toBeVisible();
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

// Verify an explicit appearance choice survives reload without leaving the trusted origin.
test("persists an explicit theme locally", async ({ page }) => {
  // Load the production-style shell before opening its appearance settings.
  await page.goto("./");
  // Open the native settings dialog through its accessible header action.
  await page.getByRole("button", { name: "Settings" }).click();
  // Select the explicit dark preference through the native radio control.
  await page.getByRole("radio", { name: "Dark" }).check();
  // Verify CSS receives the concrete dark palette marker immediately.
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  // Reload the built application to exercise real browser storage restoration.
  await page.reload();
  // Verify the explicit theme remains active after a complete React restart.
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  // Reopen settings to inspect the stored choice through its native selected state.
  await page.getByRole("button", { name: "Settings" }).click();
  // Protect the visible checked state rather than inspecting application internals.
  await expect(page.getByRole("radio", { name: "Dark" })).toBeChecked();
  // Close the theme persistence browser case after reload and visible-state verification.
});

// Verify one real second advances exactly one countdown second and recovery survives a reload.
test("keeps timestamp-accurate time and restores a running session after refresh", async ({
  page,
}) => {
  // Begin from a clean production-style page with the familiar 25-minute focus default.
  await page.goto("./");
  // Start through the same accessible control used by keyboard and touch visitors.
  await page.getByRole("button", { name: "Start focus" }).click();
  // Wait slightly beyond one real second so the four-hertz paint loop observes the boundary.
  await page.waitForTimeout(1_150);
  // Prove the display lost one second, not four seconds for four 250-millisecond refreshes.
  await expect(page.locator(".timer-display__time")).toHaveText("24:59");
  // Reload the complete React application while the target timestamp remains active.
  await page.reload();
  // Verify restoration returns the legal running controls rather than resetting the attempt.
  await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
  // Pause immediately and require the restored clock to remain near the real elapsed duration.
  await page.getByRole("button", { name: "Pause" }).click();
  await expect(page.locator(".timer-display__time")).toHaveText(/24:5[7-9]/);
  // Close the timestamp and refresh-recovery test after validating visible browser behavior.
});

// Verify the compact shell reflows without page-level horizontal scrolling.
test("reflows at the supported mobile width", async ({ page }) => {
  // Use the smallest planned viewport width and a common compact phone height.
  await page.setViewportSize({ width: 320, height: 700 });
  // Load the production-style shell at the same repository base path used for release.
  await page.goto("./");
  // Protect the primary timer purpose at the compact width.
  await expect(page.getByRole("heading", { name: "Make space for one thing." })).toBeVisible();
  // Compare layout and viewport widths directly to detect page-level horizontal overflow.
  const hasHorizontalOverflow = await page.evaluate(
    // Report whether any document content extends beyond the visible layout viewport.
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    // Close the browser-side overflow calculation after returning its boolean result.
  );
  // Require the complete mobile shell to remain inside the visible page width.
  expect(hasHorizontalOverflow).toBe(false);
  // Protect the compact primary navigation as a visible touch-ready region.
  await expect(page.getByRole("navigation", { name: "Primary mobile navigation" })).toBeVisible();
  // Close the responsive browser case after checking purpose, overflow, and navigation.
});

// Protect the most important first-screen action at representative phone and desktop sizes.
for (const viewport of [
  // Use a common modern phone viewport for the compact touch layout.
  { label: "mobile", width: 390, height: 844 },
  // Use the documented release desktop viewport for the two-column workspace.
  { label: "desktop", width: 1440, height: 900 },
]) {
  // Name each case with its visual profile so failures identify the affected layout immediately.
  test(`keeps the start action visible initially at the ${viewport.label} viewport`, async ({
    page,
  }) => {
    // Apply the release viewport before navigation so responsive layout never paints at another size.
    await page.setViewportSize(viewport);
    // Load the fresh timer workspace at the production repository path.
    await page.goto("./");
    // Require the primary action to be fully available without an initial page scroll.
    await expect(page.getByRole("button", { name: "Start focus" })).toBeInViewport({ ratio: 1 });
    // Close the viewport case after protecting the first-session call to action.
  });
  // Close the responsive case generator after defining its phone and desktop coverage.
}

// Bound one deterministic interaction-to-paint proxy when field data and timer state are ready.
test("paints primary timer feedback within the interaction budget", async ({ page }) => {
  // Load the production timer before measuring a representative state-changing action.
  await page.goto("./");
  // Wait until local hydration makes the neighboring planning field editable and startup is complete.
  await expect(page.getByRole("textbox", { name: "What will you move forward?" })).toBeEnabled();
  // Measure from a browser-side click through the next paint without terminal round-trip latency.
  const interactionToPaintMs = await page.evaluate(async () => {
    // Find the primary native button through its stable visible label.
    const startButton = Array.from(document.querySelectorAll("button")).find(
      // Match exact visitor-facing text so the measurement cannot target a hidden unrelated action.
      (button) => button.textContent?.trim() === "Start focus",
      // Close the primary-action lookup after checking the rendered native buttons.
    );
    // Reject a broken measurement setup instead of returning a misleading fast duration.
    if (!startButton) throw new Error("The primary timer action was not available to measure.");
    // Schedule the action at a paint boundary and resolve after its resulting frame is presented.
    return await new Promise<number>((resolve) => {
      // Begin from one animation frame so the start time has a stable rendering boundary.
      requestAnimationFrame(() => {
        // Capture the high-resolution monotonic start immediately before the state-changing click.
        const startedAt = performance.now();
        // Use the native action path so React handles the same click behavior as a visitor.
        startButton.click();
        // Observe the first frame after React has processed and painted the running state.
        requestAnimationFrame(() => resolve(performance.now() - startedAt));
        // Close the measured animation frame after scheduling its visible result.
      });
      // Close the browser-side measurement promise after defining both paint boundaries.
    });
    // Close the page evaluation after returning the deterministic local duration.
  });
  // Preserve the measured value in the raw runner log for release-report traceability.
  console.info(`[performance] interaction-to-paint=${interactionToPaintMs.toFixed(2)}ms`);
  // Keep this interaction-to-paint proxy within the approved 200-millisecond INP ceiling.
  expect(interactionToPaintMs).toBeLessThanOrEqual(200);
  // Require the visible Pause action to prove the measured click produced the intended state.
  await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
  // Close the responsiveness case after checking both duration and visible behavior.
});
