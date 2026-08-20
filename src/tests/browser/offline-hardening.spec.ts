import { expect, test } from "@playwright/test";

test("installs an approved manifest and reopens after the network goes offline", async ({
  context,
  page,
}) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "Make space for one thing." })).toBeVisible();

  const manifest = await page.locator('link[rel="manifest"]').getAttribute("href");
  expect(manifest).toBeTruthy();
  const manifestResponse = await page.request.get(new URL(manifest!, page.url()).toString());
  expect(manifestResponse.ok()).toBe(true);
  expect(await manifestResponse.json()).toMatchObject({
    name: "Pomorise",
    display: "standalone",
    theme_color: "#321b3b",
  });

  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  // The first installed worker controls the next navigation; reload once while still online.
  await page.reload();
  await expect
    .poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)))
    .toBe(true);

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Make space for one thing." })).toBeVisible();
  // Chromium may retain navigator.onLine across an emulated reload, so deliver its offline event.
  await page.evaluate(() => window.dispatchEvent(new Event("offline")));
  await expect(page.getByLabel("Application status")).toContainText("You are offline");
});

test("continues normally when notification permission is denied", async ({ page }) => {
  await page.addInitScript(() => {
    class DeniedNotification {
      static permission = "denied";
      static requestPermission = () => Promise.resolve("denied" as const);
    }
    Object.defineProperty(window, "Notification", {
      configurable: true,
      value: DeniedNotification,
    });
  });
  await page.goto("./");
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("checkbox", { name: /Show browser notifications/ }).click();
  await expect(page.getByText(/Notification permission was not granted/)).toBeVisible();
  await page.getByRole("button", { name: "Done" }).click();
  await expect(page.getByRole("button", { name: "Start focus" })).toBeEnabled();
});

test("keeps personal text out of versioned application caches", async ({ page }) => {
  const privateMarker = `private-cache-marker-${Date.now()}`;
  await page.goto("./");
  await page.getByRole("textbox", { name: "What will you move forward?" }).fill(privateMarker);
  await page.waitForTimeout(400);
  await page.evaluate(async () => navigator.serviceWorker.ready);

  const cachedText = await page.evaluate(async () => {
    const names = await caches.keys();
    const bodies: string[] = [];
    for (const name of names) {
      const cache = await caches.open(name);
      for (const request of await cache.keys()) {
        const response = await cache.match(request);
        if (response) bodies.push(await response.clone().text());
      }
    }
    return bodies.join("\n");
  });

  expect(cachedText).not.toContain(privateMarker);
});

for (const viewport of [
  { label: "medium", width: 768, height: 900 },
  { label: "wide", width: 1440, height: 900 },
]) {
  test(`has no page overflow at the ${viewport.label} viewport`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("./");
    const dimensions = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client);
  });
}
