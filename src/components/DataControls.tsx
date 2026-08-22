// Import React state tools for local backup previews, confirmations, and status feedback.
import { useEffect, useRef, useState, type ChangeEvent } from "react";
// Import project-owned controls so privacy actions share the application interaction language.
import { Button, Notice } from "./ui";
// Import local-only backup helpers that never upload the visitor's selected file.
import {
  createBackup,
  createSessionCsv,
  MAX_BACKUP_BYTES,
  parseBackupText,
  replaceFromBackup,
  type PomoriseBackup,
} from "../data/backup";
// Import database controls and diagnostics from the single typed data boundary.
import {
  countLocalRecords,
  DATA_SCHEMA_VERSION,
  deleteAllLocalData,
  clearLocalHistory,
  loadLocalWorkspace,
  type LocalWorkspaceSnapshot,
} from "../data/database";

// Keep the application version visible by reading the value inlined from package.json.
const APPLICATION_VERSION = __APP_VERSION__;

// Describe the callback used to synchronize React after transactional database changes.
interface DataControlsProps {
  onWorkspaceChange: (snapshot: LocalWorkspaceSnapshot) => void;
  onResetPreferences: () => void;
  onWorkspaceMutationStart: () => void;
}

// Download one locally-created file and revoke its temporary browser URL immediately afterward.
function downloadLocalFile(contents: string, type: string, filename: string) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

