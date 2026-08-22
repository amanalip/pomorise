// Keep every timer calculation pure so browser time and rendering never become hidden inputs.
export const TIMER_LIMITS = { minimumMinutes: 1, maximumMinutes: 180 } as const;

// Provide familiar Pomodoro defaults in seconds while allowing preferences to replace them.
export const DEFAULT_DURATIONS = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
} as const;

// Keep the familiar four-session rhythm as the default distance between long breaks.
export const DEFAULT_LONG_BREAK_INTERVAL = 4;

// Bound how many focus sessions a visitor may stack before the longer recovery break.
export const LONG_BREAK_INTERVAL_LIMITS = { minimum: 1, maximum: 8 } as const;

// Name the three session purposes used by the timer cycle.
export type TimerMode = keyof typeof DEFAULT_DURATIONS;

// Keep terminal outcomes visible until the visitor deliberately advances or resets them.
export type TimerPhase = "idle" | "running" | "paused" | "completed" | "skipped" | "overtime";

// Store only meaningful timer facts; visible seconds are always derived from these values.
export interface TimerState {
  mode: TimerMode;
  phase: TimerPhase;
  sessionNumber: number;
  plannedSeconds: number;
  remainingMs: number;
  startedAt: number | null;
  targetEndAt: number | null;
  completedAt: number | null;
  overtimeStartedAt: number | null;
}

// Describe every legal request accepted by the deterministic state machine.
export type TimerEvent =
  | { type: "START"; now: number }
  | { type: "PAUSE"; now: number }
  | { type: "RESUME"; now: number }
  | { type: "RESET" }
  // Reinstate one trusted earlier snapshot so a reset can be undone calmly.
  | { type: "RESTORE"; state: TimerState }
  | { type: "SKIP"; now: number }
  | { type: "ADD_TIME"; seconds: number; now: number }
  | { type: "TICK"; now: number }
  | { type: "START_OVERTIME"; now: number }
  | { type: "RECOVER_CLOCK"; now: number; remainingMs: number }
  | {
      type: "ADVANCE";
      now: number;
      durations: TimerDurations;
      startImmediately?: boolean;
      longBreakInterval?: number;
    }
  | { type: "SELECT_MODE"; mode: TimerMode; seconds: number }
  | { type: "SET_DURATION"; seconds: number };

// Allow preferences to supply one duration for every supported mode.
export type TimerDurations = Record<TimerMode, number>;

// Reject invalid state-machine requests explicitly instead of silently inventing behavior.
export class InvalidTimerTransitionError extends Error {
  constructor(phase: TimerPhase, event: TimerEvent["type"]) {
    super(`Cannot ${event.toLowerCase()} while the timer is ${phase}.`);
    this.name = "InvalidTimerTransitionError";
  }
}

// Create a fresh timer for one selected mode.
export function createTimerState(
  mode: TimerMode = "focus",
  plannedSeconds = DEFAULT_DURATIONS[mode],
  sessionNumber = 1,
): TimerState {
  return {
    mode,
    phase: "idle",
    sessionNumber,
    plannedSeconds,
    remainingMs: plannedSeconds * 1_000,
    startedAt: null,
    targetEndAt: null,
    completedAt: null,
    overtimeStartedAt: null,
  };
}

// Derive the current remaining duration from a target timestamp rather than interval counts.
export function getRemainingMs(state: TimerState, now: number): number {
  if (state.phase === "running" && state.targetEndAt !== null) {
    return Math.max(0, state.targetEndAt - now);
  }
  return state.remainingMs;
}

// Derive overtime from its timestamp so suspended tabs catch up immediately when visible again.
export function getOvertimeMs(state: TimerState, now: number): number {
  if (state.phase !== "overtime" || state.overtimeStartedAt === null) return 0;
  return Math.max(0, now - state.overtimeStartedAt);
}

// Select the next familiar mode using the visitor's chosen long-break rhythm.
export function getNextMode(
  state: TimerState,
  longBreakInterval = DEFAULT_LONG_BREAK_INTERVAL,
): { mode: TimerMode; sessionNumber: number } {
  // Breaks always hand control back to the same numbered focus session.
  if (state.mode !== "focus") return { mode: "focus", sessionNumber: state.sessionNumber };
  // Give the longer recovery break once the configured focus count has been reached.
  if (state.sessionNumber >= longBreakInterval) return { mode: "longBreak", sessionNumber: 1 };
  // Otherwise continue the current cycle through the shorter recovery break.
  return { mode: "shortBreak", sessionNumber: state.sessionNumber + 1 };
}

