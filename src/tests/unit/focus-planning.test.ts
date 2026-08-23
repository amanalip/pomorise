// Import Vitest helpers for deterministic focus-planning checks.
import { describe, expect, it } from "vitest";
// Import the pure Phase 4 boundary so tests do not depend on rendered UI details.
import {
  countUnfinishedTasks,
  createInitialFocusPlan,
  MAX_FOCUS_TASKS,
  reduceFocusPlan,
} from "../../focus/planning";

// Group the first Phase 4 planning rules under their visitor-facing purpose.
describe("focus planning", () => {
  // Protect trimmed task creation, automatic first selection, and concise estimates.
  it("adds and selects the first valid task", () => {
    // Add one task through the same pure transition used by the application.
    const state = reduceFocusPlan(createInitialFocusPlan(), {
      type: "ADD_TASK",
      title: "  Outline the project brief  ",
      estimatedSessions: 2,
    });
    // Verify plain wording and estimate survive while outer whitespace is removed.
    expect(state.tasks).toEqual([
      {
        id: 1,
        title: "Outline the project brief",
        estimatedSessions: 2,
        completed: false,
        completedSessions: 0,
        lastCarriedAt: null,
      },
    ]);
    // Make the first useful task immediately available beside the timer.
    expect(state.activeTaskId).toBe(1);
  });

  // Keep the planning surface deliberately small and safe from invalid task values.
  it("rejects invalid tasks and additions beyond the small-list limit", () => {
    // Start from the calm empty state used for every application mount.
    let state = createInitialFocusPlan();
    // Reject a whitespace-only task without allocating a new identity.
    expect(reduceFocusPlan(state, { type: "ADD_TASK", title: "   ", estimatedSessions: 1 })).toBe(
      state,
    );
    // Fill the plan to its intentionally compact capacity.
    for (let index = 1; index <= MAX_FOCUS_TASKS; index += 1) {
      state = reduceFocusPlan(state, {
        type: "ADD_TASK",
        title: `Task ${index}`,
        estimatedSessions: 1,
      });
    }
    // Refuse a sixth task so the surface stays focused rather than becoming a backlog.
    expect(
      reduceFocusPlan(state, { type: "ADD_TASK", title: "Task 6", estimatedSessions: 1 }),
    ).toBe(state);
  });

  // Ensure completing current work releases the focus selection without deleting its context.
  it("completes and releases the active task", () => {
    // Create the first selected task before applying its completion transition.
    const planned = reduceFocusPlan(createInitialFocusPlan(), {
      type: "ADD_TASK",
      title: "Review notes",
      estimatedSessions: 1,
    });
    // Credit one exact completed session while carrying the same task forward.
    const carried = reduceFocusPlan(planned, {
      type: "CARRY_TASK",
      taskId: 1,
      completedAt: 1_234,
    });
    // Repeat the same completion to prove the carry-forward action is idempotent.
    const repeated = reduceFocusPlan(carried, {
      type: "CARRY_TASK",
      taskId: 1,
      completedAt: 1_234,
    });
    // Protect one credited session and the selected task relationship.
    expect(repeated.tasks[0]?.completedSessions).toBe(1);
    expect(repeated.activeTaskId).toBe(1);
    // Complete the same task through its stable identity.
    const completed = reduceFocusPlan(repeated, { type: "COMPLETE_TASK", taskId: 1 });
    // Keep the completed task readable while removing it from the current focus position.
    expect(completed.tasks[0]?.completed).toBe(true);
    expect(completed.activeTaskId).toBeNull();
    // Add new work after completion to prove history does not consume active-plan capacity.
    const next = reduceFocusPlan(completed, {
      type: "ADD_TASK",
      title: "Prepare summary",
      estimatedSessions: 2,
    });
    // Retain the completed record while selecting the newly added unfinished task.
    expect(next.tasks).toHaveLength(2);
    expect(next.tasks[0]?.completed).toBe(true);
    expect(next.activeTaskId).toBe(2);
  });
  // Verify reopening returns finished work to the plan without losing its history.
  it("reopens a completed task and restores its selection when idle", () => {
    // Plan, carry, and complete one task through the ordinary transitions.
    const planned = reduceFocusPlan(createInitialFocusPlan(), {
      type: "ADD_TASK",
      title: "Mistakenly finished",
      estimatedSessions: 2,
    });
    const carried = reduceFocusPlan(planned, {
      type: "CARRY_TASK",
      taskId: 1,
      completedAt: 5_000,
    });
    const completed = reduceFocusPlan(carried, { type: "COMPLETE_TASK", taskId: 1 });
    // Confirm the completion released the active selection before reopening.
    expect(completed.activeTaskId).toBeNull();
    // Reopen through history so the task becomes actionable again.
    const reopened = reduceFocusPlan(completed, { type: "REOPEN_TASK", taskId: 1 });
    // Protect the preserved session credit while restoring unfinished status.
    expect(reopened.tasks[0]?.completed).toBe(false);
    expect(reopened.tasks[0]?.completedSessions).toBe(1);
    // The reopened task takes the empty focus anchor without a second click.
    expect(reopened.activeTaskId).toBe(1);
    // Ignore reopen requests for unknown or still-unfinished tasks safely.
    expect(reduceFocusPlan(reopened, { type: "REOPEN_TASK", taskId: 99 })).toBe(reopened);
    // Close the reopen case after proving history stays honest.
  });

  // Keep completed history from consuming the small active-plan capacity.
  it("allows new tasks when only completed history fills the list", () => {
    // Fill the plan entirely with finished work like a long-lived browser profile would hold.
    let state = createInitialFocusPlan();
    for (let index = 1; index <= MAX_FOCUS_TASKS; index += 1) {
      state = reduceFocusPlan(state, {
        type: "ADD_TASK",
        title: `Finished ${index}`,
        estimatedSessions: 1,
      });
      state = reduceFocusPlan(state, { type: "COMPLETE_TASK", taskId: index });
    }
    // Confirm every stored task is complete before attempting the next addition.
    expect(countUnfinishedTasks(state.tasks)).toBe(0);
    // Accept one more task because capacity counts unfinished work only.
    const revived = reduceFocusPlan(state, {
      type: "ADD_TASK",
      title: "Fresh intention",
      estimatedSessions: 1,
    });
    // Keep all history visible while the new task becomes the current selection.
    expect(revived.tasks).toHaveLength(MAX_FOCUS_TASKS + 1);
    expect(countUnfinishedTasks(revived.tasks)).toBe(1);
    expect(revived.activeTaskId).toBe(MAX_FOCUS_TASKS + 1);
    // Close the completed-history capacity case after proving unfinished counting.
  });
  // Close the focus-planning group after protecting its initial vertical slice.
});
