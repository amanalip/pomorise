// Import Playwright's assertions and test fixture for real IndexedDB and settings behavior.
import { expect, test, type Page } from "@playwright/test";

// Open the ownership panel through the same controls a keyboard or pointer visitor uses.
async function openDataControls(page: Page) {
  // Open the native settings dialog from the persistent application header.
  await page.getByRole("button", { name: "Settings" }).click();
  // Select the data destination through its accessible tab name.
  await page.getByRole("tab", { name: "Data & privacy" }).click();
  // Require the ownership heading before a test interacts with higher-risk controls.
  await expect(page.getByRole("heading", { name: "Your focus data stays yours" })).toBeVisible();
  // Close the shared navigation helper after proving the panel is ready.
}

// Build a complete version-two backup from deterministic synthetic records only.
function syntheticBackup() {
  // Keep one fixed timestamp so imported records and assertions are reproducible.
  const completedAt = 1_800_000_000_000;
  // Return the exact public backup contract accepted by the local trust boundary.
  return {
    // Identify the intended product before any local transaction begins.
    product: "Pomorise",
    // Identify the portable file format independently from the IndexedDB schema.
    formatVersion: 1,
    // Record a deterministic synthetic export time for evidence repeatability.
    exportedAt: completedAt + 1_000,
    // Match the current local data schema after the version-one migration.
    dataSchemaVersion: 2,
    // Group each structured store under the reviewed portable record boundary.
    records: {
      // Include one active task so import and exact-scope deletion can inspect preservation.
      tasks: [
        {
          id: 7,
          title: "Synthetic release task",
          estimatedSessions: 2,
          completed: false,
          completedSessions: 1,
          lastCarriedAt: null,
          createdAt: completedAt - 5_000,
          updatedAt: completedAt - 1_000,
        },
      ],
      // Include one completed session so history controls have observable work to remove.
      sessions: [
        {
          id: completedAt,
          completedAt,
          plannedSeconds: 1_500,
          intention: "Verify local release data",
          taskTitle: "Synthetic release task",
        },
      ],
      // Include one captured thought so clear-history covers every promised history store.
      distractions: [
        {
          id: 3,
          text: "Synthetic follow-up",
          resolution: "kept",
          capturedAt: completedAt - 500,
        },
      ],
      // Include the reflection paired with the synthetic completed session.
      reflections: [
        {
          sessionId: completedAt,
          nextStep: "Publish after verification",
          focusRating: 4,
          notes: "Synthetic evidence only",
          status: "saved",
        },
      ],
    },
    // Carry the workspace pointer so restores rebuild the exact planning context.
    workspace: {
      intention: "Synthetic release intention",
      activeTaskId: 7,
    },
  };
  // Close the deterministic backup builder after returning every required store.
}

