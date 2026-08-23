// Import Vitest helpers for deterministic complete-focus-loop checks.
import { describe, expect, it } from "vitest";
// Import pure journey operations so tests stay independent of browser timing.
import {
  createInitialFocusJourney,
  reduceFocusJourney,
  summarizeProgress,
  summarizeWeek,
} from "../../focus/journey";

// Protect capture, reflection, and summary behavior across the complete Phase 4 journey.
describe("focus journey", () => {
  // Verify a captured thought remains pending until one explicit review choice resolves it.
  it("captures and resolves a distraction without changing unrelated state", () => {
    // Capture one concise visitor thought into an empty journey.
    const captured = reduceFocusJourney(createInitialFocusJourney(), {
      type: "CAPTURE_DISTRACTION",
      text: "  Send the follow-up note  ",
    });
    // Preserve the wording as plain trimmed text and keep it pending for review.
    expect(captured.distractions[0]).toEqual({
      id: 1,
      text: "Send the follow-up note",
      resolution: "pending",
    });
    // Resolve the thought through one explicit keep-for-later choice.
    const reviewed = reduceFocusJourney(captured, {
      type: "RESOLVE_DISTRACTION",
      distractionId: 1,
      resolution: "kept",
    });
    // Protect the selected resolution without deleting the captured context.
    expect(reviewed.distractions[0]?.resolution).toBe("kept");
  });

  // Verify kept thoughts stay actionable instead of becoming read-only records.
  it("lets kept thoughts later become tasks, be dismissed, or be deleted", () => {
    // Capture one thought and keep it for later through the ordinary review path.
    const captured = reduceFocusJourney(createInitialFocusJourney(), {
      type: "CAPTURE_DISTRACTION",
      text: "Check the refund policy",
    });
    const kept = reduceFocusJourney(captured, {
      type: "RESOLVE_DISTRACTION",
      distractionId: 1,
      resolution: "kept",
    });
    // Convert the kept thought after the fact so late decisions remain possible.
    const converted = reduceFocusJourney(kept, {
      type: "RESOLVE_DISTRACTION",
      distractionId: 1,
      resolution: "task",
    });
    expect(converted.distractions[0]?.resolution).toBe("task");
    // Capture and keep a second thought, then dismiss it later without recreating it first.
    const capturedSecond = reduceFocusJourney(converted, {
      type: "CAPTURE_DISTRACTION",
      text: "Reorder the outline",
    });
    const keptSecond = reduceFocusJourney(capturedSecond, {
      type: "RESOLVE_DISTRACTION",
      distractionId: 2,
      resolution: "kept",
    });
    const dismissedLater = reduceFocusJourney(keptSecond, {
      type: "RESOLVE_DISTRACTION",
      distractionId: 2,
      resolution: "dismissed",
    });
    expect(dismissedLater.distractions[1]?.resolution).toBe("dismissed");
    // Remove one retained thought entirely so nothing becomes permanent clutter.
    const deleted = reduceFocusJourney(keptSecond, {
      type: "DELETE_DISTRACTION",
      distractionId: 2,
    });
    expect(deleted.distractions.map((item) => item.id)).toEqual([1]);
    // Ignore deletions that point at unknown identities instead of changing state.
    expect(
      reduceFocusJourney(dismissedLater, { type: "DELETE_DISTRACTION", distractionId: 99 }),
    ).toBe(dismissedLater);
  });

  // Verify one completion can be recorded once and receive an optional reflection.
  it("records one unique session and saves bounded reflection", () => {
    // Use one stable timestamp as the timer completion boundary.
    const completedAt = new Date(2026, 7, 20, 12).getTime();
    // Record the completed focus session with its planning snapshot.
    const recorded = reduceFocusJourney(createInitialFocusJourney(), {
      type: "RECORD_SESSION",
      completedAt,
      plannedSeconds: 1_500,
      addedSeconds: 0,
      intention: "Draft the opening",
      taskTitle: "Write article",
    });
    // Repeat the same effect-like action to prove the record stays idempotent.
    const repeated = reduceFocusJourney(recorded, {
      type: "RECORD_SESSION",
      completedAt,
      plannedSeconds: 1_500,
      addedSeconds: 0,
      intention: "Draft the opening",
      taskTitle: "Write article",
    });
    // Keep exactly one session for one completion timestamp.
    expect(repeated.sessions).toHaveLength(1);
    // Save all optional reflection values against that exact session.
    const reflected = reduceFocusJourney(repeated, {
      type: "SAVE_REFLECTION",
      completedAt,
      nextStep: "Revise the first paragraph",
      focusRating: 4,
      notes: "The outline helped.",
    });
    // Protect the complete saved reflection without requiring any field.
    expect(reflected.sessions[0]).toMatchObject({
      nextStep: "Revise the first paragraph",
      focusRating: 4,
      notes: "The outline helped.",
      reflectionStatus: "saved",
    });
  });

  // Verify daily and trailing-week summaries derive from synthetic session records.
  it("calculates deterministic private progress summaries", () => {
    // Anchor the summary at local noon for stable day boundaries.
    const now = new Date(2026, 7, 20, 12).getTime();
    // Build synthetic records across today, the trailing week, and an older date.
    const sessions = [
      { completedAt: now - 60_000, plannedSeconds: 1_500, addedSeconds: 300, overtimeSeconds: 300 },
      { completedAt: now - 3_600_000, plannedSeconds: 900, addedSeconds: 0, overtimeSeconds: 0 },
      {
        completedAt: new Date(2026, 7, 17, 12).getTime(),
        plannedSeconds: 1_500,
        addedSeconds: 0,
        overtimeSeconds: 0,
      },
      {
        completedAt: new Date(2026, 7, 1, 12).getTime(),
        plannedSeconds: 1_500,
        addedSeconds: 0,
        overtimeSeconds: 0,
      },
    ].map((record) => ({
      ...record,
      intention: "",
      taskTitle: null,
      nextStep: "",
      focusRating: record.completedAt === now - 60_000 ? 4 : null,
      notes: "",
      reflectionStatus: "skipped" as const,
    }));
    // Derive counts, honest focused minutes, and the gentle average of rated sessions.
    expect(summarizeProgress(sessions, now)).toEqual({
      todaySessions: 2,
      todayMinutes: 50,
      weekSessions: 3,
      averageFocusRating: 4,
    });
    // Prove unrated history produces a quiet null instead of a misleading zero.
    const unrated = sessions.map((session) => ({ ...session, focusRating: null }));
    expect(summarizeProgress(unrated, now).averageFocusRating).toBeNull();
  });

  // Verify focused overtime is credited exactly once without shrinking earlier credit.
  it("records overtime against its own session for honest progress", () => {
    // Use one stable timestamp as the timer completion boundary.
    const completedAt = new Date(2026, 7, 20, 12).getTime();
    // Record the on-time completion before the visitor chooses to continue working.
    const recorded = reduceFocusJourney(createInitialFocusJourney(), {
      type: "RECORD_SESSION",
      completedAt,
      plannedSeconds: 1_500,
      addedSeconds: 0,
      intention: "",
      taskTitle: null,
    });
    // Credit five honestly focused extra minutes when leaving the boundary.
    const overtime = reduceFocusJourney(recorded, {
      type: "RECORD_OVERTIME",
      completedAt,
      overtimeSeconds: 300,
    });
    // Keep the credited value on the matching session only.
    expect(overtime.sessions[0]?.overtimeSeconds).toBe(300);
    // Repeat a smaller stale value so late effects can never erase real work.
    const repeated = reduceFocusJourney(overtime, {
      type: "RECORD_OVERTIME",
      completedAt,
      overtimeSeconds: 30,
    });
    // Protect the larger honest total after the idempotent repeat.
    expect(repeated.sessions[0]?.overtimeSeconds).toBe(300);
  });
  // Verify deliberate Add Time extensions are stored on the exact completed session.
  it("records added time separately so focused totals stay honest", () => {
    // Use one stable timestamp as the timer completion boundary.
    const completedAt = new Date(2026, 7, 20, 12).getTime();
    // Record a session whose visitor extended it by five focused minutes.
    const recorded = reduceFocusJourney(createInitialFocusJourney(), {
      type: "RECORD_SESSION",
      completedAt,
      plannedSeconds: 1_500,
      addedSeconds: 300,
      intention: "",
      taskTitle: null,
    });
    // Keep planned and added values distinct so summaries and exports can report both.
    expect(recorded.sessions[0]).toMatchObject({
      plannedSeconds: 1_500,
      addedSeconds: 300,
      overtimeSeconds: 0,
    });
  });

  // Verify the trailing-week series buckets sessions by honest local days.
  it("summarizes seven local days of focused minutes for the chart", () => {
    // Anchor at local noon so every day boundary is deterministic in any timezone.
    const now = new Date(2026, 7, 20, 12).getTime();
    // Place sessions today, two days ago, and outside the seven-day window.
    const sessions = [
      {
        completedAt: now - 3_600_000,
        plannedSeconds: 1_500,
        addedSeconds: 300,
        overtimeSeconds: 300,
        intention: "",
        taskTitle: null,
        nextStep: "",
        focusRating: null,
        notes: "",
        reflectionStatus: "skipped" as const,
      },
      {
        completedAt: now - 2 * 86_400_000,
        plannedSeconds: 900,
        addedSeconds: 0,
        overtimeSeconds: 0,
        intention: "",
        taskTitle: null,
        nextStep: "",
        focusRating: null,
        notes: "",
        reflectionStatus: "skipped" as const,
      },
      {
        completedAt: new Date(2026, 6, 20).getTime(),
        plannedSeconds: 1_500,
        addedSeconds: 0,
        overtimeSeconds: 0,
        intention: "",
        taskTitle: null,
        nextStep: "",
        focusRating: null,
        notes: "",
        reflectionStatus: "skipped" as const,
      },
    ];
    // Derive exactly seven day summaries ending with today.
    const week = summarizeWeek(sessions, now);
    expect(week).toHaveLength(7);
    // Require the oldest entry to sit six local days before today's midnight.
    expect(new Date(week[0]?.dayStart as number).getDate()).toBe(new Date(now).getDate() - 6);
    // Require today's bucket to include planned, added, and honestly focused overtime.
    expect(week[6]?.minutes).toBe(35);
    // Require the two-days-ago bucket to capture its own session only.
    expect(week[4]?.minutes).toBe(15);
    // Require empty days to stay present as calm zero values.
    expect(week[1]?.minutes).toBe(0);
  });

  // Close the complete journey group after its deterministic behavior coverage.
});