// Apply one event to one immutable state and throw when the requested transition is illegal.
export function timerReducer(state: TimerState, event: TimerEvent): TimerState {
  switch (event.type) {
    case "START": {
      if (state.phase !== "idle") throw new InvalidTimerTransitionError(state.phase, event.type);
      return {
        ...state,
        phase: "running",
        startedAt: event.now,
        targetEndAt: event.now + state.remainingMs,
      };
    }
    case "PAUSE": {
      if (state.phase !== "running") throw new InvalidTimerTransitionError(state.phase, event.type);
      return {
        ...state,
        phase: "paused",
        remainingMs: getRemainingMs(state, event.now),
        targetEndAt: null,
      };
    }
    case "RESUME": {
      if (state.phase !== "paused") throw new InvalidTimerTransitionError(state.phase, event.type);
      return { ...state, phase: "running", targetEndAt: event.now + state.remainingMs };
    }
    case "RESET": {
      if (state.phase === "idle") throw new InvalidTimerTransitionError(state.phase, event.type);
      return createTimerState(state.mode, state.plannedSeconds, state.sessionNumber);
    }
    case "RESTORE": {
      // Accept only snapshots of the same mode so the visible cycle never changes meaning.
      if (event.state.mode !== state.mode) return state;
      return { ...event.state };
    }
    case "SKIP": {
      if (state.phase !== "running" && state.phase !== "paused" && state.phase !== "overtime") {
        throw new InvalidTimerTransitionError(state.phase, event.type);
      }
      return {
        ...state,
        phase: "skipped",
        remainingMs: getRemainingMs(state, event.now),
        targetEndAt: null,
      };
    }
    case "ADD_TIME": {
      if (state.phase !== "running" && state.phase !== "paused") {
        throw new InvalidTimerTransitionError(state.phase, event.type);
      }
      if (!Number.isFinite(event.seconds) || event.seconds <= 0) {
        throw new RangeError("Added time must be a positive number of seconds.");
      }
      const addedMs = event.seconds * 1_000;
      // Treat the reviewed duration maximum as an absolute per-session ceiling.
      const maximumRemainingMs = TIMER_LIMITS.maximumMinutes * 60_000;
      if (state.phase === "running") {
        // Measure current time first so the target moves only by the amount truly added.
        const remainingMs = getRemainingMs(state, event.now);
        const cappedRemaining = Math.min(remainingMs + addedMs, maximumRemainingMs);
        // Ignore the request entirely when the session already holds the full ceiling.
        if (cappedRemaining === remainingMs) return state;
        return {
          ...state,
          remainingMs: cappedRemaining,
          targetEndAt: (state.targetEndAt ?? event.now) + (cappedRemaining - remainingMs),
        };
      }
      const cappedRemaining = Math.min(state.remainingMs + addedMs, maximumRemainingMs);
      // Keep paused state untouched when it already sits at the absolute limit.
      if (cappedRemaining === state.remainingMs) return state;
      return { ...state, remainingMs: cappedRemaining };
    }
    case "TICK": {
      if (state.phase !== "running") throw new InvalidTimerTransitionError(state.phase, event.type);
      const remainingMs = getRemainingMs(state, event.now);
      return remainingMs === 0
        ? {
            ...state,
            phase: "completed",
            remainingMs: 0,
            targetEndAt: null,
            completedAt: event.now,
          }
        : state;
    }
    case "START_OVERTIME": {
      if (state.phase !== "completed")
        throw new InvalidTimerTransitionError(state.phase, event.type);
      return { ...state, phase: "overtime", overtimeStartedAt: event.now };
    }
    case "RECOVER_CLOCK": {
      if (state.phase !== "running") throw new InvalidTimerTransitionError(state.phase, event.type);
      return {
        ...state,
        remainingMs: event.remainingMs,
        targetEndAt: event.now + event.remainingMs,
      };
    }
    case "ADVANCE": {
      if (state.phase !== "completed" && state.phase !== "skipped" && state.phase !== "overtime") {
        throw new InvalidTimerTransitionError(state.phase, event.type);
      }
      const next = getNextMode(state, event.longBreakInterval);
      const freshState = createTimerState(
        next.mode,
        event.durations[next.mode],
        next.sessionNumber,
      );
      return event.startImmediately
        ? timerReducer(freshState, { type: "START", now: event.now })
        : freshState;
    }
    case "SELECT_MODE": {
      if (state.phase !== "idle") throw new InvalidTimerTransitionError(state.phase, event.type);
      return createTimerState(event.mode, event.seconds, state.sessionNumber);
    }
    case "SET_DURATION": {
      if (state.phase !== "idle") throw new InvalidTimerTransitionError(state.phase, event.type);
      const minutes = event.seconds / 60;
      if (
        !Number.isInteger(event.seconds) ||
        minutes < TIMER_LIMITS.minimumMinutes ||
        minutes > TIMER_LIMITS.maximumMinutes
      ) {
        throw new RangeError(
          `Duration must be between ${TIMER_LIMITS.minimumMinutes} and ${TIMER_LIMITS.maximumMinutes} minutes.`,
        );
      }
      return { ...state, plannedSeconds: event.seconds, remainingMs: event.seconds * 1_000 };
    }
  }
}

// Format a duration for the stable clock display, rounding upward before completion.
export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1_000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