// Prove the registered Dexie upgrade preserves an older task while filling newer fields.
test("migrates a version-one task without losing visitor wording", async ({ page, baseURL }) => {
  // Require the configured application address before leaving the app origin temporarily.
  if (!baseURL) throw new Error("The migration test requires the configured base URL.");
  // Block application scripts once so setup receives the trusted origin without opening Dexie.
  await page.route("**/*.js", (route) => route.abort());
  // Load only the same-origin HTML document needed to grant IndexedDB access safely.
  await page.goto(baseURL);
  // Remove the temporary script block before the real migrated application navigation.
  await page.unroute("**/*.js");
  // Create the exact older browser schema through native IndexedDB before the app opens it.
  await page.evaluate(async () => {
    // Wait for version-one creation and its seed transaction to finish completely.
    await new Promise<void>((resolve, reject) => {
      // Open the release database explicitly at its legacy native version.
      const request = indexedDB.open("pomorise-first-light", 1);
      // Create every original object store and index during the native upgrade event.
      request.onupgradeneeded = () => {
        // Read the upgrade connection supplied by the browser.
        const database = request.result;
        // Create the task store used by the migration assertion.
        const tasks = database.createObjectStore("tasks", { keyPath: "id" });
        // Match the original task indexes registered by Dexie version one.
        tasks.createIndex("completed", "completed");
        tasks.createIndex("updatedAt", "updatedAt");
        // Create the remaining stores so the application sees a complete old schema.
        const sessions = database.createObjectStore("sessions", { keyPath: "id" });
        // Match the original completed-session lookup index.
        sessions.createIndex("completedAt", "completedAt");
        // Create captured-thought storage with its two original indexes.
        const distractions = database.createObjectStore("distractions", { keyPath: "id" });
        // Match the original resolution lookup index.
        distractions.createIndex("resolution", "resolution");
        // Match the original capture-time lookup index.
        distractions.createIndex("capturedAt", "capturedAt");
        // Create the reflection store and its original review-status index.
        const reflections = database.createObjectStore("reflections", { keyPath: "sessionId" });
        // Match the original status lookup index.
        reflections.createIndex("status", "status");
        // Create metadata storage used for the active plan identity.
        database.createObjectStore("meta", { keyPath: "key" });
        // Close legacy object-store creation after reproducing version one faithfully.
      };
      // Seed a task that deliberately lacks the two version-two fields.
      request.onsuccess = () => {
        // Keep all old seed values in one transaction so setup cannot be partially applied.
        const transaction = request.result.transaction(["tasks", "meta"], "readwrite");
        // Preserve synthetic visitor wording and older timestamps for the upgrade assertion.
        transaction.objectStore("tasks").put({
          id: 1,
          title: "Legacy synthetic task",
          estimatedSessions: 2,
          completed: false,
          createdAt: 1_700_000_000_000,
          updatedAt: 1_700_000_000_500,
        });
        // Make the legacy task active so hydration exercises metadata as well as task records.
        transaction.objectStore("meta").put({
          key: "focus-plan",
          value: { intention: "Preserve this synthetic plan", activeTaskId: 1 },
        });
        // Resolve only after the seed transaction is durably committed.
        transaction.oncomplete = () => {
          // Close setup so the application can reopen the database at version two.
          request.result.close();
          // Release the setup promise after the connection no longer blocks migration.
          resolve();
          // Close the completed transaction callback after successful setup.
        };
        // Surface a seed failure rather than allowing a false migration result.
        transaction.onerror = () =>
          reject(transaction.error ?? new Error("Legacy seed transaction failed."));
        // Close the successful open callback after registering transaction outcomes.
      };
      // Surface native open failures with their original browser error.
      request.onerror = () =>
        reject(request.error ?? new Error("Legacy database creation failed."));
      // Close the setup promise after defining every native IndexedDB event.
    });
    // Close browser-side legacy setup after its transaction is durable.
  });
  // Open the production build so Dexie performs the registered version-two upgrade.
  await page.goto(baseURL);
  // Require preserved visitor wording in the hydrated interface after migration.
  await expect(page.getByText("Legacy synthetic task", { exact: true }).first()).toBeVisible();
  // Inspect the migrated record directly to prove both defaulted fields were written.
  const migratedTask = await page.evaluate(async () => {
    // Open the now-current native database version without changing it.
    const request = indexedDB.open("pomorise-first-light");
    // Return the migrated task after the database connection succeeds.
    return await new Promise<Record<string, unknown>>((resolve, reject) => {
      // Read the preserved task through a read-only transaction.
      request.onsuccess = () => {
        // Open the task store without permitting mutation during verification.
        const transaction = request.result.transaction("tasks", "readonly");
        // Request the one synthetic legacy identity.
        const getRequest = transaction.objectStore("tasks").get(1);
        // Return the migrated record and close the temporary connection.
        getRequest.onsuccess = () => {
          // Preserve the returned plain object before closing its connection.
          const result = getRequest.result as Record<string, unknown>;
          // Release the native connection after the requested record is available.
          request.result.close();
          // Resolve with the migrated value for Node-side assertions.
          resolve(result);
          // Close the successful record-read callback.
        };
        // Surface a record-read error to prevent a false pass.
        getRequest.onerror = () =>
          reject(getRequest.error ?? new Error("Migrated task read failed."));
        // Close the successful database-open callback.
      };
      // Surface an unexpected current-database open failure.
      request.onerror = () => reject(request.error ?? new Error("Migrated database open failed."));
      // Close the verification promise after defining its native events.
    });
    // Close the browser-side migration inspection after returning the plain record.
  });
  // Require the migration to initialize the newly introduced completion counter safely.
  expect(migratedTask.completedSessions).toBe(0);
  // Require the migration to represent missing carry history explicitly as null.
  expect(migratedTask.lastCarriedAt).toBeNull();
  // Close the migration case after checking interface and storage evidence.
});

// Verify structured planning data survives a complete document and page-instance restart.
test("restores focus data after closing and reopening the page", async ({ context, page }) => {
  // Open a clean application page and wait for storage hydration to finish through visible UI.
  await page.goto("./");
  // Enter a synthetic intention through the primary planning field.
  await page
    .getByRole("textbox", { name: "What will you move forward?" })
    .fill("Synthetic restart intention");
  // Allow the coherent delayed IndexedDB save to commit before closing the document.
  await page.waitForTimeout(500);
  // Close the complete page so React and its database connection are destroyed.
  await page.close();
  // Create another page in the same browser profile to model a normal reopen.
  const reopenedPage = await context.newPage();
  // Load the application again from its production repository path.
  await reopenedPage.goto("./");
  // Require the saved intention to hydrate into the new React instance.
  await expect(
    reopenedPage.getByRole("textbox", { name: "What will you move forward?" }),
  ).toHaveValue("Synthetic restart intention");
  // Close the restart case after observing durable visitor-facing state.
});

