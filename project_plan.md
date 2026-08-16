# Pomorise Project Plan

| Document information | Value |
| --- | --- |
| Created | August 15, 2026 at 11:12 PM EDT |
| Last updated | August 15, 2026 at 11:22 PM EDT |
| Timezone | America/Toronto (UTC−04:00) |
| Estimated reading time | 27 minutes |

Pomorise will be a private, local-first focus companion that guides people from a clear intention to meaningful progress. It will offer more than a countdown while remaining calm, fast, and trustworthy.

## Table of contents

- [Product vision](#product-vision)
- [The Pomorise promise](#the-pomorise-promise)
- [The focus loop](#the-focus-loop)
- [Conceptual ASCII interfaces](#conceptual-ascii-interfaces)
- [Version 1 features](#version-1-features)
- [Privacy model](#privacy-model)
- [Local data architecture](#local-data-architecture)
- [Data ownership and controls](#data-ownership-and-controls)
- [Honest limitations](#honest-limitations)
- [Technical foundation](#technical-foundation)
- [Tool selection principles](#tool-selection-principles)
- [Intended toolset](#intended-toolset)
- [Detailed data flow](#detailed-data-flow)
- [Data boundaries and invariants](#data-boundaries-and-invariants)
- [Quality standard](#quality-standard)
- [Delivery sequence](#delivery-sequence)
- [Out of scope](#out-of-scope)
- [Open product decisions](#open-product-decisions)
- [Fact-check and sanity-check record](#fact-check-and-sanity-check-record)
- [Glossary](#glossary)
- [Further reading](#further-reading)
- [Maintenance rules](#maintenance-rules)

## Product vision

Pomorise aims to become the best Pomodoro website for people who want strong focus without surrendering their personal data.

“Best” will not mean having the longest feature list. It will mean that every part of the experience works together:

- Starting a session feels effortless.
- The timer remains dependable.
- Distractions have somewhere safe to go.
- Breaks restore attention.
- Reflection creates a clear next step.
- Progress feels encouraging rather than judgmental.
- Personal information stays on the user’s device.

## The Pomorise promise

> Rise one session at a time.

Pomorise will help people make steady progress without accounts, surveillance, advertising, or pressure-driven productivity tactics.

The user-facing privacy promise will be written in plain language:

> Pomorise does not collect, transmit, sell, or analyze your focus data. Your tasks, sessions, reflections, and preferences stay in your browser unless you choose to export them.

The final privacy notice must also explain that GitHub Pages provides the static hosting. [GitHub’s privacy statement says that GitHub logs website usage data](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement), so Pomorise must never imply that visiting the hosted page creates no infrastructure records anywhere. Pomorise itself will not receive or operate application analytics, telemetry, or user logs.

## The focus loop

Pomorise will guide a complete cycle instead of presenting an isolated timer.

1. **Choose:** Set one clear intention and estimate the effort.
2. **Focus:** Work inside a reliable, distraction-light session.
3. **Recover:** Take a guided break that supports genuine rest.
4. **Reflect:** Capture progress, distractions, and the best next step.
5. **Learn:** Discover helpful personal patterns through private, on-device insights.

## Conceptual ASCII interfaces

These sketches describe hierarchy and flow. They do not approve a final color palette, type system, illustration style, or exact layout. The design phase may refine them as long as the focus loop remains clear.

### Main focus workspace on desktop

```text
+------------------------------------------------------------------------------+
| pomorise                         Today: 3 sessions / 75 min        [Settings] |
+------------------------------------------------------------------------------+
|                                                                              |
|  WHAT WILL YOU MOVE FORWARD?                CURRENT TASK                     |
|  [ Finish the project brief____________ ]   Project brief                    |
|                                              Estimate: 2 of 3 sessions       |
|                 FOCUS                                                        |
|                                                                              |
|                 25:00                       TODAY                             |
|                                              [=======.....] 75 / 120 min      |
|          [Reset] [Start focus] [Skip]                                        |
|                                                                              |
|  Session 1 of 4 before a long break         DISTRACTION INBOX                |
|  Sound: Quiet rain                           + Capture a thought              |
|                                                                              |
+------------------------------------------------------------------------------+
|  Tasks                         Session history                 Your data      |
+------------------------------------------------------------------------------+
```

### Distraction capture during focus

```text
+--------------------------------------------------------------+
|                         FOCUS  18:42                         |
|                                                              |
|                  Finish the project brief                    |
|                                                              |
|       [Pause]   [Capture distraction]   [End session]         |
+--------------------------------------------------------------+
|  SAVE FOR LATER                                               |
|  [ Reply to Maya after this session_______________________ ]  |
|                                      [Cancel] [Save quietly]  |
+--------------------------------------------------------------+
```

Saving a distraction returns keyboard focus to the timer and does not interrupt the session.

### Guided short break

```text
+--------------------------------------------------------------+
|                      SHORT BREAK  05:00                      |
|                                                              |
|                 Let your attention soften.                   |
|                                                              |
|       Look at something distant for twenty seconds.          |
|                                                              |
|       [Another suggestion]  [Quiet break]  [Skip break]       |
|                                                              |
|       Next: Continue the project brief                        |
+--------------------------------------------------------------+
```

### End-of-session reflection

```text
+--------------------------------------------------------------------+
|  SESSION COMPLETE                                      25 minutes  |
+--------------------------------------------------------------------+
|  What moved forward?                                               |
|  [ Drafted the opening and completed the research summary______ ]  |
|                                                                    |
|  What is the best next step?                                       |
|  [ Write the recommendation section____________________________ ]  |
|                                                                    |
|  Focus felt:  [Low]  [Steady]  [Strong]            Optional        |
|                                                                    |
|  2 distractions are waiting                         [Review them]   |
|                                                                    |
|               [Skip reflection]  [Save and take a break]           |
+--------------------------------------------------------------------+
```

### Mobile focus view

```text
+----------------------------------+
| pomorise              [Settings] |
+----------------------------------+
| FOCUS                  Session 1 |
|                                  |
|              25:00               |
|                                  |
|       Finish project brief       |
|                                  |
|          [Start focus]           |
|       [Reset]       [Skip]        |
|                                  |
| + Capture a distraction          |
+----------------------------------+
| Timer   Tasks   Progress   More   |
+----------------------------------+
```

### Private progress view

```text
+------------------------------------------------------------------------------+
| YOUR PROGRESS                      [Today] [Week] [Month]        [Export CSV] |
+------------------------------------------------------------------------------+
|  Focused today       Sessions       Planned / completed        Best rhythm   |
|  75 minutes          3              3 / 4                      9 to 11 AM     |
|                                                                              |
|  THIS WEEK                                                                  |
|  Mon  ====  100 min                                                        |
|  Tue  ===== 125 min                                                        |
|  Wed  ===    75 min                                                        |
|  Thu  ====== 150 min                                                       |
|  Fri  ==     50 min                                                        |
|                                                                              |
|  All insights were calculated in this browser. Nothing was sent to us.      |
+------------------------------------------------------------------------------+
```

### Settings and local data controls

```text
+--------------------------------------------------------------------+
| SETTINGS                                                           |
+--------------------------------------------------------------------+
| Timer       25 focus / 5 short / 15 long               [Edit]      |
| Sounds      Gentle bell, 60% volume                    [Edit]      |
| Appearance  System theme, reduced motion               [Edit]      |
|                                                                    |
| YOUR DATA                                                          |
| Stored here   42 sessions / 18 tasks / 7 reflections              |
| Last export   August 15, 2026                                     |
|                                                                    |
| [Export backup] [Import backup] [Export CSV]                       |
| [Delete history] [Reset preferences] [Delete everything]          |
|                                                                    |
| Your focus data stays in this browser unless you export it.        |
+--------------------------------------------------------------------+
```

Every final interface will need responsive behavior, visible keyboard focus, accessible names, screen-reader announcements for meaningful timer changes, and alternatives to motion and sound.

## Version 1 features

### Excellent timer

- Focus, short break, and long break modes
- Familiar defaults of 25, 5, and 15 minutes
- Custom durations and reusable presets
- Start, pause, resume, reset, skip, and add-time controls
- Manual or automatic session transitions
- Accurate timestamp-based timing when the tab becomes inactive
- Full-screen focus mode
- Keyboard and touch controls
- Sound and browser notifications with clear permission choices
- Optional overtime when a user wants to finish their current thought

### Intention and tasks

- A short focus intention before each session
- A deliberately small task list rather than a full project-management system
- Session estimates for tasks
- A clear active task
- Completion and carry-forward actions
- Optional subtasks or notes where they improve clarity

### Distraction inbox

- One-step capture during a focus session
- No need to leave the timer or open another application
- Review, convert to a task, or dismiss after the session

### Guided recovery

- Optional breathing, stretching, hydration, eye-rest, and movement suggestions
- A quiet break mode without guidance
- No feeds, streak pressure, or attention-grabbing break content

### Reflection

- A quick note about what moved forward
- The best next step for the following session
- Optional focus or energy rating
- Optional session notes

### Private progress

- Focused minutes and completed sessions
- Planned versus completed effort
- Progress by task or category
- Daily and weekly patterns
- Personal milestones without punishment for missed days
- A visual “rise” that makes progress feel tangible

### Personal experience

- Light and dark themes
- Accessible color and motion settings
- Adjustable sounds and volume
- Optional locally bundled ambient sound
- Reduced-motion support
- Responsive behavior across desktop, tablet, and mobile
- Installable and usable offline as a progressive web app

## Privacy model

Pomorise will follow a strict local-first model:

- No sign-in or account system
- No server-side user database
- No application analytics
- No advertising trackers
- No telemetry or behavioral logging
- No third-party session replay
- No cookies for identification or tracking
- No transmission of tasks, history, reflections, or settings
- No remote fonts, sounds, or interface assets that create unnecessary third-party requests
- No hidden network calls

Every external request needed for the public website will be reviewable. Product data will never be placed in URLs, build logs, deployment logs, or error-reporting services.

## Local data architecture

[Client-side storage](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_APIs/Client-side_storage) is appropriate because the product owner explicitly wants device-local behavior and no accounts or synchronization. MDN distinguishes small Web Storage values from more complex structured information stored in IndexedDB.

| Data | Storage | Reason |
| --- | --- | --- |
| Active timer state | React state plus a saved target timestamp | Keeps the interface responsive and allows accurate recovery after tab throttling or refresh |
| Theme, sounds, durations, and preferences | `localStorage` | Small settings benefit from immediate access |
| Tasks and distraction inbox | IndexedDB | Structured records need safe asynchronous reads, updates, and queries |
| Session history and reflections | IndexedDB | History can grow and needs filtering for private analytics |
| Application files for offline use | Cache API through a service worker | Allows the interface to load without a network connection |
| Exported backups | User-selected JSON and CSV files | Gives the user portable ownership without a server |

IndexedDB will be accessed through a small typed data layer. A focused helper library such as Dexie may be used to make schema versions and migrations safer. It is a storage helper, not a second interface framework.

Pomorise will ask the browser for [persistent storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) only after explaining why. The application must continue to work if the browser declines that request.

## Data ownership and controls

Settings will include a clear **Your data** area where the user can:

- See what categories of information exist on the device
- Export a complete JSON backup
- Export session history as CSV
- Import a compatible backup
- Delete session history only
- Reset preferences only
- Delete all Pomorise data
- See the last successful export date stored locally

Destructive actions will explain exactly what will be removed and ask for confirmation. Import will validate the file before replacing or merging anything.

## Honest limitations

Local-first privacy creates tradeoffs that Pomorise must explain clearly:

- Data belongs to one browser profile on one device.
- Opening Pomorise on another device begins with a fresh workspace.
- Clearing browser data can remove Pomorise history.
- [Private or incognito browsing deletes Web Storage when the private session closes](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API). Equivalent private-mode behavior for other storage can vary by browser, so Pomorise will warn that private browsing is not suitable for durable history.
- [Browsers may evict best-effort storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) when space is low or under browser-specific policies.
- A persistent-storage request can reduce eviction risk, but the browser may decline it.
- Exported backups are the reliable way to move or preserve information.
- Offline support keeps the app usable without a connection, but it does not create cloud synchronization.
- A web application cannot guarantee an alarm after the browser or operating system fully closes it. [Service workers can be stopped by the browser and do not run continuously](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation).
- A normal website cannot block other websites. That would require a separate browser extension, which is not part of Version 1.

## Technical foundation

- React for the interface and interactive state
- TypeScript for reliable timer and data logic
- Vite for development and production builds
- GitHub Pages for static hosting
- GitHub Actions for reproducible builds and deployment
- IndexedDB for structured local product data
- `localStorage` for small preferences
- Service worker and web app manifest for offline installation
- Native Web Notifications and Web Audio where browser support allows
- Automated unit tests for time, transitions, storage migrations, imports, and exports

React remains the only interface framework. Additional libraries will be selected narrowly, reviewed for privacy, and bundled with the application. No runtime dependency may introduce analytics, remote asset loading, or hidden network traffic.

## Tool selection principles

Every tool must earn its place. A dependency will be accepted only when it:

- Solves an approved product or quality requirement
- Works in a static GitHub Pages application
- Can be bundled locally without runtime calls to its creator
- Has current official documentation and a compatible license
- Does not add analytics, telemetry, advertising, remote fonts, or hidden services
- Has a reasonable maintenance history and security posture
- Does not duplicate a reliable browser or React capability without a clear benefit
- Can be tested and replaced behind a small project-owned boundary

Exact versions will be selected and recorded when the application scaffold is created. Versions will not be guessed in advance. The lockfile will preserve the reviewed dependency graph used by builds.

## Intended toolset

| Tool | Category | Status | Intended role | Reason for selection | Privacy and sanity check |
| --- | --- | --- | --- | --- | --- |
| [React](https://react.dev/learn) | Interface framework | Confirmed | Components, interactive state, and accessible UI composition | The product contains several coordinated interactive states, and React provides a mature component model without requiring a server runtime. | Runs in the browser. React does not require application data to be sent to a server. |
| [TypeScript](https://www.typescriptlang.org/docs/) | Language tooling | Confirmed | Types for timer states, stored records, imports, exports, and migrations | Explicit state and record types reduce invalid transitions and unsafe data assumptions in the most sensitive logic. | Compile-time tool. It adds no visitor network activity. |
| [Vite](https://vite.dev/guide/) | Build framework | Confirmed | Development server, asset bundling, and production `dist` output | It fits React and TypeScript, produces static assets for GitHub Pages, and keeps the development and build setup small. | Build-time tool. Runtime code will use relative or `/pomorise/` asset paths configured for GitHub Pages. |
| [Dexie](https://dexie.org/docs/API-Reference) | Local database library | Planned | Typed wrapper around IndexedDB with schema versions and transactions | Native IndexedDB is capable but verbose. Dexie provides clearer queries, transactions, and versioned migrations while retaining IndexedDB as the storage engine. | Stores data in the browser’s IndexedDB. Dexie Cloud will not be installed or configured. |
| [Zod](https://zod.dev/) | Validation library | Planned | Runtime validation for imported backups, stored schemas, settings, and migration boundaries | TypeScript types disappear at runtime. Zod can verify files and persisted values before the application trusts them. | Validation runs locally. It prevents malformed or unexpected import data from entering the database. |
| [Vite PWA plugin](https://vite-pwa-org.netlify.app/guide/) | Offline build plugin | Planned | Generate the web app manifest and service worker using Workbox | It integrates with Vite and provides a maintained path to installability, versioned precaching, and controlled updates. | Will cache only versioned application assets. Personal records will remain in IndexedDB and never enter the service-worker cache. |
| [React `useReducer`](https://react.dev/reference/react/useReducer) and [context](https://react.dev/learn/passing-data-deeply-with-context) | State tools | Planned | Coordinate timer and interface state before considering another state library | The approved state model can begin with React’s built-in tools, avoiding a larger dependency until real complexity demonstrates a need. | Built into React. Redux, Zustand, or another state framework will not be added unless measured complexity justifies it. |
| [Browser Web APIs](https://developer.mozilla.org/en-US/docs/Web/API) | Web platform | Confirmed | Storage, files, notifications, audio, visibility, installation, and offline behavior | Native browser capabilities cover the required device-local features and minimize third-party runtime code. | Every permission will be requested in context and remain optional. Browser support will be checked per feature. |
| [Vitest](https://vitest.dev/guide/) | Unit-test framework | Planned | Fast tests for timer transitions, calculations, validation, and migrations | It shares Vite’s configuration model and is well suited to TypeScript modules and deterministic state logic. | Development-only tool. Test output stays in project and continuous-integration logs. Tests will use synthetic data. |
| [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) | Component-test library | Planned | Component tests through user-visible roles, labels, text, and interactions | Its user-centered queries encourage tests that reflect accessible behavior rather than private component structure. | Development-only and uses synthetic interface state. |
| [Playwright](https://playwright.dev/docs/intro) | Browser-test framework | Planned | Real-browser tests for primary flows, offline behavior, storage, refresh recovery, and responsive layouts | Timer recovery, PWA behavior, IndexedDB, and browser permissions require verification in real browser engines. | Development-only. Tests will run against local or preview builds with synthetic records. |
| [axe with Playwright](https://playwright.dev/docs/accessibility-testing) | Accessibility test library | Planned | Automated detection of common accessibility problems | It catches a useful subset of labeling, structure, and contrast problems inside the existing browser-test workflow. | Automated checks supplement, but never replace, keyboard, screen-reader, zoom, contrast, and manual review. |
| [ESLint](https://eslint.org/docs/latest/) and [typescript-eslint](https://typescript-eslint.io/getting-started/) | Static analysis | Planned | Code-quality and TypeScript-aware lint checks | They catch unsafe or inconsistent code patterns before those patterns reach tests or production. | Development-only tools with no visitor runtime behavior. |
| [Prettier](https://prettier.io/docs/) | Formatter | Planned | Consistent formatting for supported source files | Automated formatting reduces review noise and keeps code style predictable. | Development-only and deterministic. Markdown formatting must preserve the project’s reading style. |
| [GitHub Actions](https://docs.github.com/en/actions) | Continuous integration and deployment | Confirmed | Reproducible install, test, build, artifact upload, and deployment | It is already integrated with the repository and is the supported automation path for custom GitHub Pages builds. | Build logs must never receive personal product data because production user data never leaves browsers. |
| [GitHub Pages](https://docs.github.com/en/pages) | Static hosting | Confirmed | Public hosting for the compiled website | It matches the project owner’s chosen platform and serves the static output produced by Vite without an application server. | GitHub remains a separate infrastructure provider under its own privacy statement. Pomorise adds no application tracking. |

No chart library is selected yet. Progress views will first be evaluated with semantic HTML, CSS, and small project-owned SVG charts backed by an accessible data table. A chart dependency will be added only if it improves clarity without harming accessibility or bundle size.

## Detailed data flow

### System overview

```text
DEVELOPMENT AND DEPLOYMENT

Source files
    |
    v
GitHub repository --> GitHub Actions --> tests --> Vite build --> dist artifact
                                                                  |
                                                                  v
                                                          GitHub Pages
                                                                  |
                                                                  | static files
                                                                  v
USER DEVICE                                                  Browser / PWA

                    +----------------------------------------------+
                    | React interface and timer state              |
                    +----------------------+-----------------------+
                                           |
                 +-------------------------+-------------------------+
                 |                         |                         |
                 v                         v                         v
          localStorage                 IndexedDB               Cache API
          preferences              personal records          app files only
                 |                         |                         |
                 +-------------------------+-------------------------+
                                           |
                                           v
                                  Local calculations only
                                           |
                          +----------------+----------------+
                          |                                 |
                          v                                 v
                    On-screen insights               User export file

No personal product data flows back to GitHub, Pomorise, or a third party.
```

### 1. Build and deployment flow

1. Source code, tests, locally bundled assets, and dependency declarations live in the GitHub repository.
2. A push to `main` starts GitHub Actions.
3. The workflow installs the exact dependency tree from `package-lock.json` with `npm ci`.
4. Quality checks and automated tests run with synthetic fixtures, never production user data.
5. Vite compiles TypeScript and React, fingerprints assets, and creates `dist`.
6. The workflow uploads only `dist` as the Pages artifact.
7. GitHub Pages serves those static files to visitors.
8. No server application, secret key, user database, or analytics collector participates in this flow.

### 2. First load and startup flow

1. The browser requests the HTML entry point and versioned assets from GitHub Pages.
2. After the first successful visit, the service worker may satisfy cached application-file requests when offline.
3. React starts and renders a safe initial shell.
4. Small preferences are read from `localStorage` and validated before use.
5. The typed data layer opens IndexedDB and applies any required schema migration.
6. Active-session recovery, tasks, and the minimum progress summary are read asynchronously.
7. The interface becomes ready. A storage failure produces a clear recovery path instead of silently discarding data.
8. No task, session, reflection, or preference is transmitted during startup.

### 3. Intended local record model

The exact schema will be approved before implementation, but the first model is expected to include:

| Store | Representative fields | Purpose |
| --- | --- | --- |
| `tasks` | `id`, `title`, `status`, `estimatedSessions`, `completedSessions`, timestamps | Maintain the deliberately small task layer |
| `sessions` | `id`, `taskId`, `mode`, `intention`, `plannedSeconds`, `startedAt`, `endedAt`, `status` | Preserve timer history and active-session recovery |
| `distractions` | `id`, `sessionId`, `text`, `capturedAt`, `resolution` | Hold thoughts captured without leaving focus |
| `reflections` | `id`, `sessionId`, `progress`, `nextStep`, optional rating | Preserve the end-of-session reflection |
| `meta` | schema version, last export time, migration markers | Support safe upgrades and transparent backup status |

Preferences remain outside these stores in a small, versioned `localStorage` object. Personal text fields receive length limits and are rendered as text rather than executable HTML.

### 4. Starting and running a session

1. The user chooses a task or writes an intention.
2. Zod validates the input shape and limits before persistence.
3. The timer state machine receives a `START` event.
4. The application records `startedAt`, the planned duration, and `targetEndAt` as timestamps.
5. A session record with `active` status is written once to IndexedDB.
6. The visible countdown is derived from `targetEndAt - Date.now()` rather than treating interval callbacks as authoritative time.
7. A lightweight interval asks React to refresh the display. It does not write to storage every second.
8. Page Visibility events trigger immediate recalculation when the tab returns.
9. If the wall clock changes unexpectedly, Pomorise detects the discontinuity and offers a clear recovery choice instead of silently rewriting history.

### 5. Pause, resume, refresh, and completion

- **Pause:** Calculate remaining time, store the paused state, and stop display updates.
- **Resume:** Create a new target timestamp from the saved remaining duration and record the transition.
- **Refresh or reopen:** Load the active record, compare the target with the current time, and restore active, paused, or completed state.
- **Complete:** Write the final end time and status in one transaction, update the linked task, then invite reflection or break selection.
- **Skip or reset:** Preserve or discard the attempt according to the approved behavior, with explicit labels so history is not misleading.

### 6. Distraction capture flow

1. The user opens the lightweight capture control without pausing the timer.
2. The text is validated locally and written to the `distractions` store with the active session identifier.
3. Keyboard focus returns to the timer context.
4. After the session, the user can dismiss the thought, retain it, or convert it into a task.
5. Conversion uses a local transaction so one distraction does not accidentally become duplicate tasks.

### 7. Reflection and private analytics flow

1. Reflection answers are validated and stored against the completed session.
2. Progress calculations query local session records by time range, task, mode, or status.
3. Planned versus completed effort and focus patterns are calculated in memory on the device.
4. The interface renders concise summaries, semantic tables, and approved visualizations.
5. Aggregates are not uploaded, logged, or shared. They can always be recalculated from local records.

### 8. Export flow

1. The user requests JSON backup or CSV history.
2. Pomorise reads the necessary IndexedDB stores and versioned preferences.
3. A project-owned serializer creates a documented export schema.
4. Zod validates the outgoing structure as a final integrity check.
5. The browser creates a `Blob` and local download URL.
6. The user chooses where to save the file.
7. The export is not uploaded. Pomorise records only the local export time after a successful download attempt.

### 9. Import flow

1. The user selects a file through the browser file picker.
2. Pomorise reads the file locally and treats every value as untrusted input.
3. File size, JSON syntax, schema version, field types, limits, identifiers, and timestamps are validated.
4. The interface previews counts and explains whether data will merge or replace existing records.
5. Nothing changes until the user confirms.
6. A single IndexedDB transaction applies the import so a failure cannot leave a half-imported database.
7. A post-import integrity check runs before success is reported.

### 10. Deletion flow

- **Delete history:** Remove sessions, distractions, and reflections while preserving chosen preferences and current tasks only if the confirmation says so.
- **Reset preferences:** Restore defaults without touching history.
- **Delete everything:** Clear all personal IndexedDB stores and Pomorise preferences, then verify that record counts are zero.
- **Reset offline application:** A separate troubleshooting action may clear application caches and unregister the service worker. Cached app files are not personal records and should not be confused with deleting focus data.

### 11. Offline and update flow

1. The service worker precaches the approved application shell and locally bundled assets.
2. Personal records stay in IndexedDB and are not copied into Cache Storage.
3. The app continues to read and write local records without a network connection.
4. When a new build is available, Pomorise prompts the user rather than forcing a reload during an active session.
5. Before activating a breaking data migration, the new application verifies schema compatibility.
6. An update failure leaves the previous usable cached build available where browser behavior permits.

### 12. Notification and audio flow

1. Sound uses bundled audio files or the Web Audio API and never streams from a remote provider.
2. Notification permission is requested only after the user enables notifications or performs an action that clearly needs them.
3. Timer completion uses local state to trigger an in-browser sound and, where supported and permitted, a notification.
4. Pomorise never promises a guaranteed notification after the browser or operating system has fully closed the app.
5. No push server, device token, or remote notification service is used.

## Data boundaries and invariants

The following rules must remain true throughout implementation:

- Personal records never appear in network request bodies, query strings, URLs, analytics events, or build logs.
- Service-worker caches contain application assets only, never tasks, reflections, or history.
- Runtime libraries are bundled into `dist`; they do not load scripts from a CDN.
- External learning links create a network request only after the user chooses to open them.
- User-generated text is rendered through React text nodes, not injected as raw HTML.
- Import data is untrusted until validation completes.
- Storage migrations are versioned, tested, and transactional where the browser API permits.
- Progress values are derived locally and can be rebuilt from source records.
- The timer’s stored state changes on meaningful transitions, not every visual tick.
- Deletion controls state their exact scope and verify the outcome.
- No API keys or private secrets are needed in the browser bundle.
- Any future feature that crosses the device boundary requires a new explicit privacy decision.

## Quality standard

Pomorise will earn trust through details:

- Accurate timer behavior after sleep, refresh, tab throttling, and clock changes
- Keyboard, screen-reader, touch, and reduced-motion accessibility
- Strong contrast and visible focus states
- Clear empty, loading, success, and error states
- Fast startup and a small production bundle
- Mobile layouts that feel designed rather than compressed
- No accidental data loss during schema upgrades
- No uncaught errors during normal use
- Plain-language privacy explanations
- No network requests beyond loading the static application itself

## Delivery sequence

### 1. Confirm behavior and scope

Settle the remaining timer, task, reflection, progress, sound, and visual details.

### 2. Approve the design direction

Choose the personality, layout, color, typography, interaction style, and visual progress concept.

### 3. Establish the application foundation

Create the React, TypeScript, and Vite application, configure the GitHub Pages base path, and add the first tests.

### 4. Build the focus loop

Implement the timer, intention, distraction inbox, guided break, reflection, and private progress experience.

### 5. Add local persistence and privacy controls

Implement IndexedDB, settings storage, migrations, export, import, deletion, and transparent privacy messaging.

### 6. Make it installable and offline

Add the manifest, service worker, caching rules, update experience, and offline verification.

### 7. Verify and publish

Test critical behavior, accessibility, responsive layouts, privacy constraints, production builds, and the public GitHub Pages deployment.

## Out of scope

The following capabilities do not fit the confirmed privacy model:

- User accounts or sign-in
- Cloud storage or cross-device synchronization
- Server-side session history
- Advertising or behavioral analytics
- Session replay or fingerprinting
- Public profiles, leaderboards, or shared focus rooms
- Integrations that require sending personal task or focus data to external services
- Website blocking from the normal Pomorise web page

These items remain out of scope unless the project owner explicitly changes the privacy direction.

## Open product decisions

- Exact automatic-transition behavior
- Default long-break frequency
- Maximum and minimum custom durations
- Whether stopwatch mode belongs in Version 1
- The right level of task detail
- Which guided break activities are included
- Which progress visualization best expresses “rise”
- Which ambient sounds are genuinely useful
- Visual direction and brand personality
- Whether exported backups are encrypted by an optional user passphrase

## Fact-check and sanity-check record

| Verification information | Value |
| --- | --- |
| Last verified | August 15, 2026 at 11:22 PM EDT |
| Verification scope | Browser storage, persistence, private browsing, offline and background limits, GitHub Pages privacy boundary, deployment assumptions, intended tools, and proposed data flow |
| Source standard | Current primary documentation from MDN, GitHub, React, Vite, and any selected library’s official documentation |
| Result | The plan is technically coherent for a static, local-first application. Limitations are stated explicitly rather than hidden. |

The plan passed the following sanity checks:

- **Hosting fit:** Every Version 1 feature can run as static client-side code on GitHub Pages.
- **Privacy fit:** No approved feature requires an application account, server database, analytics service, or remote user-data transfer.
- **Storage fit:** Small preferences suit `localStorage`; growing structured records suit IndexedDB; offline application files suit the Cache API.
- **Data-loss honesty:** Export, import, deletion, private browsing, eviction, and device-local limitations are included.
- **Background honesty:** Offline access is achievable, but a guaranteed alarm after complete closure is not promised.
- **Security fit:** User-generated text remains local and will be rendered as text, not executable markup.
- **Deployment fit:** Vite can produce the `dist` artifact expected by the GitHub Pages workflow.
- **Tooling fit:** Confirmed and planned tools have a defined purpose, an official source, and no required runtime data service.
- **Data-flow fit:** Personal records remain inside browser-controlled storage or explicit user-created export files.

Fact-checking is continuous. Before implementation, dependency choices and browser-support targets must be verified again. Before release, the built application must be checked for unexpected network requests, storage behavior, accessibility, offline behavior, and accurate privacy wording.

## Glossary

- **Cache API:** Browser storage designed for network request and response pairs, commonly used by service workers to support offline loading.
- **Artifact:** The packaged build output passed from continuous integration to a deployment system.
- **Client-side:** Work performed on the visitor’s device by the browser rather than on an application server.
- **Dexie:** An optional JavaScript wrapper that simplifies IndexedDB access, queries, schema versions, and migrations.
- **GitHub Pages:** GitHub’s static website hosting service and the confirmed home for Pomorise.
- **IndexedDB:** An asynchronous browser database for structured, queryable local data.
- **Local-first:** A product model in which personal data is created, read, and stored on the user’s device by default.
- **`localStorage`:** A synchronous browser key-value store suitable for small preferences, not growing structured history.
- **Origin:** The combination of scheme, host, and port that browsers use to isolate one website’s storage from another.
- **Persistent storage:** Browser storage that has received stronger protection from automatic eviction. The user can still remove it.
- **Progressive web app (PWA):** A website enhanced with installable and offline-capable behavior through a web app manifest and, commonly, a service worker.
- **Service worker:** A browser-managed worker that can intercept requests and support caching and some background events. It does not run continuously.
- **State machine:** A model that limits the timer to defined states and valid transitions, such as idle, running, paused, completed, and skipped.
- **Static hosting:** Hosting that serves prebuilt files without running a private application server for each request.
- **Telemetry:** Data sent from an application to its operator about usage, performance, or behavior. Pomorise will not add application telemetry.
- **Transaction:** A group of database operations that succeeds or fails as one unit where the storage engine supports it.
- **Validation:** Checking unknown data against explicit rules before the application trusts or stores it.
- **Schema migration:** A versioned change that safely transforms stored data when the application’s record structure evolves.
- **Zod:** A TypeScript-oriented runtime validation library planned for checking imports and persistence boundaries.

## Further reading

- [MDN: Client-side storage](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_APIs/Client-side_storage)
- [MDN: Using IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
- [MDN: Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [MDN: Storage quotas and eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- [MDN: What is a progressive web app?](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/What_is_a_progressive_web_app)
- [MDN: Offline and background operation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation)
- [GitHub: GitHub Pages documentation](https://docs.github.com/en/pages)
- [GitHub: General Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)
- [Vite: Deploying a static site](https://vite.dev/guide/static-deploy.html)
- [React: Adding interactivity](https://react.dev/learn/adding-interactivity)
- [Dexie: Official API reference](https://dexie.org/docs/API-Reference)
- [TypeScript documentation](https://www.typescriptlang.org/docs/)
- [Zod documentation](https://zod.dev/)
- [Vite PWA plugin guide](https://vite-pwa-org.netlify.app/guide/)
- [Vitest guide](https://vitest.dev/guide/)
- [React Testing Library introduction](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright documentation](https://playwright.dev/docs/intro)
- [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing)

## Maintenance rules

1. Preserve the local-first privacy promise when evaluating every feature.
2. Treat any new network request as a product decision that requires explicit review.
3. Keep proposals separate from confirmed scope.
4. Update the document timestamp, reading time, and table of contents when the plan changes.
5. Keep the writing engaging, clear, and free of em dashes.
6. Record scope changes in `meta_thinking.md` and committed changes in `changelog.md`.
7. Fact-check technical and privacy claims against current primary documentation before approval and release.
8. Add links near consequential claims and keep **Further reading** current.
9. Update the glossary whenever a specialized term enters the plan.
10. Record the verification date, scope, sources, and result after each substantial fact-check.
11. Keep every intended tool in a table with its category, status, role, selection reason, privacy review, and official link.
12. Update the data-flow section whenever storage, networking, export, deletion, offline, or deployment behavior changes.
