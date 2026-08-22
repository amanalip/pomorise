// Import React state and lifecycle tools for the browser-facing timer coordinator.
import { useCallback, useEffect, useRef, useState } from "react";
// Import pure timer operations so browser effects stay outside the deterministic engine.
import {
  createTimerState,
  getOvertimeMs,
  getRemainingMs,
  timerReducer,
  type TimerEvent,
  type TimerMode,
  type TimerState,
} from "./engine";
// Import guarded local persistence for recovery and visitor-controlled preferences.
import {
  loadTimerPreferences,
  loadTimerState,
  saveTimerPreferences,
  saveTimerState,
  type TimerPreferences,
} from "./storage";

// Treat a five-second disagreement between wall and monotonic time as meaningful.
const CLOCK_DISCONTINUITY_TOLERANCE_MS = 5_000;

// Reuse an audio context prepared by a visitor gesture so completion is not blocked later.
let completionAudioContext: AudioContext | null = null;

// Describe the choice shown when the system clock changes during an active session.
export interface ClockRecovery {
  differenceMs: number;
  remainingBeforeChangeMs: number;
}

// Play a short locally synthesized completion tone without fetching an audio asset.
function playCompletionTone(): void {
  const AudioContextConstructor = window.AudioContext;
  if (!AudioContextConstructor) return;
  const context = completionAudioContext ?? new AudioContextConstructor();
  completionAudioContext = context;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.value = 660;
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.45);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.46);
}

// Prepare Web Audio during a start gesture while keeping the actual tone silent until completion.
function prepareCompletionTone(): void {
  if (!window.AudioContext) return;
  completionAudioContext ??= new window.AudioContext();
  if (completionAudioContext.state === "suspended") void completionAudioContext.resume();
}

// Deliver the completion alert through the service worker first because Android only
// displays notifications created by a registered worker, then fall back to the page.
async function showCompletionNotification(mode: TimerMode): Promise<void> {
  // Share one title across delivery channels so every platform reads identically.
  const title = "Pomorise session complete";
  // Share one body sentence that invites selecting the alert to return to the timer.
  const body = `${modeLabel(mode)} is complete. Select to return to your timer.`;
  // Prefer the service-worker channel whenever this browser manages workers.
  if ("serviceWorker" in navigator) {
    try {
      // Ask for the registration controlling this page instead of assuming a fixed scope.
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        // Show through the worker so Android and installed experiences receive alerts.
        await registration.showNotification(title, { body, tag: "pomorise-session-complete" });
        // Stop here so mobile platforms never attempt the unsupported page channel.
        return;
      }
    } catch {
      // Continue quietly to the fallback when the worker channel fails unexpectedly.
    }
  }
  // Keep a guarded desktop fallback for browsers without a controllable service worker.
  if (!("Notification" in window)) return;
  // Build the fallback notification with the same stable tag so repeats replace cleanly.
  const notification = new Notification(title, { body, tag: "pomorise-session-complete" });
  // Treat selecting the notification as a request to return to the timer immediately.
  notification.addEventListener("click", () => {
    // Bring this application's tab or installed window back to the foreground.
    window.focus();
    // Close the notification after it has done its one job.
    notification.close();
  });
}

