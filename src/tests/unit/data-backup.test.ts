// Import Vitest helpers for deterministic local backup boundary tests.
import { describe, expect, it } from "vitest";
// Import the pure validators and CSV serializer without opening browser IndexedDB.
import { createSessionCsv, parseBackupText } from "../../data/backup";

// Build the smallest valid versioned backup shared by validation cases.
function validBackup() {
  return {
    product: "Pomorise",
    formatVersion: 1,
    exportedAt: 1_800_000_000_000,
    dataSchemaVersion: 2,
    records: {
      tasks: [],
      sessions: [
        {
          id: 1_800_000_000_000,
          completedAt: 1_800_000_000_000,
          plannedSeconds: 1_500,
          intention: "Draft, then review",
          taskTitle: 'Write "First Light"',
        },
      ],
      distractions: [],
      reflections: [],
    },
  };
}

// Protect imports from malformed shapes and preserve portable session wording safely.
describe("Phase 5 local backup boundary", () => {
  // Accept a complete compatible backup after checking every nested record.
  it("validates a compatible versioned backup", () => {
    const parsed = parseBackupText(JSON.stringify(validBackup()));
    expect(parsed.records.sessions).toHaveLength(1);
    expect(parsed.dataSchemaVersion).toBe(2);
  });

  // Reject unknown formats before any database transaction can begin.
  it("rejects malformed and future backup formats", () => {
    expect(() => parseBackupText("not json")).toThrow("not a compatible Pomorise backup");
    expect(() => parseBackupText(JSON.stringify({ ...validBackup(), formatVersion: 99 }))).toThrow(
      "not a compatible Pomorise backup",
    );
  });

  // Accept workspace metadata while keeping older workspace-free backups importable.
  it("optionally carries the intention and selected task for complete restores", () => {
    const enriched = parseBackupText(
      JSON.stringify({
        ...validBackup(),
        workspace: { intention: "Verify restore context", activeTaskId: null },
      }),
    );
    expect(enriched.workspace).toEqual({
      intention: "Verify restore context",
      activeTaskId: null,
    });
    // Prove the original version-one shape remains valid without workspace metadata.
    const legacy = parseBackupText(JSON.stringify(validBackup()));
    expect(legacy.workspace).toBeUndefined();
  });

  // Escape commas and quotation marks so visitor wording stays in the intended CSV cells.
  it("creates a spreadsheet-friendly session CSV", () => {
    const csv = createSessionCsv(parseBackupText(JSON.stringify(validBackup())).records.sessions);
    expect(csv).toContain('"Draft, then review"');
    expect(csv).toContain('"Write ""First Light"""');
    expect(csv.split("\r\n")).toHaveLength(2);
  });
});
