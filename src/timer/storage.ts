// Import Zod so untrusted browser storage is checked before the timer restores it.
import { z } from "zod";
// Import the public timer contract shared with the state machine and interface.
import type { TimerDurations, TimerState } from "./engine";
import {
  DEFAULT_DURATIONS,
  DEFAULT_LONG_BREAK_INTERVAL,
  LONG_BREAK_INTERVAL_LIMITS,
  TIMER_LIMITS,
} from "./engine";

// Keep timer storage versioned and separate from the existing appearance preference.
export const TIMER_STORAGE_KEY = "pomorise.timer.v1";
export const TIMER_PREFERENCES_KEY = "pomorise.timer-preferences.v1";

// Validate every persisted state field before allowing recovery into React.
const timerStateSchema = z
  .object({
    mode: z.enum(["focus", "shortBreak", "longBreak"]),
    phase: z.enum(["idle", "running", "paused", "completed", "skipped", "overtime"]),
    // Accept every session number the configurable long-break rhythm can produce.
    sessionNumber: z.number().int().min(1).max(LONG_BREAK_INTERVAL_LIMITS.maximum),
    plannedSeconds: z.number().int().positive(),
    remainingMs: z.number().nonnegative(),
    startedAt: z.number().nullable(),
    targetEndAt: z.number().nullable(),
    completedAt: z.number().nullable(),
    overtimeStartedAt: z.number().nullable(),
  })
  // Check phase relationships so a malformed state can never reach the reducer.
  .superRefine((state, ctx) => {
    // A running timer must own both its start and its target boundary.
    if (state.phase === "running" && (state.startedAt === null || state.targetEndAt === null)) {
      ctx.addIssue({
        code: "custom",
        message: "A running timer requires startedAt and targetEndAt.",
        path: ["phase"],
      });
    }
    // A completed timer must know exactly when it completed.
    if (state.phase === "completed" && state.completedAt === null) {
      ctx.addIssue({
        code: "custom",
        message: "A completed timer requires completedAt.",
        path: ["phase"],
      });
    }
    // Overtime must know when the honest extra counting began.
    if (state.phase === "overtime" && state.overtimeStartedAt === null) {
      ctx.addIssue({
        code: "custom",
        message: "An overtime timer requires overtimeStartedAt.",
        path: ["phase"],
      });
    }
  });

// Describe small non-personal timer choices that can be read synchronously at startup.
export interface TimerPreferences {
  durations: TimerDurations;
  // Count the focus sessions that pass before each longer recovery break begins.
  longBreakInterval: number;
  // Begin each break on its own when the focus session that earned it completes.
  automaticBreaks: boolean;
  // Begin the next focus session on its own when a break completes.
  automaticFocus: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

// Supply conservative defaults while unresolved product choices remain visitor-controlled.
export const DEFAULT_TIMER_PREFERENCES: TimerPreferences = {
  durations: { ...DEFAULT_DURATIONS },
  longBreakInterval: DEFAULT_LONG_BREAK_INTERVAL,
  automaticBreaks: false,
  automaticFocus: false,
  soundEnabled: false,
  notificationsEnabled: false,
};

// Validate preference data independently so one malformed choice cannot break the app.
const timerPreferencesSchema = z.object({
  durations: z.object({
    focus: z
      .number()
      .int()
      .min(TIMER_LIMITS.minimumMinutes * 60)
      .max(TIMER_LIMITS.maximumMinutes * 60),
    shortBreak: z
      .number()
      .int()
      .min(TIMER_LIMITS.minimumMinutes * 60)
      .max(TIMER_LIMITS.maximumMinutes * 60),
    longBreak: z
      .number()
      .int()
      .min(TIMER_LIMITS.minimumMinutes * 60)
      .max(TIMER_LIMITS.maximumMinutes * 60),
  }),
  // Keep older saved preferences valid by supplying the familiar four-session default.
  longBreakInterval: z
    .number()
    .int()
    .min(LONG_BREAK_INTERVAL_LIMITS.minimum)
    .max(LONG_BREAK_INTERVAL_LIMITS.maximum)
    .default(DEFAULT_LONG_BREAK_INTERVAL),
  // Accept the legacy single toggle so older profiles migrate without surprises.
  automaticTransitions: z.boolean().optional(),
  automaticBreaks: z.boolean().optional(),
  automaticFocus: z.boolean().optional(),
  soundEnabled: z.boolean(),
  notificationsEnabled: z.boolean(),
});

// Read a valid saved timer, returning no state when storage is absent or malformed.
export function loadTimerState(storage: Storage = window.localStorage): TimerState | null {
  try {
    const raw = storage.getItem(TIMER_STORAGE_KEY);
    if (!raw) return null;
    const result = timerStateSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

// Save only meaningful timer transitions, never display refresh ticks.
export function saveTimerState(state: TimerState, storage: Storage = window.localStorage): void {
  try {
    storage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The running in-memory timer remains usable when browser storage is unavailable.
  }
}

// Restore validated non-personal settings or use the complete local default set.
export function loadTimerPreferences(storage: Storage = window.localStorage): TimerPreferences {
  try {
    const raw = storage.getItem(TIMER_PREFERENCES_KEY);
    if (!raw) return DEFAULT_TIMER_PREFERENCES;
    const result = timerPreferencesSchema.safeParse(JSON.parse(raw));
    if (!result.success) return DEFAULT_TIMER_PREFERENCES;
    const parsed = result.data;
    return {
      durations: parsed.durations,
      longBreakInterval: parsed.longBreakInterval,
      // Legacy profiles only ever auto-started focus, so migration preserves that meaning.
      automaticBreaks: parsed.automaticBreaks ?? false,
      automaticFocus: parsed.automaticFocus ?? parsed.automaticTransitions ?? false,
      soundEnabled: parsed.soundEnabled,
      notificationsEnabled: parsed.notificationsEnabled,
    };
  } catch {
    return DEFAULT_TIMER_PREFERENCES;
  }
}

// Persist one complete preference snapshot after deliberate visitor changes.
export function saveTimerPreferences(
  preferences: TimerPreferences,
  storage: Storage = window.localStorage,
): void {
  try {
    storage.setItem(TIMER_PREFERENCES_KEY, JSON.stringify(preferences));
  } catch {
    // Preferences remain active for this visit when local storage is unavailable.
  }
}