// Verify malformed import is inert and a valid import applies only after preview confirmation.
test("previews valid backup replacement and rejects malformed input without partial writes", async ({
  page,
}) => {
  // Open the application and place one existing value at risk before testing malformed input.
  await page.goto("./");
  // Enter synthetic existing data that must survive a rejected file.
  await page
    .getByRole("textbox", { name: "What will you move forward?" })
    .fill("Keep after malformed import");
  // Wait for the existing value to reach IndexedDB before opening ownership controls.
  await page.waitForTimeout(500);
  // Navigate to the local import controls.
  await openDataControls(page);
  // Select malformed JSON through the hidden native file input without touching the filesystem.
  await page.locator('input[type="file"]').setInputFiles({
    name: "malformed.json",
    mimeType: "application/json",
    buffer: Buffer.from("{not compatible}"),
  });
  // Require a clear compatibility message rather than a partial preview or transaction.
  await expect(page.getByText("This file is not a compatible Pomorise backup.")).toBeVisible();
  // Close settings and prove the preexisting structured value remains unchanged.
  await page.getByRole("button", { name: "Done" }).click();
  // Require the original intention after the malformed local read failed safely.
  await expect(page.getByRole("textbox", { name: "What will you move forward?" })).toHaveValue(
    "Keep after malformed import",
  );
  // Reopen ownership controls for a fully valid transactional replacement.
  await openDataControls(page);
  // Supply a complete deterministic backup as an in-memory browser upload.
  await page.locator('input[type="file"]').setInputFiles({
    name: "synthetic-backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(syntheticBackup())),
  });
  // Require the native file control to clear without an asynchronous React currentTarget error.
  await expect(page.locator('input[type="file"]')).toHaveValue("");
  // Require preview counts before the test is allowed to confirm replacement.
  await expect(page.getByText(/1 tasks · 1 sessions · 1 captured thoughts/)).toBeVisible();
  // Require the preview to disclose that planning context travels with this backup.
  await expect(page.getByText(/intention and selected task included/)).toBeVisible();
  // Confirm the explicit replacement action after validation and preview.
  await page.getByRole("button", { name: "Replace local records" }).click();
  // Require refreshed local counts from the committed transaction.
  await expect(page.getByLabel("Local record summary")).toContainText("1 tasks");
  // Close settings to inspect the imported visitor-facing task.
  await page.getByRole("button", { name: "Done" }).click();
  // Require the imported task title inside the plan list after reducers synchronize.
  await expect(
    page.getByLabel("Unfinished tasks").getByText("Synthetic release task"),
  ).toBeVisible();
  // Require the selected-task marker so the workspace pointer proves part of the restore.
  await expect(page.getByText("1 selected")).toBeVisible();
  // Require the imported intention so workspace metadata proves part of the atomic restore.
  await expect(page.getByRole("textbox", { name: "What will you move forward?" })).toHaveValue(
    "Synthetic release intention",
  );
  // Close the import case after proving rejection safety, preview, commit, and derived UI.
});

// Verify oversized selections are refused before their contents are read into memory.
test("rejects oversized backup files before reading them", async ({ page }) => {
  // Open the application and navigate directly to the ownership controls.
  await page.goto("./");
  // Open the data panel so the hidden import control becomes available.
  await openDataControls(page);
  // Select a synthetic one-byte-too-large file without touching the real filesystem.
  await page.locator('input[type="file"]').setInputFiles({
    name: "oversized.json",
    mimeType: "application/json",
    buffer: Buffer.alloc(5_000_001, 32),
  });
  // Require the friendly size message instead of a frozen interface or parse error.
  await expect(page.getByText("Backup files must be 5 MB or smaller.")).toBeVisible();
  // Close the oversized-file case after proving the early size boundary holds.
});

