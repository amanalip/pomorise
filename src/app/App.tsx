// Import React reference and state tools for the settings dialog and shell-only demonstrations.
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
// Import the approved dark logo as a locally bundled identity for the dark palette.
import darkLogoUrl from "../../assets/logos/header_dark_mode_phase6.png";
// Import the approved light logo as a locally bundled identity for the light palette.
import lightLogoUrl from "../../assets/logos/header_light_mode_phase6.png";
// Import theme state so the logo and appearance settings follow one resolved preference.
import { useTheme } from "../components/ThemeProvider";
// Import the restrained installation offer that follows the browser's own invitation.
import { InstallPomorise } from "../components/PwaStatus";
// Import project-owned primitives that establish Phase 2 interaction and surface patterns.
import { Button, Card, Dialog, Field, Notice, SegmentedControl } from "../components/ui";
// Import only the workspace type so Dexie and Zod stay outside the first-screen bundle.
import type { LocalWorkspaceSnapshot } from "../data/database";
// Import the bounded Phase 4 planning model without coupling it to timer accuracy.
import {
  countUnfinishedTasks,
  createInitialFocusPlan,
  MAX_ESTIMATED_SESSIONS,
  MAX_FOCUS_TASKS,
  reduceFocusPlan,
} from "../focus/planning";
// Import complete-loop capture, reflection, break, and progress operations.
import {
  BREAK_GUIDES,
  createInitialFocusJourney,
  reduceFocusJourney,
  summarizeProgress,
  type DistractionResolution,
} from "../focus/journey";
// Import the timestamp-based timer interface and pure display helpers.
import {
  formatDuration,
  LONG_BREAK_INTERVAL_LIMITS,
  TIMER_LIMITS,
  type TimerDurations,
  type TimerMode,
  type TimerState,
} from "../timer/engine";
import { modeLabel, useTimer } from "../timer/useTimer";
// Import the reviewed defaults so preference reset has one shared source of truth.
import { DEFAULT_TIMER_PREFERENCES, isTimerStorageAvailable } from "../timer/storage";

// Load higher-cost ownership controls only after a visitor opens their settings destination.
const DataControls = lazy(async () => {
  // Fetch the local module as another same-origin application chunk without any remote request.
  const module = await import("../components/DataControls");
  // Adapt its named export to the default shape React lazy expects.
  return { default: module.DataControls };
  // Close the lazy module boundary after preserving the public component contract.
});

// Define the small navigation destinations established by the application shell.
const navigationItems = ["Timer", "Tasks", "Progress"] as const;

// Give each state a short visual label without placing the changing clock in a live region.
const phaseLabels = {
  idle: "Ready",
  running: "Focusing",
  paused: "Paused",
  completed: "Complete",
  skipped: "Skipped",
  overtime: "Overtime",
} as const;

// Name each timer mode in plain visitor language for validation feedback.
const modeNames: Record<TimerMode, string> = {
  focus: "Focus",
  shortBreak: "Short break",
  longBreak: "Long break",
};

// Offer two reviewed duration rhythms so visitors can start from trusted shapes.
const DURATION_PRESETS: { id: string; label: string; durations: TimerDurations }[] = [
  {
    id: "classic",
    label: "Classic 25/5/15",
    durations: { focus: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 },
  },
  {
    id: "deep-work",
    label: "Deep Work 50/10/20",
    durations: { focus: 50 * 60, shortBreak: 10 * 60, longBreak: 20 * 60 },
  },
];

// Let every transient confirmation stay readable before it quietly leaves the interface.
const STATUS_CLEAR_DELAY_MS = 6000;

// Give the reset undo window enough time to be noticed without lingering.
const RESET_UNDO_WINDOW_MS = 8000;

// Hold one piece of interface feedback and clear it automatically unless marked persistent.
function useTransientStatus(): [string, (message: string, persist?: boolean) => void] {
  // Store the current notice text as ordinary component state.
  const [status, setStatus] = useState("");
  // Remember the pending clear schedule so a newer message can replace an older one.
  const statusClearTimeout = useRef<number | null>(null);

  // Cancel any scheduled clear when the owning component unmounts.
  useEffect(
    () => () => {
      // Remove the pending timeout so an unmounted owner never updates again.
      if (statusClearTimeout.current !== null) window.clearTimeout(statusClearTimeout.current);
      // Close the cleanup guard after covering both schedule states.
    },
    [],
  );

  // Publish a message and schedule its quiet removal unless the caller marks it persistent.
  const setTransientStatus = useCallback((message: string, persist = false) => {
    // Replace any earlier schedule so the newest message owns the full display window.
    if (statusClearTimeout.current !== null) {
      window.clearTimeout(statusClearTimeout.current);
      statusClearTimeout.current = null;
      // Close the replacement branch after handing the window to the new message.
    }
    // Show the new message immediately for sighted visitors and screen readers alike.
    setStatus(message);
    // Leave persistent guidance in place until the visitor's next action replaces it.
    if (!persist && message !== "") {
      // Schedule removal only after the polite message has had time to be read.
      statusClearTimeout.current = window.setTimeout(() => {
        // Return to the calm no-message state instead of leaving stale feedback behind.
        setStatus("");
        statusClearTimeout.current = null;
        // Close the scheduled clear after restoring the quiet interface.
      }, STATUS_CLEAR_DELAY_MS);
      // Close the persistence branch after scheduling only true confirmations.
    }
    // Keep the publisher stable so effect dependency lists never churn.
  }, []);

  return [status, setTransientStatus];
}

// Describe one keyboard action so the visible hint always matches the wired behavior.
interface TimerShortcutHint {
  // Show the key cap exactly as a keyboard labels it.
  key: string;
  // Explain the action in the same calm voice as the buttons.
  label: string;
}

// List only the shortcuts that are legal for the current timer phase.
function getTimerShortcutHints(phase: TimerState["phase"]): TimerShortcutHint[] {
  // Offer the primary start action while the timer rests.
  if (phase === "idle") return [{ key: "Space", label: "start" }];
  // Offer pause, extra time, skipping, and reset while a session actively counts down.
  if (phase === "running")
    return [
      { key: "Space", label: "pause" },
      { key: "Alt+A", label: "add 1 min" },
      { key: "Alt+S", label: "skip" },
      { key: "Alt+R", label: "reset" },
    ];
  // Offer resume, extra time, skipping, and reset while a session holds its remaining time.
  if (phase === "paused")
    return [
      { key: "Space", label: "resume" },
      { key: "Alt+A", label: "add 1 min" },
      { key: "Alt+S", label: "skip" },
      { key: "Alt+R", label: "reset" },
    ];
  // Offer skipping and reset during overtime because finishing remains a visible button.
  if (phase === "overtime")
    return [
      { key: "Alt+S", label: "skip" },
      { key: "Alt+R", label: "reset" },
    ];
  // Keep completion and skipped phases quiet so reflection choices stay deliberate.
  return [];
}

