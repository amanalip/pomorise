# Pomorise Implementation Plan

| Document information | Value |
| --- | --- |
| Created | August 16, 2026 at 2:18 AM EDT |
| Last updated | August 16, 2026 at 2:35:10 AM EDT |
| ISO 8601 last updated | `2026-08-16T02:35:10-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Estimated reading time | 27 minutes |
| Verification status | Fact-checked and sanity-checked against the linked primary documentation and the confirmed project plan |

This plan turns Pomorise 1.0: First Light from an approved direction into a dependable public website. Development will proceed through **seven phases**. Each phase produces something usable, has a clear completion gate, and protects the local-first privacy promise.

## Table of contents

- [Implementation outcome](#implementation-outcome)
- [Why seven phases](#why-seven-phases)
- [Fixed implementation boundaries](#fixed-implementation-boundaries)
- [Phase overview](#phase-overview)
- [Phase 1: Foundation and guardrails](#phase-1-foundation-and-guardrails)
- [Phase 2: Design system and application shell](#phase-2-design-system-and-application-shell)
- [Phase 3: Reliable timer engine](#phase-3-reliable-timer-engine)
- [Phase 4: Complete focus loop](#phase-4-complete-focus-loop)
- [Phase 5: Local data and privacy controls](#phase-5-local-data-and-privacy-controls)
- [Phase 6: Offline experience and quality hardening](#phase-6-offline-experience-and-quality-hardening)
- [Phase 7: Release verification and publication](#phase-7-release-verification-and-publication)
- [Line-by-line commenting standard](#line-by-line-commenting-standard)
- [Testing strategy](#testing-strategy)
- [Test report standard](#test-report-standard)
- [Mandatory phase closeout checklist](#mandatory-phase-closeout-checklist)
- [Phase completion protocol](#phase-completion-protocol)
- [Risks and controls](#risks-and-controls)
- [Fact-check and sanity-check record](#fact-check-and-sanity-check-record)
- [Glossary](#glossary)
- [Further reading](#further-reading)
- [Maintenance rules](#maintenance-rules)

## Implementation outcome

At the end of Phase 7, Pomorise will be a responsive, accessible, installable, and privacy-focused Pomodoro application hosted on GitHub Pages. It will provide a reliable timer, intentions, a deliberately small task layer, distraction capture, guided breaks, reflections, private progress, local backup controls, and light and dark themes.

The finished application will require no account, application server, analytics service, advertising tracker, or remote database. Personal records will stay inside browser-controlled storage unless the visitor deliberately exports a backup.

## Why seven phases

Seven phases are enough to separate the major engineering risks without turning development into a long administrative exercise.

1. The foundation must exist before product code can be trusted.
2. The interface shell establishes reusable visual and accessibility rules.
3. The timer is isolated because time correctness is the product’s central promise.
4. The remaining focus loop can then build around a stable timer.
5. Persistence and data ownership require their own migration and recovery work.
6. Offline behavior, accessibility, browser recovery, and performance need integrated hardening.
7. Publication deserves a final gate because a passing local build does not prove that the deployed GitHub Pages site works.

The phases are sequential at their boundaries, but tasks inside a phase may be completed together when they do not hide dependencies. A phase does not close because a date arrives. It closes only when its exit gate passes.

## Fixed implementation boundaries

The following decisions apply to every phase:

- Use React, TypeScript, and Vite for the application.
- Build static files into `dist` for GitHub Pages.
- Use React reducer and context tools for coordinated application state.
- Use Dexie over IndexedDB for structured local records.
- Use Zod to validate unknown persisted and imported values.
- Use the Vite PWA plugin for the manifest and application-asset service worker.
- Use Vitest for deterministic logic, React Testing Library with user-event for component behavior, and Playwright for real-browser flows.
- Use axe within Playwright as one automated accessibility layer.
- Use project-owned CSS and accessible semantic HTML.
- Load no runtime scripts, fonts, sounds, or interface assets from third-party content delivery networks.
- Send no tasks, sessions, reflections, settings, diagnostics, analytics, or telemetry away from the visitor’s device.
- Preserve the approved light and dark Pomorise logos.
- Apply the mandatory line-by-line commenting standard to every human-authored code file.

Exact package versions will be selected during Phase 1 after compatibility and license checks. The committed lockfile will preserve the reviewed dependency graph.

## Phase overview

| Phase | Name | Primary result | Exit gate |
| --- | --- | --- | --- |
| 1 | Foundation and guardrails | Reproducible application scaffold and automated quality commands | Clean install, lint, type check, unit test, production build, and Pages-path preview all pass |
| 2 | Design system and application shell | Responsive themed shell using the approved identity | Desktop and mobile shell passes keyboard, contrast, theme, and responsive checks |
| 3 | Reliable timer engine | Tested focus, short-break, and long-break state machine | Timer recovery and transition tests pass across unit, component, and browser layers |
| 4 | Complete focus loop | Intention, tasks, distraction inbox, break guidance, reflection, and progress | A visitor can complete the entire loop using keyboard, pointer, and touch-sized controls |
| 5 | Local data and privacy controls | Versioned local storage, backup, restore, deletion, and privacy explanations | Refresh, migration, import, export, and deletion tests pass with no personal-data network traffic |
| 6 | Offline experience and quality hardening | Installable offline-capable application with accessibility and resilience work | Offline, update, responsive, accessibility, and performance budgets pass |
| 7 | Release verification and publication | Verified Pomorise 1.0: First Light deployment | Production checklist passes on the actual GitHub Pages URL |

## Phase 1: Foundation and guardrails

### Purpose

Create the smallest trustworthy project foundation before feature code begins. This phase makes every later change reproducible and reviewable.

### Work

- Create the React and TypeScript Vite scaffold without replacing the confirmed GitHub Pages workflow unnecessarily.
- Configure Vite’s repository base path so assets resolve from `/pomorise/` on the project Pages URL.
- Install only the confirmed dependencies and record exact versions in `package.json` and `package-lock.json`.
- Configure strict TypeScript checking.
- Configure ESLint, typescript-eslint, and Prettier.
- Add scripts for development, formatting checks, linting, type checking, unit tests, component tests, browser tests, and production builds.
- Configure Vitest, React Testing Library, user-event, Playwright, and axe.
- Establish the source layout for application code, timer logic, local data, components, styles, assets, tests, and schemas.
- Add a minimal product-specific application entry that proves React, TypeScript, CSS, and the approved logo assets work together.
- Add a network-boundary test that can later fail if unexpected runtime requests appear.
- Document the line-by-line comment enforcement review inside the pull-request or commit checklist.

### Required validation

- [ ] A clean `npm ci` succeeds from the lockfile.
- [ ] Formatting, linting, and TypeScript checks succeed.
- [ ] The first Vitest and component tests succeed.
- [ ] The production build creates `dist`.
- [ ] The built application works under the `/pomorise/` base path.
- [ ] GitHub Actions uses the same install and build commands as local development.
- [ ] No secrets or environment-specific private values are required.

### Exit gate

Phase 1 is complete when a new contributor can clone the repository, run the documented commands, see the Pomorise shell, execute all quality checks, and build the exact artifact expected by GitHub Pages.

- [ ] **Phase 1 completion:** Exit gate satisfied and linked test report status is `Passed`.

## Phase 2: Design system and application shell

### Purpose

Turn the approved identity into a calm, readable, and reusable interface foundation before filling the screen with features.

### Work

- Define light and dark color tokens derived from the approved logos.
- Choose the local or system typography stack without remote font requests.
- Define spacing, radius, border, shadow, motion, focus-ring, and layer tokens.
- Build semantic primitives for buttons, fields, dialogs, cards, segmented controls, notices, and status messages.
- Build the responsive application shell for header, timer workspace, supporting panels, and settings.
- Load `assets/logos/light_mode.png` and `assets/logos/dark_mode.png` according to the active theme.
- Add system-theme detection and an explicit local theme preference.
- Respect `prefers-reduced-motion` and ensure no interaction depends on animation.
- Establish visible keyboard focus, useful hover and active states, and touch-friendly target sizing.
- Add empty, disabled, error, and permission-explanation patterns that later features can reuse.

### Required validation

- [ ] Light and dark themes remain readable at 200 percent zoom.
- [ ] The shell reflows without horizontal page scrolling at the supported mobile width.
- [ ] Every interactive shell control is reachable and operable by keyboard.
- [ ] Automated accessibility checks find no known serious or critical issues.
- [ ] Manual contrast checks cover text, controls, focus indicators, status colors, and disabled states.
- [ ] Theme selection persists locally and does not create a network request.

### Exit gate

Phase 2 is complete when the application looks recognizably Pomorise on desktop and mobile, the approved logos are integrated correctly, and every later feature has accessible project-owned components to build upon.

- [ ] **Phase 2 completion:** Exit gate satisfied and linked test report status is `Passed`.

## Phase 3: Reliable timer engine

### Purpose

Build the core promise as a deterministic state machine before tasks or progress features depend on it.

### Work

- Define focus, short-break, and long-break modes with familiar 25, 5, and 15 minute defaults.
- Define idle, running, paused, completed, skipped, and overtime states.
- Define legal events and transitions for start, pause, resume, reset, skip, add time, and completion.
- Store timestamps and derive remaining time from wall-clock values instead of trusting interval tick counts.
- Refresh the visible countdown without writing to storage every second.
- Recover an active timer after refresh, tab suspension, device sleep, or browser throttling.
- Detect meaningful wall-clock discontinuities and present a recovery choice rather than silently inventing history.
- Support custom durations within approved bounds.
- Add manual and automatic transition behavior after the final product choice is confirmed.
- Add local sound and browser-notification completion paths with contextual permission requests.
- Add accessible timer names and restrained announcements that do not read every second to screen-reader users.

### Required validation

- [ ] Unit tests cover every legal transition and reject invalid transitions.
- [ ] Fake-clock tests cover completion boundaries, pause and resume, added time, skipped sessions, and overtime.
- [ ] Component tests cover controls, labels, announcements, and permission explanations.
- [ ] Browser tests cover refresh recovery, hidden-tab recovery, storage restoration, and responsive controls.
- [ ] Manual tests cover device sleep and a simulated clock change where automation is insufficient.
- [ ] The timer remains usable when sound and notifications are unsupported or denied.

### Exit gate

Phase 3 is complete when the countdown is accurate, recoverable, keyboard-accessible, touch-accessible, and independent of browser interval precision.

- [ ] **Phase 3 completion:** Exit gate satisfied and linked test report status is `Passed`.

## Phase 4: Complete focus loop

### Purpose

Build the experience that makes Pomorise more useful than an isolated 25-minute countdown.

### Work

- Add a concise focus intention before a session.
- Add a deliberately small task list with an active task and session estimates.
- Add task completion and carry-forward actions.
- Add one-step distraction capture that does not stop the timer.
- Add post-session distraction review with convert, keep, and dismiss choices.
- Add quiet and guided break experiences for breathing, stretching, hydration, eye rest, and movement.
- Add a short reflection with progress, next step, optional focus rating, and optional notes.
- Add private daily and weekly summaries derived from local session records.
- Add the approved first version of the visual “rise” progress treatment with a semantic data alternative.
- Keep every optional field skippable and avoid streak punishment or pressure-driven language.
- Connect the stages into one understandable sequence without trapping users in a wizard.

### Required validation

- [ ] A complete intention-to-reflection journey works with keyboard only.
- [ ] The same journey works with pointer and touch-sized controls.
- [ ] Component tests cover empty, partial, complete, canceled, and error states.
- [ ] Browser tests cover session completion with and without a selected task.
- [ ] Progress values match deterministic calculations from synthetic session records.
- [ ] User-generated text is rendered as text and never injected as raw HTML.
- [ ] The focus screen remains visually quiet while capture controls stay reachable.

### Exit gate

Phase 4 is complete when a visitor can plan a session, focus, capture a distraction, take a break, reflect, and understand personal progress without leaving Pomorise or creating an account.

- [ ] **Phase 4 completion:** Exit gate satisfied and linked test report status is `Passed`.

## Phase 5: Local data and privacy controls

### Purpose

Make browser-only data ownership dependable, transparent, and recoverable.

### Work

- Define versioned Dexie stores for tasks, sessions, distractions, reflections, and metadata.
- Keep small interface preferences in `localStorage` only where synchronous access is useful.
- Validate stored and imported values with Zod at trust boundaries.
- Add explicit, tested schema migrations.
- Add local export of a versioned JSON backup.
- Add local CSV export for appropriate history records.
- Add import preview, validation, duplicate policy, confirmation, and transactional write behavior.
- Add clear-history, reset-preferences, and delete-everything controls with exact scope explanations.
- Verify deletion outcomes before showing success.
- Add an optional request for persistent browser storage after a plain-language explanation.
- Add honest warnings about private browsing, cleared site data, storage eviction, and device-local history.
- Provide a user-controlled diagnostics view that reveals local schema and application version without transmitting it.

### Required validation

- [ ] Data survives refresh and normal browser restart behavior.
- [ ] Migration tests preserve older synthetic records.
- [ ] Malformed imports fail safely without partial writes.
- [ ] Valid imports produce expected records and derived progress.
- [ ] Exported data can be imported into a clean browser profile.
- [ ] Each deletion scope removes exactly the promised records.
- [ ] Browser tests confirm that personal values never appear in URLs or network request bodies.
- [ ] The application still works if persistent-storage permission is unavailable or declined.

### Exit gate

Phase 5 is complete when visitors can understand, back up, restore, inspect, and delete their Pomorise data without sending that data to Pomorise or another application service.

- [ ] **Phase 5 completion:** Exit gate satisfied and linked test report status is `Passed`.

## Phase 6: Offline experience and quality hardening

### Purpose

Make the integrated product resilient across browsers, screen sizes, permissions, network states, and common interruptions.

### Work

- Add the web app manifest with approved identity assets and theme colors.
- Configure the service worker to cache versioned application assets only.
- Keep personal records out of Cache Storage.
- Add an update prompt that never reloads during an active session without consent.
- Add an offline-ready explanation and graceful behavior when a first visit has not completed caching.
- Complete screen-reader, keyboard, zoom, contrast, reduced-motion, sound-off, and notification-denied reviews.
- Test responsive layouts across representative narrow, medium, and wide viewports.
- Measure startup, asset, and interaction performance and remove avoidable weight.
- Audit the production bundle and runtime network activity for unexpected third-party code or requests.
- Add error boundaries and recoverable error messages where they protect user work.
- Verify that schema failures or update failures preserve the last usable state whenever possible.

### Required validation

- [ ] The installed or previously loaded application opens without a network connection.
- [ ] An active session remains recoverable after an application update.
- [ ] Automated accessibility tests pass, followed by the documented manual accessibility review.
- [ ] All primary flows pass at representative mobile and desktop sizes.
- [ ] No personal data enters service-worker caches.
- [ ] Runtime network inspection shows only approved static application requests.
- [ ] Production performance budgets defined during Phase 1 pass on the built application.

### Exit gate

Phase 6 is complete when Pomorise remains understandable and useful through offline use, denied permissions, viewport changes, browser throttling, refreshes, and ordinary update conditions.

- [ ] **Phase 6 completion:** Exit gate satisfied and linked test report status is `Passed`.

## Phase 7: Release verification and publication

### Purpose

Prove that Pomorise 1.0: First Light works as deployed, not only inside the development environment.

### Work

- Freeze the First Light scope and defer nonessential discoveries explicitly.
- Run formatting, linting, type checking, unit tests, component tests, accessibility tests, browser tests, and the production build from a clean install.
- Inspect the built dependency and asset graph.
- Verify titles, descriptions, icons, manifest fields, theme colors, and privacy language.
- Verify the GitHub Pages workflow uploads only the intended `dist` artifact.
- Deploy through the confirmed GitHub Actions workflow.
- Run the release smoke suite against the public GitHub Pages URL.
- Verify direct loading, refresh, asset paths, offline readiness, theme selection, timer recovery, data controls, and responsive layouts on the deployed site.
- Record known limitations and visitor-facing support guidance.
- Resolve the changelog’s pending commit entry and publish the release notes.

### Required validation

- [ ] The clean continuous-integration run passes without ignored failures.
- [ ] The public URL loads without missing assets or incorrect base paths.
- [ ] The deployed application makes no unapproved runtime requests.
- [ ] The privacy promise matches observed application behavior.
- [ ] A fresh visitor can complete the main focus loop.
- [ ] An existing visitor’s synthetic local data survives a compatible application update.
- [ ] The final accessibility and responsive checklist is signed off.
- [ ] Backup, restore, and delete-everything flows pass on the deployed build.

### Exit gate

Phase 7 is complete only when the public GitHub Pages deployment passes the release checklist and is ready to be called **Pomorise 1.0: First Light**.

- [ ] **Phase 7 completion:** Exit gate satisfied and linked test report status is `Passed`.

## Line-by-line commenting standard

### Binding rule

Every human-authored line of application code, test code, styling code, configuration code, and automation code must have an adjacent beginner-friendly comment that explains its purpose. This is a project requirement, not a claim that every software project follows the same convention.

A comment line does not need another comment, which prevents an infinite chain of comments about comments. Blank lines also do not require comments.

### What the comments must explain

Comments must help a beginner understand:

- What the next line does.
- Why that line exists in Pomorise.
- What important input, output, state, side effect, or constraint is involved.
- Why a less obvious syntax or browser behavior is safe.
- What boundary is being protected when the line handles time, storage, privacy, accessibility, or untrusted data.

Comments must not merely translate punctuation into words. “Create the timer state with an initial idle value” is useful. “Declare a constant” is not enough when the line’s role can be explained more clearly.

### Placement rules

- Place a comment immediately above a line when an inline comment would make the code harder to scan.
- Use a valid inline comment only when the language and formatter preserve readability.
- Comment each import separately with the reason the imported value is needed.
- Comment opening and closing structural lines, including braces, JSX containers, CSS rule boundaries, and test blocks.
- Comment each branch with the condition’s product meaning.
- Comment every test assertion with the behavior it protects.
- Comment every storage and network operation with the privacy boundary it must preserve.
- Keep comments synchronized whenever code changes. A stale comment fails review even when the code still runs.

### Example TypeScript style

```ts
// Import the reducer type so the timer transition function has an explicit contract.
import type { Reducer } from "react";