// Verify each destructive scope removes exactly the records promised by its confirmation text.
test("preserves tasks during history clearing and removes them during focus-data deletion", async ({
  page,
}) => {
  // Open the application and navigate directly to local ownership controls.
  await page.goto("./");
  // Open the data panel before importing deterministic records for deletion checks.
  await openDataControls(page);
  // Load the complete synthetic record set through the public import boundary.
  await page.locator('input[type="file"]').setInputFiles({
    name: "synthetic-deletion-backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(syntheticBackup())),
  });
  // Confirm replacement only after the validated preview is available.
  await page.getByRole("button", { name: "Replace local records" }).click();
  // Begin the exact-scope history confirmation.
  await page.getByRole("button", { name: "Clear history" }).click();
  // Require the confirmation to state the preserved and removed scopes explicitly.
  await expect(page.getByText(/Tasks and preferences stay/)).toBeVisible();
  // Commit the history-only deletion.
  await page.getByRole("button", { name: "Yes, clear history" }).click();
  // Require the task count to remain while session and capture counts become zero.
  await expect(page.getByLabel("Local record summary")).toContainText("1 tasks");
  // Require completed sessions to be absent after verified history clearing.
  await expect(page.getByLabel("Local record summary")).toContainText("0 sessions");
  // Require captured thoughts to be absent after verified history clearing.
  await expect(page.getByLabel("Local record summary")).toContainText("0 captured thoughts");
  // Begin the separate all-focus-data confirmation.
  await page.getByRole("button", { name: "Delete all focus data" }).click();
  // Commit removal of the remaining structured records.
  await page.getByRole("button", { name: "Yes, delete focus data" }).click();
  // Require every visible structured count to be zero after post-delete verification.
  await expect(page.getByLabel("Local record summary")).toContainText("0 tasks");
  // Close the deletion-scope case after observing both preservation and complete removal.
});

// Verify resetting preferences preserves focus data and declined persistence remains non-blocking.
test("resets only preferences and continues when storage protection is declined", async ({
  page,
}) => {
  // Force the optional persistence API to report a supported but declined request deterministically.
  await page.addInitScript(() => {
    // Replace only the two optional methods while retaining the browser-owned storage object.
    Object.defineProperty(navigator.storage, "persisted", {
      configurable: true,
      value: () => Promise.resolve(false),
    });
    // Return a declined result without throwing so the application can explain best-effort storage.
    Object.defineProperty(navigator.storage, "persist", {
      configurable: true,
      value: () => Promise.resolve(false),
    });
    // Close optional storage stubbing after defining the deterministic permission state.
  });
  // Open the application and create focus data that preference reset must preserve.
  await page.goto("./");
  // Let initial IndexedDB hydration finish so it cannot overwrite later synthetic input.
  await page.waitForTimeout(400);
  // Enter a synthetic focus intention before changing preferences.
  await page
    .getByRole("textbox", { name: "What will you move forward?" })
    .fill("Preserve while resetting preferences");
  // Open settings and choose values that differ visibly from defaults.
  await page.getByRole("button", { name: "Settings" }).click();
  // Select explicit dark appearance before resetting to system.
  await page.getByRole("radio", { name: "Dark" }).check();
  // Change the focus duration from the default twenty-five minutes.
  await page.getByLabel("Focus minutes").fill("40");
  // Move to the exact-scope data controls within the same dialog.
  await page.getByRole("tab", { name: "Data & privacy" }).click();
  // Begin the preference-only reset confirmation.
  await page.getByRole("button", { name: "Reset preferences" }).click();
  // Require the confirmation to promise that tasks and history remain.
  await expect(page.getByText(/Tasks and history stay/)).toBeVisible();
  // Apply the reset through its explicit confirmation action.
  await page.getByRole("button", { name: "Yes, reset preferences" }).click();
  // Exercise the optional persistent-storage request after its plain-language explanation.
  await page.getByRole("button", { name: "Ask browser to keep Pomorise data" }).click();
  // Require an honest best-effort result without disabling backup or timer behavior.
  await expect(page.getByText(/browser kept best-effort storage/)).toBeVisible();
  // Return to preferences to inspect both default owners visibly.
  await page.getByRole("tab", { name: "Preferences" }).click();
  // Require appearance to return to its system-following default.
  await expect(page.getByRole("radio", { name: "System" })).toBeChecked();
  // Require focus duration to return to the reviewed twenty-five-minute default.
  await expect(page.getByLabel("Focus minutes")).toHaveValue("25");
  // Close settings so preserved structured focus data can be inspected.
  await page.getByRole("button", { name: "Done" }).click();
  // Require the personal planning value to remain untouched by preference reset.
  await expect(page.getByRole("textbox", { name: "What will you move forward?" })).toHaveValue(
    "Preserve while resetting preferences",
  );
  // Require the primary timer to remain available after declined optional persistence.
  await expect(page.getByRole("button", { name: "Start focus" })).toBeEnabled();
  // Close the preference and permission case after proving both graceful boundaries.
});
