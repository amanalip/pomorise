// Import Dexie primitives for a typed, transactional wrapper around browser IndexedDB.
import Dexie, { type EntityTable } from "dexie";
// Import Zod so records read from browser storage remain untrusted until validated.
import { z } from "zod";
// Import the public focus contracts used to restore reducer state safely.
import type { FocusJourneyState, SessionRecord, Distraction } from "../focus/journey";
import type { FocusPlanState, FocusTask } from "../focus/planning";

// Keep the public storage version explicit for backups, diagnostics, and future migrations.
export const DATA_SCHEMA_VERSION = 2;
// Name the local database clearly so browser storage panels are understandable.
export const DATABASE_NAME = "pomorise-first-light";

// Store planning records with timestamps without weakening the reducer's compact task model.
export interface StoredTask extends FocusTask {
  createdAt: number;
  updatedAt: number;
}

// Keep session identity aligned with its immutable completion boundary.
export interface StoredSession extends Omit<
  SessionRecord,
  "nextStep" | "focusRating" | "notes" | "reflectionStatus"
> {
  id: number;
}

// Separate reflection details so deletion and migrations can honor exact data scopes.
export interface StoredReflection {
  sessionId: number;
  nextStep: string;
  focusRating: number | null;
  notes: string;
  status: SessionRecord["reflectionStatus"];
}

// Add a capture timestamp while preserving the Phase 4 distraction contract in React.
export interface StoredDistraction extends Distraction {
  capturedAt: number;
}

// Keep small database coordination values outside personal record stores.
export interface StoredMeta {
  key: string;
  value: unknown;
}

// Validate one task before allowing it to hydrate application state.
export const storedTaskSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().trim().min(1).max(100),
  estimatedSessions: z.number().int().min(1).max(8),
  completed: z.boolean(),
  completedSessions: z.number().int().nonnegative(),
  lastCarriedAt: z.number().finite().nullable(),
  createdAt: z.number().finite(),
  updatedAt: z.number().finite(),
});

// Validate one completed focus record at the IndexedDB trust boundary.
export const storedSessionSchema = z.object({
  id: z.number().finite(),
  completedAt: z.number().finite(),
  plannedSeconds: z.number().int().nonnegative(),
  intention: z.string().max(120),
  taskTitle: z.string().max(100).nullable(),
});

// Validate optional reflection fields independently from the session record.
export const storedReflectionSchema = z.object({
  sessionId: z.number().finite(),
  nextStep: z.string().max(120),
  focusRating: z.number().int().min(1).max(5).nullable(),
  notes: z.string().max(500),
  status: z.enum(["pending", "saved", "skipped"]),
});

// Validate captured visitor text and its bounded review outcome.
export const storedDistractionSchema = z.object({
  id: z.number().int().positive(),
  text: z.string().trim().min(1).max(160),
  resolution: z.enum(["pending", "task", "kept", "dismissed"]),
  capturedAt: z.number().finite(),
});

// Extend Dexie with typed tables while leaving schema upgrades explicit below.
export class PomoriseDatabase extends Dexie {
  tasks!: EntityTable<StoredTask, "id">;
  sessions!: EntityTable<StoredSession, "id">;
  distractions!: EntityTable<StoredDistraction, "id">;
  reflections!: EntityTable<StoredReflection, "sessionId">;
  meta!: EntityTable<StoredMeta, "key">;

  // Register every durable schema in order so Dexie can upgrade older browser profiles safely.
  constructor() {
    super(DATABASE_NAME);
    // Preserve the First Light version-one store layout as the migration starting point.
    this.version(1).stores({
      tasks: "id, completed, updatedAt",
      sessions: "id, completedAt",
      distractions: "id, resolution, capturedAt",
      reflections: "sessionId, status",
      meta: "key",
    });
    // Introduce version two without changing indexes so existing records remain addressable.
    this.version(DATA_SCHEMA_VERSION)
      .stores({
        tasks: "id, completed, updatedAt",
        sessions: "id, completedAt",
        distractions: "id, resolution, capturedAt",
        reflections: "sessionId, status",
        meta: "key",
      })
      // Fill fields absent from early synthetic records before current validation reads them.
      .upgrade(async (transaction) => {
        // Modify records in the upgrade transaction so a failure rolls back the whole migration.
        await transaction
          .table("tasks")
          .toCollection()
          .modify((task: Record<string, unknown>) => {
            // Older tasks had no completed-session counter, so begin their preserved count at zero.
            if (typeof task.completedSessions !== "number") task.completedSessions = 0;
            // Older tasks had no carry-forward timestamp, so represent that history honestly as absent.
            if (!("lastCarriedAt" in task)) task.lastCarriedAt = null;
            // Recover a missing creation time from the older update time when it is trustworthy.
            if (typeof task.createdAt !== "number") {
              // Use the old update timestamp or zero rather than inventing the time of migration.
              task.createdAt = typeof task.updatedAt === "number" ? task.updatedAt : 0;
              // Close the creation-time recovery after assigning a deterministic finite value.
            }
            // Recover a missing update time from the normalized creation time for validation safety.
            if (typeof task.updatedAt !== "number") task.updatedAt = task.createdAt;
            // Close the per-task migration after preserving identity and visitor-authored wording.
          });
        // Close the atomic version-two upgrade after every legacy task is normalized.
      });
  }
}

// Share one database connection across the application without creating a remote dependency.
export const pomoriseDatabase = new PomoriseDatabase();

// Describe the complete reducer snapshot restored from separate structured stores.
export interface LocalWorkspaceSnapshot {
  plan: FocusPlanState;
  journey: FocusJourneyState;
}