// Coordinate timestamp-derived display refreshes, persistence, recovery, and completion alerts.
export function useTimer() {
  const [preferences, setPreferencesState] = useState<TimerPreferences>(() =>
    loadTimerPreferences(),
  );
  const [state, setState] = useState<TimerState>(() => {
    const restored = loadTimerState();
    if (!restored) return createTimerState("focus", loadTimerPreferences().durations.focus);
    return restored.phase === "running" && getRemainingMs(restored, Date.now()) === 0
      ? timerReducer(restored, { type: "TICK", now: Date.now() })
      : restored;
  });
  const [displayNow, setDisplayNow] = useState(Date.now());
  const [announcement, setAnnouncement] = useState("Your session is ready when you are.");
  const [clockRecovery, setClockRecovery] = useState<ClockRecovery | null>(null);
  const observationRef = useRef({ wall: Date.now(), monotonic: performance.now() });
  const previousPhaseRef = useRef(state.phase);

  // Apply a meaningful event, persist its result once, and provide restrained status feedback.
  const send = useCallback(
    (event: TimerEvent, message?: string) => {
      if ((event.type === "START" || event.type === "RESUME") && preferences.soundEnabled) {
        prepareCompletionTone();
      }
      setState((current) => {
        const next = timerReducer(current, event);
        if (event.type !== "TICK" || next !== current) saveTimerState(next);
        return next;
      });
      if (message) setAnnouncement(message);
    },
    [preferences.soundEnabled],
  );

  // Refresh visible time from timestamps and compare wall time with a monotonic clock.
  const refresh = useCallback(() => {
    const wall = Date.now();
    const monotonic = performance.now();
    const previous = observationRef.current;
    const differenceMs = wall - previous.wall - (monotonic - previous.monotonic);
    observationRef.current = { wall, monotonic };
    setDisplayNow(wall);
    setState((current) => {
      if (current.phase !== "running") return current;
      if (Math.abs(differenceMs) > CLOCK_DISCONTINUITY_TOLERANCE_MS) {
        setClockRecovery({
          differenceMs,
          remainingBeforeChangeMs: getRemainingMs(current, previous.wall),
        });
        return current;
      }
      const next = timerReducer(current, { type: "TICK", now: wall });
      if (next !== current) saveTimerState(next);
      return next;
    });
  }, []);

  // Tick only while running, and recalculate immediately when a hidden tab returns.
  useEffect(() => {
    if (state.phase !== "running" || clockRecovery) return undefined;
    observationRef.current = { wall: Date.now(), monotonic: performance.now() };
    const intervalId = window.setInterval(refresh, 250);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [clockRecovery, refresh, state.phase]);

  // Alert once at completion, then optionally begin the visitor-selected next session.
  useEffect(() => {
    if (previousPhaseRef.current !== "completed" && state.phase === "completed") {
      setAnnouncement(`${modeLabel(state.mode)} complete.`);
      if (preferences.soundEnabled) playCompletionTone();
      if (
        preferences.notificationsEnabled &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        // Deliver the alert through the service worker when possible, desktop fallback otherwise.
        void showCompletionNotification(state.mode);
      }
    }
    previousPhaseRef.current = state.phase;
    if (state.phase !== "completed" || !preferences.automaticTransitions || state.mode === "focus")
      return undefined;
    const timeoutId = window.setTimeout(() => {
      send(
        {
          type: "ADVANCE",
          now: Date.now(),
          durations: preferences.durations,
          startImmediately: true,
          longBreakInterval: preferences.longBreakInterval,
        },
        "The next session started automatically.",
      );
    }, 1_500);
    return () => window.clearTimeout(timeoutId);
  }, [preferences, send, state.mode, state.phase]);

  // Save each settings update immediately because it contains no personal session text.
  const setPreferences = useCallback((next: TimerPreferences) => {
    setPreferencesState(next);
    saveTimerPreferences(next);
  }, []);

  // Continue from the last trusted remaining duration after a clock discontinuity.
  const keepRemainingTime = useCallback(() => {
    if (!clockRecovery) return;
    send(
      {
        type: "RECOVER_CLOCK",
        now: Date.now(),
        remainingMs: clockRecovery.remainingBeforeChangeMs,
      },
      "Timer continued from the time shown before the clock changed.",
    );
    setClockRecovery(null);
  }, [clockRecovery, send]);

  // Trust the newly observed wall clock and complete immediately when it passed the target.
  const useChangedClock = useCallback(() => {
    setClockRecovery(null);
    refresh();
    setAnnouncement("Timer recalculated using the changed device clock.");
  }, [refresh]);

  // Let visitors preview the exact completion tone during an explicit settings gesture.
  const playTestTone = useCallback(() => {
    // Refuse quietly on browsers without Web Audio support.
    if (!window.AudioContext) return;
    // Reuse or create the shared context inside this visitor gesture so playback is allowed.
    completionAudioContext ??= new window.AudioContext();
    if (completionAudioContext.state === "suspended") void completionAudioContext.resume();
    // Play the same short tone that announces real session completions.
    playCompletionTone();
    // Keep the preview stable because it depends only on browser capabilities.
  }, []);

  return {
    state,
    preferences,
    displayNow,
    remainingMs: getRemainingMs(state, displayNow),
    overtimeMs: getOvertimeMs(state, displayNow),
    announcement,
    clockRecovery,
    send,
    setPreferences,
    keepRemainingTime,
    useChangedClock,
    playTestTone,
  };
}

// Convert internal mode names into concise visitor-facing labels.
export function modeLabel(mode: TimerMode): string {
  return mode === "focus" ? "Focus session" : mode === "shortBreak" ? "Short break" : "Long break";
}
