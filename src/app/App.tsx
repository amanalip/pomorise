// Import React reference and state tools for the settings dialog and shell-only demonstrations.
import { useRef, useState } from "react";
// Import the approved dark logo as a locally bundled identity for the dark palette.
import darkLogoUrl from "../../assets/logos/dark_mode.png";
// Import the approved light logo as a locally bundled identity for the light palette.
import lightLogoUrl from "../../assets/logos/light_mode.png";
// Import theme state so the logo and appearance settings follow one resolved preference.
import { useTheme } from "../components/ThemeProvider";
// Import project-owned primitives that establish Phase 2 interaction and surface patterns.
import { Button, Card, Dialog, Field, Notice, SegmentedControl } from "../components/ui";

// Define the small navigation destinations established by the application shell.
const navigationItems = ["Timer", "Tasks", "Progress"] as const;

// Render the responsive Phase 2 application shell around future focus features.
export function App() {
  // Read both stored and resolved theme values from the application-level provider.
  const { preference, resolvedTheme, setPreference } = useTheme();
  // Keep the active shell destination local until later phases add coordinated application state.
  const [activeNavigation, setActiveNavigation] = useState<(typeof navigationItems)[number]>(
    // Start in the timer workspace because it is the product's primary destination.
    "Timer",
    // Close the initial navigation state after selecting the primary workspace.
  );
  // Track a quiet status message so shell-only controls provide honest feedback.
  const [statusMessage, setStatusMessage] = useState("Your session is ready when you are.");
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

  // Explain that Phase 3 will own real timer transitions instead of simulating a countdown now.
  function explainTimerBoundary() {
    // Update the polite status region with an honest implementation-stage explanation.
    setStatusMessage("Timer controls arrive in Phase 3. This shell is ready for them.");
    // Close the boundary explanation after updating its visible state.
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
        {/* Use the resolved theme directly so an explicit choice always selects the matching logo. */}
        <img
          // Keep the local logo compact enough to behave as a header identity rather than a banner.
          className="app-header__logo"
          // Choose the approved asset that belongs to the currently painted palette.
          src={resolvedTheme === "dark" ? darkLogoUrl : lightLogoUrl}
          // Expose only the product name because the wordmark's printed tagline is decorative here.
          alt="Pomorise"
        />

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
        {/* Establish the calm central timer surface that Phase 3 will make functional. */}
        <Card className="timer-card" elevated aria-labelledby="timer-title">
          {/* Show session type and sequence without competing with the countdown. */}
          <div className="timer-card__eyebrow">
            {/* Name the current timer mode in a short high-contrast label. */}
            <span>Focus session</span>
            {/* Provide lightweight sequence context for the future long-break cycle. */}
            <span>Session 1 of 4</span>
            {/* Close the timer context row after both concise labels. */}
          </div>

          {/* Give the page one clear heading that describes the user's immediate purpose. */}
          <h1 id="timer-title">Make space for one thing.</h1>
          {/* Explain the empty intention state without requiring input before a timer can start. */}
          <p className="timer-card__intro">
            Add an intention when you are ready, or begin with a clear desk and an open mind.
          </p>

          {/* Demonstrate the reusable empty field pattern before Phase 4 connects intention state. */}
          <Field
            // Give the visible and programmatic field relationship a stable identifier.
            id="focus-intention"
            // Explain that the optional field does not block starting a future session.
            hint="Optional. You can change this before the session starts."
            // Label the outcome rather than the implementation detail of a text input.
            label="What will you move forward?"
            // Offer a realistic prompt without inserting saved or synthetic personal data.
            placeholder="For example, outline the project brief"
          />

          {/* Make the future countdown the strongest visual object while keeping its text semantic. */}
          <div className="timer-display" aria-label="25 minutes remaining">
            {/* Identify the numeric value as a clock-like duration for visual readers. */}
            <span className="timer-display__time">25:00</span>
            {/* Add a quiet state label rather than animating an idle countdown. */}
            <span className="timer-display__state">Ready</span>
            {/* Close the timer display after duration and current state. */}
          </div>

          {/* Reserve the primary action hierarchy without implementing Phase 3 timer transitions. */}
          <div className="timer-actions">
            {/* Show the disabled-state pattern on an action that has no meaning before a session starts. */}
            <Button disabled variant="quiet">
              {/* Use the familiar timer action label planned for the reliable engine. */}
              Reset
              {/* Close the disabled reset control after its label. */}
            </Button>
            {/* Let the primary shell control explain its honest implementation boundary. */}
            <Button onClick={explainTimerBoundary}>Start focus</Button>
            {/* Show the disabled-state pattern on the second unavailable timer transition. */}
            <Button disabled variant="quiet">
              {/* Use the approved future action name without attaching incomplete behavior. */}
              Skip
              {/* Close the disabled skip control after its label. */}
            </Button>
            {/* Close the grouped timer actions after their complete priority order. */}
          </div>

          {/* Announce only meaningful shell feedback and avoid a second-by-second live region. */}
          <Notice className="timer-status" role="status">
            {/* Render the current quiet feedback message from component state. */}
            {statusMessage}
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
        {/* Explain the narrow Phase 2 settings scope before presenting the theme control. */}
        <p className="dialog__intro">Choose how Pomorise looks on this device.</p>
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
        {/* Explain the privacy and persistence behavior of the appearance setting. */}
        <Notice>
          Appearance is saved only in this browser. Changing it sends no network request.
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
