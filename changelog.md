# Pomorise Commit Changelog

| Document information | Value |
| --- | --- |
| Created | August 15, 2026 at 10:36 PM EDT |
| Last updated | August 20, 2026 at 6:15:50 PM EDT |
| ISO 8601 last updated | `2026-08-20T18:15:50-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Estimated reading time | 42 minutes |
| Verification status | Commit facts checked against local Git history; technical claims checked against linked primary documentation |

Every commit moves Pomorise somewhere. This changelog tells that story in chronological detail, capturing the purpose, files, behavior, implementation choices, validation, and follow-up behind each step.

The newest commit should be added at the top of the **Commit history** section.

## Table of contents

- [Entry template](#entry-template)
- [Commit history](#commit-history)
  - [Pending: Prepare First Light release verification](#pending-prepare-first-light-release-verification)
  - [Pending: Establish Phase 6 offline experience and quality hardening](#pending-establish-phase-6-offline-experience-and-quality-hardening)
  - [Pending: Begin Phase 5 local data and privacy controls](#pending-begin-phase-5-local-data-and-privacy-controls)
  - [Pending: Establish Phase 4 complete focus loop](#pending-establish-phase-4-complete-focus-loop)
  - [Pending: Establish Phase 3 reliable timer engine](#pending-establish-phase-3-reliable-timer-engine)
  - [Pending: Establish Phase 2 design system and application shell](#pending-establish-phase-2-design-system-and-application-shell)
  - [`cd5cbde`: Establish Phase 1 foundation and guardrails](#cd5cbde-establish-phase-1-foundation-and-guardrails)
  - [Pending: Consolidate verification into one final suite](#pending-consolidate-verification-into-one-final-suite)
  - [Pending: Establish beginner-focused development documentation](#pending-establish-beginner-focused-development-documentation)
  - [`00c4ec9`: Establish screenshot-backed test reporting](#00c4ec9-establish-screenshot-backed-test-reporting)
  - [`554be76`: Define seven-phase implementation plan](#554be76-define-seven-phase-implementation-plan)
  - [`4add167`: Approve light and dark Pomorise logos](#4add167-approve-light-and-dark-pomorise-logos)
  - [`6fb739a`: Confirm the First Light development toolset](#6fb739a-confirm-the-first-light-development-toolset)
  - [`cecd97e`: Name Pomorise 1.0 First Light](#cecd97e-name-pomorise-10-first-light)
  - [`dac259b`: Add new functionality and refine existing behavior](#dac259b-add-new-functionality-and-refine-existing-behavior)
  - [`7753811`: Prepare Vite deployment for GitHub Pages](#7753811-prepare-vite-deployment-for-github-pages)
  - [`562126d`: Refine project documentation and collaboration tracking](#562126d-refine-project-documentation-and-collaboration-tracking)
  - [`fce4b4b`: Initial push](#fce4b4b-initial-push)
  - [`01d529e`: Add GitHub Actions workflow for static site deployment](#01d529e-add-github-actions-workflow-for-static-site-deployment)
  - [`7cd737a`: Initial commit](#7cd737a-initial-commit)
- [Glossary](#glossary)
- [Further reading](#further-reading)
- [Maintenance rules](#maintenance-rules)

## Entry template

```markdown
### `<short hash>`: Commit title

- **Date:** YYYY-MM-DD HH:MM (timezone)
- **Author:** Name
- **Full commit:** `<full hash>`

#### Purpose

Tell the story behind the change. What problem did it solve, or what possibility did it unlock?

#### Decision context

Capture the requirement, discussion, issue, or constraint that led to this commit. Explain why this change was the right next step.

#### Changes

- Describe each meaningful change in concrete terms.

#### Files affected

- `path/to/file`: what changed and why

#### User-visible impact

Describe what a visitor or maintainer will notice. Write “None” when the change stays entirely behind the scenes.

#### Decisions and tradeoffs

- Record the important choices made in this commit.
- Note alternatives that were considered and why they were not chosen.

#### Risks and limitations

- Describe known limitations, compatibility concerns, or areas that deserve extra care.

#### Validation

- Checks, tests, builds, or manual verification performed

#### Lessons learned by the agent

- Record what the agent learned while completing this commit and how that lesson should influence future work.
- Write “No agent lesson was recorded for this commit” when appropriate.

#### Lessons learned by the user

- Record only lessons the project owner explicitly shared or confirmed.
- Write “No user lesson was recorded for this commit” rather than guessing.

#### Related references

- Link related discussions, issues, pull requests, documentation, or commits when available.

#### Follow-up

