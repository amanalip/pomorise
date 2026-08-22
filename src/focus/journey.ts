// Name the choices available when a captured thought is reviewed after focus.
export type DistractionResolution = "pending" | "task" | "kept" | "dismissed";

// Preserve one quick distraction without interrupting the timestamp-based timer.
export interface Distraction {
  // Give each captured thought a stable transient identity.
  id: number;
  // Preserve the visitor's wording as plain text after outer whitespace is removed.
  text: string;
  // Track whether the thought still needs review or received one explicit choice.
  resolution: DistractionResolution;
  // Close the distraction contract after its text and review state.
}

// Store one completed focus boundary for reflection and private summary calculations.
export interface SessionRecord {
  // Use the timer's completion timestamp as a stable boundary identity.
  completedAt: number;
  // Preserve the planned duration so progress minutes stay deterministic.
  plannedSeconds: number;
  // Count honestly focused extra time so continued work is never silently erased.
  overtimeSeconds: number;
  // Keep the optional intention that was active for this completed session.
  intention: string;
  // Keep the optional selected task wording without depending on later task edits.
  taskTitle: string | null;
  // Allow a short next step to make returning to work easier.
  nextStep: string;
  // Keep rating fully optional and bounded to a familiar five-point scale.
  focusRating: number | null;
  // Preserve optional private reflection notes as plain text.
  notes: string;
  // Mark whether the visitor explicitly finished or skipped reflection.
  reflectionStatus: "pending" | "saved" | "skipped";
  // Close the session-record contract after completion and reflection data.
}

// Coordinate transient Phase 4 capture, review, reflection, and progress records.
export interface FocusJourneyState {
  // Keep captured distractions in their original order for calm review.
  distractions: Distraction[];
  // Keep completed focus sessions in chronological order for summaries.
  sessions: SessionRecord[];
  // Allocate stable in-memory identities until Phase 5 introduces durable stores.
  nextDistractionId: number;
  // Close the journey contract after its transient collections and identity counter.
}

// Describe every legal focus-journey transition as explicit plain data.
export type FocusJourneyAction =
  // Restore validated sessions and captured thoughts after local storage opens.
  | { type: "RESTORE_JOURNEY"; state: FocusJourneyState }
  // Capture one thought without touching timer state.
  | { type: "CAPTURE_DISTRACTION"; text: string }
  // Resolve one pending distraction through a visitor-selected outcome.
  | {
      type: "RESOLVE_DISTRACTION";
      distractionId: number;
      resolution: Exclude<DistractionResolution, "pending">;
    }
  // Record one unique focus completion from the timer boundary.
  | {
      type: "RECORD_SESSION";
      completedAt: number;
      plannedSeconds: number;
      intention: string;
      taskTitle: string | null;
    }
  // Credit focused overtime to the exact session that earned it before leaving it.
  | { type: "RECORD_OVERTIME"; completedAt: number; overtimeSeconds: number }
  // Save optional reflection values against one completed focus session.
  | {
      type: "SAVE_REFLECTION";
      completedAt: number;
      nextStep: string;
      focusRating: number | null;
      notes: string;
    }
  // Let every optional reflection field be skipped without blocking the journey.
  | { type: "SKIP_REFLECTION"; completedAt: number };

// Provide a fresh private in-memory journey until Phase 5 adds durable local records.
export function createInitialFocusJourney(): FocusJourneyState {
  // Return new arrays so independent application mounts never share personal text.
  return { distractions: [], sessions: [], nextDistractionId: 1 };
  // Close the initial journey factory after returning its empty state.
}

