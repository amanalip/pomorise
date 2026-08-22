// Import deterministic timer operations so correctness is proven without React or a browser clock.
import {
  DEFAULT_DURATIONS,
  InvalidTimerTransitionError,
  createTimerState,
  formatDuration,
  getOvertimeMs,
  getRemainingMs,
  timerReducer,
  type TimerEvent,
  type TimerPhase,
} from "../../timer/engine";
// Import Vitest helpers for exact transition and fake-clock assertions.
import { describe, expect, it } from "vitest";

// Protect the timer's central promise: timestamps, not callback counts, define elapsed time.
describe("timer engine accuracy", () => {
  it("treats 250 milliseconds as one quarter-second and 1,000 milliseconds as one second", () => {
    const running = timerReducer(createTimerState("focus"), { type: "START", now: 10_000 });

    expect(getRemainingMs(running, 10_250)).toBe(1_499_750);
    expect(getRemainingMs(running, 11_000)).toBe(1_499_000);
    expect(formatDuration(getRemainingMs(running, 10_250))).toBe("25:00");
    expect(formatDuration(getRemainingMs(running, 11_000))).toBe("24:59");
  });

  it("catches up from the target timestamp after a throttled callback or device sleep", () => {
    const running = timerReducer(createTimerState("focus", 10), { type: "START", now: 5_000 });

    expect(getRemainingMs(running, 12_500)).toBe(2_500);
    expect(timerReducer(running, { type: "TICK", now: 15_000 }).phase).toBe("completed");
    expect(timerReducer(running, { type: "TICK", now: 45_000 }).remainingMs).toBe(0);
  });

  it("uses timestamps for pause, resume, added time, and overtime", () => {
    const running = timerReducer(createTimerState("focus", 60), { type: "START", now: 0 });
    const paused = timerReducer(running, { type: "PAUSE", now: 10_000 });
    expect(paused.remainingMs).toBe(50_000);

    const extended = timerReducer(paused, { type: "ADD_TIME", seconds: 60, now: 20_000 });
    const resumed = timerReducer(extended, { type: "RESUME", now: 30_000 });
    expect(resumed.targetEndAt).toBe(140_000);

    const completed = timerReducer(resumed, { type: "TICK", now: 140_000 });
    const overtime = timerReducer(completed, { type: "START_OVERTIME", now: 150_000 });
    expect(getOvertimeMs(overtime, 151_000)).toBe(1_000);
  });
});

