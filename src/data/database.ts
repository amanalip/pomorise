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

// Validate the saved intention and current-task pointer shared by hydration and backups.
export const planMetaSchema = z
  .object({
    intention: z.string().max(120),
    activeTaskId: z.number().int().positive().nullable(),
  })
  // Treat missing or malformed planning metadata as the calm empty workspace instead of failing.
  .catch({ intention: "", activeTaskId: null });

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
  const planMetadata = planMetaSchema.parse(planMeta?.value);
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

// Detect a visitor-meaningful task change so unrelated saves keep the honest update time.
function hasTaskMeaningChanged(previous: StoredTask | undefined, next: FocusTask): boolean {
  // Treat a brand-new record as changed so its first update time reflects creation.
  if (!previous) return true;
  // Compare exactly the planning values visitors can observe and edit.
  return (
    previous.title !== next.title ||
    previous.estimatedSessions !== next.estimatedSessions ||
    previous.completed !== next.completed ||
    previous.completedSessions !== next.completedSessions ||
    previous.lastCarriedAt !== next.lastCarriedAt
  );
}

// Detect a visitor-meaningful session change so history bytes stay stable between saves.
function hasSessionMeaningChanged(
  previous: StoredSession | undefined,
  next: LocalWorkspaceSnapshot["journey"]["sessions"][number],
): boolean {
  // Treat a brand-new record as changed so its completion is written exactly once.
  if (!previous) return true;
  // Compare the completed-session fields that visitors can review later.
  return (
    previous.plannedSeconds !== next.plannedSeconds ||
    previous.intention !== next.intention ||
    previous.taskTitle !== next.taskTitle
  );
}

// Detect a visitor-meaningful captured-thought change so saves touch only edited thoughts.
function hasDistractionMeaningChanged(
  previous: StoredDistraction | undefined,
  next: LocalWorkspaceSnapshot["journey"]["distractions"][number],
): boolean {
  // Treat a brand-new record as changed so its first write carries its capture moment.
  if (!previous) return true;
  // Compare the wording and review outcome while ignoring the preserved timestamp.
  return previous.text !== next.text || previous.resolution !== next.resolution;
}

// Detect a visitor-meaningful reflection change so quiet fields are never rewritten.
function hasReflectionMeaningChanged(
  previous: StoredReflection | undefined,
  next: StoredReflection,
): boolean {
  // Treat a brand-new record as changed so its first save lands durably.
  if (!previous) return true;
  // Compare every optional reflection field visitors can author.
  return (
    previous.nextStep !== next.nextStep ||
    previous.focusRating !== next.focusRating ||
    previous.notes !== next.notes ||
    previous.status !== next.status
  );
}

// Persist only new, changed, or removed records inside one all-or-nothing local transaction.
export async function saveLocalWorkspace(
  snapshot: LocalWorkspaceSnapshot,
  database: PomoriseDatabase = pomoriseDatabase,
): Promise<void> {
  const now = Date.now();
  await database.transaction(
    "rw",
    [database.tasks, database.sessions, database.distractions, database.reflections, database.meta],
    async () => {
      const [storedTasks, storedSessions, storedDistractions, storedReflections, storedMeta] =
        await Promise.all([
          database.tasks.toArray(),
          database.sessions.toArray(),
          database.distractions.toArray(),
          database.reflections.toArray(),
          database.meta.get("focus-plan"),
        ]);
      const taskById = new Map(storedTasks.map((task) => [task.id, task]));
      const sessionById = new Map(storedSessions.map((session) => [session.id, session]));
      const distractionById = new Map(storedDistractions.map((item) => [item.id, item]));
      const reflectionById = new Map(storedReflections.map((item) => [item.sessionId, item]));

      // Write only tasks that are new or meaningfully different from stored records.
      const changedTasks = snapshot.plan.tasks
        .filter((task) => hasTaskMeaningChanged(taskById.get(task.id), task))
        .map((task) => {
          // Find the stored twin so unchanged identity fields keep their original stamps.
          const previous = taskById.get(task.id);
          return {
            ...task,
            createdAt: previous?.createdAt ?? now,
            // Bump the update stamp only when this specific task actually changed.
            updatedAt: now,
          };
        });
      if (changedTasks.length > 0) await database.tasks.bulkPut(changedTasks);

      // Write only sessions whose reviewed history actually differs from storage.
      const changedSessions = snapshot.journey.sessions
        .filter((session) =>
          hasSessionMeaningChanged(sessionById.get(session.completedAt), session),
        )
        .map((session) => ({
          id: session.completedAt,
          completedAt: session.completedAt,
          plannedSeconds: session.plannedSeconds,
          intention: session.intention,
          taskTitle: session.taskTitle,
        }));
      if (changedSessions.length > 0) await database.sessions.bulkPut(changedSessions);

      // Write only captured thoughts that changed, preserving each honest capture moment.
      const changedDistractions = snapshot.journey.distractions
        .filter((item) => hasDistractionMeaningChanged(distractionById.get(item.id), item))
        .map((item) => ({
          ...item,
          capturedAt: distractionById.get(item.id)?.capturedAt ?? now,
        }));
      if (changedDistractions.length > 0) await database.distractions.bulkPut(changedDistractions);

      // Write only reflections whose optional authored fields differ from storage.
      const changedReflections = snapshot.journey.sessions
        .map((session) => ({
          sessionId: session.completedAt,
          nextStep: session.nextStep,
          focusRating: session.focusRating,
          notes: session.notes,
          status: session.reflectionStatus,
        }))
        .filter((reflection) =>
          hasReflectionMeaningChanged(reflectionById.get(reflection.sessionId), reflection),
        );
      if (changedReflections.length > 0) await database.reflections.bulkPut(changedReflections);

      // Remove records the snapshot no longer contains so deletions stay transactional here too.
      const keptTaskIds = new Set(snapshot.plan.tasks.map((task) => task.id));
      const removedTaskIds = storedTasks
        .filter((task) => !keptTaskIds.has(task.id))
        .map((task) => task.id);
      if (removedTaskIds.length > 0) await database.tasks.bulkDelete(removedTaskIds);
      const keptSessionIds = new Set(
        snapshot.journey.sessions.map((session) => session.completedAt),
      );
      const removedSessionIds = storedSessions
        .filter((session) => !keptSessionIds.has(session.id))
        .map((session) => session.id);
      if (removedSessionIds.length > 0) await database.sessions.bulkDelete(removedSessionIds);
      const keptDistractionIds = new Set(snapshot.journey.distractions.map((item) => item.id));
      const removedDistractionIds = storedDistractions
        .filter((item) => !keptDistractionIds.has(item.id))
        .map((item) => item.id);
      if (removedDistractionIds.length > 0)
        await database.distractions.bulkDelete(removedDistractionIds);
      const keptReflectionIds = new Set(
        snapshot.journey.sessions.map((session) => session.completedAt),
      );
      const removedReflectionIds = storedReflections
        .filter((reflection) => !keptReflectionIds.has(reflection.sessionId))
        .map((reflection) => reflection.sessionId);
      if (removedReflectionIds.length > 0)
        await database.reflections.bulkDelete(removedReflectionIds);

      // Update planning metadata only when its two small values actually change.
      const planMetadata = {
        intention: snapshot.plan.intention,
        activeTaskId: snapshot.plan.activeTaskId,
      };
      if (
        !storedMeta ||
        storedMeta.value === undefined ||
        JSON.stringify(storedMeta.value) !== JSON.stringify(planMetadata)
      ) {
        await database.meta.put({ key: "focus-plan", value: planMetadata });
      }
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
