// Import React reference and state tools for the settings dialog and shell-only demonstrations.
import { useRef, useState } from "react";
// Import the approved dark logo as a locally bundled identity for the dark palette.
import darkLogoUrl from "../../assets/logos/header_dark_mode.png";
// Import the approved light logo as a locally bundled identity for the light palette.
import lightLogoUrl from "../../assets/logos/header_light_mode.png";
// Import theme state so the logo and appearance settings follow one resolved preference.
import { useTheme } from "../components/ThemeProvider";
// Import project-owned primitives that establish Phase 2 interaction and surface patterns.
import { Button, Card, Dialog, Field, Notice, SegmentedControl } from "../components/ui";
// Import the timestamp-based timer interface and pure display helpers.
import { formatDuration, type TimerMode } from "../timer/engine";
import { modeLabel, useTimer } from "../timer/useTimer";

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
  // Report notification support and permission results beside the explicit setting.
  const [notificationStatus, setNotificationStatus] = useState("");
  // Hold the native dialog element so settings can use its modal browser behavior.
  const settingsDialogRef = useRef<HTMLDialogElement>(null);

  // Open settings as a modal without adding a custom focus-trap implementation.
  function openSettings() {
    // Ask the native dialog to manage modality, focus entry, and the backdrop.
    settingsDialogRef.current?.showModal();
    // Close the open-settings action after requesting native modal behavior.
  }

  // Close the current settings dialog from its explicit Done control.
  function closeSettings() {
    // Use the native close method so focus returns to the settings trigger.
    settingsDialogRef.current?.close();
    // Close the settings-dismiss action after restoring the non-modal page.
  }

  // Switch modes only while idle so active session history never changes meaning.
  function selectMode(mode: TimerMode) {
    timer.send({ type: "SELECT_MODE", mode, seconds: timer.preferences.durations[mode] });
  }

  // Update one bounded duration and synchronize the idle clock for the selected mode.
  function updateDuration(mode: TimerMode, minutes: number) {
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) return;
    const durations = { ...timer.preferences.durations, [mode]: minutes * 60 };
    timer.setPreferences({ ...timer.preferences, durations });
    if (timer.state.phase === "idle" && timer.state.mode === mode) {
      timer.send({ type: "SET_DURATION", seconds: minutes * 60 });
    }
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
      );
      return;
    }
    const permission = await Notification.requestPermission();
    const granted = permission === "granted";
    timer.setPreferences({ ...timer.preferences, notificationsEnabled: granted });
    setNotificationStatus(
      granted
        ? "Browser notifications are on."
        : "Notification permission was not granted. The timer still works normally.",
    );
  }

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
        {/* Keep the approved mark together with a text-sized rendition of its small tagline. */}
        <div className="app-header__brand">
          {/* Use the resolved theme directly so an explicit choice selects the matching logo. */}
          <img
            // Keep the complete local logo compact enough to behave as a header identity.
            className="app-header__logo"
            // Choose the approved asset that belongs to the currently painted palette.
            src={resolvedTheme === "dark" ? darkLogoUrl : lightLogoUrl}
            // Expose the product name once while the visible tagline remains readable text.
            alt="Pomorise"
          />
          {/* Cover and faithfully restate the baked-in tiny tagline at interface text size. */}
          <span className="app-header__tagline">rise one session at a time</span>
        </div>

        {/* Expose the main destinations at desktop widths without claiming later feature completion. */}
        <nav className="desktop-navigation" aria-label="Primary navigation">
          {/* Create one quiet shell control for each planned first-level destination. */}
          {navigationItems.map((item) => (
            // Reuse the stable item name as React's identity for each destination.
            <Button
              // Communicate the currently selected page through the standard ARIA state.
              aria-current={activeNavigation === item ? "page" : undefined}
              // Preserve the stable destination name as React's list key.
              key={item}
              // Switch the highlighted shell destination without pretending to load future content.
              onClick={() => setActiveNavigation(item)}
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
        {/* Keep the reliable timer as the calm central application surface. */}
        <Card className="timer-card" elevated aria-labelledby="timer-title">
          {/* Show session type and sequence without competing with the countdown. */}
          <div className="timer-card__eyebrow">
            {/* Name the current timer mode in a short high-contrast label. */}
            <span>{modeLabel(timer.state.mode)}</span>
            {/* Provide lightweight sequence context for the future long-break cycle. */}
            <span>Session {timer.state.sessionNumber} of 4</span>
            {/* Close the timer context row after both concise labels. */}
          </div>

          {/* Give the page one clear heading that describes the user's immediate purpose. */}
          <h1 id="timer-title">Make space for one thing.</h1>
          {/* Explain the empty intention state without requiring input before a timer can start. */}
          <p className="timer-card__intro">
            Add an intention when you are ready, or begin with a clear desk and an open mind.
          </p>

          {/* Let a visitor choose a timer purpose before starting, using native radio behavior. */}
          <SegmentedControl
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

          {/* Preserve the optional Phase 4 intention boundary without affecting timer accuracy. */}
          <Field
            // Give the visible and programmatic field relationship a stable identifier.
            id="focus-intention"
            // Explain that the optional field does not block starting a future session.
            hint="Optional. You can change this before the session starts."
            // Label the outcome rather than the implementation detail of a text input.
            label="What will you move forward?"
            // Offer a realistic prompt without inserting saved or synthetic personal data.
            placeholder="For example, outline the project brief"
            disabled={timer.state.phase !== "idle"}
          />

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
            <Button
              disabled={timer.state.phase === "idle"}
              onClick={() => timer.send({ type: "RESET" }, "Timer reset.")}
              variant="quiet"
            >
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
                <Button
                  onClick={() =>
                    timer.send(
                      { type: "ADVANCE", now: Date.now(), durations: timer.preferences.durations },
                      "Next session is ready.",
                    )
                  }
                >
                  Next session
                </Button>
              </>
            )}
            {timer.state.phase === "skipped" && (
              <Button
                onClick={() =>
                  timer.send(
                    { type: "ADVANCE", now: Date.now(), durations: timer.preferences.durations },
                    "Next session is ready.",
                  )
                }
              >
                Next session
              </Button>
            )}
            {timer.state.phase === "overtime" && (
              <Button
                onClick={() =>
                  timer.send(
                    { type: "ADVANCE", now: Date.now(), durations: timer.preferences.durations },
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
          {/* Explain the deliberately empty task state that Phase 4 will later replace. */}
          <Card aria-labelledby="task-title">
            {/* Group the card heading and small neutral count on one readable line. */}
            <div className="card__heading-row">
              {/* Name the support panel for screen readers and visual readers alike. */}
              <h2 id="task-title">Current task</h2>
              {/* Show a compact empty count without implying stored task data exists. */}
              <span className="badge">0 selected</span>
              {/* Close the supporting card heading after title and state. */}
            </div>
            {/* Describe the empty state in calm, non-judgmental language. */}
            <p className="muted-copy">No task is selected. That is completely fine.</p>
            {/* Keep the unavailable future action visible as a reusable disabled pattern. */}
            <Button disabled variant="secondary">
              {/* Name the task action that becomes available when Phase 4 adds task state. */}
              Choose a task
              {/* Close the disabled task control after its label. */}
            </Button>
            {/* Close the task support surface after its complete empty state. */}
          </Card>

          {/* Preserve one low-pressure summary area for later private progress data. */}
          <Card aria-labelledby="today-title">
            {/* Name the supporting summary without introducing synthetic achievement pressure. */}
            <h2 id="today-title">A gentle start</h2>
            {/* Provide an encouraging empty-state value that reads well in both themes. */}
            <p className="supporting-stat">
              {/* Highlight the current local session count in a tabular number style. */}
              <strong>0</strong>
              {/* Explain the number immediately so it never depends on color or layout. */}
              <span>focus sessions today</span>
              {/* Close the supporting statistic after value and label. */}
            </p>
            {/* Explain the local-first boundary without claiming persistence before Phase 5. */}
            <Notice>Your future progress will stay private in this browser.</Notice>
            {/* Close the daily support surface after its empty state and privacy explanation. */}
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
            // Communicate selection independently of the visual coral indicator.
            aria-current={activeNavigation === item ? "page" : undefined}
            // Preserve the stable destination name as React's list key.
            key={item}
            // Synchronize mobile and desktop selections through one shared state value.
            onClick={() => setActiveNavigation(item)}
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

      {/* Keep appearance settings inside a native modal with project-owned visual treatment. */}
      <Dialog ref={settingsDialogRef} title="Settings">
        {/* Introduce appearance and timer choices that remain local to this browser. */}
        <p className="dialog__intro">Choose how Pomorise looks and behaves on this device.</p>
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
                  className="field__control"
                  max={180}
                  min={1}
                  onChange={(event) => updateDuration(mode, event.currentTarget.valueAsNumber)}
                  type="number"
                  value={timer.preferences.durations[mode] / 60}
                />
              </label>
            ))}
          </div>
          <span className="field__hint">Choose 1 to 180 whole minutes.</span>
        </fieldset>

        {/* Keep automatic flow optional until its final product behavior is approved. */}
        <label className="setting-toggle">
          <input
            checked={timer.preferences.automaticTransitions}
            onChange={(event) =>
              timer.setPreferences({
                ...timer.preferences,
                automaticTransitions: event.currentTarget.checked,
              })
            }
            type="checkbox"
          />
          <span>
            <strong>Start the next session automatically</strong>
            <small>Manual transitions are the default.</small>
          </span>
        </label>
        <label className="setting-toggle">
          <input
            checked={timer.preferences.soundEnabled}
            onChange={(event) =>
              timer.setPreferences({
                ...timer.preferences,
                soundEnabled: event.currentTarget.checked,
              })
            }
            type="checkbox"
          />
          <span>
            <strong>Play a local completion sound</strong>
            <small>The tone is generated on this device and never streamed.</small>
          </span>
        </label>
        <label className="setting-toggle">
          <input
            checked={timer.preferences.notificationsEnabled}
            onChange={(event) => void changeNotifications(event.currentTarget.checked)}
            type="checkbox"
          />
          <span>
            <strong>Show browser notifications</strong>
            <small>Permission is requested only when you turn this on.</small>
          </span>
        </label>
        {notificationStatus && <Notice tone="warning">{notificationStatus}</Notice>}

        {/* Explain the privacy and persistence behavior of all local settings. */}
        <Notice>
          Timer and appearance settings are saved only in this browser. Changing them sends no
          network request.
        </Notice>
        {/* Keep the primary dismiss action aligned with the dialog's reading direction. */}
        <div className="dialog__actions">
          {/* Close settings explicitly and return focus to the header trigger. */}
          <Button onClick={closeSettings}>Done</Button>
          {/* Close the dialog action group after its single clear completion control. */}
        </div>
        {/* Close the settings dialog after its explanation, theme choices, and action. */}
      </Dialog>
      {/* Close the application frame after every shell region and settings surface. */}
    </div>
    // Close the returned application expression after the complete Phase 2 shell.
  );
  // Close the App component after defining its state, actions, and rendered interface.
}