// Describe the only two states used by this shortened teaching example.
type TimerStatus = "idle" | "running";

// Create a reducer that returns a valid timer status for every supported event.
const timerReducer: Reducer<TimerStatus, "start" | "reset"> = (
  // Receive the current status so unsupported events can preserve it safely.
  currentStatus,
  // Receive the requested event that describes the user’s timer action.
  event,
// Close the reducer parameter list before its implementation begins.
) => {
  // Check whether the user requested that the timer begin running.
  if (event === "start") {
    // Return the running state because the start event was valid.
    return "running";
  // Close the start-event branch after returning its result.
  }

  // Check whether the user requested a reset to the idle state.
  if (event === "reset") {
    // Return idle so the display and controls return to their starting state.
    return "idle";
  // Close the reset-event branch after returning its result.
  }

  // Preserve the existing status if a future caller supplies an unknown event.
  return currentStatus;
// Close the reducer function after every event path has returned a safe state.
};
```

### Formats that cannot contain comments

Some required formats, including strict JSON, lockfiles, generated build artifacts, and binary images, cannot accept line comments without becoming invalid or meaningless. These are not silent exceptions.

- Never insert illegal comments into `package.json`, `package-lock.json`, imported data fixtures that must remain strict JSON, generated `dist` files, or binary assets.
- For each human-maintained non-commentable configuration file, create a companion Markdown explanation under `code_annotations/`.
- The companion file must identify the source path and explain every meaningful line or generated field group in source order.
- Machine-generated lockfiles and build output require a generator and purpose explanation, not a fabricated line-by-line annotation.
- Binary assets require purpose, source, dimensions, and usage notes rather than line comments.

This treatment keeps every authored decision understandable while preserving valid file formats.

### Review gate

No phase can close while an authored code line lacks its required explanation. Review must check comment accuracy, beginner readability, privacy wording, and synchronization with the actual behavior.

## Testing strategy

The test layers divide responsibility instead of repeating the same checks everywhere.

| Layer | Confirmed tool | Main responsibility | Runs when |
| --- | --- | --- | --- |
| Static | TypeScript, ESLint, and typescript-eslint | Type safety, unsafe patterns, and project rules | During local review and every continuous-integration build |
| Unit | Vitest | Timer transitions, calculations, schemas, migrations, and progress derivation | During development and every continuous-integration build |
| Component | React Testing Library and user-event | Accessible names, visible behavior, keyboard interaction, and component states | During feature work and every continuous-integration build |
| Browser | Playwright | Refresh recovery, IndexedDB, offline behavior, responsive flows, and deployment paths | At phase gates and every release candidate |
| Automated accessibility | axe with Playwright | Detect a useful subset of structural, labeling, and contrast issues | At phase gates and every release candidate |
| Manual accessibility | Human review | Keyboard order, screen-reader experience, zoom, motion, sound alternatives, and comprehension | Phases 2, 3, 4, 6, and 7 |
| Privacy | Network and storage inspection | Confirm personal data remains local and caches contain only application assets | Phases 1, 5, 6, and 7 |

Tests use synthetic records only. No real visitor data is copied into fixtures, screenshots, logs, or continuous-integration artifacts.

## Test report standard

Every meaningful test phase, run, or independently verified step must create a detailed permanent report at:

```text
testreports/<phase_or_run_or_step>/test_report.md
```

The directory name must be a stable lowercase identifier such as `phase-01-foundation`, `run-2026-08-16-timer-recovery`, or `step-dark-theme-keyboard-review`. Each report keeps its supporting evidence beside it:

```text
testreports/<phase_or_run_or_step>/
|-- test_report.md
|-- screenshots/
|   |-- 001-initial-state.png
|   |-- 002-primary-flow-passed.png
|   `-- 003-test-runner-summary.png
|-- logs/
|   `-- 001-command-output.txt
`-- artifacts/
    `-- optional-machine-report.json