// Read and validate every personal record before it reaches React application state.
export async function loadLocalWorkspace(
  database: PomoriseDatabase = pomoriseDatabase,
): Promise<LocalWorkspaceSnapshot> {
  const [rawTasks, rawSessions, rawDistractions, rawReflections, planMeta] = await Promise.all([
    database.tasks.toArray(),
    database.sessions.toArray(),
    database.distractions.toArray(),
    database.reflections.toArray(),
    database.meta.get("focus-plan"),
  ]);
  const tasks = z.array(storedTaskSchema).parse(rawTasks);
  const sessions = z.array(storedSessionSchema).parse(rawSessions);
  const distractions = z.array(storedDistractionSchema).parse(rawDistractions);
  const reflections = z.array(storedReflectionSchema).parse(rawReflections);
  const planMetadata = z
    .object({
      intention: z.string().max(120),
      activeTaskId: z.number().int().positive().nullable(),
    })
    .catch({ intention: "", activeTaskId: null })
    .parse(planMeta?.value);
  const reflectionBySession = new Map(reflections.map((item) => [item.sessionId, item]));
  const planTasks: FocusTask[] = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    estimatedSessions: task.estimatedSessions,
    completed: task.completed,
    completedSessions: task.completedSessions,
    lastCarriedAt: task.lastCarriedAt,
  }));
  const journeySessions: SessionRecord[] = sessions.map((session) => {
    const reflection = reflectionBySession.get(session.completedAt);
    return {
      completedAt: session.completedAt,
      plannedSeconds: session.plannedSeconds,
      intention: session.intention,
      taskTitle: session.taskTitle,
      nextStep: reflection?.nextStep ?? "",
      focusRating: reflection?.focusRating ?? null,
      notes: reflection?.notes ?? "",
      reflectionStatus: reflection?.status ?? "pending",
    };
  });
  return {
    plan: {
      intention: planMetadata.intention,
      tasks: planTasks,
      activeTaskId: planTasks.some(
        (task) => task.id === planMetadata.activeTaskId && !task.completed,
      )
        ? planMetadata.activeTaskId
        : null,
      nextTaskId: Math.max(0, ...planTasks.map((task) => task.id)) + 1,
    },
    journey: {
      distractions: distractions.map((item) => ({
        id: item.id,
        text: item.text,
        resolution: item.resolution,
      })),
      sessions: journeySessions,
      nextDistractionId: Math.max(0, ...distractions.map((item) => item.id)) + 1,
    },
  };
}

// Persist one coherent reducer snapshot in a single all-or-nothing local transaction.
export async function saveLocalWorkspace(
  snapshot: LocalWorkspaceSnapshot,
  database: PomoriseDatabase = pomoriseDatabase,
): Promise<void> {
  const now = Date.now();
  await database.transaction(
    "rw",
    [database.tasks, database.sessions, database.distractions, database.reflections, database.meta],
    async () => {
      const previousTasks = new Map(
        (await database.tasks.toArray()).map((task) => [task.id, task]),
      );
      await database.tasks.clear();
      await database.sessions.clear();
      await database.distractions.clear();
      await database.reflections.clear();
      await database.tasks.bulkPut(
        snapshot.plan.tasks.map((task) => ({
          ...task,
          createdAt: previousTasks.get(task.id)?.createdAt ?? now,
          updatedAt: now,
        })),
      );
      await database.sessions.bulkPut(
        snapshot.journey.sessions.map((session) => ({
          id: session.completedAt,
          completedAt: session.completedAt,
          plannedSeconds: session.plannedSeconds,
          intention: session.intention,
          taskTitle: session.taskTitle,
        })),
      );
      await database.distractions.bulkPut(
        snapshot.journey.distractions.map((item) => ({ ...item, capturedAt: now })),
      );
      await database.reflections.bulkPut(
        snapshot.journey.sessions.map((session) => ({
          sessionId: session.completedAt,
          nextStep: session.nextStep,
          focusRating: session.focusRating,
          notes: session.notes,
          status: session.reflectionStatus,
        })),
      );
      await database.meta.put({
        key: "focus-plan",
        value: { intention: snapshot.plan.intention, activeTaskId: snapshot.plan.activeTaskId },
      });
    },
  );
}

// Count local records for transparent settings summaries and post-delete verification.
export async function countLocalRecords(database: PomoriseDatabase = pomoriseDatabase) {
  const [tasks, sessions, distractions, reflections] = await Promise.all([
    database.tasks.count(),
    database.sessions.count(),
    database.distractions.count(),
    database.reflections.count(),
  ]);
  return { tasks, sessions, distractions, reflections };
}

// Remove history while preserving the visitor's current task plan and preferences.
export async function clearLocalHistory(database: PomoriseDatabase = pomoriseDatabase) {
  await database.transaction(
    "rw",
    [database.sessions, database.distractions, database.reflections],
    async () => {
      await Promise.all([
        database.sessions.clear(),
        database.distractions.clear(),
        database.reflections.clear(),
      ]);
    },
  );
}

// Remove all structured personal records and verify the promised empty outcome.
export async function deleteAllLocalData(database: PomoriseDatabase = pomoriseDatabase) {
  await database.transaction(
    "rw",
    [database.tasks, database.sessions, database.distractions, database.reflections, database.meta],
    async () => {
      await Promise.all([
        database.tasks.clear(),
        database.sessions.clear(),
        database.distractions.clear(),
        database.reflections.clear(),
        database.meta.clear(),
      ]);
    },
  );
  const counts = await countLocalRecords(database);
  if (Object.values(counts).some((count) => count !== 0)) {
    throw new Error("Pomorise could not verify that every local record was deleted.");
  }
}