// Format one completion boundary as a short local date for the recent-sessions list.
function formatSessionDate(completedAt: number): string {
  return new Date(completedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

// Render the responsive shell around the reliable Phase 3 timer engine.
export function App() {
  // Read both stored and resolved theme values from the application-level provider.
  const { preference, resolvedTheme, setPreference } = useTheme();
  // Keep the active shell destination local until later phases add coordinated application state.
  const [activeNavigation, setActiveNavigation] = useState<(typeof navigationItems)[number]>(
    // Start in the timer workspace because it is the product's primary destination.
    "Timer",
    // Close the initial navigation state after selecting the primary workspace.
  );
  // Coordinate timestamp-derived timing, recovery, settings, and completion alerts.
  const timer = useTimer();
  // Coordinate the optional intention and deliberately small task plan through pure transitions.
  const [focusPlan, updateFocusPlan] = useReducer(
    reduceFocusPlan,
    undefined,
    createInitialFocusPlan,
  );
  // Hold the pending task title separately so incomplete form text is not treated as planned work.
  const [taskDraft, setTaskDraft] = useState("");
  // Start each new task with one approachable estimated focus session.
  const [taskEstimate, setTaskEstimate] = useState(1);
  // Track which unfinished task has an open removal confirmation.
  const [confirmingDeleteTaskId, setConfirmingDeleteTaskId] = useState<number | null>(null);
  // Track which unfinished task is being edited so only one row changes at a time.
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  // Hold the in-progress edited title outside the reviewed task collection.
  const [editTaskTitle, setEditTaskTitle] = useState("");
  // Hold the in-progress edited estimate for the same single-row edit surface.
  const [editTaskEstimate, setEditTaskEstimate] = useState(1);
  // Coordinate captured thoughts, completed sessions, reflections, and derived progress.
  const [focusJourney, updateFocusJourney] = useReducer(
    reduceFocusJourney,
    undefined,
    createInitialFocusJourney,
  );
  // Keep unfinished distraction wording outside the reviewed journey collection.
  const [distractionDraft, setDistractionDraft] = useState("");
  // Let breaks remain quiet by default while making guidance an explicit choice.
  const [breakStyle, setBreakStyle] = useState<"quiet" | "guided">("quiet");
  // Begin guided breaks with the gentlest local breathing prompt.
  const [breakGuideId, setBreakGuideId] = useState<(typeof BREAK_GUIDES)[number]["id"]>("breathe");
  // Hold optional reflection fields until the visitor saves or skips them.
  const [reflectionNextStep, setReflectionNextStep] = useState("");
  const [reflectionRating, setReflectionRating] = useState<number | null>(null);
  const [reflectionNotes, setReflectionNotes] = useState("");
  // Track the keyboard-focused rating so older browsers can still show a focus ring.
  const [focusedRating, setFocusedRating] = useState<number | null>(null);
  // Hold the pre-reset timer snapshot so a mistaken reset can be undone calmly.
  const [resetUndoState, setResetUndoState] = useState<TimerState | null>(null);
  // Remember the pending undo expiry so a newer reset always replaces the older window.
  const resetUndoTimeout = useRef<number | null>(null);
  // Provide restrained feedback for capture and review actions outside timer announcements.
  const [journeyStatus, setJourneyStatus] = useTransientStatus();
  // Report notification support and permission results beside the explicit setting.
  const [notificationStatus, setNotificationStatus] = useTransientStatus();
  // Report the result of the explicit local-sound confirmation beside its setting.
  const [soundStatus, setSoundStatus] = useTransientStatus();
  // Explain rejected duration values beside the fields that produced them.
  const [durationError, setDurationError] = useState<{ mode: TimerMode; message: string } | null>(
    null,
  );
  // Explain a rejected rhythm value beside its own field.
  const [rhythmError, setRhythmError] = useState("");
  // Keep in-progress duration typing local so live ticks never snap fields mid-edit.
  const [durationDrafts, setDurationDrafts] = useState<Partial<Record<TimerMode, string>>>({});
  // Keep the in-progress rhythm value local for the same calm editing behavior.
  const [rhythmDraft, setRhythmDraft] = useState<string | null>(null);
  // Hold the native dialog element so settings can use its modal browser behavior.
  const settingsDialogRef = useRef<HTMLDialogElement>(null);
  // Hold the native dialog element so sound confirmation uses the same modal behavior.
  const soundDialogRef = useRef<HTMLDialogElement>(null);
  // Track the sound confirmation dialog so Escape and explicit actions stay synchronized.
  const [isSoundDialogOpen, setIsSoundDialogOpen] = useState(false);
  // Keep preferences and data ownership as two calm, discoverable settings destinations.
  const [settingsView, setSettingsView] = useState<"preferences" | "data">("preferences");
  // Prevent an empty first render from overwriting IndexedDB before hydration completes.
  const [localDataState, setLocalDataState] = useState<"loading" | "ready" | "error">("loading");
  // Count explicit recovery attempts so a transient IndexedDB failure can be retried in place.
  const [storageLoadAttempt, setStorageLoadAttempt] = useState(0);
  // Version queued saves so imports and deletion can invalidate older pending snapshots safely.
  const workspacePersistenceEpoch = useRef(0);
  // Probe browser storage once so blocked persistence can be explained honestly.
  const [timerStorageAvailable] = useState(() => isTimerStorageAvailable());

  // Open settings as a modal without adding a custom focus-trap implementation.
  function openSettings() {
    // Ask the native dialog to manage modality, focus entry, and the backdrop.
    settingsDialogRef.current?.showModal();
    // Close the open-settings action after requesting native modal behavior.
  }

  // Synchronize both reducers after a validated import, deletion, or initial database read.
  function restoreWorkspace(snapshot: LocalWorkspaceSnapshot) {
    updateFocusPlan({ type: "RESTORE_PLAN", state: snapshot.plan });
    updateFocusJourney({ type: "RESTORE_JOURNEY", state: snapshot.journey });
  }

  // Invalidate any delayed save captured before a higher-priority local data transaction begins.
  function beginWorkspaceMutation() {
    // Advance the epoch synchronously before import or deletion touches IndexedDB.
    workspacePersistenceEpoch.current += 1;
    // Close the mutation boundary after preventing an older snapshot from starting later.
  }

  // Reset only non-personal interface choices while leaving the timer and focus records intact.
  function resetPreferences() {
    // Follow the operating system appearance again through the provider's guarded persistence path.
    setPreference("system");
    // Copy nested durations so later edits cannot mutate the exported default object accidentally.
    timer.setPreferences({
      ...DEFAULT_TIMER_PREFERENCES,
      durations: { ...DEFAULT_TIMER_PREFERENCES.durations },
    });
    // Clear permission feedback because notifications return to their disabled default.
    setNotificationStatus("");
    // Clear field validation feedback because defaults are always valid.
    setDurationError(null);
    setRhythmError("");
    // Release every local draft so fields show the restored defaults immediately.
    setDurationDrafts({});
    setRhythmDraft(null);
    // Close the exact-scope reset after coordinating both preference owners.
  }

  // Hydrate structured personal records once without delaying the reliable timer shell.
  useEffect(() => {
    let active = true;
    // Let the primary timer paint before local data code competes for throttled startup bandwidth.
    const hydrationDelay = window.setTimeout(() => {
      // Load the same-origin database chunk only after the first-screen rendering opportunity.
      void import("../data/database")
        .then(({ loadLocalWorkspace }) => loadLocalWorkspace())
        .then((snapshot) => {
          if (!active) return;
          restoreWorkspace(snapshot);
          setLocalDataState("ready");
        })
        .catch(() => {
          if (active) setLocalDataState("error");
        });
      // Close the delayed hydration callback after defining success and recovery behavior.
    }, 300);
    return () => {
      active = false;
      // Prevent a discarded application instance from starting a new database import.
      window.clearTimeout(hydrationDelay);
    };
  }, [storageLoadAttempt]);

  // Persist coherent snapshots shortly after meaningful planning or journey changes.
  useEffect(() => {
    if (localDataState !== "ready") return;
    const scheduledEpoch = workspacePersistenceEpoch.current;
    const saveDelay = window.setTimeout(() => {
      if (scheduledEpoch !== workspacePersistenceEpoch.current) return;
      void import("../data/database")
        .then(({ saveLocalWorkspace }) =>
          saveLocalWorkspace({ plan: focusPlan, journey: focusJourney }),
        )
        .catch(() => setLocalDataState("error"));
    }, 250);
    return () => window.clearTimeout(saveDelay);
  }, [focusJourney, focusPlan, localDataState]);

  // Close the current settings dialog from its explicit Done control.
  function closeSettings() {
    // Use the native close method so focus returns to the settings trigger.
    settingsDialogRef.current?.close();
    // Close the settings-dismiss action after restoring the non-modal page.
  }

  // Reset through the shared undo flow so an accidental click stays recoverable.
  function requestReset() {
    // Keep the guarded engine rule: idle timers have nothing to reset.
    if (timer.state.phase === "idle") return;
    // Snapshot the exact pre-reset state for the undo window.
    setResetUndoState(timer.state);
    // Replace any pending expiry so the newest reset owns one clear undo window.
    if (resetUndoTimeout.current !== null) window.clearTimeout(resetUndoTimeout.current);
    resetUndoTimeout.current = window.setTimeout(() => {
      setResetUndoState(null);
      resetUndoTimeout.current = null;
    }, RESET_UNDO_WINDOW_MS);
    // Perform the ordinary reset with its usual calm announcement.
    timer.send({ type: "RESET" }, "Timer reset.");
  }

  // Reinstate the exact pre-reset snapshot when the visitor selects Undo in time.
  function undoReset() {
    // Ignore stale toasts whose snapshot has already expired.
    if (resetUndoState === null) return;
    if (resetUndoTimeout.current !== null) {
      window.clearTimeout(resetUndoTimeout.current);
      resetUndoTimeout.current = null;
    }
    timer.send({ type: "RESTORE", state: resetUndoState }, "Timer restored.");
    setResetUndoState(null);
  }

  // Give keyboard visitors direct timer control without reaching for the pointer.
  useEffect(() => {
    // Translate one key press into the same event its matching button would send.
    function handleTimerShortcut(event: KeyboardEvent) {
      // Stay out of the way while any modal dialog owns the interaction.
      if (document.querySelector("dialog[open]")) return;
      // Let native controls keep their own Space, Enter, and arrow behavior.
      const target = event.target;
      if (
        target instanceof Element &&
        (target.closest("input, textarea, select, button, a, summary") ||
          (target instanceof HTMLElement && target.isContentEditable))
      ) {
        return;
      }
      // Mirror the visible primary control with an unmodified Space bar only.
      if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
        if (event.code !== "Space") return;
        if (timer.state.phase === "idle") {
          event.preventDefault();
          timer.send({ type: "START", now: Date.now() }, `${modeLabel(timer.state.mode)} started.`);
        } else if (timer.state.phase === "running") {
          event.preventDefault();
          timer.send({ type: "PAUSE", now: Date.now() }, "Timer paused.");
        } else if (timer.state.phase === "paused") {
          event.preventDefault();
          timer.send({ type: "RESUME", now: Date.now() }, "Timer resumed.");
        }
        // Close the Space branch after covering every legal toggle state.
        return;
      }
      // Reserve secondary actions for Alt chords so plain typing can never trigger them.
      if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      // Match physical keys so international layouts keep the same chords.
      switch (event.code) {
        // Repeat the reset button's guarded behavior for Alt+R.
        case "KeyR":
          if (timer.state.phase !== "idle") {
            event.preventDefault();
            requestReset();
          }
          break;
        // Add one minute exactly when the visible Add 1 minute button is available.
        case "KeyA":
          if (timer.state.phase === "running" || timer.state.phase === "paused") {
            event.preventDefault();
            timer.send({ type: "ADD_TIME", seconds: 60, now: Date.now() }, "One minute added.");
          }
          break;
        // Skip only during the phases where skipping is a legal engine transition.
        case "KeyS":
          if (
            timer.state.phase === "running" ||
            timer.state.phase === "paused" ||
            timer.state.phase === "overtime"
          ) {
            event.preventDefault();
            timer.send({ type: "SKIP", now: Date.now() }, "Session skipped.");
          }
          break;
        // Leave every other Alt chord to the browser and operating system.
        default:
          break;
      }
      // Close the shortcut handler after leaving all other keys untouched.
    }
    // Listen at the window level so shortcuts work from anywhere in the workspace.
    window.addEventListener("keydown", handleTimerShortcut);
    return () => window.removeEventListener("keydown", handleTimerShortcut);
    // Rebind only when the phase-dependent behavior or sender identity changes.
  }, [timer.send, timer.state.mode, timer.state.phase]);

  // Keep the browser tab honest about live progress without demanding attention.
  useEffect(() => {
    // Start from the descriptive product title used by idle, completed, and skipped moments.
    const idleTitle = "Pomorise – Private Pomodoro Focus Timer";
    let title = idleTitle;
    // Show a live clock while a session counts down or runs honestly into overtime.
    if (timer.state.phase === "running" || timer.state.phase === "overtime") {
      // Reuse the exact on-screen duration so the tab and display never disagree.
      const overtimePrefix = timer.state.phase === "overtime" ? "+" : "";
      const clock = formatDuration(
        timer.state.phase === "overtime" ? timer.overtimeMs : timer.remainingMs,
      );
      // Keep break modes equally visible with one shared calm label.
      const label = timer.state.mode === "focus" ? "Focus" : "Break";
      title = `${overtimePrefix}${clock} · ${label} · Pomorise`;
    } else if (timer.state.phase === "paused") {
      // Lead with the state so an untouched paused timer reads clearly at a glance.
      title = `Paused · ${formatDuration(timer.remainingMs)} · Pomorise`;
    }
    document.title = title;
    // Refresh only when the visible clock or phase actually changes.
  }, [timer.overtimeMs, timer.remainingMs, timer.state.mode, timer.state.phase]);

  // Switch modes only while idle so active session history never changes meaning.
  function selectMode(mode: TimerMode) {
    timer.send({ type: "SELECT_MODE", mode, seconds: timer.preferences.durations[mode] });
  }

  // Turn a valid pending title and estimate into one small local task.
  function addTask(event: FormEvent<HTMLFormElement>) {
    // Prevent the native form submission from navigating away from the running application.
    event.preventDefault();
    // Leave whitespace-only drafts in the editable field for immediate correction.
    if (!taskDraft.trim()) return;
    // Send validated form data through the pure planning boundary.
    updateFocusPlan({ type: "ADD_TASK", title: taskDraft, estimatedSessions: taskEstimate });
    // Clear the draft after a successful capacity-aware addition.
    if (focusPlan.tasks.filter((task) => !task.completed).length < MAX_FOCUS_TASKS) {
      setTaskDraft("");
    }
    // Close the add-task action after preserving the visitor's compact plan.
  }

  // Derive the current unfinished task from its stable selected identity.
  const activeTask = focusPlan.tasks.find(
    // Match only the selected task because completed tasks automatically release selection.
    (task) => task.id === focusPlan.activeTaskId,
    // Close the current-task lookup after checking every planned task.
  );
  // Keep actionable work separate from completed records so each has a clear purpose.
  const pendingTasks = focusPlan.tasks.filter((task) => !task.completed);
  // Preserve completed work as a local audit trail instead of removing it from the plan.
  const completedTasks = focusPlan.tasks.filter((task) => task.completed);
  // Relate focus-session progress to the selected task without implying a fixed total otherwise.
  const sessionSequence =
    timer.state.mode === "focus" && activeTask
      ? `Session ${Math.min(activeTask.completedSessions + 1, activeTask.estimatedSessions)} of ${activeTask.estimatedSessions}`
      : `Session ${timer.state.sessionNumber}`;
  // Derive pending review items without hiding kept or converted history from state.
  const pendingDistractions = focusJourney.distractions.filter(
    // Present only thoughts that still need one explicit post-session choice.
    (item) => item.resolution === "pending",
    // Close the pending-review derivation after checking each captured thought.
  );
  // Derive private summaries from session records rather than storing duplicate totals.
  const progressSummary = summarizeProgress(focusJourney.sessions, Date.now());
  // Choose the active local guide only when the visitor requests guided break support.
  const activeBreakGuide = BREAK_GUIDES.find((guide) => guide.id === breakGuideId);

  // Snapshot each unique completed focus boundary into the Phase 4 journey.
  useEffect(() => {
    // Ignore non-focus sessions and timer states without a real completion timestamp.
    if (timer.state.mode !== "focus" || timer.state.completedAt === null) return;
    // Record immutable planning context without coupling it back into timer transitions.
    updateFocusJourney({
      type: "RECORD_SESSION",
      completedAt: timer.state.completedAt,
      plannedSeconds: timer.state.plannedSeconds,
      intention: focusPlan.intention,
      taskTitle: activeTask?.title ?? null,
    });
    // Close the completion effect after its idempotent journey action.
  }, [
    activeTask?.title,
    focusPlan.intention,
    timer.state.completedAt,
    timer.state.mode,
    timer.state.plannedSeconds,
  ]);

  // Move between the two settings tabs with the arrow keys the tabs pattern promises.
  function handleSettingsTabKeys(event: ReactKeyboardEvent<HTMLDivElement>) {
    // Treat the two-tab list as a simple ring for Home, End, Left, and Right.
    const nextView =
      event.key === "ArrowRight" || event.key === "End"
        ? "data"
        : event.key === "ArrowLeft" || event.key === "Home"
          ? "preferences"
          : null;
    // Leave every other key to normal focus movement between dialog controls.
    if (nextView === null) return;
    event.preventDefault();
    setSettingsView(nextView);
    // Move real focus onto the newly selected tab so the pattern stays keyboard-first.
    document.getElementById(nextView === "data" ? "data-tab" : "preferences-tab")?.focus();
    // Close the tablist keyboard handler after its two-destination navigation.
  }

  // Move keyboard focus to a selected first-level destination without trapping the visitor.
  function navigateTo(item: (typeof navigationItems)[number]) {
    // Synchronize the selected visual state across desktop and compact navigation.
    setActiveNavigation(item);
    // Focus the existing destination so keyboard and touch users receive the same movement.
    document
      .getElementById(item === "Timer" ? "workspace" : `${item.toLowerCase()}-panel`)
      ?.focus();
    // Close navigation after moving focus to the requested existing section.
  }

  // Capture one thought through a single step while leaving the timer untouched.
  function captureDistraction(event: FormEvent<HTMLFormElement>) {
    // Prevent form submission from navigating away from the current focus session.
    event.preventDefault();
    // Leave empty text available for correction without creating an invalid record.
    if (!distractionDraft.trim()) return;
    // Add the plain-text thought to the explicit post-session review queue.
    updateFocusJourney({ type: "CAPTURE_DISTRACTION", text: distractionDraft });
    // Clear the field immediately so another thought can be captured in one step.
    setDistractionDraft("");
    // Confirm capture without interrupting or speaking the changing timer.
    setJourneyStatus("Distraction captured. Your timer kept running.");
    // Close the capture action after preserving focus continuity.
  }

  // Apply one convert, keep, or dismiss choice to a pending distraction.
  function resolveDistraction(
    distractionId: number,
    resolution: Exclude<DistractionResolution, "pending">,
  ) {
    // Find the pending plain-text thought before optionally converting it into a task.
    const distraction = focusJourney.distractions.find((item) => item.id === distractionId);
    // Refuse stale review requests that no longer point to a pending thought.
    if (!distraction || distraction.resolution !== "pending") return;
    // Convert only when the deliberately small task list still has unfinished capacity.
    if (resolution === "task") {
      if (countUnfinishedTasks(focusPlan.tasks) >= MAX_FOCUS_TASKS) {
        setJourneyStatus("The task list is full. Keep or dismiss this thought instead.");
        return;
      }
      updateFocusPlan({ type: "ADD_TASK", title: distraction.text, estimatedSessions: 1 });
    }
    // Preserve the visitor's explicit review outcome in the transient journey.
    updateFocusJourney({ type: "RESOLVE_DISTRACTION", distractionId, resolution });
    // Confirm the completed choice in calm plain language.
    setJourneyStatus(
      resolution === "task"
        ? "Distraction converted to a task."
        : resolution === "kept"
          ? "Distraction kept for later."
          : "Distraction dismissed.",
    );
    // Close the review action after applying its optional task conversion.
  }

  // Begin one bounded inline edit with the task's current trusted values.
  function beginEditTask(taskId: number, title: string, estimatedSessions: number) {
    setEditingTaskId(taskId);
    setEditTaskTitle(title);
    setEditTaskEstimate(estimatedSessions);
  }

  // Commit the open edit through the guarded reducer and close the row quietly.
  function saveEditedTask() {
    if (editingTaskId === null) return;
    updateFocusPlan({
      type: "EDIT_TASK",
      taskId: editingTaskId,
      title: editTaskTitle,
      estimatedSessions: editTaskEstimate,
    });
    setEditingTaskId(null);
  }

  // Finish optional reflection and move to the break chosen by the timer cycle.
  function finishReflection(skip: boolean) {
    // Require the exact completion boundary that owns this reflection.
    if (timer.state.completedAt === null) return;
    // Credit focused overtime once, before the boundary leaves the visible timer.
    if (timer.state.phase === "overtime" && timer.state.overtimeStartedAt !== null) {
      updateFocusJourney({
        type: "RECORD_OVERTIME",
        completedAt: timer.state.completedAt,
        overtimeSeconds: Math.round((Date.now() - timer.state.overtimeStartedAt) / 1_000),
      });
    }
    // Save the optional fields or record the visitor's deliberate skip.
    updateFocusJourney(
      skip
        ? { type: "SKIP_REFLECTION", completedAt: timer.state.completedAt }
        : {
            type: "SAVE_REFLECTION",
            completedAt: timer.state.completedAt,
            nextStep: reflectionNextStep,
            focusRating: reflectionRating,
            notes: reflectionNotes,
          },
    );
    // Advance from either normal completion or overtime into the next cycle stage.
    timer.send(
      {
        type: "ADVANCE",
        now: Date.now(),
        durations: timer.preferences.durations,
        startImmediately: timer.preferences.automaticBreaks,
        longBreakInterval: timer.preferences.longBreakInterval,
      },
      skip ? "Reflection skipped. Your break is ready." : "Reflection saved. Your break is ready.",
    );
    // Clear drafts so the next completed session starts with an uncluttered reflection.
    setReflectionNextStep("");
    setReflectionRating(null);
    setReflectionNotes("");
    // Close the reflection boundary after continuing the timer cycle.
  }

  // Apply one reviewed duration rhythm across all three modes at once.
  function applyDurationPreset(preset: (typeof DURATION_PRESETS)[number]) {
    // Release local drafts because the preset owns every field value now.
    setDurationDrafts({});
    setDurationError(null);
    // Copy nested durations so later edits cannot mutate the shared preset object.
    timer.setPreferences({
      ...timer.preferences,
      durations: { ...preset.durations },
    });
    // Synchronize the visible idle clock when the current mode is affected.
    if (timer.state.phase === "idle") {
      timer.send({ type: "SET_DURATION", seconds: preset.durations[timer.state.mode] });
    }
  }

  // Update one bounded duration and synchronize the idle clock for the selected mode.
  function updateDuration(mode: TimerMode, minutes: number) {
    // Treat a cleared field as quiet mid-edit typing instead of an error to correct.
    if (Number.isNaN(minutes)) return;
    // Explain out-of-range values instead of silently keeping the previous duration.
    if (
      !Number.isInteger(minutes) ||
      minutes < TIMER_LIMITS.minimumMinutes ||
      minutes > TIMER_LIMITS.maximumMinutes
    ) {
      setDurationError({
        mode,
        message: `${modeNames[mode]} must be a whole number from ${TIMER_LIMITS.minimumMinutes} to ${TIMER_LIMITS.maximumMinutes}.`,
      });
      return;
    }
    setDurationError(null);
    // Release the local draft so the committed value normalizes in the field.
    setDurationDrafts((drafts) => {
      const next = { ...drafts };
      delete next[mode];
      return next;
    });
    const durations = { ...timer.preferences.durations, [mode]: minutes * 60 };
    timer.setPreferences({ ...timer.preferences, durations });
    if (timer.state.phase === "idle" && timer.state.mode === mode) {
      timer.send({ type: "SET_DURATION", seconds: minutes * 60 });
    }
  }

  // Update the focus-session count that triggers each long break within its safe bounds.
  function updateLongBreakInterval(sessions: number) {
    // Treat a cleared field as quiet mid-edit typing instead of an error to correct.
    if (Number.isNaN(sessions)) return;
    // Explain out-of-range values instead of silently keeping the previous rhythm.
    if (
      !Number.isInteger(sessions) ||
      sessions < LONG_BREAK_INTERVAL_LIMITS.minimum ||
      sessions > LONG_BREAK_INTERVAL_LIMITS.maximum
    ) {
      setRhythmError(
        `Choose a whole number from ${LONG_BREAK_INTERVAL_LIMITS.minimum} to ${LONG_BREAK_INTERVAL_LIMITS.maximum} focus sessions.`,
      );
      return;
    }
    setRhythmError("");
    // Release the local draft so the committed value normalizes in the field.
    setRhythmDraft(null);
    timer.setPreferences({ ...timer.preferences, longBreakInterval: sessions });
  }

  // Accept raw typing for one duration while keeping validation on parsed values only.
  function changeDurationDraft(mode: TimerMode, raw: string) {
    setDurationDrafts((drafts) => ({ ...drafts, [mode]: raw }));
    updateDuration(mode, raw.trim() === "" ? Number.NaN : Number(raw));
  }

  // Accept raw typing for the rhythm while keeping validation on parsed values only.
  function changeRhythmDraft(raw: string) {
    setRhythmDraft(raw);
    updateLongBreakInterval(raw.trim() === "" ? Number.NaN : Number(raw));
  }

  // Request notification permission only in response to the visitor enabling the setting.
  async function changeNotifications(enabled: boolean) {
    if (!enabled) {
      timer.setPreferences({ ...timer.preferences, notificationsEnabled: false });
      setNotificationStatus("Browser notifications are off.");
      return;
    }
    if (!("Notification" in window)) {
      setNotificationStatus(
        "This browser does not support notifications. The timer still works normally.",
        true,
      );
      return;
    }
    if (Notification.permission === "denied") {
      timer.setPreferences({ ...timer.preferences, notificationsEnabled: false });
      setNotificationStatus(
        "Your browser has blocked notifications for this site. Open the site controls beside the address bar, allow Notifications, then try again.",
        true,
      );
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      const granted = permission === "granted";
      timer.setPreferences({ ...timer.preferences, notificationsEnabled: granted });
      setNotificationStatus(
        granted
          ? "Browser notifications are on."
          : "Notifications were not allowed. If no prompt appears, open the site controls beside the address bar and allow Notifications.",
        !granted,
      );
    } catch {
      timer.setPreferences({ ...timer.preferences, notificationsEnabled: false });
      setNotificationStatus(
        "Notifications could not be enabled. The timer still works normally without them.",
        true,
      );
    }
  }

  // Offer an in-app sound confirmation with a live preview instead of a blocking browser prompt.
  function changeSound(enabled: boolean) {
    if (!enabled) {
      timer.setPreferences({ ...timer.preferences, soundEnabled: false });
      setSoundStatus("Local completion sound is off.");
      return;
    }
    // Ignore repeated enable requests while the confirmation conversation is already open.
    if (isSoundDialogOpen && soundDialogRef.current?.open) return;
    // Open the calm in-app explanation so the tone can be heard before it is trusted.
    setIsSoundDialogOpen(true);
    // Ask the native dialog to manage modality only once per confirmation conversation.
    if (!soundDialogRef.current?.open) soundDialogRef.current?.showModal();
  }

  // Enable the completion sound after the visitor confirmed it inside the application.
  function confirmSoundEnable() {
    timer.setPreferences({ ...timer.preferences, soundEnabled: true });
    setSoundStatus(
      "Local completion sound is on. If it stays silent, check that the tab and device are not muted, or allow Sound in your browser's site controls.",
    );
    closeSoundDialog();
  }

  // Leave the sound disabled when the visitor declines the in-app confirmation.
  function declineSoundEnable() {
    setSoundStatus("The completion sound remains off.");
    closeSoundDialog();
  }

  // Close the sound dialog through its explicit controls and reset its React state together.
  function closeSoundDialog() {
    setIsSoundDialogOpen(false);
    soundDialogRef.current?.close();
  }

  // Derive the visible keyboard hints from the same phase logic that gates the shortcuts.
  const timerShortcutHints = getTimerShortcutHints(timer.state.phase);

  // Render the complete branded shell, responsive workspace, and appearance dialog.
  return (
    // Group header, main workspace, and mobile navigation inside the full-height application frame.
    <div className="app-shell">
      {/* Provide a keyboard shortcut past repeated navigation to the primary workspace. */}
      <a className="skip-link" href="#workspace">
        {/* Name the landmark destination in plain action language. */}
        Skip to timer
        {/* Close the skip link after its useful label. */}
      </a>

      {/* Keep product identity, desktop navigation, and settings in one responsive header. */}
      <header className="app-header">
        {/* Keep the approved symbol beside crisp live text at every responsive size. */}
        <div className="app-header__brand">
          {/* Crop only the approved symbol so raster tagline fragments can never enter the header. */}
          <span className="app-header__mark" aria-hidden="true">
            <img src={resolvedTheme === "dark" ? darkLogoUrl : lightLogoUrl} alt="" />
          </span>
          {/* Render identity wording as real text for clean scaling and accessibility. */}
          <span className="app-header__identity">
            <strong>pomorise</strong>
            <span>rise one session at a time</span>
          </span>
        </div>

        {/* Expose the main destinations at desktop widths without claiming later feature completion. */}
        <nav className="desktop-navigation" aria-label="Primary navigation">
          {/* Create one quiet shell control for each planned first-level destination. */}
          {navigationItems.map((item) => (
            // Reuse the stable item name as React's identity for each destination.
            <Button
              // Mark the current section generically because these are views, not pages.
              aria-current={activeNavigation === item ? "true" : undefined}
              // Preserve the stable destination name as React's list key.
              key={item}
              // Switch the highlighted shell destination without pretending to load future content.
              onClick={() => navigateTo(item)}
              // Keep every desktop destination visually quiet beside the timer workspace.
              variant="quiet"
            >
              {/* Display the concise destination label. */}
              {item}
              {/* Close the navigation control after its text. */}
            </Button>
            // Close the navigation mapping after all planned destinations.
          ))}
          {/* Close the desktop navigation after every first-level destination. */}
        </nav>

        {/* Open appearance and future preferences through one consistent header action. */}
        <Button className="settings-button" onClick={openSettings} variant="secondary">
          {/* Keep the visible label direct and recognizable at every supported width. */}
          Settings
          {/* Close the settings trigger after its text. */}
        </Button>
        {/* Close the application header after identity, navigation, and settings. */}
      </header>

      {/* Place the timer workspace first and secondary context beside it on wider viewports. */}
      <main className="workspace" id="workspace" tabIndex={-1}>
        {/* Explain blocked browser storage instead of implying timer recovery survives. */}
        {!timerStorageAvailable && (
          <Notice className="storage-warning" role="status" tone="warning">
            <span>
              Local browser storage is blocked, so the timer cannot remember this session or your
              settings after the page closes. The timer itself still works.
            </span>
            {/* Close the honest storage warning without offering a retry that cannot help. */}
          </Notice>
        )}
        {/* Explain a failed local-storage boundary instead of silently implying persistence. */}
        {localDataState === "error" && (
          <Notice className="storage-warning" role="alert" tone="warning">
            <span>
              Local saving is unavailable in this browser session. The timer still works, but export
              anything you want to keep before closing the page.
            </span>
            <Button
              onClick={() => {
                setLocalDataState("loading");
                setStorageLoadAttempt((attempt) => attempt + 1);
              }}
              variant="secondary"
            >
              Try local data again
            </Button>
          </Notice>
        )}
        {/* Keep the reliable timer as the calm central application surface. */}
        <Card className="timer-card" elevated aria-labelledby="timer-title">
          {/* Show session type and sequence without competing with the countdown. */}
          <div className="timer-card__eyebrow">
            {/* Name the current timer mode in a short high-contrast label. */}
            <span>{modeLabel(timer.state.mode)}</span>
            {/* Show selected-task progress during focus and only the current session otherwise. */}
            <span>{sessionSequence}</span>
            {/* Close the timer context row after both concise labels. */}
          </div>

          {/* Give the page one clear heading that describes the user's immediate purpose. */}
          <h1 id="timer-title">
            {timer.state.mode === "focus" ? "Make space for one thing." : "Take a real pause."}
          </h1>
          {/* Explain the current mode without requiring optional planning or guidance. */}
          <p className="timer-card__intro">
            {timer.state.mode === "focus"
              ? "Set an intention when you are ready, or begin without one."
              : "Choose a quiet break or one gentle guide. You can always do nothing here."}
          </p>

          {/* Let a visitor choose a timer purpose before starting, using native radio behavior. */}
          <SegmentedControl
            className="timer-mode-control"
            disabled={timer.state.phase !== "idle"}
            label="Timer mode"
            name="timer-mode"
            onChange={selectMode}
            options={[
              { value: "focus", label: "Focus" },
              { value: "shortBreak", label: "Short break" },
              { value: "longBreak", label: "Long break" },
            ]}
            value={timer.state.mode}
          />

          {/* Keep focus intention available only when it belongs to the selected session mode. */}
          {timer.state.mode === "focus" && (
            <Field
              // Give the visible and programmatic field relationship a stable identifier.
              id="focus-intention"
              // Explain that the optional field does not block starting a future session.
              hint="Optional. You can change this before the session starts."
              // Label the outcome rather than the implementation detail of a text input.
              label="What will you move forward?"
              // Offer a realistic prompt without inserting saved or synthetic personal data.
              placeholder="For example, outline the project brief"
              disabled={timer.state.phase !== "idle" || localDataState === "loading"}
              maxLength={120}
              onChange={(event) =>
                updateFocusPlan({ type: "SET_INTENTION", intention: event.currentTarget.value })
              }
              value={focusPlan.intention}
            />
          )}

          {/* Keep the timestamp-derived clock outside a live region to avoid second-by-second speech. */}
          <div
            className="timer-display"
            role="timer"
            aria-label={
              timer.state.phase === "overtime"
                ? `${formatDuration(timer.overtimeMs)} overtime`
                : `${formatDuration(timer.remainingMs)} remaining`
            }
          >
            {/* Identify the numeric value as a clock-like duration for visual readers. */}
            <span className="timer-display__time">
              {timer.state.phase === "overtime" ? "+" : ""}
              {formatDuration(
                timer.state.phase === "overtime" ? timer.overtimeMs : timer.remainingMs,
              )}
            </span>
            {/* Add a quiet state label rather than animating an idle countdown. */}
            <span className="timer-display__state">{phaseLabels[timer.state.phase]}</span>
            {/* Close the timer display after duration and current state. */}
          </div>

          {/* Expose only actions legal for the current deterministic state. */}
          <div className="timer-actions">
            <Button disabled={timer.state.phase === "idle"} onClick={requestReset} variant="quiet">
              Reset
            </Button>

            {timer.state.phase === "idle" && (
              <Button
                onClick={() =>
                  timer.send(
                    { type: "START", now: Date.now() },
                    `${modeLabel(timer.state.mode)} started.`,
                  )
                }
              >
                Start {timer.state.mode === "focus" ? "focus" : "break"}
              </Button>
            )}
            {timer.state.phase === "running" && (
              <Button
                onClick={() => timer.send({ type: "PAUSE", now: Date.now() }, "Timer paused.")}
              >
                Pause
              </Button>
            )}
            {timer.state.phase === "paused" && (
              <Button
                onClick={() => timer.send({ type: "RESUME", now: Date.now() }, "Timer resumed.")}
              >
                Resume
              </Button>
            )}
            {timer.state.phase === "completed" && (
              <>
                <Button
                  variant="secondary"
                  onClick={() =>
                    timer.send({ type: "START_OVERTIME", now: Date.now() }, "Overtime started.")
                  }
                >
                  Keep working
                </Button>
                {/* Let completed breaks advance directly while focus completion enters reflection below. */}
                {timer.state.mode !== "focus" && (
                  <Button
                    onClick={() =>
                      timer.send(
                        {
                          type: "ADVANCE",
                          now: Date.now(),
                          durations: timer.preferences.durations,
                          longBreakInterval: timer.preferences.longBreakInterval,
                        },
                        "Next session is ready.",
                      )
                    }
                  >
                    Next session
                  </Button>
                )}
              </>
            )}
            {timer.state.phase === "skipped" && (
              <Button
                onClick={() =>
                  timer.send(
                    {
                      type: "ADVANCE",
                      now: Date.now(),
                      durations: timer.preferences.durations,
                      longBreakInterval: timer.preferences.longBreakInterval,
                    },
                    "Next session is ready.",
                  )
                }
              >
                Next session
              </Button>
            )}
            {timer.state.phase === "overtime" && timer.state.mode !== "focus" && (
              <Button
                onClick={() =>
                  timer.send(
                    {
                      type: "ADVANCE",
                      now: Date.now(),
                      durations: timer.preferences.durations,
                      longBreakInterval: timer.preferences.longBreakInterval,
                    },
                    "Overtime ended. The next session is ready.",
                  )
                }
              >
                Finish and continue
              </Button>
            )}

            {(timer.state.phase === "running" || timer.state.phase === "paused") && (
              <Button
                variant="secondary"
                disabled={timer.remainingMs >= TIMER_LIMITS.maximumMinutes * 60_000}
                onClick={() =>
                  timer.send(
                    { type: "ADD_TIME", seconds: 60, now: Date.now() },
                    "One minute added.",
                  )
                }
              >
                Add 1 minute
              </Button>
            )}
            {(timer.state.phase === "running" ||
              timer.state.phase === "paused" ||
              timer.state.phase === "overtime") && (
              <Button
                variant="quiet"
                onClick={() => timer.send({ type: "SKIP", now: Date.now() }, "Session skipped.")}
              >
                Skip
              </Button>
            )}
          </div>

          {/* Offer one calm undo window so an accidental reset stays recoverable. */}
          {resetUndoState && (
            <p className="undo-toast" role="status" aria-label="Reset undo">
              <span>Timer reset.</span>
              <Button onClick={undoReset} variant="secondary">
                Undo
              </Button>
            </p>
          )}

          {/* Teach the keyboard shortcuts quietly so they never compete with the timer itself. */}
          {timerShortcutHints.length > 0 && (
            <p className="timer-shortcuts">
              {/* Announce the group once instead of reading decorative separators aloud. */}
              <span className="timer-shortcuts__label">Keyboard:</span>
              {/* Show only the keys that work right now, in the order visitors will use them. */}
              {timerShortcutHints.map((hint) => (
                // Keep each stable key name as React's identity for its hint chip.
                <span key={hint.key} className="timer-shortcuts__item">
                  {/* Mark the key cap as a keyboard input for assistive technology. */}
                  <kbd>{hint.key}</kbd>
                  {/* Pair the key with its plain-language action. */}
                  <span>{hint.label}</span>
                  {/* Close one hint chip after its key and action. */}
                </span>
              ))}
              {/* Close the shortcut hints after listing every available key. */}
            </p>
          )}

          {/* Offer one-step capture only while an active focus session can be interrupted. */}
          {timer.state.mode === "focus" &&
            (timer.state.phase === "running" ||
              timer.state.phase === "paused" ||
              timer.state.phase === "overtime") && (
              // Keep capture in one compact native form that never sends a timer event.
              <form className="capture-panel" onSubmit={captureDistraction}>
                {/* Explain the low-interruption purpose before the editable field. */}
                <div>
                  <strong>Something else on your mind?</strong>
                  <span>Capture it without stopping this session.</span>
                </div>
                {/* Keep visitor wording bounded and rendered only as plain text later. */}
                <Field
                  id="distraction-capture"
                  label="Quick capture"
                  maxLength={160}
                  onChange={(event) => setDistractionDraft(event.currentTarget.value)}
                  placeholder="Write it down and return to focus"
                  value={distractionDraft}
                />
                {/* Disable empty capture while preserving the visible one-step action. */}
                <Button disabled={!distractionDraft.trim()} type="submit" variant="secondary">
                  Capture and continue
                </Button>
              </form>
            )}

          {/* Review every pending thought after focus without forcing a choice during the timer. */}
          {timer.state.mode === "focus" &&
            (timer.state.phase === "completed" || timer.state.phase === "overtime") &&
            pendingDistractions.length > 0 && (
              // Give the review collection a clear heading and list relationship.
              <section className="review-panel" aria-labelledby="distraction-review-title">
                {/* Name the boundary in calm post-session language. */}
                <h2 id="distraction-review-title">Review captured thoughts</h2>
                {/* Explain that each item can leave the queue through one optional choice. */}
                <p>Convert each thought into a task, keep it for later, or dismiss it.</p>
                {/* Preserve capture order while presenting independent review actions. */}
                <ul className="review-list">
                  {pendingDistractions.map((distraction) => (
                    // Use the stable transient identity across review updates.
                    <li key={distraction.id}>
                      {/* Render visitor-authored capture strictly as text. */}
                      <strong>{distraction.text}</strong>
                      {/* Allow actions to wrap without changing their logical order. */}
                      <div>
                        <Button
                          disabled={countUnfinishedTasks(focusPlan.tasks) >= MAX_FOCUS_TASKS}
                          onClick={() => resolveDistraction(distraction.id, "task")}
                          variant="secondary"
                        >
                          Convert to task
                        </Button>
                        <Button
                          onClick={() => resolveDistraction(distraction.id, "kept")}
                          variant="quiet"
                        >
                          Keep for later
                        </Button>
                        <Button
                          onClick={() => resolveDistraction(distraction.id, "dismissed")}
                          variant="quiet"
                        >
                          Dismiss
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

          {/* Complete or skip reflection after each focus completion, including overtime. */}
          {timer.state.mode === "focus" &&
            timer.state.completedAt !== null &&
            (timer.state.phase === "completed" || timer.state.phase === "overtime") && (
              // Keep optional reflection visible in the flow without trapping visitors in a wizard.
              <section className="reflection-panel" aria-labelledby="reflection-title">
                {/* Name the short transition between focus and break. */}
                <h2 id="reflection-title">Close this session gently</h2>
                {/* Summarize the completed progress before asking for optional detail. */}
                <p>
                  You completed {Math.round(timer.state.plannedSeconds / 60)} focus minutes.
                  Everything below is optional.
                </p>
                {/* Keep the next return point concise and directly editable. */}
                <Field
                  id="reflection-next-step"
                  label="What is the next small step?"
                  maxLength={120}
                  onChange={(event) => setReflectionNextStep(event.currentTarget.value)}
                  placeholder="For example, revise the opening paragraph"
                  value={reflectionNextStep}
                />
                {/* Use native radios for the optional focus rating. */}
                <fieldset className="rating-control">
                  <legend>Focus rating, optional</legend>
                  <div>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      // Give each bounded numeric option a native label and stable identity.
                      <label
                        key={rating}
                        // Mirror selection and keyboard focus through classes that need no :has().
                        className={
                          [
                            reflectionRating === rating ? "is-selected" : "",
                            focusedRating === rating ? "is-focused" : "",
                          ]
                            .filter(Boolean)
                            .join(" ") || undefined
                        }
                      >
                        <input
                          checked={reflectionRating === rating}
                          name="focus-rating"
                          onBlur={() => setFocusedRating(null)}
                          onChange={() => setReflectionRating(rating)}
                          onFocus={(event) => {
                            // Reserve the ring for keyboard focus so pointer clicks stay calm.
                            if (event.currentTarget.matches(":focus-visible")) {
                              setFocusedRating(rating);
                            }
                          }}
                          type="radio"
                          value={rating}
                        />
                        <span>{rating}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                {/* Link private notes to a visible native textarea label. */}
                <label className="reflection-notes" htmlFor="reflection-notes">
                  <span>Notes, optional</span>
                  <textarea
                    id="reflection-notes"
                    maxLength={500}
                    onChange={(event) => setReflectionNotes(event.currentTarget.value)}
                    placeholder="Keep any useful context for yourself"
                    value={reflectionNotes}
                  />
                </label>
                {/* Offer explicit completion or carry-forward treatment for selected work. */}
                {activeTask && (
                  // Keep task outcomes adjacent to reflection rather than hidden in another page.
                  <div className="reflection-task">
                    <span>
                      Current task: <strong>{activeTask.title}</strong>
                    </span>
                    <div>
                      <Button
                        onClick={() =>
                          updateFocusPlan({ type: "COMPLETE_TASK", taskId: activeTask.id })
                        }
                        variant="secondary"
                      >
                        Mark task complete
                      </Button>
                      <Button
                        disabled={activeTask.lastCarriedAt === timer.state.completedAt}
                        onClick={() => {
                          updateFocusPlan({
                            type: "CARRY_TASK",
                            taskId: activeTask.id,
                            completedAt: timer.state.completedAt ?? 0,
                          });
                          setJourneyStatus("Task carried forward to the next focus session.");
                        }}
                        variant="quiet"
                      >
                        Carry forward
                      </Button>
                    </div>
                  </div>
                )}
                {/* Save optional detail or continue immediately through an explicit skip. */}
                <div className="reflection-actions">
                  <Button onClick={() => finishReflection(false)}>Save and continue</Button>
                  <Button onClick={() => finishReflection(true)} variant="quiet">
                    Skip reflection
                  </Button>
                </div>
              </section>
            )}

          {/* Offer quiet or locally guided support whenever the selected mode is a break. */}
          {timer.state.mode !== "focus" && (
            // Keep break guidance inside the same understandable timer surface.
            <section className="break-panel" aria-labelledby="break-title">
              <h2 id="break-title">How would you like to pause?</h2>
              {/* Let quiet remain the default while guidance is always one choice away. */}
              <SegmentedControl
                label="Break experience"
                name="break-style"
                onChange={setBreakStyle}
                options={[
                  { value: "quiet", label: "Quiet" },
                  { value: "guided", label: "Guided" },
                ]}
                value={breakStyle}
              />
              {breakStyle === "quiet" ? (
                // Avoid filling quiet breaks with instructions or achievement pressure.
                <p className="break-prompt">
                  Step away if you can. Nothing needs your attention here.
                </p>
              ) : (
                // Present every approved guide locally without media or network requests.
                <div className="guided-break">
                  <div className="guide-choices" aria-label="Guided break options">
                    {BREAK_GUIDES.map((guide) => (
                      // Select one short prompt through a native project button.
                      <Button
                        aria-pressed={breakGuideId === guide.id}
                        key={guide.id}
                        onClick={() => setBreakGuideId(guide.id)}
                        variant="quiet"
                      >
                        {guide.label}
                      </Button>
                    ))}
                  </div>
                  {/* Show the selected instruction as ordinary readable text. */}
                  <p className="guided-break__instruction">{activeBreakGuide?.instruction}</p>
                </div>
              )}
            </section>
          )}

          {/* Announce focus-loop actions separately from timestamp transition announcements. */}
          {journeyStatus && (
            <Notice className="journey-status" role="status">
              {journeyStatus}
            </Notice>
          )}

          {/* Ask for an explicit recovery choice instead of silently trusting a changed clock. */}
          {timer.clockRecovery && (
            <div className="clock-recovery" role="alert" aria-labelledby="clock-recovery-title">
              <strong id="clock-recovery-title">Your device clock changed</strong>
              <span>
                Choose whether to keep the time shown before the change or recalculate from the new
                clock.
              </span>
              <div className="clock-recovery__actions">
                <Button onClick={timer.keepRemainingTime}>Keep remaining time</Button>
                <Button variant="secondary" onClick={timer.useChangedClock}>
                  Use changed clock
                </Button>
              </div>
            </div>
          )}

          {/* Announce only meaningful transitions and never the per-second display refresh. */}
          <Notice className="timer-status" role="status">
            {timer.announcement}
            {/* Close the polite status notice after its current message. */}
          </Notice>
          {/* Close the timer workspace after its heading, field, display, actions, and status. */}
        </Card>

        {/* Keep supporting planning and privacy context visible without crowding the central timer. */}
        <aside className="supporting-panels" aria-label="Session support">
          {/* Keep a deliberately small Phase 4 task plan beside the quiet timer surface. */}
          <Card aria-labelledby="task-title" id="tasks-panel" tabIndex={-1}>
            {/* Group the card heading and small neutral count on one readable line. */}
            <div className="card__heading-row">
              {/* Name the support panel for screen readers and visual readers alike. */}
              <h2 id="task-title">Current task</h2>
              {/* Show whether one unfinished task currently anchors the next focus session. */}
              <span className="badge">{activeTask ? "1 selected" : "0 selected"}</span>
              {/* Close the supporting card heading after title and state. */}
            </div>
            {/* Describe the selection calmly or show the current task in plain visitor-authored text. */}
            {activeTask ? (
              // Group the active wording, estimate, and completion action as one readable unit.
              <div className="current-task">
                {/* Render visitor content through React text interpolation and never as raw HTML. */}
                <strong>{activeTask.title}</strong>
                {/* Explain the lightweight estimate without presenting it as a deadline. */}
                <span>
                  Estimated {activeTask.estimatedSessions} focus{" "}
                  {activeTask.estimatedSessions === 1 ? "session" : "sessions"}
                  {activeTask.completedSessions > 0
                    ? `, ${activeTask.completedSessions} completed`
                    : ""}
                </span>
                {/* Let visitors finish the task without requiring a timer session first. */}
                <Button
                  onClick={() => updateFocusPlan({ type: "COMPLETE_TASK", taskId: activeTask.id })}
                  variant="secondary"
                >
                  Mark complete
                </Button>
              </div>
            ) : (
              // Keep the no-selection state permissive because a task is always optional.
              <p className="muted-copy">No task is selected. That is completely fine.</p>
            )}

            {/* Add concise work through native form behavior and bounded inputs. */}
            <form className="task-form" onSubmit={addTask}>
              {/* Reuse the accessible field primitive for the visitor's plain-text task wording. */}
              <Field
                disabled={localDataState === "loading" || pendingTasks.length >= MAX_FOCUS_TASKS}
                id="new-focus-task"
                label="Add a small task"
                maxLength={100}
                onChange={(event) => setTaskDraft(event.currentTarget.value)}
                placeholder="For example, review the first draft"
                value={taskDraft}
              />
              {/* Keep the compact estimate associated with a visible native label. */}
              <label className="task-estimate" htmlFor="task-estimate">
                <span>Estimated sessions</span>
                <select
                  disabled={localDataState === "loading" || pendingTasks.length >= MAX_FOCUS_TASKS}
                  id="task-estimate"
                  onChange={(event) => setTaskEstimate(Number(event.currentTarget.value))}
                  value={taskEstimate}
                >
                  {/* Offer a small fixed range that avoids false precision. */}
                  {Array.from({ length: MAX_ESTIMATED_SESSIONS }, (_, index) => index + 1).map(
                    (estimate) => (
                      // Use the estimate itself as the stable option identity and stored value.
                      <option key={estimate} value={estimate}>
                        {estimate}
                      </option>
                      // Close this estimate option after its concise numeric label.
                    ),
                  )}
                </select>
              </label>
              {/* Add the draft only while the intentionally small task list has room. */}
              <Button
                disabled={
                  localDataState === "loading" ||
                  !taskDraft.trim() ||
                  pendingTasks.length >= MAX_FOCUS_TASKS
                }
                type="submit"
              >
                Add task
              </Button>
            </form>

            {/* Keep unfinished work immediately actionable above the separate history. */}
            {pendingTasks.length > 0 && (
              // Give the active collection a concise accessible name independent of its card heading.
              <ul className="task-list" aria-label="Unfinished tasks">
                {/* Render each unfinished task as text with its available next action. */}
                {pendingTasks.map((task) => (
                  // Preserve task identity across selection and completion updates.
                  <li className="task-list__item" key={task.id}>
                    {editingTaskId === task.id ? (
                      // Swap the row into one compact inline edit surface while active.
                      <form
                        className="task-edit"
                        onSubmit={(event: FormEvent<HTMLFormElement>) => {
                          event.preventDefault();
                          saveEditedTask();
                        }}
                      >
                        <input
                          aria-label="Task title"
                          className="field__control"
                          maxLength={100}
                          onChange={(event) => setEditTaskTitle(event.currentTarget.value)}
                          type="text"
                          value={editTaskTitle}
                        />
                        <select
                          aria-label="Estimated sessions"
                          className="field__control"
                          onChange={(event) =>
                            setEditTaskEstimate(Number(event.currentTarget.value))
                          }
                          value={editTaskEstimate}
                        >
                          {/* Offer every legal estimate including the credited minimum. */}
                          {Array.from(
                            {
                              length:
                                MAX_ESTIMATED_SESSIONS - Math.max(1, task.completedSessions) + 1,
                            },
                            (_, index) => Math.max(1, task.completedSessions) + index,
                          ).map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                        <Button disabled={!editTaskTitle.trim()} type="submit" variant="secondary">
                          Save
                        </Button>
                        <Button onClick={() => setEditingTaskId(null)} variant="quiet">
                          Cancel
                        </Button>
                        {/* Close the inline edit form after its bounded controls. */}
                      </form>
                    ) : (
                      <>
                        {/* Keep title and estimate together before the relevant action. */}
                        <span>
                          <strong>{task.title}</strong>
                          <small>
                            {task.completedSessions} of {task.estimatedSessions}{" "}
                            {task.estimatedSessions === 1 ? "session" : "sessions"}
                          </small>
                        </span>
                        {/* Group the row's quiet corrections before the state indicator. */}
                        <span className="task-list__end">
                          {task.id === focusPlan.activeTaskId ? (
                            <span className="badge">Current</span>
                          ) : (
                            <Button
                              onClick={() =>
                                updateFocusPlan({ type: "SELECT_TASK", taskId: task.id })
                              }
                              variant="quiet"
                            >
                              Choose
                            </Button>
                          )}
                          <Button
                            onClick={() =>
                              beginEditTask(task.id, task.title, task.estimatedSessions)
                            }
                            variant="quiet"
                          >
                            Edit
                          </Button>
                          {/* Offer simple ordering without introducing drag complexity. */}
                          <Button
                            aria-label={`Move ${task.title} up`}
                            onClick={() =>
                              updateFocusPlan({ type: "MOVE_TASK", taskId: task.id, direction: -1 })
                            }
                            variant="quiet"
                          >
                            ↑
                          </Button>
                          <Button
                            aria-label={`Move ${task.title} down`}
                            onClick={() =>
                              updateFocusPlan({ type: "MOVE_TASK", taskId: task.id, direction: 1 })
                            }
                            variant="quiet"
                          >
                            ↓
                          </Button>
                          {/* Confirm removal inline so no blocking dialog is required. */}
                          {confirmingDeleteTaskId === task.id ? (
                            <>
                              <Button
                                onClick={() => {
                                  updateFocusPlan({ type: "DELETE_TASK", taskId: task.id });
                                  setConfirmingDeleteTaskId(null);
                                }}
                                variant="secondary"
                              >
                                Confirm
                              </Button>
                              <Button
                                onClick={() => setConfirmingDeleteTaskId(null)}
                                variant="quiet"
                              >
                                Keep
                              </Button>
                            </>
                          ) : (
                            <Button
                              onClick={() => setConfirmingDeleteTaskId(task.id)}
                              variant="quiet"
                            >
                              Remove
                            </Button>
                          )}
                        </span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {/* Explain the active durable local boundary in direct user-facing language. */}
            <p className="field__hint">
              Up to {MAX_FOCUS_TASKS} unfinished tasks. Saved privately in this browser.
            </p>
            {/* Keep previous work available for review without crowding the active plan. */}
            <details className="task-history">
              {/* Summarize both the purpose and record count before the history is expanded. */}
              <summary>
                <span>Task history</span>
                <span className="badge">{completedTasks.length} completed</span>
              </summary>
              {/* Explain the empty audit trail before any work has been completed. */}
              {completedTasks.length === 0 ? (
                <p className="muted-copy">Completed tasks will appear here.</p>
              ) : (
                // Give completed records their own semantic list for assistive navigation.
                <ul className="task-list task-history__list" aria-label="Completed task history">
                  {/* Preserve each completed task's wording, estimate, and credited sessions. */}
                  {completedTasks.map((task) => (
                    <li className="task-list__item task-list__item--complete" key={task.id}>
                      <span>
                        <strong>{task.title}</strong>
                        <small>
                          {task.completedSessions} completed of {task.estimatedSessions} estimated{" "}
                          focus {task.estimatedSessions === 1 ? "session" : "sessions"}
                        </small>
                      </span>
                      {/* Offer a calm correction path without hiding the completion record. */}
                      <span className="task-list__end">
                        <Button
                          onClick={() => updateFocusPlan({ type: "REOPEN_TASK", taskId: task.id })}
                          variant="quiet"
                        >
                          Reopen
                        </Button>
                        <span className="badge">Complete</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </details>
            {/* Keep deliberately retained distractions reachable after their review choice. */}
            {focusJourney.distractions.some((item) => item.resolution === "kept") && (
              // Group kept thoughts separately from actionable focus tasks.
              <div className="kept-thoughts">
                <h3>Kept for later</h3>
                <ul>
                  {focusJourney.distractions
                    .filter((item) => item.resolution === "kept")
                    .map((item) => (
                      // Render retained visitor wording as plain text under its stable identity.
                      <li key={item.id}>{item.text}</li>
                    ))}
                </ul>
              </div>
            )}
            {/* Close the task support surface after selection, entry, and list states. */}
          </Card>

          {/* Present private progress derived from completed in-memory session records. */}
          <Card aria-labelledby="today-title" id="progress-panel" tabIndex={-1}>
            {/* Name the supporting summary without introducing streak pressure. */}
            <h2 id="today-title">Your rise</h2>
            {/* Pair the visual sunrise treatment with a complete semantic data alternative. */}
            <div
              aria-hidden="true"
              className={`progress-rise progress-rise--${Math.min(4, progressSummary.todaySessions)}`}
            >
              <span />
            </div>
            {/* Provide a clear primary daily value without relying on the visual treatment. */}
            <p className="supporting-stat">
              {/* Highlight the current transient local session count in tabular numerals. */}
              <strong>{progressSummary.todaySessions}</strong>
              {/* Explain the number immediately so it never depends on color or layout. */}
              <span>focus sessions today</span>
              {/* Close the supporting statistic after value and label. */}
            </p>
            {/* Expose every visual progress value as concise semantic data. */}
            <dl className="progress-data">
              <div>
                <dt>Focus minutes today</dt>
                <dd>{progressSummary.todayMinutes}</dd>
              </div>
              <div>
                <dt>Sessions in the last 7 days</dt>
                <dd>{progressSummary.weekSessions}</dd>
              </div>
              {/* Surface the gentle rating signal only once reflection ratings exist. */}
              {progressSummary.averageFocusRating !== null && (
                <div>
                  <dt>Average focus rating</dt>
                  <dd>{progressSummary.averageFocusRating.toFixed(1)} of 5</dd>
                </div>
              )}
            </dl>
            {/* Let visitors revisit their own recent reflections without leaving the page. */}
            {focusJourney.sessions.length > 0 && (
              <details className="recent-sessions">
                {/* Summarize the review purpose and record count before expansion. */}
                <summary>
                  <span>Recent sessions</span>
                  <span className="badge">{Math.min(5, focusJourney.sessions.length)}</span>
                </summary>
                {/* Present the newest reflections first in one calm readable list. */}
                <ul className="recent-sessions__list" aria-label="Recent completed sessions">
                  {focusJourney.sessions
                    .slice(-5)
                    .reverse()
                    .map((session) => (
                      // Keep each reflection grouped beside its completion boundary.
                      <li key={session.completedAt}>
                        <strong>{formatSessionDate(session.completedAt)}</strong>
                        <small>
                          {Math.round((session.plannedSeconds + session.overtimeSeconds) / 60)} min
                          {/* Show the rating only when the visitor gave one. */}
                          {session.focusRating !== null && ` · rated ${session.focusRating}`}
                          {/* Name the task only when one was selected during the session. */}
                          {session.taskTitle !== null && ` · ${session.taskTitle}`}
                        </small>
                        {/* Reveal the saved next step as the most useful private cue. */}
                        {session.nextStep && <p>Next: {session.nextStep}</p>}
                        {/* Preserve optional notes without ever requiring them. */}
                        {session.notes && <p>{session.notes}</p>}
                      </li>
                    ))}
                </ul>
              </details>
            )}
            {/* Explain the current device-local privacy boundary without implying cloud sync. */}
            <Notice>
              Private progress is saved on this device. No account or upload is involved.
            </Notice>
            {/* Close the progress surface after visual, semantic, and privacy context. */}
          </Card>

          {/* Demonstrate a recoverable permission explanation for later notification controls. */}
          <Card className="permission-card" aria-labelledby="permission-title">
            {/* Name the explanation so visitors can scan it independently. */}
            <h2 id="permission-title">Quiet by default</h2>
            {/* Explain that future permission choices remain contextual and optional. */}
            <p className="muted-copy">
              Pomorise will ask about sound or notifications only when you choose to use them.
            </p>
            {/* Close the permission-explanation pattern after its complete message. */}
          </Card>
          {/* Close the support region after task, progress, and permission patterns. */}
        </aside>
        {/* Close the primary workspace after central and supporting content. */}
      </main>

      {/* Keep primary destinations reachable with touch-sized controls on compact screens. */}
      <nav className="mobile-navigation" aria-label="Primary mobile navigation">
        {/* Repeat only the three first-level destinations needed by the compact shell. */}
        {navigationItems.map((item) => (
          // Render each mobile destination as a native button with visible selected state.
          <Button
            // Mark the current section generically because these are views, not pages.
            aria-current={activeNavigation === item ? "true" : undefined}
            // Preserve the stable destination name as React's list key.
            key={item}
            // Synchronize mobile and desktop selections through one shared state value.
            onClick={() => navigateTo(item)}
            // Use the quiet visual treatment inside the persistent mobile bar.
            variant="quiet"
          >
            {/* Display the same destination wording used by desktop navigation. */}
            {item}
            {/* Close the compact navigation control after its label. */}
          </Button>
          // Close the mobile destination mapping after every shell section.
        ))}
        {/* Close the compact navigation bar after all destinations. */}
      </nav>

      {/* Keep ownership and support links available at the bottom of every application view. */}
      <footer className="app-footer">
        {/* Identify the site owner and release year in one concise line. */}
        <span>© {new Date().getFullYear()} Aman Ali Pogaku</span>
        {/* Group project information links without competing with primary navigation. */}
        <nav aria-label="Project information">
          <a href="/pomorise/FAQs.html">FAQs</a>
          <a href="https://github.com/amanalip/pomorise" rel="noreferrer">
            GitHub repository
          </a>
        </nav>
      </footer>

      {/* Keep appearance settings inside a native modal with project-owned visual treatment. */}
      <Dialog
        className={settingsView === "data" ? "dialog--wide" : undefined}
        ref={settingsDialogRef}
        title="Settings"
      >
        {/* Separate everyday preferences from higher-stakes data ownership controls. */}
        <div
          className="settings-tabs"
          role="tablist"
          aria-label="Settings sections"
          onKeyDown={handleSettingsTabKeys}
        >
          <Button
            aria-controls="preferences-panel"
            aria-selected={settingsView === "preferences"}
            id="preferences-tab"
            onClick={() => setSettingsView("preferences")}
            role="tab"
            tabIndex={settingsView === "preferences" ? 0 : -1}
            variant={settingsView === "preferences" ? "secondary" : "quiet"}
          >
            Preferences
          </Button>
          <Button
            aria-controls="data-panel"
            aria-selected={settingsView === "data"}
            id="data-tab"
            onClick={() => setSettingsView("data")}
            role="tab"
            tabIndex={settingsView === "data" ? 0 : -1}
            variant={settingsView === "data" ? "secondary" : "quiet"}
          >
            Data &amp; privacy
          </Button>
        </div>

        {settingsView === "preferences" ? (
          <div aria-labelledby="preferences-tab" id="preferences-panel" role="tabpanel">
            {/* Introduce appearance and timer choices that remain local to this browser. */}
            <p className="dialog__intro">Choose how Pomorise looks and behaves on this device.</p>
            {/* Offer installation only while the browser itself invites it. */}
            <InstallPomorise />
            {/* Present the three exclusive theme choices as accessible native radio inputs. */}
            <SegmentedControl
              // Give the radio group a concise visible legend.
              label="Appearance"
              // Use one shared name so native radio behavior remains intact.
              name="theme-preference"
              // Update and persist the selected theme through the shared provider.
              onChange={setPreference}
              // List the approved explicit and system-following appearance options.
              options={[
                // Let the browser follow operating-system appearance changes.
                { value: "system", label: "System" },
                // Allow a visitor to keep the approved light palette explicitly.
                { value: "light", label: "Light" },
                // Allow a visitor to keep the approved dark palette explicitly.
                { value: "dark", label: "Dark" },
              ]}
              // Reflect the visitor's stored choice rather than only the resolved palette.
              value={preference}
            />

            {/* Let visitors tune each mode within the centrally approved safety bounds. */}
            <fieldset className="settings-group">
              <legend>Session durations</legend>
              {/* Offer trusted starting rhythms while honest custom values stay visible. */}
              <div className="duration-presets" role="group" aria-label="Duration presets">
                {DURATION_PRESETS.map((preset) => {
                  // Detect an exact match so the active rhythm is always explicit.
                  const isActive = (["focus", "shortBreak", "longBreak"] as const).every(
                    (mode) => timer.preferences.durations[mode] === preset.durations[mode],
                  );
                  return (
                    <Button
                      key={preset.id}
                      aria-pressed={isActive}
                      onClick={() => applyDurationPreset(preset)}
                      variant={isActive ? "secondary" : "quiet"}
                    >
                      {preset.label}
                    </Button>
                  );
                })}
                {/* Name the custom state whenever neither reviewed rhythm matches exactly. */}
                {!DURATION_PRESETS.some((preset) =>
                  (["focus", "shortBreak", "longBreak"] as const).every(
                    (mode) => timer.preferences.durations[mode] === preset.durations[mode],
                  ),
                ) && <span className="duration-presets__custom">Custom</span>}
              </div>
              <div className="duration-settings">
                {(
                  [
                    ["focus", "Focus"],
                    ["shortBreak", "Short break"],
                    ["longBreak", "Long break"],
                  ] as const
                ).map(([mode, label]) => (
                  <label key={mode}>
                    <span>{label} minutes</span>
                    <input
                      aria-invalid={durationError?.mode === mode || undefined}
                      className="field__control"
                      max={180}
                      min={1}
                      onChange={(event) => changeDurationDraft(mode, event.currentTarget.value)}
                      type="number"
                      // Show the local draft while typing and the committed value otherwise.
                      value={durationDrafts[mode] ?? String(timer.preferences.durations[mode] / 60)}
                    />
                    {/* Keep each rejected value's explanation beside its own field. */}
                    {durationError?.mode === mode && (
                      <span className="field__error" role="alert">
                        {durationError.message}
                      </span>
                    )}
                  </label>
                ))}
              </div>
              <span className="field__hint">Choose 1 to 180 whole minutes.</span>
            </fieldset>

            {/* Let visitors choose their own distance between longer recovery breaks. */}
            <fieldset className="settings-group">
              <legend>Focus rhythm</legend>
              <label className="rhythm-setting">
                <span>Long break after this many focus sessions</span>
                <input
                  aria-invalid={rhythmError ? true : undefined}
                  className="field__control"
                  max={LONG_BREAK_INTERVAL_LIMITS.maximum}
                  min={LONG_BREAK_INTERVAL_LIMITS.minimum}
                  onChange={(event) => changeRhythmDraft(event.currentTarget.value)}
                  type="number"
                  // Show the local draft while typing and the committed value otherwise.
                  value={rhythmDraft ?? String(timer.preferences.longBreakInterval)}
                />
                {/* Keep the rejected rhythm explanation beside its own field. */}
                {rhythmError && (
                  <span className="field__error" role="alert">
                    {rhythmError}
                  </span>
                )}
              </label>
              {/* Hide the generic hint only while a specific correction is being shown. */}
              {!rhythmError && (
                <span className="field__hint">Choose 1 to 8 focus sessions per cycle.</span>
              )}
            </fieldset>

            {/* Let automatic flow be chosen per boundary so breaks and focus stay independent. */}
            <label className="setting-toggle">
              <input
                checked={timer.preferences.automaticBreaks}
                onChange={(event) =>
                  timer.setPreferences({
                    ...timer.preferences,
                    automaticBreaks: event.currentTarget.checked,
                  })
                }
                type="checkbox"
              />
              <span>
                <strong>Automatically start breaks</strong>
                <small>When a focus session ends, its break begins on its own.</small>
              </span>
            </label>
            <label className="setting-toggle">
              <input
                checked={timer.preferences.automaticFocus}
                onChange={(event) =>
                  timer.setPreferences({
                    ...timer.preferences,
                    automaticFocus: event.currentTarget.checked,
                  })
                }
                type="checkbox"
              />
              <span>
                <strong>Automatically start focus sessions</strong>
                <small>When a break ends, the next focus session begins on its own.</small>
              </span>
            </label>
            <label className="setting-toggle">
              <input
                checked={timer.preferences.soundEnabled}
                onChange={(event) => changeSound(event.currentTarget.checked)}
                type="checkbox"
              />
              <span>
                <strong>Play a local completion sound</strong>
                <small>
                  The tone is generated locally. Sound follows your browser's site controls.
                </small>
              </span>
            </label>
            {/* Keep a preview reachable while the sound is trusted so it can be rechecked anytime. */}
            {timer.preferences.soundEnabled && (
              <div className="sound-preview">
                {/* Play the exact completion tone on this explicit visitor gesture. */}
                <Button onClick={timer.playTestTone} variant="secondary">
                  Play test tone
                </Button>
                {/* Close the inline preview after its single clear action. */}
              </div>
            )}
            {soundStatus && <Notice>{soundStatus}</Notice>}
            <label className="setting-toggle">
              <input
                checked={timer.preferences.notificationsEnabled}
                onChange={(event) => void changeNotifications(event.currentTarget.checked)}
                type="checkbox"
              />
              <span>
                <strong>Show browser notifications</strong>
                <small>Your browser asks for permission when you turn this on.</small>
              </span>
            </label>
            {notificationStatus && <Notice tone="warning">{notificationStatus}</Notice>}

            {/* Explain the privacy and persistence behavior of all local settings. */}
            <Notice>
              Settings stay in this browser and send no network request. After one online visit,
              Pomorise can reopen offline. Updates never replace an active session automatically.
            </Notice>
          </div>
        ) : (
          <div aria-labelledby="data-tab" id="data-panel" role="tabpanel">
            <Suspense
              fallback={
                <p className="dialog__intro" role="status">
                  Loading local data controls...
                </p>
              }
            >
              <DataControls
                onResetPreferences={resetPreferences}
                onWorkspaceChange={restoreWorkspace}
                onWorkspaceMutationStart={beginWorkspaceMutation}
              />
            </Suspense>
          </div>
        )}
        {/* Keep the primary dismiss action aligned with the dialog's reading direction. */}
        <div className="dialog__actions">
          {/* Close settings explicitly and return focus to the header trigger. */}
          <Button onClick={closeSettings}>Done</Button>
          {/* Close the dialog action group after its single clear completion control. */}
        </div>
        {/* Close the settings dialog after its explanation, theme choices, and action. */}
      </Dialog>

      {/* Confirm sound enablement in place so the tone can be previewed before it is trusted. */}
      <Dialog
        onClose={() => setIsSoundDialogOpen(false)}
        ref={soundDialogRef}
        title="Play a local completion sound"
      >
        {/* Explain exactly what will happen before asking for confirmation. */}
        <p className="dialog__intro">
          Pomorise can play one short locally generated tone when a session finishes. The sound
          never leaves this browser and no audio file is downloaded.
        </p>
        {/* Offer a live preview so the decision is based on hearing, not imagination. */}
        <div className="sound-preview">
          {/* Play the exact completion tone on this explicit visitor gesture. */}
          <Button onClick={timer.playTestTone} variant="secondary">
            Play test tone
          </Button>
          {/* Close the preview group after its single clear action. */}
        </div>
        {/* Separate the declining and confirming choices at the logical end of the content. */}
        <div className="dialog__actions">
          {/* Preserve the off state when the visitor declines without changing anything else. */}
          <Button onClick={declineSoundEnable} variant="quiet">
            Keep it off
          </Button>
          {/* Confirm enablement as the primary outcome of this conversation. */}
          <Button onClick={confirmSoundEnable}>Turn on</Button>
          {/* Close the confirmation actions after both outcomes are reachable. */}
        </div>
        {/* Close the sound confirmation dialog after its explanation and actions. */}
      </Dialog>
      {/* Close the application frame after every shell region and settings surface. */}
    </div>
    // Close the returned application expression after the complete Phase 2 shell.
  );
  // Close the App component after defining its state, actions, and rendered interface.
}
