// Define one intentionally small task that can guide a focus session without becoming a project manager.
export interface FocusTask {
  // Give React and future storage migrations a stable local identity for this task.
  id: number;
  // Preserve the visitor's plain-text description exactly as entered after outer whitespace is removed.
  title: string;
  // Record a lightweight estimate in focus sessions rather than hours or deadlines.
  estimatedSessions: number;
  // Keep completion independent from selection so finished work can remain understandable.
  completed: boolean;
  // Count completed focus sessions that the visitor deliberately carried into this task.
  completedSessions: number;
  // Remember the latest completion credited to this task so repeated clicks stay idempotent.
  lastCarriedAt: number | null;
  // Close the focus-task contract after its planning and completion values.
}

// Keep the Phase 4 planning state separate from the timestamp-based timer engine.
export interface FocusPlanState {
  // Store the optional outcome the visitor wants to move forward in the next session.
  intention: string;
  // Limit the visible plan to a deliberately small collection of local tasks.
  tasks: FocusTask[];
  // Point to the task currently connected to the focus surface when one is selected.
  activeTaskId: number | null;
  // Allocate predictable in-memory task identities until Phase 5 introduces durable records.
  nextTaskId: number;
  // Close the focus-plan contract after all transient planning values.
}

// Describe every legal planning change as a small explicit action.
export type FocusPlanAction =
  // Restore one validated browser-owned plan after the local database opens.
  | { type: "RESTORE_PLAN"; state: FocusPlanState }
  // Replace the optional intention while the application still allows editing.
  | { type: "SET_INTENTION"; intention: string }
  // Add one validated task with its compact session estimate.
  | { type: "ADD_TASK"; title: string; estimatedSessions: number }
  // Choose one unfinished task as the current focus anchor.
  | { type: "SELECT_TASK"; taskId: number }
  // Carry current unfinished work into another session without using pressure-driven language.
  | { type: "CARRY_TASK"; taskId: number; completedAt: number }
  // Mark one task complete and release it when it was the current selection.
  | { type: "COMPLETE_TASK"; taskId: number }
  // Return one completed task to the unfinished plan without erasing its history.
  | { type: "REOPEN_TASK"; taskId: number };

// Prevent the planning layer from expanding into an overwhelming backlog.
export const MAX_FOCUS_TASKS = 5;
// Keep estimates useful and compact for this first task-planning slice.
export const MAX_ESTIMATED_SESSIONS = 8;

// Count only unfinished work so completed history never consumes active-plan capacity.
export function countUnfinishedTasks(tasks: FocusTask[]): number {
  return tasks.filter((task) => !task.completed).length;
}

// Provide a fresh empty plan for each application mount until Phase 5 adds durable storage.
export function createInitialFocusPlan(): FocusPlanState {
  // Return new arrays so tests and application mounts never share mutable state.
  return { intention: "", tasks: [], activeTaskId: null, nextTaskId: 1 };
  // Close the initial-plan factory after returning its calm empty state.
}

// Apply one pure planning transition so behavior can be tested without a browser.
export function reduceFocusPlan(state: FocusPlanState, action: FocusPlanAction): FocusPlanState {
  // Route each explicit action to its bounded state transition.
  switch (action.type) {
    // Replace the empty startup plan only with a snapshot validated by the data layer.
    case "RESTORE_PLAN":
      return action.state;
    // Keep an optional intention concise even when input arrives outside the rendered field.
    case "SET_INTENTION":
      return { ...state, intention: action.intention.slice(0, 120) };
    // Add a task only when its title, estimate, and small-list capacity are valid.
    case "ADD_TASK": {
      // Remove accidental outer whitespace while preserving the visitor's wording.
      const title = action.title.trim();
      // Reject empty, oversized, invalid, or over-capacity additions without changing state.
      if (
        !title ||
        title.length > 100 ||
        !Number.isInteger(action.estimatedSessions) ||
        action.estimatedSessions < 1 ||
        action.estimatedSessions > MAX_ESTIMATED_SESSIONS ||
        countUnfinishedTasks(state.tasks) >= MAX_FOCUS_TASKS
      ) {
        return state;
      }
      // Build the new task from validated plain data and the next local identity.
      const task: FocusTask = {
        id: state.nextTaskId,
        title,
        estimatedSessions: action.estimatedSessions,
        completed: false,
        completedSessions: 0,
        lastCarriedAt: null,
      };
      // Select the first task automatically while leaving later choices explicit.
      return {
        ...state,
        tasks: [...state.tasks, task],
        activeTaskId: state.activeTaskId ?? task.id,
        nextTaskId: state.nextTaskId + 1,
      };
    }
    // Select only an existing unfinished task so the current-task panel remains truthful.
    case "SELECT_TASK":
      return state.tasks.some((task) => task.id === action.taskId && !task.completed)
        ? { ...state, activeTaskId: action.taskId }
        : state;
    // Record one completed session against unfinished work while keeping it selected.
    case "CARRY_TASK":
      return state.tasks.some(
        (task) =>
          task.id === action.taskId &&
          !task.completed &&
          Number.isFinite(action.completedAt) &&
          task.lastCarriedAt !== action.completedAt,
      )
        ? {
            ...state,
            tasks: state.tasks.map((task) =>
              task.id === action.taskId
                ? {
                    ...task,
                    completedSessions: task.completedSessions + 1,
                    lastCarriedAt: action.completedAt,
                  }
                : task,
            ),
          }
        : state;
    // Complete an existing task while leaving unknown identities unchanged.
    case "COMPLETE_TASK": {
      // Avoid allocating new state when the requested task does not exist or is already complete.
      if (!state.tasks.some((task) => task.id === action.taskId && !task.completed)) return state;
      // Update only the matching task and clear its active relationship when necessary.
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.taskId ? { ...task, completed: true } : task,
        ),
        activeTaskId: state.activeTaskId === action.taskId ? null : state.activeTaskId,
      };
    }
    // Reopen one finished task so corrected mistakes stay recoverable from history.
    case "REOPEN_TASK": {
      // Ignore unknown or still-unfinished tasks without changing any state.
      if (!state.tasks.some((task) => task.id === action.taskId && task.completed)) return state;
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.taskId ? { ...task, completed: false } : task,
        ),
        // Select the reopened work only when nothing else currently holds the focus anchor.
        activeTaskId: state.activeTaskId ?? action.taskId,
      };
    }
    // Preserve the current plan if a future caller reaches this reducer with no recognized action.
    default:
      return state;
  }
  // Close the focus-plan reducer after every legal transition.
}