// Cover each visitor-visible legal path and prove invalid requests are rejected.
describe("timer state transitions", () => {
  it("supports reset, skip, mode selection, custom duration, and cycle advancement", () => {
    const selected = timerReducer(createTimerState(), {
      type: "SELECT_MODE",
      mode: "shortBreak",
      seconds: 300,
    });
    const customized = timerReducer(selected, { type: "SET_DURATION", seconds: 6 * 60 });
    const running = timerReducer(customized, { type: "START", now: 1_000 });
    const skipped = timerReducer(running, { type: "SKIP", now: 2_000 });
    const advanced = timerReducer(skipped, {
      type: "ADVANCE",
      now: 3_000,
      durations: { ...DEFAULT_DURATIONS },
    });
    expect(advanced.mode).toBe("focus");
    expect(advanced.phase).toBe("idle");

    const reset = timerReducer(running, { type: "RESET" });
    expect(reset).toMatchObject({ phase: "idle", remainingMs: 360_000 });
  });

  it("uses a long break after the fourth focus and can auto-start the next timer", () => {
    const focusFour = createTimerState("focus", 1, 4);
    const completed = timerReducer(timerReducer(focusFour, { type: "START", now: 0 }), {
      type: "TICK",
      now: 1_000,
    });
    const next = timerReducer(completed, {
      type: "ADVANCE",
      now: 2_000,
      durations: { ...DEFAULT_DURATIONS },
      startImmediately: true,
    });
    expect(next).toMatchObject({ mode: "longBreak", phase: "running", sessionNumber: 1 });
  });

  it("honors a custom long-break interval when advancing the cycle", () => {
    // Complete the second focus session under a shorter two-session rhythm.
    const focusTwo = timerReducer(
      timerReducer(createTimerState("focus", 1, 2), { type: "START", now: 0 }),
      { type: "TICK", now: 1_000 },
    );
    const longBreakNext = timerReducer(focusTwo, {
      type: "ADVANCE",
      now: 2_000,
      durations: { ...DEFAULT_DURATIONS },
      longBreakInterval: 2,
    });
    expect(longBreakNext).toMatchObject({ mode: "longBreak", sessionNumber: 1 });

    // Complete the first focus session under a longer eight-session rhythm.
    const focusOne = timerReducer(
      timerReducer(createTimerState("focus", 1, 1), { type: "START", now: 0 }),
      { type: "TICK", now: 1_000 },
    );
    const shortBreakNext = timerReducer(focusOne, {
      type: "ADVANCE",
      now: 2_000,
      durations: { ...DEFAULT_DURATIONS },
      longBreakInterval: 8,
    });
    expect(shortBreakNext).toMatchObject({ mode: "shortBreak", sessionNumber: 2 });
  });

  it("accepts every legal phase-event pair and rejects every illegal pair", () => {
    const idle = createTimerState("focus", 60);
    const running = timerReducer(idle, { type: "START", now: 0 });
    const paused = timerReducer(running, { type: "PAUSE", now: 1_000 });
    const completed = timerReducer(running, { type: "TICK", now: 60_000 });
    const skipped = timerReducer(running, { type: "SKIP", now: 1_000 });
    const overtime = timerReducer(completed, { type: "START_OVERTIME", now: 61_000 });
    const states = { idle, running, paused, completed, skipped, overtime };
    const events: TimerEvent[] = [
      { type: "START", now: 2_000 },
      { type: "PAUSE", now: 0 },
      { type: "RESUME", now: 0 },
      { type: "RESET" },
      { type: "SKIP", now: 0 },
      { type: "ADD_TIME", seconds: 60, now: 0 },
      { type: "TICK", now: 0 },
      { type: "START_OVERTIME", now: 0 },
      { type: "ADVANCE", now: 0, durations: { ...DEFAULT_DURATIONS } },
      { type: "RECOVER_CLOCK", now: 0, remainingMs: 1_000 },
      { type: "SELECT_MODE", mode: "shortBreak", seconds: 300 },
      { type: "SET_DURATION", seconds: 60 },
    ];
    const legalEvents: Record<TimerPhase, Set<TimerEvent["type"]>> = {
      idle: new Set(["START", "SELECT_MODE", "SET_DURATION"]),
      running: new Set(["PAUSE", "RESET", "SKIP", "ADD_TIME", "TICK", "RECOVER_CLOCK"]),
      paused: new Set(["RESUME", "RESET", "SKIP", "ADD_TIME"]),
      completed: new Set(["RESET", "START_OVERTIME", "ADVANCE"]),
      skipped: new Set(["RESET", "ADVANCE"]),
      overtime: new Set(["RESET", "SKIP", "ADVANCE"]),
    };

    for (const [phase, state] of Object.entries(states) as Array<
      [TimerPhase, (typeof states)[TimerPhase]]
    >) {
      for (const event of events) {
        if (legalEvents[phase].has(event.type)) {
          expect(() => timerReducer(state, event)).not.toThrow();
        } else {
          expect(() => timerReducer(state, event)).toThrow(InvalidTimerTransitionError);
        }
      }
    }
  });

  it("rejects unbounded durations and invalid added time", () => {
    expect(() => timerReducer(createTimerState(), { type: "SET_DURATION", seconds: 0 })).toThrow(
      RangeError,
    );
    const running = timerReducer(createTimerState(), { type: "START", now: 0 });
    expect(() => timerReducer(running, { type: "ADD_TIME", seconds: -1, now: 0 })).toThrow(
      RangeError,
    );
  });
});