```

Every report must include:

- Human-readable creation and last-updated timestamps, ISO 8601 timestamps where exact values are known, timezone, and estimated reading time.
- The phase, run, or step identifier and its purpose.
- The exact commit, branch, application URL, build mode, operating system, browser engines, viewport sizes, locale, timezone, and relevant tool versions.
- The start time, end time, duration, command, exit code, expected result, actual result, and log path for every automated command.
- A numbered record for every automated and manual test case.
- Setup data and preconditions using synthetic information only.
- Pass, fail, blocked, skipped, and flaky counts with an explanation for every non-pass result.
- Full failure symptoms, reproduction steps, likely cause, affected scope, fix or deferral decision, and retest result.
- Accessibility, keyboard, responsive, privacy, storage, network, performance, offline, and comment-coverage findings when relevant.
- Known limitations, residual risks, deferred checks, and follow-up owners.
- A screenshot index with a descriptive caption, capture timestamp, test-case link, viewport, theme, expected state, and observed state for every image.
- Relative Markdown image embeds so screenshots are visible while reading the report.
- Links to raw logs, machine-readable results, traces, videos, coverage output, and other retained artifacts.
- A final checklist and an evidence-based conclusion that states passed, failed, blocked, or incomplete.

Every timestamp must include its date and timezone. Every completed report must show a realistic estimated reading time near the top so reviewers know its length before beginning.

Screenshots are mandatory for every report. A browser-visible run must show the tested interface states, including relevant light, dark, desktop, and mobile evidence. A command-only run must include a readable terminal or test-reporter screenshot. Screenshots supplement logs and assertions; they never replace them.

Playwright may capture page, full-page, or element screenshots and may retain traces for failed or diagnostically important browser cases. Vitest and other command runs must retain text output in `logs/` in addition to the report summary. Secret values, personal data, access tokens, private file paths, unrelated browser tabs, and real user records must be removed before any evidence is committed.

The canonical template is [`testreports/_template/test_report.md`](testreports/_template/test_report.md). The navigation index and naming rules live in [`testreports/README.md`](testreports/README.md).

## Mandatory phase closeout checklist

This checklist must be copied into the phase report and checked with direct evidence. An unchecked item prevents the phase from being marked complete.

- [ ] The approved phase scope is implemented, and any deviation is documented.
- [ ] Every phase-specific **Required validation** checkbox is checked and linked to evidence.
- [ ] Every human-authored code line satisfies the line-by-line commenting standard.
- [ ] Companion annotations cover every human-maintained format that cannot contain comments.
- [ ] Formatting, linting, type checking, unit tests, component tests, browser tests, and builds required by this phase have recorded commands and exit codes.
- [ ] Manual keyboard, accessibility, responsive, permission, privacy, and recovery checks required by this phase are recorded.
- [ ] Runtime network and browser-storage findings are recorded where the phase can affect them.
- [ ] Every failure, retry, skipped case, flaky result, and blocked check has an explanation.
- [ ] Raw logs and available machine-readable reports are stored beside the report.
- [ ] Screenshots are stored locally, embedded in the report, captioned, and tied to test cases.
- [ ] Screenshots and logs contain only synthetic data and no secrets or personal records.
- [ ] Known limitations and residual risks are explicit.
- [ ] The report conclusion matches the recorded evidence.
- [ ] `testreports/README.md` links to the completed report.
- [ ] Project documentation and the commit tracker are synchronized.
- [ ] The phase exit gate is checked only after the complete report passes review.

## Phase completion protocol

Every phase follows the same evidence-driven closeout sequence:

1. Create the report directory from the canonical template before testing begins.
2. Record the environment, scope, commit, commands, and planned test cases.
3. Complete only the approved work for that phase.
4. Confirm every authored code line satisfies the commenting standard.
5. Run the phase’s required automated checks while preserving raw logs.
6. Perform the listed manual checks and capture screenshots during testing.
7. Record runtime network activity and local-data behavior where applicable.
8. Document failures and retests without deleting the earlier result from the report.
9. Complete the mandatory phase closeout checklist with links to evidence.
10. Add the report to `testreports/README.md`.
11. Update `implementation_plan.md`, `project_plan.md`, `meta_thinking.md`, and `changelog.md` in sync.
12. Commit a coherent phase result only after its exit gate and report conclusion both pass.

If a phase reveals a requirement that materially changes privacy, hosting, or product scope, development pauses at that boundary for an explicit project-owner decision.

## Risks and controls

| Risk | Why it matters | Control |
| --- | --- | --- |
| Excessive comments drift away from behavior | Incorrect explanations are worse than missing explanations for a beginner | Treat comment accuracy as a testable review requirement and update comments in the same change as code |
| Line comments make files visually dense | Beginners may lose the shape of the program | Use consistent placement, short sentences, small functions, descriptive names, and blank lines between conceptual groups |
| Timer behavior depends on interval timing | Background tabs and sleeping devices can delay intervals | Store timestamps and derive remaining time from wall-clock differences |
| Browser storage can be removed | A visitor could lose history | Provide transparent warnings, export, import, and persistent-storage requests where appropriate |
| Service-worker updates interrupt a session | Reloading can erase unsaved interface state or cause confusion | Prompt for updates and never force an active-session reload |
| GitHub Pages uses a repository subpath | Incorrect asset paths can break the public build | Configure and test Vite’s `/pomorise/` base path from Phase 1 onward |
| Automated accessibility tests miss human experience | Tools cannot judge every screen-reader, keyboard, motion, or comprehension issue | Require manual accessibility gates in multiple phases |
| Dependencies introduce unexpected code or requests | Privacy and performance could change without a visible feature change | Lock versions, audit the production graph, bundle locally, and inspect runtime requests |
| Screenshots expose private or irrelevant information | Evidence may accidentally retain secrets, personal data, or unrelated windows | Use synthetic data, capture only the relevant application or terminal surface, inspect every image, and redact before committing |
| Reports become summaries instead of evidence | A pass label without commands, logs, and screenshots cannot be independently reviewed | Require the canonical template, raw artifacts, screenshot index, and closeout checklist for every phase or run |

## Fact-check and sanity-check record

| Verification information | Value |
| --- | --- |
| Last verified | August 16, 2026 at 2:35:10 AM EDT |
| Verification scope | Seven-phase sequence, Vite static output, GitHub Pages artifact deployment, React component model, confirmed test layers, local-first boundaries, comment-format limitations, screenshot capture, and evidence-report requirements |
| Primary sources | React, TypeScript, Vite, GitHub Pages, Vitest, Testing Library, Playwright, MDN, Dexie, Zod, and Vite PWA documentation linked below |
| Result | The sequence is compatible with the confirmed static, browser-only architecture and can begin without selecting another framework or service |

The plan passed these sanity checks:

- **Phase fit:** Each phase produces a coherent result and has an observable exit gate.
- **Dependency fit:** Timer behavior exists before focus-loop records depend on it, and records exist before offline migration hardening.
- **Hosting fit:** Vite’s default production output is `dist`, and GitHub Pages custom workflows can publish a built artifact.
- **Privacy fit:** No phase requires an account, application backend, analytics service, or remote personal-data store.
- **Testing fit:** Unit, component, browser, accessibility, and manual checks protect different risks.
- **Evidence fit:** Each completed phase or meaningful run requires commands, raw logs, screenshots, case results, failures, retests, and a final evidence-based conclusion.
- **Commenting fit:** The project-specific every-line rule remains valid without corrupting strict JSON, lockfiles, generated output, or binary assets.
- **Scope fit:** The plan defines implementation order without inventing additional product versions.

Package versions, browser-support targets, performance budgets, and exact accessibility acceptance values must be verified when their implementation phase begins. They are not guessed here.

## Glossary

- **Artifact:** The packaged files passed from a build job to a deployment job.
- **Companion annotation:** A Markdown explanation for a required file format that cannot legally or meaningfully contain comments.
- **Continuous integration:** Automated checks that run from the repository to verify a clean installation, tests, and build.
- **Exit gate:** The complete set of observable conditions that must pass before a phase closes.
- **Focus loop:** The Pomorise sequence of plan, focus, capture, recover, reflect, and rise.
- **Line-by-line commenting:** The Pomorise requirement that every human-authored code line has an adjacent beginner-friendly explanation.
- **Test report:** The permanent Markdown record that connects a test scope to its environment, commands, cases, logs, screenshots, failures, retests, and conclusion.
- **Local-first:** A product model in which personal data stays on the visitor’s device by default.
- **Migration:** A versioned transformation that moves stored records safely from an older schema to a newer schema.
- **Production build:** The optimized static application output created for public hosting.
- **Progressive web app:** A website enhanced with a manifest, offline support, and installable behavior where browsers permit it.
- **State machine:** A model that allows only named states and valid transitions between them.
- **Synthetic data:** Invented test records that contain no real visitor information.
- **Trust boundary:** A point where unknown input must be validated before the application relies on it.

## Further reading

- [React documentation](https://react.dev/learn)
- [TypeScript documentation](https://www.typescriptlang.org/docs/)
- [Vite guide](https://vite.dev/guide/)
- [Vite static deployment and GitHub Pages](https://vite.dev/guide/static-deploy.html)
- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Dexie API reference](https://dexie.org/docs/API-Reference)
- [Zod documentation](https://zod.dev/)
- [Vite PWA plugin guide](https://vite-pwa-org.netlify.app/guide/)
- [Vitest guide](https://vitest.dev/guide/)
- [React Testing Library introduction](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library user-event introduction](https://testing-library.com/docs/user-event/intro/)
- [Playwright documentation](https://playwright.dev/docs/intro)
- [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing)
- [Playwright screenshots](https://playwright.dev/docs/screenshots)
- [Playwright reporters](https://playwright.dev/docs/test-reporters)
- [Playwright trace viewer](https://playwright.dev/docs/trace-viewer-intro)
- [Vitest reporters](https://vitest.dev/guide/reporters)
- [MDN: Using IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
- [MDN: Storage quotas and eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- [MDN: Progressive web apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/What_is_a_progressive_web_app)

## Maintenance rules

1. Keep the phase count at seven unless an explicit project decision changes it.
2. Do not begin a later phase while an earlier exit gate has unresolved blocking failures.
3. Update scope, tasks, risks, and gates when implementation evidence changes the plan.
4. Apply the line-by-line commenting standard to every human-authored code change.
5. Keep companion annotations synchronized with non-commentable source files.
6. Recheck official documentation before installing or upgrading dependencies.
7. Preserve the local-first privacy boundary in every phase.
8. Update the timestamp, reading time, table of contents, glossary, sources, and verification record whenever this document changes substantially.
9. Keep the prose engaging, precise, beginner-friendly, and free of em dashes.
10. Record phase completion and meaningful deviations in `meta_thinking.md` and `changelog.md`.
11. Create and index a detailed screenshot-backed report for every meaningful phase, run, or independently verified step.
12. Never check a phase exit gate without a passing report and complete closeout checklist.
