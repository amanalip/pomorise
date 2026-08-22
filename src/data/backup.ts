// Import Zod to treat every selected backup file as untrusted local input.
import { z } from "zod";
// Reuse the exact database record validators so storage and backup boundaries cannot drift.
import {
  DATA_SCHEMA_VERSION,
  planMetaSchema,
  storedDistractionSchema,
  storedReflectionSchema,
  storedSessionSchema,
  storedTaskSchema,
  type PomoriseDatabase,
  pomoriseDatabase,
} from "./database";

// Cap imports before parsing so an accidental huge file cannot freeze the focus interface.
export const MAX_BACKUP_BYTES = 5_000_000;

// Validate the complete portable format and reject unknown future versions safely.
export const backupSchema = z.object({
  product: z.literal("Pomorise"),
  formatVersion: z.literal(1),
  exportedAt: z.number().finite(),
  dataSchemaVersion: z.literal(DATA_SCHEMA_VERSION),
  records: z.object({
    tasks: z.array(storedTaskSchema).max(10_000),
    sessions: z.array(storedSessionSchema).max(100_000),
    distractions: z.array(storedDistractionSchema).max(100_000),
    reflections: z.array(storedReflectionSchema).max(100_000),
  }),
  // Carry the optional intention and selected task so restores rebuild the full workspace.
  workspace: planMetaSchema.optional(),
});

// Export the inferred trusted contract for previews and transactional restore.
export type PomoriseBackup = z.infer<typeof backupSchema>;

// Build and validate a complete backup without transmitting a single record.
export async function createBackup(
  database: PomoriseDatabase = pomoriseDatabase,
): Promise<PomoriseBackup> {
  const [tasks, sessions, distractions, reflections, planMeta] = await Promise.all([
    database.tasks.toArray(),
    database.sessions.toArray(),
    database.distractions.toArray(),
    database.reflections.toArray(),
    database.meta.get("focus-plan"),
  ]);
  const backup = {
    product: "Pomorise" as const,
    formatVersion: 1 as const,
    exportedAt: Date.now(),
    dataSchemaVersion: DATA_SCHEMA_VERSION,
    records: { tasks, sessions, distractions, reflections },
    // Include the workspace pointer so a restore returns the exact planning context.
    workspace: planMetaSchema.parse(planMeta?.value),
  };
  return backupSchema.parse(backup);
}

// Parse a selected file locally and return only a fully validated previewable backup.
export function parseBackupText(text: string): PomoriseBackup {
  if (new Blob([text]).size > MAX_BACKUP_BYTES)
    throw new Error("Backup files must be 5 MB or smaller.");
  try {
    return backupSchema.parse(JSON.parse(text));
  } catch (error) {
    if (error instanceof Error && error.message.includes("5 MB")) throw error;
    throw new Error("This file is not a compatible Pomorise backup.");
  }
}

// Replace structured records inside one transaction so imports never apply partially.
export async function replaceFromBackup(
  backup: PomoriseBackup,
  database: PomoriseDatabase = pomoriseDatabase,
): Promise<void> {
  const trusted = backupSchema.parse(backup);
  await database.transaction(
    "rw",
    [database.tasks, database.sessions, database.distractions, database.reflections, database.meta],
    async () => {
      await Promise.all([
        database.tasks.clear(),
        database.sessions.clear(),
        database.distractions.clear(),
        database.reflections.clear(),
      ]);
      await database.tasks.bulkPut(trusted.records.tasks);
      await database.sessions.bulkPut(trusted.records.sessions);
      await database.distractions.bulkPut(trusted.records.distractions);
      await database.reflections.bulkPut(trusted.records.reflections);
      // Restore the intention and selected task inside the same atomic transaction.
      if (trusted.workspace) {
        await database.meta.put({ key: "focus-plan", value: trusted.workspace });
      }
      // Leave existing planning metadata untouched when an older backup omits it.
    },
  );
}

// Escape a value according to the common CSV quoting rules used by spreadsheet software.
function csvCell(value: string | number | null): string {
  const text = value === null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

// Create a portable session-history table with no dependency on a charting or cloud service.
export function createSessionCsv(records: PomoriseBackup["records"]["sessions"]): string {
  const header = ["completed_at", "planned_minutes", "intention", "task"];
  const rows = records.map((session) => [
    new Date(session.completedAt).toISOString(),
    Math.round(session.plannedSeconds / 60),
    session.intention,
    session.taskTitle,
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
}