// Present understandable data ownership controls without turning settings into a technical console.
export function DataControls({
  onResetPreferences,
  onWorkspaceChange,
  onWorkspaceMutationStart,
}: DataControlsProps) {
  const [counts, setCounts] = useState({ tasks: 0, sessions: 0, distractions: 0, reflections: 0 });
  const [status, setStatus] = useState("");
  const [pendingBackup, setPendingBackup] = useState<PomoriseBackup | null>(null);
  const [confirmation, setConfirmation] = useState<"history" | "preferences" | "everything" | null>(
    null,
  );
  const [persistentState, setPersistentState] = useState<"unknown" | "granted" | "best-effort">(
    "unknown",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Refresh only aggregate counts so the overview never exposes personal wording unnecessarily.
  async function refreshCounts() {
    setCounts(await countLocalRecords());
  }

  // Load the current local summary and browser persistence status when this view opens.
  useEffect(() => {
    void refreshCounts().catch(() =>
      setStatus("Local storage is unavailable. Backup and deletion controls may not work here."),
    );
    if (navigator.storage?.persisted) {
      void navigator.storage
        .persisted()
        .then((persisted) => setPersistentState(persisted ? "granted" : "best-effort"));
    }
  }, []);

  // Export every structured record as a validated versioned JSON backup.
  async function exportJson() {
    try {
      const backup = await createBackup();
      downloadLocalFile(
        `${JSON.stringify(backup, null, 2)}\n`,
        "application/json",
        `pomorise-backup-${new Date(backup.exportedAt).toISOString().slice(0, 10)}.json`,
      );
      setStatus("Backup created on this device. Nothing was uploaded.");
    } catch {
      setStatus("Pomorise could not create a backup in this browser.");
    }
  }

  // Export only completed-session history as a spreadsheet-friendly local CSV file.
  async function exportCsv() {
    try {
      const backup = await createBackup();
      downloadLocalFile(
        `${createSessionCsv(backup.records.sessions)}\r\n`,
        "text/csv;charset=utf-8",
        `pomorise-sessions-${new Date().toISOString().slice(0, 10)}.csv`,
      );
      setStatus("Session history exported as CSV on this device.");
    } catch {
      setStatus("Pomorise could not create the CSV file in this browser.");
    }
  }

  // Read a selected backup locally and show counts before any record is changed.
  async function previewImport(event: ChangeEvent<HTMLInputElement>) {
    // Retain the element because React clears currentTarget after this async handler yields.
    const input = event.currentTarget;
    // Read the visitor-selected local file from the retained element before awaiting its contents.
    const file = input.files?.[0];
    if (!file) return;
    try {
      // Refuse oversized files before reading so a huge selection cannot freeze the interface.
      if (file.size > MAX_BACKUP_BYTES) throw new Error("Backup files must be 5 MB or smaller.");
      const backup = parseBackupText(await file.text());
      setPendingBackup(backup);
      setStatus("Backup checked. Review the preview before replacing local records.");
    } catch (error) {
      setPendingBackup(null);
      setStatus(error instanceof Error ? error.message : "This backup could not be read.");
    } finally {
      // Clear the retained element so choosing the same backup again triggers another change event.
      input.value = "";
    }
  }

  // Replace current structured records only after the visitor confirms the validated preview.
  async function confirmImport() {
    if (!pendingBackup) return;
    try {
      onWorkspaceMutationStart();
      await replaceFromBackup(pendingBackup);
      const snapshot = await loadLocalWorkspace();
      onWorkspaceChange(snapshot);
      setPendingBackup(null);
      await refreshCounts();
      setStatus("Backup restored. Your current preferences were kept.");
    } catch {
      setStatus("The restore was not applied. Your existing local records are unchanged.");
    }
  }

  // Ask the browser to reduce storage-eviction risk only after this explicit visitor action.
  async function requestPersistentStorage() {
    if (!navigator.storage?.persist) {
      setStatus("This browser does not offer a persistent-storage request. Backups still work.");
      return;
    }
    try {
      const granted = await navigator.storage.persist();
      setPersistentState(granted ? "granted" : "best-effort");
      setStatus(
        granted
          ? "Storage protection is on for this browser profile."
          : "The browser kept best-effort storage. Exported backups remain the safest copy.",
      );
    } catch {
      // Keep the interface calm when the browser refuses or fails the optional request.
      setStatus(
        "The storage-protection request could not be completed. Exported backups remain the safest copy.",
      );
    }
  }

  // Remove completed history after an inline confirmation while preserving tasks and preferences.
  async function confirmClearHistory() {
    try {
      onWorkspaceMutationStart();
      await clearLocalHistory();
      const snapshot = await loadLocalWorkspace();
      onWorkspaceChange(snapshot);
      setConfirmation(null);
      await refreshCounts();
      setStatus(
        "Session, reflection, and distraction history was deleted. Tasks and preferences remain.",
      );
    } catch {
      // Leave every record untouched and say so when the deletion cannot complete.
      setStatus("History could not be deleted right now. Your records are unchanged.");
    }
  }

  // Restore non-personal appearance and timer choices without changing tasks or completed history.
  function confirmResetPreferences() {
    onResetPreferences();
    setConfirmation(null);
    setStatus("Appearance and timer preferences were reset. Focus data remains on this device.");
  }

  // Remove all structured personal data only after a separate exact-scope confirmation.
  async function confirmDeleteEverything() {
    try {
      onWorkspaceMutationStart();
      await deleteAllLocalData();
      const snapshot = await loadLocalWorkspace();
      onWorkspaceChange(snapshot);
      setConfirmation(null);
      await refreshCounts();
      setStatus("All tasks and history were deleted from this browser. Preferences remain.");
    } catch {
      // Keep every record and say so when the verified deletion cannot complete.
      setStatus("Deletion could not be completed right now. Your records are unchanged.");
    }
  }

  return (
    <div className="data-controls">
      <section className="data-overview" aria-labelledby="local-data-title">
        <div>
          <span className="data-kicker">On this device</span>
          <h2 id="local-data-title">Your focus data stays yours</h2>
          <p>
            Pomorise stores your work in this browser profile. It has no account, cloud sync,
            analytics, or application telemetry.
          </p>
        </div>
        <div className="data-counts" aria-label="Local record summary">
          <span>
            <strong>{counts.tasks}</strong> tasks
          </span>
          <span>
            <strong>{counts.sessions}</strong> sessions
          </span>
          <span>
            <strong>{counts.distractions}</strong> captured thoughts
          </span>
        </div>
      </section>

      <section className="data-section" aria-labelledby="backup-title">
        <div className="data-section__heading">
          <div>
            <h2 id="backup-title">Backup and move</h2>
            <p>Downloads are created locally. Import replaces tasks and history after a preview.</p>
          </div>
          <span className="privacy-chip">No upload</span>
        </div>
        <div className="data-actions">
          <Button onClick={() => void exportJson()}>Download backup</Button>
          <Button onClick={() => void exportCsv()} variant="secondary">
            Export sessions CSV
          </Button>
          <Button onClick={() => fileInputRef.current?.click()} variant="secondary">
            Choose backup
          </Button>
          <input
            accept="application/json,.json"
            hidden
            onChange={(event) => void previewImport(event)}
            ref={fileInputRef}
            type="file"
          />
        </div>
        {pendingBackup && (
          <div className="import-preview">
            <div>
              <strong>Ready to restore</strong>
              <span>
                {pendingBackup.records.tasks.length} tasks · {pendingBackup.records.sessions.length}{" "}
                sessions · {pendingBackup.records.distractions.length} captured thoughts
                {pendingBackup.workspace
                  ? " · intention and selected task included"
                  : " · current intention stays"}
              </span>
            </div>
            <div className="data-actions">
              <Button onClick={() => void confirmImport()}>Replace local records</Button>
              <Button onClick={() => setPendingBackup(null)} variant="quiet">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </section>

      <section className="data-section" aria-labelledby="storage-title">
        <div className="data-section__heading">
          <div>
            <h2 id="storage-title">Storage protection</h2>
            <p>
              Pomorise saves tasks and history in this browser. If device storage runs low, the
              browser may remove that data automatically. This request asks the browser to keep it,
              but protection is not guaranteed. Private-browsing data remains temporary.
            </p>
          </div>
          <span className={`storage-state storage-state--${persistentState}`}>
            {persistentState === "granted" ? "Protected" : "Best effort"}
          </span>
        </div>
        {persistentState !== "granted" && (
          <Button onClick={() => void requestPersistentStorage()} variant="secondary">
            Ask browser to keep Pomorise data
          </Button>
        )}
      </section>

      <details className="data-details">
        <summary>Local diagnostics</summary>
        <dl>
          <div>
            <dt>Application version</dt>
            <dd>{APPLICATION_VERSION}</dd>
          </div>
          <div>
            <dt>Data schema</dt>
            <dd>{DATA_SCHEMA_VERSION}</dd>
          </div>
          <div>
            <dt>Reflection records</dt>
            <dd>{counts.reflections}</dd>
          </div>
          <div>
            <dt>Transmission</dt>
            <dd>None</dd>
          </div>
        </dl>
      </details>

      <section className="danger-zone" aria-labelledby="delete-title">
        <div>
          <h2 id="delete-title">Delete local data</h2>
          <p>
            Choose an exact scope. Pomorise verifies structured records before reporting success.
          </p>
        </div>
        {confirmation === null ? (
          <div className="data-actions">
            <Button onClick={() => setConfirmation("history")} variant="secondary">
              Clear history
            </Button>
            <Button onClick={() => setConfirmation("everything")} variant="quiet">
              Delete all focus data
            </Button>
            <Button onClick={() => setConfirmation("preferences")} variant="quiet">
              Reset preferences
            </Button>
          </div>
        ) : (
          <div className="delete-confirmation" role="alert">
            <strong>
              {confirmation === "history"
                ? "Delete history?"
                : confirmation === "preferences"
                  ? "Reset preferences?"
                  : "Delete all focus data?"}
            </strong>
            <p>
              {confirmation === "history"
                ? "Sessions, reflections, and captured thoughts will be removed. Tasks and preferences stay."
                : confirmation === "preferences"
                  ? "Appearance and timer choices return to their defaults. Tasks and history stay."
                  : "Tasks, sessions, reflections, and captured thoughts will be removed. This cannot be undone."}
            </p>
            <div className="data-actions">
              <Button
                onClick={() =>
                  confirmation === "preferences"
                    ? confirmResetPreferences()
                    : void (confirmation === "history"
                        ? confirmClearHistory()
                        : confirmDeleteEverything())
                }
              >
                {confirmation === "history"
                  ? "Yes, clear history"
                  : confirmation === "preferences"
                    ? "Yes, reset preferences"
                    : "Yes, delete focus data"}
              </Button>
              <Button onClick={() => setConfirmation(null)} variant="quiet">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </section>

      {status && <Notice role="status">{status}</Notice>}
    </div>
  );
}