// Apply one deterministic focus-loop transition without browser or timer side effects.
export function reduceFocusJourney(
  state: FocusJourneyState,
  action: FocusJourneyAction,
): FocusJourneyState {
  // Route each explicit action to its validated immutable update.
  switch (action.type) {
    // Replace the empty startup journey with the validated device-local snapshot.
    case "RESTORE_JOURNEY":
      return action.state;
    // Add one concise thought to the post-session review queue.
    case "CAPTURE_DISTRACTION": {
      // Remove accidental outer whitespace while preserving visitor wording.
      const text = action.text.trim();
      // Reject empty or oversized capture requests without changing journey state.
      if (!text || text.length > 160) return state;
      // Append the pending thought without changing any current timer value.
      return {
        ...state,
        distractions: [
          ...state.distractions,
          { id: state.nextDistractionId, text, resolution: "pending" },
        ],
        nextDistractionId: state.nextDistractionId + 1,
      };
    }
    // Apply one review choice only to a still-pending captured thought.
    case "RESOLVE_DISTRACTION":
      return state.distractions.some(
        (item) => item.id === action.distractionId && item.resolution === "pending",
      )
        ? {
            ...state,
            distractions: state.distractions.map((item) =>
              item.id === action.distractionId ? { ...item, resolution: action.resolution } : item,
            ),
          }
        : state;
    // Add one session for each unique timer completion timestamp.
    case "RECORD_SESSION": {
      // Ignore invalid or already-recorded boundaries so effects remain idempotent.
      if (
        !Number.isFinite(action.completedAt) ||
        state.sessions.some((session) => session.completedAt === action.completedAt)
      ) {
        return state;
      }
      // Append the bounded completion snapshot used by reflection and summaries.
      return {
        ...state,
        sessions: [
          ...state.sessions,
          {
            completedAt: action.completedAt,
            plannedSeconds: Math.max(0, Math.round(action.plannedSeconds)),
            overtimeSeconds: 0,
            intention: action.intention.slice(0, 120),
            taskTitle: action.taskTitle?.slice(0, 100) ?? null,
            nextStep: "",
            focusRating: null,
            notes: "",
            reflectionStatus: "pending",
          },
        ],
      };
    }
    // Update the exact session with honestly focused overtime before it is left behind.
    case "RECORD_OVERTIME": {
      // Ignore invalid boundaries or non-finite overtime instead of corrupting history.
      if (!Number.isFinite(action.completedAt) || !Number.isFinite(action.overtimeSeconds)) {
        return state;
      }
      // Keep the largest credited value so repeated exits never shrink real work.
      const trustedOvertime = Math.max(0, Math.round(action.overtimeSeconds));
      return {
        ...state,
        sessions: state.sessions.map((session) =>
          session.completedAt === action.completedAt
            ? {
                ...session,
                overtimeSeconds: Math.max(session.overtimeSeconds, trustedOvertime),
              }
            : session,
        ),
      };
    }
    // Save a bounded optional reflection against its exact completed session.
    case "SAVE_REFLECTION":
      return {
        ...state,
        sessions: state.sessions.map((session) =>
          session.completedAt === action.completedAt
            ? {
                ...session,
                nextStep: action.nextStep.trim().slice(0, 120),
                focusRating:
                  action.focusRating !== null &&
                  Number.isInteger(action.focusRating) &&
                  action.focusRating >= 1 &&
                  action.focusRating <= 5
                    ? action.focusRating
                    : null,
                notes: action.notes.trim().slice(0, 500),
                reflectionStatus: "saved",
              }
            : session,
        ),
      };
    // Mark the exact session as deliberately skipped while preserving all other records.
    case "SKIP_REFLECTION":
      return {
        ...state,
        sessions: state.sessions.map((session) =>
          session.completedAt === action.completedAt
            ? { ...session, reflectionStatus: "skipped" }
            : session,
        ),
      };
    // Preserve state if a future caller supplies no recognized action.
    default:
      return state;
  }
  // Close the journey reducer after every capture, review, and reflection transition.
}

// Describe the private progress values derived from completed session records.
export interface ProgressSummary {
  // Count focus sessions completed during the visitor's current local day.
  todaySessions: number;
  // Sum planned focus minutes completed during the visitor's current local day.
  todayMinutes: number;
  // Count focus sessions completed during the trailing seven local calendar days.
  weekSessions: number;
  // Close the progress summary after its deterministic semantic values.
}

// Derive daily and trailing-week progress without storing duplicate totals.
export function summarizeProgress(sessions: SessionRecord[], now: number): ProgressSummary {
  // Find the current local day's first millisecond using native calendar semantics.
  const currentDate = new Date(now);
  // Create the local midnight boundary for today's summary.
  const todayStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
  ).getTime();
  // Include today plus the six preceding local calendar days.
  const weekStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - 6,
  ).getTime();
  // Select today's immutable records once for both count and minute calculations.
  const todayRecords = sessions.filter((session) => session.completedAt >= todayStart);
  // Return counts and minutes derived only from the supplied session records.
  return {
    todaySessions: todayRecords.length,
    todayMinutes: Math.round(
      todayRecords.reduce(
        (seconds, session) => seconds + session.plannedSeconds + session.overtimeSeconds,
        0,
      ) / 60,
    ),
    weekSessions: sessions.filter((session) => session.completedAt >= weekStart).length,
  };
  // Close the progress calculation after returning its semantic summary.
}

// Offer a small approved set of break guides without requiring network content.
export const BREAK_GUIDES = [
  {
    id: "breathe",
    label: "Breathing",
    instruction: "Breathe in gently for four, then out for six.",
  },
  {
    id: "stretch",
    label: "Stretching",
    instruction: "Relax your shoulders, then stretch without forcing.",
  },
  { id: "hydrate", label: "Hydration", instruction: "Take a few unhurried sips of water." },
  {
    id: "eyes",
    label: "Eye rest",
    instruction: "Look at something far away and soften your gaze.",
  },
  { id: "move", label: "Movement", instruction: "Stand and take a brief, comfortable walk." },
] as const;