- Remaining work, risks, or “None”
```

## Commit history

### `Pending`: Prepare First Light release verification

- **Status:** Release-candidate implementation prepared for the Phase 7 evidence run
- **Prepared:** 2026-08-20 18:15 EDT
- **Author:** Aman Ali with Codex collaboration
- **Full commit:** Assigned after the release-candidate commit is created

#### Purpose

Close the remaining Phase 5 implementation gap, fix issues exposed by cross-browser and visual review, and make the Pages workflow enforce release quality before publication.

#### Changes

- Added an atomic IndexedDB version-one to version-two migration that preserves older task wording and fills newly required fields.
- Added exact-scope preference reset while preserving focus data.
- Added production-browser coverage for migration, restart persistence, safe import, derived restoration, deletion scopes, declined persistent storage, and first-screen action visibility.
- Prevented delayed workspace saves from racing with import and deletion through a synchronous persistence epoch.
- Prevented startup hydration from overwriting immediately entered planning text by keeping structured inputs disabled until local loading completes.
- Improved desktop and mobile first-screen hierarchy so the timer action remains visible at release viewports.
- Removed the non-actionable offline-ready toast that obscured core controls while preserving offline and update guidance.
- Expanded the Pages workflow to gate deployment on formatting, linting, unit/component tests, and Chromium/Firefox browser tests.

#### Validation

- Formatting, strict types, linting, build, and focused responsive cases passed.
- Ten local-data cases passed across Chromium and Firefox after correcting the persistence race that Firefox exposed.
- Visual browser review covered light and dark themes, 390 by 844 mobile, 1440 by 900 desktop, settings, data ownership, navigation, and primary-action visibility.

#### Follow-up

Run the clean comprehensive suite, publish through the strengthened workflow, verify the public URL, retain the report and screenshots, and publish First Light release notes.

### `Pending`: Establish Phase 6 offline experience and quality hardening

- **Status:** Prepared for the next owner commit
- **Prepared:** 2026-08-20 18:00 EDT
- **Author:** Aman Ali with Codex collaboration
- **Full commit:** Assigned after the commit is created

#### Purpose

Make Pomorise installable and resilient offline while keeping updates consentful, caches free of personal data, failures recoverable, and the production bundle inside its approved budgets.

#### Changes

- Activated a generated app-shell service worker with no runtime data caching.
- Added the manifest, compact identity icons, theme metadata, offline readiness, connectivity status, and consent-only update controls.
- Added root error recovery, local-storage retry, and notification denial or failure handling.
- Optimized header artwork and added offline, cache-privacy, permission, error-boundary, accessibility, network, and responsive verification.
- Marked the Phase 6 implementation gate ready for the comprehensive Phase 7 suite.

#### Validation

- Formatting, strict TypeScript, ESLint, 26 Vitest tests, and the production build passed.
- The first browser run found an incorrect service-worker control assertion; the test was corrected to reload once after installation before switching offline.
- The final production-style browser rerun passed all 10 cases.

#### Follow-up

Run the comprehensive Phase 7 release suite, including the supported-browser and assistive-technology matrix, throttled performance measurements, artifact audit, deployment, and public-site smoke tests.

### `Pending`: Begin Phase 5 local data and privacy controls

- **Status:** In progress for the next owner commit
- **Prepared:** 2026-08-20 17:33 EDT
- **Author:** Aman Ali with Codex collaboration
- **Full commit:** Assigned after the commit is created

#### Purpose

Replace fragile transient data and header presentation with a durable local-first foundation and a clearer user-controlled privacy experience.

#### Changes

- Rebuilt the header lockup from an approved cropped symbol and responsive live text.
- Added a versioned Dexie database with separate task, session, distraction, reflection, and metadata stores.
- Added Zod validation, transactional hydration and persistence, JSON backup, CSV export, import preview and replacement, verified deletion, diagnostics, and persistent-storage explanation.
- Added a two-destination Settings experience for preferences and Data & privacy.
- Added pure backup validation and CSV escaping tests plus targeted real-browser visual inspection.

#### Follow-up

Phase 5 remains in progress. Migration coverage, preference reset, and comprehensive browser scenarios are still required.

### `Pending`: Establish Phase 4 complete focus loop

- **Status:** Prepared for the next owner commit
- **Prepared:** 2026-08-20 17:17 EDT
- **Author:** Aman Ali with Codex collaboration
- **Full commit:** Assigned after the commit is created

#### Purpose

Complete the journey around Pomorise's reliable timer by connecting planning, uninterrupted capture, post-session review, breaks, reflection, and private progress, while correcting the header identity issues identified by the project owner.

#### Changes

- Replaced the loose intention placeholder with controlled, bounded planning state that remains optional before a session.
- Added a pure focus-plan reducer for up to five tasks, one-to-eight-session estimates, current-task selection, and completion.
- Added accessible native task entry, estimate, selection, and completion controls beside the timer.
- Rendered visitor-authored task wording through React text interpolation and never through raw HTML.
- Added deterministic reducer coverage and a component journey for intention, task creation, automatic first selection, and completion.
- Added a theme-aware mask beneath the wordmark so the raster tagline is fully hidden before the readable text replacement is painted.
- Added coordinated light and dark header assets with a dominant continuous bowl-to-stem silhouette so the left symbol reads clearly as a lowercase `p` at compact size.
- Added one-step distraction capture during focus and post-session convert, keep, and dismiss review choices.
- Added task completion and idempotent carry-forward credit at the reflection boundary.
- Added quiet breaks and local guided breathing, stretching, hydration, eye-rest, and movement prompts.
- Added a fully skippable reflection with completed minutes, next step, optional rating, and optional notes.
- Added unique in-memory session records, deterministic daily and trailing-week summaries, and a semantic rise-progress treatment.
- Connected Timer, Tasks, and Progress navigation to real focus destinations without adding a wizard.
- Preserved post-focus review when automatic flow is enabled, then starts the break after reflection is saved or skipped.
- Marked Phase 4 implementation-complete while keeping durable journey persistence assigned to Phase 5.

#### User-visible impact

Visitors can now move through the complete focus loop from optional planning to capture, review, reflection, guided or quiet break, and private progress. The header shows exactly one clean tagline and an unmistakable lowercase `p` symbol in both themes.

#### Decisions and tradeoffs

- Planning and timer transitions remain separate pure boundaries so task changes cannot affect timestamp accuracy.
- The list is capped at five tasks and estimates at eight sessions to preserve a focused aid rather than introduce project-management weight.
- The first task becomes current automatically, while later task selection stays explicit.
- Journey data remains transient because versioned browser storage, migrations, and privacy controls belong to Phase 5.
- A CSS mask preserves the approved raster asset and its descending symbol geometry while fully covering only the baked-in wordmark tagline.
- The refined header assets preserve the established wordmark, tagline, sunrise, timer segments, and palette while making the requested `p` recognition explicit.
- Completion timestamps uniquely identify session records, making repeated effect requests safe and progress calculations deterministic.
- Quiet break behavior is the default, every reflection field is optional, and no summary uses streak or punishment language.

#### Risks and limitations

- Refreshing or closing the page clears Phase 4 journey data until Phase 5 adds durable local records.
- Comprehensive keyboard, touch, completion-variant, and accessibility evidence remains queued for Phase 7.

#### Validation

- Prettier formatting checks and ESLint passed.
- Strict TypeScript and the Vite production build passed.
- Twenty-two Vitest unit and component tests passed.
- Five Chromium cases passed, including the same-origin privacy boundary, automated accessibility scan, timer recovery, theme persistence, and 320-pixel reflow.
- Real-browser light and dark 390-pixel screenshots confirmed one clean tagline, a clear `p`, and responsive focus controls.

#### Follow-up

- Begin Phase 5 with versioned local data, migrations, validation, export, import, and deletion.
- Repeat the complete focus journey through the comprehensive Phase 7 browser and accessibility suite.

### `Pending`: Establish Phase 3 reliable timer engine

- **Status:** Prepared for the next owner commit
- **Prepared:** 2026-08-20 16:50 EDT
- **Author:** Aman Ali with Codex collaboration
- **Full commit:** Assigned after the commit is created

#### Purpose

Turn Pomorise's static timer surface into a deterministic, recoverable, accessible timer whose elapsed seconds remain tied to real timestamps rather than callback frequency.

#### Changes

- Added focus, short-break, and long-break modes with 25, 5, and 15 minute defaults.
- Added idle, running, paused, completed, skipped, and overtime states with explicit legal events and rejected invalid transitions.
- Derived remaining and overtime values from timestamps while using a 250-millisecond interval only to refresh the visible display.
- Added meaningful-transition local persistence, Zod restoration checks, refresh recovery, immediate visibility refresh, and device-clock discontinuity choices.
- Added reset, start, pause, resume, add-time, skip, overtime, and next-session controls with restrained accessible announcements.
- Added 1-to-180-minute custom durations, optional automatic transitions, locally synthesized sound, and contextual notification permission.
- Added deterministic timer and storage tests plus a real-browser exact-second and refresh-recovery case.
- Derived tightly cropped header assets from the approved logos and restated the tagline at readable interface size after the owner identified its small presentation.
- Added the Phase 3 technical narrative and synchronized the implementation status.

#### User-visible impact

Visitors can now run and recover real focus and break timers, customize durations, add time, pause, skip, continue in overtime, choose manual or automatic flow, and opt into local completion alerts. The Pomorise tagline is clearer in desktop and mobile headers.

#### Decisions and tradeoffs

- Timestamp subtraction is authoritative; interval callbacks only request paint updates.
- Manual advancement remains the default because exact automatic flow remained an open product choice.
- Custom duration bounds are centralized at 1 to 180 whole minutes so they can be revised without changing transition logic.
- Active timer state uses small versioned localStorage data in Phase 3; structured session history remains Phase 5 work.
- A monotonic comparison detects clock changes while ordinary browser throttling catches up from the wall-clock target.

#### Risks and limitations

- Browser sound and notifications remain subject to browser and operating-system policies.
- A closed browser cannot guarantee completion delivery.
- Session history and reflection records are not created until later phases.
- Device sleep and simulated clock changes remain mapped to the comprehensive Phase 7 manual suite.

#### Validation

- Fourteen Vitest unit and component tests passed.
- Five Chromium browser cases passed, including the exact one-second assertion, reload recovery, privacy boundary, axe scan, and 320-pixel layout.
- Strict TypeScript and the Vite production build passed.
- Desktop and mobile header presentation were inspected in real-browser screenshots.

#### Follow-up

- Begin Phase 4 with the complete focus loop on the stable timer boundary.
- Repeat the full timer matrix and manual sleep and clock-change cases in Phase 7.

### `Pending`: Establish Phase 2 design system and application shell

- **Status:** Prepared for the next owner commit
- **Prepared:** 2026-08-20 14:10 EDT
- **Author:** Aman Ali with Codex collaboration
- **Full commit:** Assigned after the commit is created
- **Expected files:** Theme provider, project-owned UI primitives, responsive shell, design tokens, appearance and writing-style tests, and synchronized phase documentation

#### Purpose

Turn the approved Pomorise identity into a calm, reusable, responsive interface foundation before reliable timer behavior and focus-loop features arrive.

#### Decision context

Phase 1 closed with Phase 2 as the next eligible phase. The implementation plan required approved light and dark identity, project-owned accessible controls, explicit local theme preference, responsive desktop and mobile layout, reduced-motion behavior, clear interaction states, and acceptance cases queued for Phase 7. During the work, the project owner also clarified that website text and source code must contain no em dashes.

#### Changes

- Added system, light, and dark theme state with safe localStorage validation and persistence.
- Added semantic button, card, field, segmented-control, notice, and native-dialog primitives.
- Replaced the foundation proof with a timer-first application shell, supporting panels, mobile navigation, settings, and honest future-feature boundaries.
- Defined semantic light and dark color tokens plus spacing, radius, shadow, motion, focus, disabled, status, and layer tokens.
- Added reduced-motion handling, keyboard focus, touch-sized targets, hover and active states, empty states, and permission guidance.
- Added component and browser acceptance cases for theme choice, reload persistence, network boundaries, axe findings, and 320 pixel reflow.
- Removed the requested punctuation from website source and added a Unicode code-point guard to prevent its return.
- Corrected a real-browser mobile overflow caused by a root minimum width and expanded native radio hit targets to cover their complete visible segments.
- Added the Phase 2 development narrative and updated phase status records.

#### Files affected

- `src/components/ThemeProvider.tsx`: New appearance preference, system detection, resolved theme, and safe local persistence boundary.
- `src/components/ui.tsx`: New project-owned semantic component primitives.
- `src/app/App.tsx`: New responsive shell and truthful shell-stage interactions.
- `src/styles/global.css`: Complete theme tokens, component states, responsive layout, focus, and motion system.
- `src/main.tsx`: Wraps the application in the shared theme provider.
- `src/tests/setup.ts`: Adds deterministic jsdom shims for media queries and native dialog methods.
- `src/tests/component/App.test.tsx`: Covers identity, empty states, boundary feedback, settings, persistence, and logo selection.
- `src/tests/browser/network-boundary.spec.ts`: Adds real-browser theme and compact-layout cases while retaining privacy and axe checks.
- `src/tests/unit/writing-style.test.ts`: Guards project-owned website source and code from forbidden punctuation.
- `index.html`: Adds a temporary local browser icon from the approved identity assets.
- `README.md`, `implementation_plan.md`, `src/components/README.md`, `development_docs/README.md`, and `development_docs/phase-02-design-system-shell/doc.md`: Record the Phase 2 architecture, status, and continuation path.

#### User-visible impact

Visitors now see a refined Pomorise workspace instead of a foundation proof. They can choose system, light, or dark appearance in an accessible settings dialog, reload without losing an explicit choice, use the shell at compact mobile widths, and understand which controls are not available until later phases.

#### Decisions and tradeoffs

- Native HTML behavior was retained beneath bespoke visual styling.
- Semantic color tokens were chosen instead of component-specific light and dark values.
- A system font stack was chosen instead of a remote or newly bundled display font.
- Theme preference uses localStorage because it is a small non-sensitive preference; structured personal records still wait for Dexie in Phase 5.
- Incomplete timer and task behavior remains disabled or explanatory instead of being simulated.
- The approved full-size PNG serves as a temporary local icon; final icon geometry remains Phase 6 hardening.

#### Risks and limitations

- The timer display is static until Phase 3.
- Intention text, tasks, and progress are not persisted or calculated.
- The source logo PNGs are large and require later release-asset hardening.
- Targeted checks support implementation but do not replace the comprehensive Phase 7 evidence record.

#### Validation

- Formatting, strict TypeScript, and zero-warning lint checks succeeded.
- Two unit cases and three component cases succeeded.
- The production build succeeded under the repository base path.
- Four Chromium browser cases succeeded, including same-origin loading, axe analysis, theme reload persistence, and 320 pixel overflow detection.
- Manual browser inspection covered desktop hierarchy, mobile reflow, the settings dialog, dark theme selection, and native radio target behavior.
- A repository search found no em dashes outside ignored generated and dependency paths.

#### Lessons learned by the agent

- A minimum width on the root element can create horizontal scrolling when a classic vertical scrollbar reduces the layout viewport. Future responsive checks should compare client and scroll widths at the smallest supported size.
- A visually hidden native input must retain a reliable full-label hit target. Semantic markup alone does not guarantee that a browser automation pointer can activate the intended control surface.

#### Lessons learned by the user

- The project owner explicitly clarified that em dashes are unwanted in website text and source code and asked for that preference to be checked now or in Phase 7. The implementation now enforces it immediately and maps it forward.

#### Related references

- Phase plan: `implementation_plan.md`
- Technical narrative: `development_docs/phase-02-design-system-shell/doc.md`
- Product direction: `project_plan.md`

#### Follow-up

- Begin Phase 3 with the reliable timestamp-based timer engine.
- Retain the no-em-dash guard and include it in the final comprehensive suite.
- Optimize final icon and application asset geometry during Phase 6.

### `cd5cbde`: Establish Phase 1 foundation and guardrails

- **Date:** 2026-08-20 13:53 EDT
- **Author:** Aman Ali with Codex collaboration
- **Full commit:** `cd5cbdefde128a9e457bde0e7741982b6e7016d0`
- **Change size:** Recorded in local Git history

#### Purpose

Turn the approved documentation-only direction into the smallest trustworthy application foundation that later Pomorise features can build upon.

#### Decision context

The project owner explicitly requested that Phase 1 begin and added a requirement to ignore unnecessary local files so they are not uploaded. The existing seven-phase plan already fixed React, TypeScript, Vite, GitHub Pages, strict quality tools, local-only runtime behavior, exact dependencies, and line-by-line beginner comments.

#### Changes

- Added exact runtime and development dependencies with a generated npm lockfile and compatible license review.
- Added strict TypeScript, typed ESLint, scoped Prettier, Vitest, Testing Library, user-event, Playwright, and axe configuration.
- Added reproducible development, formatting, lint, type, unit, component, browser, build, and preview commands.
- Added a minimal semantic Pomorise React shell using the approved light and dark logo assets and local CSS.
- Added unit, component, browser-origin, and automated accessibility specifications.
- Reserved clear source boundaries for components, timer logic, local data, schemas, styles, assets, and test layers.
- Configured Vite for the `/pomorise/` GitHub Pages path while preserving the existing guarded deployment workflow.
- Added `.gitignore` coverage for dependencies, builds, generated test artifacts, local environment variants, logs, caches, editor state, and operating-system noise.
- Added package and TypeScript companion annotations, dependency review, browser targets, and performance budgets.
- Added the complete Phase 1 development narrative and synchronized project status documents.

#### User-visible impact

Visitors can see a deliberately minimal branded foundation page and reveal a short Phase 1 status message. It is not the final application shell or timer.

#### Decisions and tradeoffs

- Installed the complete confirmed direct toolset at exact versions but deferred Dexie, Zod, and PWA activation to their owning phases.
- Preserved the existing GitHub Pages workflow instead of replacing a compatible deployment boundary.
- Scoped Prettier to application and Phase 1 technical files so implementation does not rewrite long-form project history mechanically.
- Began Playwright with Chromium while documenting the cross-browser and manual matrix for later comprehensive verification.

#### Risks and limitations

- The approved source logos are large and need measured delivery review before release.
- npm currently reports a transitive `glob` deprecation warning even though the dependency audit reports zero known vulnerabilities.
- The public Pages site, additional browsers, assistive technologies, and release performance profile remain Phase 7 evidence work.

#### Validation

- `npm ci` recreated 508 packages from the committed lockfile.
- Formatting, ESLint with zero warnings, and strict TypeScript diagnostics completed.
- Two Vitest files with three total assertions completed.
- Vite created `dist` with a 60.30 kB gzip JavaScript bundle and fingerprinted local assets.
- Two Chromium diagnostics completed against `/pomorise/`, finding no unexpected origin and no serious or critical axe violation.
- `git status --ignored` confirmed `node_modules`, `dist`, Playwright reports, and browser results remain untracked.

#### Lessons learned by the agent

- Test runner discovery must be explicit when multiple frameworks share one source tree. Vitest's include rules now prevent it from importing Playwright fixtures.
- Localhost browser tests may require explicit workspace permission even when the application server itself starts successfully.

#### Lessons learned by the user

- The project owner emphasized that unnecessary generated and machine-local files must not be uploaded.

#### Related references

- `implementation_plan.md`: Phase 1 scope and exit gate
- `development_docs/phase-01-foundation/doc.md`: beginner-focused system explanation and acceptance mapping
- `dependency_review.md`: exact versions, roles, and licenses
- `quality_baseline.md`: browser and performance release targets

#### Follow-up

- Begin Phase 2 only after accepting this implementation-ready closeout.
- Re-audit the transitive warning and measure image delivery before the release gate.

### `Pending`: Consolidate verification into one final suite

- **Status:** Prepared for the next commit
- **Prepared:** 2026-08-20 13:21 EDT
- **Author:** Aman Ali with Codex collaboration
- **Full commit:** Assigned after the commit is created
- **Expected files:** Every project Markdown document

#### Purpose

Reduce repeated execution and reporting overhead by implementing all seven phases first and running one comprehensive verification suite in Phase 7.

#### Decision context

The project owner observed that separate full suites after every phase would repeat integrated checks and consume additional time and tokens. They approved one final suite, while retaining authored test coverage during development and allowing lightweight targeted diagnostics when needed to unblock implementation.

#### Changes

- Changed Phases 1 through 6 from separate evidence gates to implementation-readiness gates.
- Kept phase-specific acceptance criteria and required their coverage to be ready for the final suite.
- Assigned static, unit, component, browser, accessibility, privacy, storage, offline, responsive, performance, build, deployment, and public-site checks to Phase 7.
- Replaced per-phase test-report directories with `testreports/final-comprehensive-suite/test_report.md`.
- Updated the report and development-document templates for many-to-one traceability between phase narratives and final evidence.
- Preserved earlier discussion and changelog entries as historical decisions and recorded this policy as their explicit successor.
- Synchronized all Markdown instructions, indexes, definitions, timestamps, and current decision summaries.

#### User-visible impact

There is no application interface change. The implementation workflow now performs one complete verification and reporting pass at release time, reducing repeated work while keeping final coverage requirements intact.

#### Risks and controls

- Defects may be discovered later because full suites no longer run at every phase boundary. Tests are still authored with each implementation unit, and targeted diagnostics remain available for blockers or uncertain behavior.
- A single suite can produce a large report. Cases remain grouped by phase and requirement so failures are traceable to the responsible development document.
- Integration failures may affect several phases. The final report preserves failures, fixes, and retests without erasing history.

#### Validation

- Confirmed there is one formal implementation-plan file containing seven phases.
- Checked every Markdown file for active per-phase report instructions and replaced them with the final-suite policy.
- Preserved historical descriptions of superseded requirements in dated decision and commit records.
- Checked Markdown changes for whitespace errors and consistent `final-comprehensive-suite` paths.

#### Follow-up

- Create the comprehensive report directory from the updated template when Phase 7 verification begins.

### `Pending`: Establish beginner-focused development documentation

- **Status:** Prepared for the next commit
- **Prepared:** 2026-08-16 02:48 EDT
- **Author:** Aman Ali with Codex collaboration
- **Full commit:** Assigned after the commit is created
- **Expected files:** `README.md`, `changelog.md`, `development_docs/`, `implementation_plan.md`, `meta_thinking.md`, `project_plan.md`, and `testreports/`

#### Purpose

Preserve the complete technical story behind every meaningful Pomorise implementation unit so a beginner can understand what changed, why it was designed that way, how the system works, and where evidence supports the result.

#### Decision context

The project owner requested a new document set at `development_docs/<phase_or_run_or_step>/doc.md`. The goal is not another short change summary. It is an in-depth guide for beginners and new programmers covering development within a commit or step, including design method, system design, design decisions, assumptions, architecture, code responsibilities, and every other detail needed to continue confidently.

#### Changes

- Created `development_docs/README.md` as the navigation, naming, depth, traceability, lifecycle, and privacy guide.
- Created `development_docs/_template/doc.md` as the comprehensive reusable development narrative.
- Defined a direct distinction between product direction, implementation order, development explanation, test evidence, commit history, and conversation history.
- Required matching development documents and test reports to share the same stable identifier and cross-link.
- Added sections for learning outcomes, executive explanation, commit identity, prerequisites, user value, before-and-after behavior, goals, non-goals, constraints, and requirements traceability.
- Added a detailed design-method record and system-context, architecture, runtime, data-flow, and state-model sections.
- Added structured design decisions with options, rationale, tradeoffs, consequences, and reconsideration conditions.
- Added an assumption register with evidence, status, risk, and fallback plans.
- Added component, module, file, symbol, type, contract, schema, and validation walkthroughs.
- Added interface, accessibility, privacy, security, storage, migration, offline, update, error, recovery, performance, dependency, configuration, build, and deployment explanations.
- Added line-by-line comment coverage, companion annotation, testing, screenshot, rejected alternative, limitation, and technical-debt sections.
- Added a beginner reading order, complete synthetic example, learning exercises, common mistakes, debugging guide, and next-learning resources.
- Added a detailed documentation completion checklist.
- Updated the implementation phase closeout checklist and protocol to require development documents alongside test reports.
- Updated test-report navigation and templates to link paired development narratives.
- Synchronized the README, project plan, discussion record, and changelog.
- Resolved the previous pending test-reporting entry as commit `00c4ec9`.

#### Files affected

- `development_docs/README.md`: New chronological index and documentation governance guide.
- `development_docs/_template/doc.md`: New in-depth beginner-focused development document template.
- `implementation_plan.md`: Makes development narratives a binding implementation and phase-closeout requirement.
- `testreports/README.md`: Adds the explanation-and-evidence relationship to report navigation.
- `testreports/_template/test_report.md`: Adds the paired development document to report scope and closeout.
- `project_plan.md`: Adds development narratives to the project quality standard.
- `meta_thinking.md`: Records the request, intended depth, and pairing decision.
- `README.md`: Links the development documentation index and explains its purpose.
- `changelog.md`: Resolves the reporting commit and prepares this documentation-system entry.

#### User-visible impact

There is no application interface change. Future contributors will be able to move from a commit or phase to a complete beginner-friendly explanation of the design and then to the paired test evidence, without reconstructing the system from raw diffs.

#### Decisions and tradeoffs

- Development narratives are separate from test reports because intended design and observed evidence answer different questions.
- The same identifier connects both records and prevents explanation from drifting away from evidence.
- The template is intentionally comprehensive. Non-applicable sections remain with reasons instead of disappearing silently.
- Important decisions and changed assumptions remain in history rather than being rewritten to show only the final answer.
- The template uses project-owned structure while borrowing useful coverage ideas from C4, ADR, arc42, and Diátaxis references.
- Whole source files are not duplicated in the narrative. The document explains responsibilities and uses small excerpts only when they improve learning.

#### Risks and limitations

- Deep documentation requires time and disciplined synchronization with code.
- A large template can become mechanical if authors fill sections without explaining real evidence and tradeoffs.
- Incorrect architecture prose may mislead beginners even when line-level comments remain correct.
- Development documents will increase repository size, though less sharply than screenshot and trace evidence.
- The template does not replace source code, tests, browser evidence, or direct practice.

#### Validation

- Confirmed the required `development_docs/<phase_or_run_or_step>/doc.md` path appears consistently.
- Confirmed the index and template include timestamps, ISO timestamps, timezone, estimated reading time, table of contents, glossary, and further reading.
- Confirmed the template covers design method, system design, decisions, assumptions, requirements, architecture, flows, state, files, types, interface, accessibility, privacy, storage, errors, performance, dependencies, deployment, testing, alternatives, limitations, and beginner guidance.
- Confirmed development and test templates require matching identifiers and cross-links.
- Checked the documentation approach against primary C4, ADR, arc42, Diátaxis, and W3C references.
- Checked every populated Markdown file for required metadata, balanced code fences, required document sections, local links, and forbidden em dashes.
- Validated all external links.

#### Lessons learned by the agent

- Line-by-line comments explain local code intent, while a separate narrative is needed to teach architecture, tradeoffs, and system behavior.
- Pairing explanation and evidence with one identifier creates a clearer audit trail than placing both inside one oversized report.
- Assumptions deserve first-class records because many design errors begin when an unverified belief is treated as fact.

#### Lessons learned by the user

- The project owner explicitly wants development history to teach beginners and new programmers, not merely record changed files.
- The project owner specifically requires design method, system design, decisions, assumptions, and related development detail to be explained in depth.

#### Related references

- Development document index: `development_docs/README.md`
- Canonical development template: `development_docs/_template/doc.md`
- Paired evidence system: `testreports/README.md`
- [C4 model](https://c4model.com/)
- [Architectural Decision Records](https://adr.github.io/)
- [arc42 overview](https://arc42.org/overview/)
- [Diátaxis documentation framework](https://diataxis.fr/)

#### Follow-up

- Create the first real development narrative when Phase 1 or another meaningful implementation unit begins.
- Use the same identifier for its paired test report.
- Add every completed document to `development_docs/README.md`.
- Replace `Pending` with the commit hash while preparing the next meaningful change.

### `00c4ec9`: Establish screenshot-backed test reporting

- **Date:** 2026-08-16 02:37 EDT
- **Author:** Aman Ali
- **Full commit:** `00c4ec9e2f6102fcac4734d6d914a41858873a2b`
- **Change size:** 7 files changed, 881 lines added, 77 lines removed

#### Purpose

Make every phase and meaningful test run independently reviewable through explicit checklists, exact timestamps, raw logs, screenshots, case results, failure history, and evidence-based conclusions.

#### Decision context

The project owner asked whether each phase had a checklist that would be checked as work completed. They also required a highly detailed report with screenshots after every phase or run, stored at `testreports/<phase_or_run_or_step>/test_report.md`, plus a navigation README. They then clarified that test reports and all Markdown documents must carry dated timestamps and estimated reading times.

#### Changes

- Converted all seven phase validation lists into unchecked Markdown task lists.
- Added a mandatory phase closeout checklist that blocks completion when evidence is missing.
- Added a test-report standard covering scope, environment, commands, exit codes, cases, raw logs, screenshots, artifacts, failures, retests, risks, and conclusions.
- Required screenshots for browser-visible and command-only reports.
- Required synthetic data and sensitive-information review for screenshots, logs, traces, and artifacts.
- Defined stable report paths and evidence subdirectories for screenshots, logs, and machine-readable artifacts.
- Created `testreports/README.md` as the chronological navigation and governance index.
- Created `testreports/_template/test_report.md` as the detailed reusable report structure.
- Added report-specific sections for accessibility, responsiveness, themes, privacy, network activity, browser storage, offline behavior, updates, performance, and code-comment coverage.
- Added failure and retest history that preserves the original failing evidence.
- Required human-readable timestamps, timezone, estimated reading time, and ISO 8601 timestamps where exact values are known across Markdown documents.
- Synchronized the repository overview, product plan, implementation plan, decision record, and changelog.
- Resolved the previous pending implementation-plan entry as commit `554be76`.

#### Files affected

- `testreports/README.md`: New report navigation, naming, evidence, screenshot, logging, lifecycle, and privacy rules.
- `testreports/_template/test_report.md`: New detailed template for every future phase, run, or step report.
- `implementation_plan.md`: Adds checkable phase validations, report requirements, evidence rules, and closeout checklist.
- `project_plan.md`: Adds test-reporting and screenshot evidence to the product quality standard.
- `meta_thinking.md`: Records the checklist, reporting, screenshot, and metadata decisions.
- `README.md`: Links the public report index and summarizes the evidence promise.
- `changelog.md`: Resolves the implementation-plan commit and prepares this reporting entry.

#### User-visible impact

There is no application interface change. Future readers will be able to navigate from a phase or run to a detailed report and inspect what was tested, in which environment, with which commands, what failed, what was retried, and which screenshots support the conclusion.

#### Decisions and tradeoffs

- Phase validation uses unchecked task lists until direct evidence exists.
- A phase cannot be marked complete without a passing report and completed closeout checklist.
- Screenshots are mandatory even for command-only runs, which use a terminal or test-reporter capture.
- Screenshots supplement assertions and logs rather than replacing them.
- Failed evidence remains in history after a successful retest.
- Reports stay inside the repository instead of using an external reporting service, preserving the local and transparent project model.
- The reusable template is not an executed report and therefore contains instructions instead of fabricated screenshots or results.

#### Risks and limitations

- Detailed reports and screenshot evidence will increase repository size and testing time.
- Screenshots and traces can accidentally expose sensitive information if they are not reviewed carefully.
- A comprehensive template can become administrative overhead if reports are filled mechanically rather than from observed evidence.
- Browser screenshots show visible state but cannot replace assertions, raw output, accessibility review, or privacy inspection.

#### Validation

- Confirmed that each of the seven phases has a checkable **Required validation** list.
- Confirmed the mandatory closeout checklist covers scope, comments, automated tests, manual tests, logs, screenshots, privacy, failures, risks, document synchronization, and exit-gate evidence.
- Verified that the requested `testreports/<phase_or_run_or_step>/test_report.md` structure is documented consistently.
- Verified that the template includes human-readable and ISO timestamps, timezone, run duration, and estimated reading time.
- Checked screenshot and raw-log requirements against current Playwright and Vitest reporting documentation.
- Checked every populated Markdown document for metadata, table of contents, glossary, further reading, balanced code fences, and forbidden em dashes.
- Validated all external links and existing local document links.

#### Lessons learned by the agent

- A validation list becomes operational only when it can be checked and tied to durable evidence.
- Screenshot evidence needs captions, environment context, and test-case links to remain meaningful later.
- Preserving failures and retests in one history is more honest and useful than rewriting a report to show only the final pass.

#### Lessons learned by the user

- The project owner explicitly requires checklists to be checked after every phase.
- The project owner explicitly requires detailed timestamped reports with screenshots after every phase or run.
- The project owner requires dates, readable timestamps, and estimated reading times across all Markdown documents.

#### Related references

- Test report index: `testreports/README.md`
- Canonical report template: `testreports/_template/test_report.md`
- Phase and report rules: `implementation_plan.md`
- [Playwright screenshots](https://playwright.dev/docs/screenshots)
- [Playwright reporters](https://playwright.dev/docs/test-reporters)
- [Playwright trace viewer](https://playwright.dev/docs/trace-viewer-intro)
- [Vitest reporters](https://vitest.dev/guide/reporters)

#### Follow-up

- Create the first real report directory when the first implementation or test run begins.
- Add every completed report to `testreports/README.md`.
- Resolve the pending entry with the final commit hash. Completed in the development-documentation change.

### `554be76`: Define seven-phase implementation plan

- **Date:** 2026-08-16 02:23 EDT
- **Author:** Aman Ali
- **Full commit:** `554be76587fd8666dc8ef9edeb749effcbb6ec2b`
- **Change size:** 5 files changed, 668 lines added, 27 lines removed

#### Purpose

Turn the approved product direction into an executable development sequence with clear phase boundaries, validation gates, and a binding beginner-readability standard.

#### Decision context

The project owner first left a future reminder to create an implementation plan, choose the number of development phases, and require detailed comments. They later activated those tasks and explicitly confirmed that every code line must be commented. The project already contained a seven-step delivery direction, so the implementation plan formalizes seven engineering phases rather than creating a competing count.

#### Changes

- Created `implementation_plan.md` with document metadata, a table of contents, glossary, primary-source links, and a verification record.
- Fixed development at seven phases with a purpose, work list, validation list, and exit gate for each phase.
- Defined the phases as foundation, design shell, timer, focus loop, local data, offline hardening, and release publication.
- Added fixed architectural, privacy, testing, and deployment boundaries.
- Made adjacent beginner-friendly comments mandatory for every human-authored code line.
- Defined comment placement, content, review expectations, and an annotated TypeScript example.
- Defined companion Markdown annotations for strict JSON and other required formats that cannot safely contain comments.
- Added cross-phase testing responsibilities, phase closeout steps, and a risk-control table.
- Updated the repository overview to point readers to the seven-phase plan and its readiness state.
- Aligned the project plan’s delivery sequence and quality standard with the new implementation plan.
- Recorded the activated request and confirmed decisions in the discussion history.
- Resolved the previous pending logo entry as commit `4add167`.

#### Files affected

- `implementation_plan.md`: New detailed seven-phase execution plan and line-by-line commenting standard.
- `README.md`: Links the new plan and reflects readiness for Phase 1 when requested.
- `project_plan.md`: Aligns the delivery sequence, quality expectations, glossary, sources, and verification record.
- `meta_thinking.md`: Records the reminder, activation, phase count, and mandatory commenting decision.
- `changelog.md`: Resolves the logo commit and prepares this implementation-planning entry.

#### User-visible impact

There is no application interface change yet. Contributors now have one development sequence that identifies what to build, how to prove each phase is complete, and how thoroughly every code line must be explained for beginners.

#### Decisions and tradeoffs

- Seven phases balance meaningful engineering boundaries with the project owner’s desire to begin development soon.
- Exit gates are evidence-based and have no invented calendar estimates.
- The unusually detailed commenting requirement is accepted as a project-specific readability rule.
- Companion annotations preserve the rule’s teaching purpose when strict file formats would become invalid if comments were inserted directly.
- The implementation plan orders work without choosing unresolved product behavior on the owner’s behalf.

#### Risks and limitations

- Line-by-line comments will make source files substantially longer and require disciplined maintenance.
- Incorrect or stale comments could mislead beginners even when tests pass.
- Exact dependency versions, supported browsers, and measurable performance budgets remain installation-phase decisions.
- Some product behavior still requires explicit decisions before its implementation phase can close.

#### Validation

- Checked the phase sequence against the confirmed React, Vite, GitHub Pages, local storage, PWA, and testing architecture.
- Verified Vite’s documented `dist` output and repository base-path requirement for GitHub Pages.
- Verified that GitHub Pages custom workflows support built artifact deployment.
- Checked every phase for a purpose, work list, validation list, and exit gate.
- Checked the code-commenting rule for strict JSON, generated files, lockfiles, and binary assets.
- Verified tables of contents, glossaries, further-reading sections, timestamps, and estimated reading times.
- Checked all Markdown for formatting errors and forbidden em dashes.

#### Lessons learned by the agent

- A phase count is useful only when every phase has an observable exit gate.
- Literal line-by-line commenting needs an explicit policy for formats that reject comments.
- The existing seven-step project direction provided a sound backbone and prevented unnecessary replanning.

#### Lessons learned by the user

- The project owner explicitly confirmed that commenting every code line is mandatory for beginner readability.
- The project owner chose to activate implementation planning after initially preserving it only as a personal reminder.

#### Related references

- Detailed execution plan: `implementation_plan.md`
- Product direction: `project_plan.md`
- Conversation record: `meta_thinking.md`
- [Vite static deployment guide](https://vite.dev/guide/static-deploy.html)
- [GitHub Pages custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

#### Follow-up

- Resolve the remaining product behavior and visual-system decisions needed by their implementation phases.
- Begin Phase 1 only after the project owner requests implementation.
- Resolve the pending entry with the final commit hash. Completed in the test-reporting change.

### `4add167`: Approve light and dark Pomorise logos

- **Date:** 2026-08-15 23:45 EDT
- **Author:** Aman Ali
- **Full commit:** `4add1674379554b659a00812a2c63d9ccbe10027`
- **Change size:** 8 files changed, 149 lines added, 15 lines removed

#### Purpose

Give Pomorise a distinctive visual identity that connects focused time with steady progress, while providing coordinated assets for both light and dark interface themes.

#### Decision context

The project owner asked to see the logo idea as ASCII before image creation. The proposed construction combined a segmented timer ring, a rising sun and horizon, and a subtle lowercase `p`. After reviewing the generated light and dark variants, the project owner described them as perfect and approved their addition at exact production paths.

#### Changes

- Created an ivory light-mode logo with deep plum lettering and a warm coral and apricot sunrise.
- Created a midnight-violet dark-mode logo with pale lavender-white lettering and a luminous coral and apricot sunrise.
- Preserved matching geometry, wordmark, tagline, layout, and spacing across both variants.
- Added the approved assets at `assets/logos/light_mode.png` and `assets/logos/dark_mode.png`.
- Preserved the original concept renders in `assets/brand/concepts/` for design provenance.
- Added the approved logo construction, palette, paths, and implementation notes to the project plan.
- Recorded the request and explicit approval in the discussion history.
- Resolved the previous pending toolset entry as commit `6fb739a`.

#### Files affected

- `assets/logos/light_mode.png`: Approved opaque light-mode logo.
- `assets/logos/dark_mode.png`: Approved opaque dark-mode logo.
- `assets/brand/concepts/`: Original light, transparent-light, and dark concept renders.
- `project_plan.md`: Records the approved logo direction and remaining visual-system work.
- `meta_thinking.md`: Records the ASCII-first request, creation, and approval.
- `changelog.md`: Resolves the previous commit and prepares this logo entry.

#### User-visible impact

Pomorise now has a recognizable approved identity for light and dark surfaces. The segmented ring communicates focused time, while the sunrise and lowercase `p` connect the mark directly to the Pomorise name and First Light release.

#### Decisions and tradeoffs

- The same structure is used in both themes so visitors learn one brand mark rather than two competing identities.
- Separate opaque PNGs provide predictable review and initial integration on their intended backgrounds.
- A transparent light concept is retained as a working asset, but the explicitly approved production path uses the opaque ivory version.
- PNG renders are accepted for initial development. A precise SVG reconstruction remains a release-quality follow-up if scalable geometry is needed.

#### Risks and limitations

- The wide lockup includes a small tagline that will not remain legible at favicon size.
- The icon still needs dedicated small-size and monochrome variants before every possible brand placement is covered.
- The final interface palette and typography must be designed around, but not copied mechanically from, the logo.

#### Validation

- Confirmed both approved files are readable 1672 by 941 pixel RGB PNG images.
- Visually reviewed the light logo on ivory and the dark logo on midnight violet.
- Confirmed both wordmarks read `pomorise` and both taglines read `rise one session at a time`.
- Confirmed the requested production filenames and paths exactly match the project owner’s instruction.
- Checked updated Markdown structure, reading times, and the no-em-dash rule.

#### Lessons learned by the agent

- Showing the structural idea in ASCII created a useful approval checkpoint before image generation.
- Theme variants feel coherent when geometry and spacing stay fixed while contrast treatment changes.
- Generated transparent artwork can appear misleading in dark preview surfaces, so theme review needs an opaque background presentation.

#### Lessons learned by the user

- The project owner explicitly confirmed that the proposed symbol, palette, wordmark, and coordinated theme treatment fit the desired identity.
- The project owner chose exact production paths for predictable application integration.

#### Related references

- Approved identity and ASCII construction: `project_plan.md`
- Conversation and approval record: `meta_thinking.md`
- Light logo: `assets/logos/light_mode.png`
- Dark logo: `assets/logos/dark_mode.png`

#### Follow-up

- Integrate the correct logo variant when the themed application shell is implemented.
- Test the mark at website-header, mobile-header, application-icon, and favicon sizes.
- Reconstruct a project-owned SVG and derive reduced-detail icon variants if required by implementation.
- Resolve the pending entry with the final commit hash. Completed in the implementation-planning change.

### `6fb739a`: Confirm the First Light development toolset

- **Date:** 2026-08-15 23:37 EDT
- **Author:** Aman Ali
- **Full commit:** `6fb739a4e22fc55e052d5bea6f53d6808c71abd1`
- **Change size:** 3 files changed, 169 lines added, 28 lines removed

#### Purpose

Remove uncertainty from the development baseline so implementation can begin with a lean but complete quality system. Preserve rejected alternatives and their reconsideration conditions instead of leaving technology choices ambiguous.

#### Decision context

The project owner shared a screenshot of Vitest, React Testing Library, and Playwright marked as `Planned`. They asked the agent to decide which tools are genuinely necessary for the best usable website, move required tools to confirmed, and add a rejected-tools audit explaining every exclusion.

#### Changes

- Removed every `Planned` status from the intended tool table.
- Confirmed the complete build, runtime, storage, validation, offline, state, testing, accessibility, quality, automation, and hosting baseline.
- Kept Vitest, React Testing Library, and Playwright because they protect distinct and necessary layers of quality.
- Added Node.js 24, npm, the official React plugin for Vite, and Testing Library user-event to make the implementation toolchain complete.
- Added explicit selection reasons and privacy checks for every confirmed tool.
- Added a rejected-tools audit with replacements and objective reconsideration conditions.
- Rejected unnecessary full-stack frameworks, duplicate state libraries, client routing, CSS and component frameworks, motion and chart libraries, network and date wrappers, direct Workbox configuration, remote backends, authentication, analytics, monitoring, and desktop wrappers for First Light.
- Recorded the decision in the discussion history and confirmed decisions.
- Resolved the previous pending entry as commit `cecd97e`.

#### Files affected

- `changelog.md`: Resolves the First Light naming commit and prepares this toolset decision entry.
- `meta_thinking.md`: Records the request, rationale, confirmed baseline, and audit requirement.
- `project_plan.md`: Replaces uncertainty with confirmed tools and adds the rejected-tools audit.

#### User-visible impact

There is no interface change yet. The project is now ready to scaffold without reopening basic technology choices, and future readers can see why each tool is present or absent.

#### Decisions and tradeoffs

- Test depth is retained because timing, browser persistence, offline behavior, and accessibility are core product qualities.
- A larger development toolchain is accepted where tools prevent different classes of defects.
- Runtime dependencies remain narrow and local-first.
- Rejected tools can return only when a concrete approved requirement satisfies their documented reconsideration condition.

#### Risks and limitations

- Exact compatible package versions still require verification at installation time.
- Automated accessibility testing cannot replace manual accessibility review.
- Rejected tools may become appropriate if the product’s approved scope changes.

#### Validation

- Confirmed that no intended tool remains marked `Planned`.
- Checked every confirmed and rejected tool for a stated reason and official link.
- Sanity-checked the baseline against GitHub Pages, local-first privacy, offline operation, timer reliability, and accessibility requirements.
- Checked Markdown for formatting errors and forbidden em dashes.

#### Lessons learned by the agent

- Uncertain tool labels delay implementation even when the product requirements already justify a decision.
- The smallest responsible toolset is not the one with the fewest packages. It is the one that covers every material risk without duplicate solutions.
- A rejected-tools audit prevents discarded ideas from returning without context.

#### Lessons learned by the user

- The project owner delegated final tool selection to the agent while preserving the goal of a highly usable, privacy-focused website.
- The project owner requested transparent reasoning for rejected tools, not only a list of chosen technologies.

#### Related references

- Confirmed and rejected tool tables: `project_plan.md`
- Decision record: `meta_thinking.md`
- [Vitest documentation](https://vitest.dev/guide/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright documentation](https://playwright.dev/docs/intro)

#### Follow-up

- Scaffold First Light with the confirmed tools after the remaining product behavior and visual direction are approved.
- Verify exact compatible versions, licenses, and the production dependency graph during installation.
- Resolve the pending entry with the final commit hash. Completed in the approved-logo change.

### `cecd97e`: Name Pomorise 1.0 First Light

- **Date:** 2026-08-15 23:27 EDT
- **Author:** Aman Ali
- **Full commit:** `cecd97e0fb7f6e89d3c65f1ab3e7d3e73ebdf0fc`
- **Change size:** 4 files changed, 111 lines added, 16 lines removed

#### Purpose

Give the first public release a memorable identity that reflects the spirit of Pomorise and removes ambiguity from the generic “Version 1” label.

#### Decision context

The project owner asked how many versions were planned after seeing “Version 1” in the plan. Only the first complete public release is currently planned. They then invited the agent to name it.

#### Changes

- Named the first complete public release **Pomorise 1.0: First Light**.
- Replaced generic “Version 1” references in the current project plan.
- Explained that no fixed sequence of later releases is planned.
- Added the release name to the README, discussion record, glossaries, and project plan.
- Resolved the previous pending documentation entry as commit `dac259b`.

#### Files affected

- `README.md`: Introduces the First Light release name in the project status and glossary.
- `changelog.md`: Records the release naming decision and resolves the previous commit.
- `meta_thinking.md`: Preserves the naming conversation and confirmed decision.
- `project_plan.md`: Replaces the generic release label and explains the name’s meaning.

#### User-visible impact

Readers now see a clear, memorable name for the release being planned instead of an unexplained version placeholder.

#### Decisions and tradeoffs

- “First Light” was selected because it connects the project’s beginning with the idea of rising through focused sessions.
- The semantic version remains 1.0 because this is intended to be the first complete public release.
- Later release names and numbers remain undecided until genuine post-launch needs appear.

#### Risks and limitations

- The release name identifies the planned scope but does not set a release date.
- Future release naming should remain consistent without forcing an unnecessary theme.

#### Validation

- Searched current Markdown documents for generic “Version 1” references.
- Confirmed that the project plan table of contents points to the renamed release section.
- Checked Markdown for forbidden em dashes and formatting errors.

#### Lessons learned by the agent

- A named release communicates purpose more effectively than an unexplained version placeholder.
- Version labels should not imply a detailed future roadmap when none has been approved.

#### Lessons learned by the user

- The project owner clarified that release naming is part of the agent’s creative responsibility in this collaboration.

#### Related references

- First Light plan: `project_plan.md`
- Naming discussion: `meta_thinking.md`

#### Follow-up

- Complete the remaining First Light behavior and design decisions.
- Resolve the pending entry with the final commit hash. Completed in the toolset confirmation change.

### `dac259b`: Add new functionality and refine existing behavior

- **Date:** 2026-08-15 23:24 EDT
- **Author:** Aman Ali
- **Full commit:** `dac259b255838993296226ef0a39ff737e1e7951`
- **Change size:** 4 files changed, 1,081 lines added, 44 lines removed

#### Purpose

Give Pomorise a concrete product direction built around private, device-local focus data. Make the project documentation easier to trust and explore through fact-checking, sanity checks, glossaries, authoritative links, and conceptual interface sketches.

#### Decision context

The project owner approved the complete focus-loop direction while setting a strict boundary: Pomorise will have no sign-in, application logs, analytics, trackers, or server-side user data. They requested a fully updated plan, factual verification for every Markdown document, glossaries, further-reading links, and ASCII interface sketches.

#### Changes

- Opened `project_plan.md` with the approved vision, focus loop, Version 1 features, privacy model, storage architecture, limitations, technology, quality standard, and delivery sequence.
- Assigned small preferences to `localStorage`, structured product data to IndexedDB, and offline assets to the Cache API.
- Added user-controlled export, import, deletion, and persistent-storage requirements.
- Added honest limitations for device-local data, private browsing, browser eviction, background alarms, and website blocking.
- Added ASCII sketches for the primary workspace, focused session, distraction capture, break, reflection, mobile view, progress, and data settings.
- Added a detailed tool table covering frameworks, libraries, Web APIs, testing, accessibility, code quality, automation, and hosting.
- Documented each tool’s category, approval status, role, reason for selection, privacy impact, and official source.
- Added an end-to-end data-flow diagram and detailed flows for deployment, startup, timer state, local records, distraction capture, reflection, analytics, export, import, deletion, offline updates, notifications, and audio.
- Added data-boundary invariants that prevent personal records from entering network traffic, caches, build logs, or third-party services.
- Added a verification record backed by primary documentation.
- Added glossaries, embedded source links, and further-reading sections to every populated Markdown document.
- Expanded the README with project status and privacy direction.
- Recorded all new product and documentation decisions in the discussion record.
- Resolved the previous pending workflow entry as commit `7753811`.

#### Files affected

- `README.md`: Adds current status, privacy direction, terminology, verification status, and learning resources.
- `changelog.md`: Resolves the workflow commit and prepares this complete documentation entry.
- `meta_thinking.md`: Records the privacy, verification, sourcing, glossary, and ASCII-interface decisions.
- `project_plan.md`: Establishes the fact-checked local-first product plan and conceptual interfaces.

#### User-visible impact

Repository visitors can now understand what Pomorise intends to become, how it protects focus data, which limitations come with local storage, and how the core experience may flow across desktop and mobile.

#### Decisions and tradeoffs

- Rich product history will stay in the browser rather than gaining account-based synchronization.
- Privacy takes priority over cross-device convenience.
- IndexedDB supports growing structured records, while `localStorage` remains limited to small preferences.
- Backup and import controls compensate for the absence of cloud storage.
- ASCII sketches clarify hierarchy without locking in the final visual design.
- Primary sources establish technical facts; competitor pages remain suitable only for feature research.

#### Risks and limitations

- Browser data can be removed by the user, private browsing behavior, or browser storage policies.
- No cloud copy exists unless the user exports a backup.
- The exact storage library and browser-support matrix require another verification before implementation.
- Planned tools still need exact version, license, bundle-size, maintenance, and compatibility review before installation.
- Reading-time estimates vary by reader and must be refreshed as documents grow.

#### Validation

- Cross-checked storage, eviction, private browsing, service worker, GitHub hosting, React, and Vite claims against current primary documentation.
- Verified that every populated Markdown file has a table of contents, glossary, and further-reading links.
- Checked internal plan consistency against GitHub Pages static-hosting constraints.
- Checked Markdown for whitespace errors and forbidden em dashes.
- Confirmed that the ASCII sketches contain no unsupported product promises.
- Confirmed that every intended tool has an official link and a stated reason for selection.
- Sanity-checked the detailed data flow against the local-first privacy boundary and static GitHub Pages hosting.

#### Lessons learned by the agent

- Privacy-focused hosting claims must distinguish application behavior from the hosting provider’s own request processing.
- Browser storage is a sound fit for explicitly device-local product data, but export and data-loss explanations are essential.
- Conceptual wireframes can clarify product flow without starting implementation or prematurely deciding visual style.
- A tool list is not sufficient on its own. Selection reasons and privacy consequences make architectural choices reviewable.
- Explicit data-flow invariants make it easier to detect future features or dependencies that violate the local-first promise.

#### Lessons learned by the user

- The project owner confirmed that rich progress features can remain private by calculating them locally.
- The project owner established verification, sourcing, terminology, and further reading as permanent documentation requirements.
- The project owner chose ASCII interfaces as a practical bridge between feature planning and visual design.
- The project owner requested transparent reasoning for every planned framework, library, platform API, and delivery tool.
- The project owner established detailed data-flow documentation as part of the product plan, not an implementation afterthought.

#### Related references

- Product plan: `project_plan.md`
- Discussion record: `meta_thinking.md`
- [MDN client-side storage](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_APIs/Client-side_storage)
- [MDN storage quotas and eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- [GitHub General Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)
- [React documentation](https://react.dev/learn)
- [Vite documentation](https://vite.dev/guide/)
- [Dexie API reference](https://dexie.org/docs/API-Reference)
- [Zod documentation](https://zod.dev/)
- [Vitest guide](https://vitest.dev/guide/)
- [Playwright documentation](https://playwright.dev/docs/intro)

#### Follow-up

- Approve the remaining timer and task behaviors.
- Approve the visual direction after behavior is settled.
- Verify dependency versions and browser support before scaffolding the application.
- Resolve the pending entry with the final commit hash. Completed in the First Light naming change.

### `7753811`: Prepare Vite deployment for GitHub Pages

- **Date:** 2026-08-15 22:53 EDT
- **Author:** Aman Ali
- **Full commit:** `77538113516332e0985759ff345f763df77c19f6`
- **Change size:** 1 file changed, 51 lines added, 19 lines removed

#### Purpose

Prepare a safe, modern path from the future React application to GitHub Pages. The workflow can recognize when the app is ready, produce its optimized Vite build, and publish only the files visitors need.

#### Decision context

The project owner approved React, TypeScript, and Vite as the technical foundation and asked for the GitHub Pages workflow to be updated. Product implementation remained deferred until features and design were approved.

#### Changes

- Renamed the workflow to describe both building and deploying Pomorise.
- Split the workflow into dedicated build and deployment jobs.
- Added a readiness check for `package.json` and `package-lock.json`.
- Made documentation-only pushes safe while the application scaffold is absent.
- Added Node.js 24 setup with npm dependency caching.
- Added clean dependency installation through `npm ci`.
- Added the Vite production build command.
- Changed the Pages artifact from the entire repository to `dist`.
- Updated the checkout and Pages artifact actions to their supported major versions at the time of the commit.
- Preserved manual runs, deployment permissions, concurrency protection, and the public Pages URL.

#### Files affected

- `.github/workflows/static.yml`: Builds the future Vite application and deploys only its production output.

#### User-visible impact

No interface existed yet. Once the application scaffold is committed, pushes to `main` can build and publish Pomorise automatically. Until then, the workflow exits safely without publishing repository documentation.

#### Decisions and tradeoffs

- The workflow waits for both the package manifest and lockfile to support reproducible installs.
- Deployment is skipped during planning instead of publishing the repository root or failing because the app does not exist.
- Only `dist` becomes public through the Pages artifact.

#### Risks and limitations

- No deployment occurs until both package files exist.
- Vite still needs the correct `/pomorise/` base path when the scaffold is created.
- The application build cannot be validated before application files exist.

#### Validation

- Parsed the workflow as valid YAML.
- Confirmed that the deploy job depends on a ready build.
- Confirmed that only `dist` is selected for upload.
- Checked output references and workflow structure.

#### Lessons learned by the agent

- Approved infrastructure can move forward safely during discovery when it does not assume unapproved product behavior.
- A readiness gate prevents a temporary planning state from becoming a broken deployment.

#### Lessons learned by the user

- The project owner confirmed that GitHub Pages can support a rich interactive experience through compiled browser JavaScript.

#### Related references

- Deployment workflow: `.github/workflows/static.yml`
- [Vite static deployment guide](https://vite.dev/guide/static-deploy.html)
- [GitHub Pages custom workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

#### Follow-up

- Define the Version 1 features and privacy model.
- Configure the Vite base path when the scaffold is added.
- Build and verify the application before enabling a real deployment.

### `562126d`: Refine project documentation and collaboration tracking

- **Date:** 2026-08-15 22:47 EDT
- **Author:** Aman Ali
- **Full commit:** `562126d1b34435176e26ef77838efdcee8514c2a`
- **Change size:** 3 files changed, 521 lines added, 61 lines removed

#### Purpose

Turn the project documentation into a warmer, more reliable shared memory. This change makes every record easier to navigate, more enjoyable to read, and more useful when future decisions need context.

#### Decision context

The project owner asked for engaging prose without em dashes, a richer commit template, retrospective use of that template, and clear timestamps and reading times for each recorded conversation. Before committing, they also asked that the commit tracker stay synchronized with the work it describes.

#### Changes

- Expanded the README introduction so it communicates the spirit of Pomorise, not only its hosting destination.
- Reworked the discussion record with a more inviting voice and clearer distinctions between proposals and confirmed decisions.
- Added conversation-level dates, timestamps, timezones, and estimated reading times.
- Added honest retrospective labels wherever an exact historical conversation time was unavailable.
- Expanded the commit template with decision context, tradeoffs, risks, agent lessons, user lessons, and related references.
- Updated historical commits to follow the expanded template.
- Added this prepared entry so the tracker reflects the upcoming commit before it is created.
- Established a practical synchronization rule for commit hashes.
- Removed em dashes from all populated Markdown files and added a rule that prevents them from returning.

#### Files affected

- `README.md`: Adds a more engaging explanation of the product's intended value.
- `changelog.md`: Expands the template, updates historical records, and prepares the entry for this commit.
- `meta_thinking.md`: Adds conversation metadata, writing standards, and the latest documentation decisions.

#### User-visible impact

Readers can now understand the project's story more quickly. They can see when each conversation happened, how long an entry takes to read, why a commit was made, and what both collaborators learned along the way.

#### Decisions and tradeoffs

- Commit entries will be prepared before a commit with a `Pending` hash, since a commit cannot contain its own final hash.
- The pending hash will be resolved during preparation of the next meaningful commit. This avoids creating endless documentation-only commits that exist solely to record the previous hash.
- Historical timestamps will be marked unavailable when they were not retained. Accuracy takes priority over artificial precision.
- Lessons will be recorded only when the agent or user actually learned or expressed them.

#### Risks and limitations

- The newest entry will temporarily show `Pending` until the next meaningful change begins.
- Reading times are estimates and may vary by reader.
- Retrospective entries cannot recover conversation times that were never retained.

#### Validation

- Checked every populated Markdown file for em dashes.
- Verified that each historical commit contains every section in the expanded template.
- Confirmed that `project_plan.md` remains a zero-byte file.
- Checked Markdown changes for whitespace errors.

#### Lessons learned by the agent

- Product work should follow the collaboration rhythm requested by the project owner. Feature and design decisions come before implementation.
- A tracker needs a deliberate strategy for its own commit because Git creates the final hash only after the tracked contents are fixed.
- Historical metadata should favor honest gaps over invented precision.

#### Lessons learned by the user

- The project owner identified that a changelog becomes more valuable when it captures learning, not only file changes.
- The project owner established that conversation timestamps and reading times make a long-running decision record easier to navigate.

#### Related references

- Discussion record: `meta_thinking.md`
- Project introduction: `README.md`
- Previous documentation commit: `fce4b4bebdce994c689f7c4d771d1a9f49245baf`

#### Follow-up

- Replace the prepared entry with its short and full hashes while preparing the next meaningful commit. Completed in the workflow preparation change.
- Continue updating `changelog.md` and `meta_thinking.md` together whenever project decisions become committed work.

### `fce4b4b`: Initial push

- **Date:** 2026-08-15 22:38 EDT
- **Author:** Aman Ali
- **Full commit:** `fce4b4bebdce994c689f7c4d771d1a9f49245baf`
- **Change size:** 4 files changed, 264 lines added, 2 lines removed

#### Purpose

Give Pomorise a durable project memory before product planning begins. This commit introduced the documents that will preserve discussions, commits, and future direction.

#### Decision context

The project owner wanted to decide features and design before any implementation resumed. They requested dedicated records so important conversations, commit details, and project direction would not disappear as the work evolved.

#### Changes

- Expanded the README from a name and tagline into a short project overview with a table of contents.
- Created `meta_thinking.md` to record discussions, confirmed decisions, open questions, and collaboration rules.
- Created `changelog.md` with a detailed entry structure and retrospective records for the first two commits.
- Created an empty `project_plan.md` so planning could begin later from a clean slate.
- Added tables of contents to every populated Markdown document.
- Added document-level creation dates, update times, timezones, and reading-time estimates.

#### Files affected

- `README.md`: Adds navigation and a concise overview.
- `changelog.md`: Introduces the detailed commit tracker and records the first two commits.
- `meta_thinking.md`: Introduces the shared discussion and decision record.
- `project_plan.md`: Creates an intentionally empty planning document.

#### User-visible impact

Repository visitors gained a clearer introduction and a transparent view of how Pomorise would be shaped. Future collaborators gained dedicated places to understand the project's history and direction.

#### Decisions and tradeoffs

- Important project knowledge was split across three focused documents instead of combining everything into the README.
- `project_plan.md` was deliberately kept empty so its contents could be created through discussion rather than assumption.
- The changelog favored rich explanations over a brief list of commit titles.

#### Risks and limitations

- The initial changelog template did not yet include decision context, tradeoffs, risks, lessons, or related references.
- Discussion entries included dates but did not yet include individual timestamps or reading times.
- Some early prose used em dashes, which later conflicted with the chosen writing standard.

#### Validation

- Git recorded all four intended files in commit `fce4b4b`.
- `project_plan.md` was confirmed as an empty tracked file.
- No application tests applied because the commit contained documentation only.

#### Lessons learned by the agent

- The agent learned that this project must move from discussion to approval before implementation. That lesson now guides every future phase.
- The agent learned to preserve proposals as proposals instead of presenting them as settled requirements.

#### Lessons learned by the user

- The project owner reinforced a preference for step-by-step decisions before code is written.
- The project owner recognized the value of living documents that preserve conversation, commit history, and direction separately.

#### Related references

- Discussion record introduced in this commit: `meta_thinking.md`
- Commit tracker introduced in this commit: `changelog.md`
- Empty planning space introduced in this commit: `project_plan.md`

#### Follow-up

- Enrich the writing style and remove em dashes.
- Expand the commit template to capture lessons and decision quality.
- Add conversation-level timestamps and reading times.
- Begin `project_plan.md` only when the project owner is ready to plan from scratch.

### `01d529e`: Add GitHub Actions workflow for static site deployment

- **Date:** 2026-08-15 22:16 EDT
- **Author:** Aman Ali / GitHub
- **Full commit:** `01d529eb1f60ccea9cb9ed551b1b871b893f27dd`
- **Change size:** 1 file created, 43 lines added

#### Purpose

Give Pomorise a reliable path from the repository to the public web. This workflow makes each release easier by removing the need to upload the site by hand.

#### Decision context

Pomorise was intended for GitHub Pages from the beginning. A deployment workflow was needed before the website arrived so the repository would already have a clear route to publication.

#### Changes

- Added a GitHub Actions workflow named **Deploy static content to Pages**.
- Configured deployment to run whenever a commit is pushed to `main`.
- Added a manual `workflow_dispatch` trigger so deployment can also be started from GitHub Actions.
- Granted the workflow read access to repository contents and the permissions needed to publish to GitHub Pages.
- Added a concurrency group named `pages` to prevent overlapping queued deployments while allowing a deployment already in progress to finish.
- Configured the job to check out the repository, configure Pages, upload the repository as a static artifact, and deploy that artifact.
- Connected the GitHub Pages environment URL to the deployment step’s generated URL.

#### Files affected

- `.github/workflows/static.yml`: New workflow that publishes the repository’s static content to GitHub Pages.

#### User-visible impact

Once GitHub Pages is connected to GitHub Actions, a push to `main` can carry Pomorise straight to its public home. The stage was ready, even though the website itself had not yet arrived.

#### Decisions and tradeoffs

- GitHub Actions was chosen as the publishing source because it fits the repository's GitHub Pages destination.
- The workflow uploads the whole repository, which keeps a plain static site simple but may need to change if Pomorise later gains a build step.

#### Risks and limitations

- Publishing depends on GitHub Pages being configured to use GitHub Actions.
- Uploading the whole repository may include files that do not belong in the final site once the project grows.

#### Validation

- The workflow was committed with the expected GitHub Pages actions and permissions.
- No local application build or interface test applied to this infrastructure-only commit.

#### Lessons learned by the agent

No agent lesson was recorded for this commit. It was created before the current agent collaboration began.

#### Lessons learned by the user

No user lesson was recorded for this commit.

#### Related references

- GitHub workflow: `.github/workflows/static.yml`

#### Follow-up

- Add the actual static website files.
- Confirm that the repository’s GitHub Pages source is set to GitHub Actions.
- Revisit the uploaded artifact path if the project later introduces a build output directory.

### `7cd737a`: Initial commit

- **Date:** 2026-08-15 22:14 EDT
- **Author:** Aman Ali
- **Full commit:** `7cd737a73fe5c86dbf13bbc456ad97c409dd7bce`
- **Change size:** 3 files created, 678 lines added

#### Purpose

Set the first stones in place: a name, a purpose, a license, and consistent text-file behavior. Pomorise had a home and a promise before it had an interface.

#### Decision context

The repository needed a clear identity and legal foundation before product work could begin.

#### Changes

- Added the project README with the name **pomorise**.
- Established the tagline **“Rise one session at a time.”**
- Added the GNU General Public License version 3, defining the terms under which the project may be used and distributed.
- Added Git attributes configuration for consistent repository behavior.

#### Files affected

- `.gitattributes`: Repository-level text and line-ending settings.
- `LICENSE`: GNU General Public License version 3.
- `README.md`: Initial project name and tagline.

#### User-visible impact

The repository gained its public identity and license. Visitors could see the name and the guiding phrase, while the functional website still waited ahead.

#### Decisions and tradeoffs

- The project adopted the name Pomorise and the tagline **“Rise one session at a time.”**
- GNU GPL version 3 was selected as the project license.
- The commit intentionally stayed small and foundational, leaving product decisions for later discussion.

#### Risks and limitations

- No working product existed yet.
- The initial README offered only the name and tagline, so visitors had little context about the planned experience.

#### Validation

- Confirmed that the three initial files were recorded in the commit.
- No application tests applied because no application code existed.

#### Lessons learned by the agent

No agent lesson was recorded for this commit. It was created before the current agent collaboration began.

#### Lessons learned by the user

No user lesson was recorded for this commit.

#### Related references

- Project introduction: `README.md`
- License terms: `LICENSE`

#### Follow-up

- Define the Pomodoro product’s requirements and design direction.
- Build the static website.
- Add a deployment process for GitHub Pages.

## Glossary

- **Artifact:** A packaged output produced by a workflow, such as the `dist` files uploaded for GitHub Pages.
- **Commit:** A recorded Git snapshot with authorship, time, message, content, and parent history.
- **Commit hash:** The identifier Git calculates from a commit’s contents and metadata.
- **Deployment:** The act of publishing a tested build to its public hosting destination.
- **Pending entry:** A complete changelog record prepared before Git creates the final commit hash.
- **Primary source:** Official documentation, a technical standard, or original Git history used to verify a claim.
- **Retrospective entry:** A changelog record written after the corresponding commit already exists.
- **Workflow:** An automated sequence of GitHub Actions jobs and steps.

## Further reading

- [Git: Recording changes to the repository](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)
- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Vite static deployment guide](https://vite.dev/guide/static-deploy.html)
- [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
- [Semantic Versioning](https://semver.org/)

## Maintenance rules

1. Document every commit, including documentation-only and maintenance commits.
2. Use the actual commit hash, author, timestamp, and file list from Git history.
3. Explain intent and impact; do not merely repeat the commit title.
4. Record validation honestly. Never claim a check was performed when it was not.
5. Preserve older entries. Corrections should add context rather than erase meaningful history.
6. Refresh the document-level **Last updated** timestamp and reading-time estimate with every changelog update.
7. Keep the table of contents synchronized with the commit entries and other headings.
8. Write with energy and clarity while keeping every fact precise.
9. Do not use em dashes.
10. Include decision context, tradeoffs, risks, lessons, and related references in every new entry.
11. Never invent a lesson for the agent or project owner. State that no lesson was recorded when the history does not provide one.
12. Prepare the newest entry before committing and mark its hash as `Pending`.
13. Resolve the pending hash when preparing the next meaningful commit, then add the new pending entry in the same change.
14. Fact-check commit metadata against Git history and technical statements against current primary documentation.
15. Sanity-check that each entry describes only files and behavior actually present in that commit.
16. Keep the glossary, embedded source links, and **Further reading** section current.
