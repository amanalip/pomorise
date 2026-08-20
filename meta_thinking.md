# Pomorise Discussion and Decision Record

| Document information | Value |
| --- | --- |
| Created | August 15, 2026 at 10:36 PM EDT |
| Last updated | August 20, 2026 at 2:10:50 PM EDT |
| ISO 8601 last updated | `2026-08-20T14:10:50-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Estimated reading time | 24 minutes |
| Verification status | Fact-checked and sanity-checked against the primary sources in **Further reading** |

This is Pomorise's shared memory. It captures the conversations, requests, decisions, and working agreements that shape the product. It does not contain private internal reasoning.

## Table of contents

- [Project origin](#project-origin)
- [Working agreement](#working-agreement)
- [Discussion history](#discussion-history)
  - [Initial request](#2026-08-15-initial-request)
  - [Process correction](#2026-08-15-process-correction)
  - [First proposed feature group](#2026-08-15-first-proposed-feature-group)
  - [Project documentation requested](#2026-08-15-project-documentation-requested)
  - [Documentation structure revised](#2026-08-15-documentation-structure-revised)
  - [Writing style established](#2026-08-15-writing-style-established)
  - [Commit record expanded](#2026-08-15-commit-record-expanded)
  - [Conversation tracking standard established](#2026-08-15-conversation-tracking-standard-established)
  - [Commit synchronization established](#2026-08-15-commit-synchronization-established)
  - [Technical foundation and quality ambition approved](#2026-08-15-technical-foundation-and-quality-ambition-approved)
  - [Feature possibilities explored](#2026-08-15-feature-possibilities-explored)
  - [Local-first privacy direction confirmed](#2026-08-15-local-first-privacy-direction-confirmed)
  - [Documentation verification standard confirmed](#2026-08-15-documentation-verification-standard-confirmed)
  - [ASCII interface sketches requested](#2026-08-15-ascii-interface-sketches-requested)
  - [Detailed tooling and data flow requested](#2026-08-15-detailed-tooling-and-data-flow-requested)
  - [First public release named](#2026-08-15-first-public-release-named)
  - [Development toolset confirmed](#2026-08-15-development-toolset-confirmed)
  - [Light and dark logos approved](#2026-08-15-light-and-dark-logos-approved)
  - [Seven-phase implementation planning activated](#2026-08-16-seven-phase-implementation-planning-activated)
  - [Screenshot-backed test reporting required](#2026-08-16-screenshot-backed-test-reporting-required)
  - [Beginner-focused development documents required](#2026-08-16-beginner-focused-development-documents-required)
  - [Final testing consolidated](#2026-08-20-final-testing-consolidated)
  - [Phase 1 implementation completed](#2026-08-20-phase-1-implementation-completed)
  - [Phase 2 implementation completed](#2026-08-20-phase-2-implementation-completed)
- [Confirmed decisions](#confirmed-decisions)
- [Open decisions](#open-decisions)
- [Documentation verification standard](#documentation-verification-standard)
- [Glossary](#glossary)
- [Further reading](#further-reading)
- [Maintenance rules](#maintenance-rules)

## Project origin

Pomorise began with a clear idea: create a Pomodoro website that helps people move forward through focused, manageable sessions.

- **Product:** A Pomodoro website
- **Home:** GitHub Pages
- **Tagline:** **“Rise one session at a time.”**
- **Deployment foundation:** A GitHub Actions workflow is already ready to publish static content to GitHub Pages.

## Working agreement

Pomorise will grow deliberately. The aim is not to rush toward code. The aim is to build the right experience once its purpose is clear.

- Move one decision at a time instead of planning or building everything at once.
- Discuss and approve the feature set first.
- Shape the design only after the features are settled.
- Begin implementation after the important decisions are made.
- Treat suggestions as possibilities, not approvals.
- Keep this record current whenever a requirement, decision, constraint, or direction changes.

## Discussion history

### 2026-08-15: Initial request

| Conversation details | Value |
| --- | --- |
| Conversation date | August 15, 2026 |
| Conversation timestamp | Exact time was not retained |
| Entry recorded | August 15, 2026 at 10:36 PM EDT |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | Less than 1 minute |

The journey began with a request for a Pomodoro website that could live comfortably on GitHub Pages.

### 2026-08-15: Process correction

| Conversation details | Value |
| --- | --- |
| Conversation date | August 15, 2026 |
| Conversation timestamp | Exact time was not retained |
| Entry recorded | August 15, 2026 at 10:36 PM EDT |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | Less than 1 minute |

An initial visual concept moved into implementation before the feature set and design had been agreed upon. The project owner clarified the intended rhythm: decide the features and direction first, then build. The unapproved files were removed, and the repository returned to its original state.

That moment gave the project its most important working rule: **discussion and approval come before implementation.**

### 2026-08-15: First proposed feature group

| Conversation details | Value |
| --- | --- |
| Conversation date | August 15, 2026 |
| Conversation timestamp | Exact time was not retained |
| Entry recorded | August 15, 2026 at 10:36 PM EDT |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | 1 minute |

The first feature conversation opened with a familiar Pomodoro foundation. These ideas are on the table, but they are **not yet approved**:

- 25-minute focus session
- 5-minute short break
- 15-minute long break
- Start, pause, reset, and skip controls
- Automatic switching between focus and break sessions
- A sound notification when a session ends

They remain possibilities until the project owner confirms, changes, or replaces them.

### 2026-08-15: Project documentation requested

| Conversation details | Value |
| --- | --- |
| Conversation date | August 15, 2026 |
| Conversation timestamp | Exact time was not retained |
| Entry recorded | August 15, 2026 at 10:36 PM EDT |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | Less than 1 minute |

To keep the project thoughtful and easy to follow, the project owner requested three living documents:

- `meta_thinking.md` to preserve important discussion points
- `changelog.md` to preserve detailed information about every commit
- `project_plan.md` to preserve the project’s direction

### 2026-08-15: Documentation structure revised

| Conversation details | Value |
| --- | --- |
| Conversation date | August 15, 2026 |
| Conversation timestamp | Exact time was not retained |
| Entry recorded | August 15, 2026 at 10:37 PM EDT |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | Less than 1 minute |

The project owner requested a table of contents in every populated Markdown document. They also requested that `project_plan.md` remain present but have no contents so its direction can be written collaboratively from scratch.

### 2026-08-15: Writing style established

| Conversation details | Value |
| --- | --- |
| Conversation date | August 15, 2026 |
| Conversation timestamp | Exact time was not retained |
| Entry recorded | August 15, 2026 at 10:39 PM EDT |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | Less than 1 minute |

Every Markdown document should invite the reader in. The writing must be clear, lively, and engaging without sacrificing accuracy. Em dashes are not permitted. `project_plan.md` remains empty until the planning conversation begins.

### 2026-08-15: Commit record expanded

| Conversation details | Value |
| --- | --- |
| Conversation date | August 15, 2026 |
| Conversation timestamp | Exact time was not retained |
| Entry recorded | August 15, 2026 at 10:41 PM EDT |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | Less than 1 minute |

The project owner requested that every changelog entry capture lessons learned by both the agent and the user. The commit structure was also expanded with decision context, tradeoffs, risks, and related references. These additions preserve not only what changed, but also why it changed and what future work can learn from it. Lessons must never be invented when none were expressed.

### 2026-08-15: Conversation tracking standard established

| Conversation details | Value |
| --- | --- |
| Conversation date | August 15, 2026 |
| Conversation timestamp | August 15, 2026 at 10:43:26 PM EDT |
| ISO 8601 timestamp | `2026-08-15T22:43:26-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | Less than 1 minute |

The project owner asked for every discussion entry to show when the conversation happened and how long the entry takes to read. Each new entry will now include a readable local timestamp, an ISO 8601 timestamp when available, the timezone, and an estimated reading time. Older entries keep honest retrospective metadata because their exact message times were not retained.

### 2026-08-15: Commit synchronization established

| Conversation details | Value |
| --- | --- |
| Conversation date | August 15, 2026 |
| Conversation timestamp | August 15, 2026 at 10:45:38 PM EDT |
| ISO 8601 timestamp | `2026-08-15T22:45:38-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | 1 minute |

Before committing the documentation updates, the project owner asked whether the commit tracker needed anything else and requested that the living records stay synchronized. A newly discovered commit, `fce4b4b`, was added retrospectively using the complete template. The upcoming commit also received a prepared entry.

Git creates a commit hash only after its contents are fixed, so a changelog inside that commit cannot already know its own final hash. Pomorise will solve this cleanly: prepare the newest entry with a `Pending` hash, then resolve that hash while preparing the next meaningful commit. This keeps the tracker aligned with the work without creating an endless trail of commits that exist only to update one another.

### 2026-08-15: Technical foundation and quality ambition approved

| Conversation details | Value |
| --- | --- |
| Conversation date | August 15, 2026 |
| Conversation timestamp | August 15, 2026 at 10:51:15 PM EDT |
| ISO 8601 timestamp | `2026-08-15T22:51:15-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | 1 minute |

The project owner set the quality ambition clearly: Pomorise should aim to become the best Pomodoro website. This is a standard for thoughtful usefulness, reliability, accessibility, and delight. It is not permission to add a large collection of unapproved features.

The React, TypeScript, and Vite foundation was approved. GitHub Pages remains the hosting destination, with GitHub Actions responsible for producing and publishing the static application. The deployment workflow can now wait safely during product discovery, then build and publish `dist` as soon as the approved application scaffold exists.

The next product step remains feature definition. Implementation will wait until the feature set and design direction are settled.

### 2026-08-15: Feature possibilities explored

| Conversation details | Value |
| --- | --- |
| Conversation date | August 15, 2026 |
| Conversation timestamp | August 15, 2026 at 11:05:13 PM EDT |
| ISO 8601 timestamp | `2026-08-15T23:05:13-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | 2 minutes |

The project owner asked what Pomorise could become beyond a standard 25-minute timer and gave permission to introduce additional JavaScript technology when it creates real value.

Research across established focus products revealed several familiar strengths: task estimates and reports in Pomofocus, detailed task management and synchronization in Focus To-Do, intention setting and reflection in Session, and visible progress, ambient sound, and gentle gamification in Forest.

The proposed Pomorise distinction is a complete focus loop:

1. **Choose:** Name one clear intention and estimate the effort.
2. **Focus:** Enter a dependable, distraction-light session.
3. **Recover:** Take a guided break that restores attention instead of inviting aimless browsing.
4. **Reflect:** Capture progress, distractions, and the best next step.
5. **Learn:** Turn completed sessions into useful patterns without guilt-driven metrics.

Possible feature groups include flexible timer modes, a small task layer, guided breaks, a distraction inbox, session notes, progress analytics, ambient sound, local-first privacy, offline installation, accessibility, and thoughtful personalization. Accounts, cross-device synchronization, collaboration, calendar connections, and genuine website blocking belong to later phases because they require external services or a browser extension.

These ideas are proposals, not approved requirements. React remains the only recommended interface framework. Additional libraries should be introduced only when an approved feature needs them. Likely candidates include a small offline-installation plugin and IndexedDB support for rich local history. A second interface framework would add complexity without improving the experience.

### 2026-08-15: Local-first privacy direction confirmed

| Conversation details | Value |
| --- | --- |
| Conversation date | August 15, 2026 |
| Conversation timestamp | August 15, 2026 at 11:12:28 PM EDT |
| ISO 8601 timestamp | `2026-08-15T23:12:28-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | 2 minutes |

The project owner confirmed that Pomorise will be public-facing and strongly privacy-focused. The application will not offer sign-in, collect application logs, track behavior, or store personal product data on a server. The proposed focus-loop features remain desired, but their information must stay in the user’s browser.

This direction makes Pomorise a local-first application. Small preferences will use `localStorage`, while structured tasks, session history, distractions, and reflections will use IndexedDB. Offline application files will use the Cache API through a service worker. Export, import, and clear-data controls will give each user direct ownership of their information.

Browser storage fits the requirement, but it carries honest limitations. Data stays with one browser profile and device, can disappear when site data is cleared, and is normally temporary in private browsing. Browsers may also remove best-effort data under storage pressure. Pomorise will request persistent storage where appropriate, explain that the browser can decline, and encourage portable backups.

The project plan was opened for the first time and now treats privacy as an architectural boundary rather than a settings option. No approved dependency may introduce analytics, remote assets, or hidden network calls.

### 2026-08-15: Documentation verification standard confirmed

| Conversation details | Value |
| --- | --- |
| Conversation date | August 15, 2026 |
| Conversation timestamp | August 15, 2026 at 11:14:22 PM EDT |
| ISO 8601 timestamp | `2026-08-15T23:14:22-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | 1 minute |

The project owner required every Markdown document to be fact-checked and sanity-checked. They also requested glossaries and embedded links to external sources for readers who want to explore a topic further.

Primary documentation is now the standard for technical, browser, privacy, hosting, and dependency claims. Consequential statements should link to their supporting source near the claim. Every populated Markdown document will also maintain a glossary and a **Further reading** section. Verification records must say what was checked, when it was checked, which sources were used, and whether any uncertainty remains.

### 2026-08-15: ASCII interface sketches requested

| Conversation details | Value |
| --- | --- |
| Conversation date | August 15, 2026 |
| Conversation timestamp | August 15, 2026 at 11:16:19 PM EDT |
| ISO 8601 timestamp | `2026-08-15T23:16:19-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | Less than 1 minute |

The project owner requested ASCII interface sketches inside the project plan. Conceptual layouts were added for the desktop workspace, focused session, distraction capture, guided break, reflection, mobile timer, private progress, and local data controls. These sketches establish hierarchy and flow without prematurely approving a final visual style.

### 2026-08-15: Detailed tooling and data flow requested

| Conversation details | Value |
| --- | --- |
| Conversation date | August 15, 2026 |
| Conversation timestamp | Exact send time was not retained |
| Entry recorded | August 15, 2026 at 11:22:21 PM EDT |
| ISO 8601 entry timestamp | `2026-08-15T23:22:21-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | 1 minute |

The project owner requested a detailed account of the tools intended for Pomorise and a step-by-step explanation of the product’s data flow. They clarified that “tools” includes frameworks and required each tool to appear in a table with its selection reason and a link to its official website or documentation.

The project plan now distinguishes interface, build, storage, validation, offline, state, testing, accessibility, quality, automation, and hosting tools. Each table row states the tool’s category, approval status, role, reason for selection, and privacy implications.

The data-flow plan now follows Pomorise through deployment, first load, local schema, timer transitions, distraction capture, reflection, private analytics, export, import, deletion, offline updates, notifications, and audio. It also defines invariants that prevent personal information from crossing the device boundary.

### 2026-08-15: First public release named

| Conversation details | Value |
| --- | --- |
| Conversation date | August 15, 2026 |
| Conversation timestamp | Exact send time was not retained |
| Entry recorded | August 15, 2026 at 11:25:34 PM EDT |
| ISO 8601 entry timestamp | `2026-08-15T23:25:34-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | Less than 1 minute |

The project owner asked the agent to name the first public release rather than leaving it as a generic “Version 1.” The release is now named **Pomorise 1.0: First Light**.

First Light reflects the beginning of Pomorise and the product’s promise to help people rise through steady sessions. It identifies one complete public release without implying that a fixed series of later versions has already been planned.

### 2026-08-15: Development toolset confirmed

| Conversation details | Value |
| --- | --- |
| Conversation date | August 15, 2026 |
| Conversation timestamp | Exact send time was not retained |
| Entry recorded | August 15, 2026 at 11:30:43 PM EDT |
| ISO 8601 entry timestamp | `2026-08-15T23:30:43-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | 2 minutes |

The project owner asked the agent to remove uncertainty from the tool table before development begins. The instruction was to keep every tool that materially helps make Pomorise excellent, move those tools to confirmed, and document rejected alternatives instead of leaving a collection of indefinite possibilities.

The development baseline is now confirmed: React, TypeScript, Node.js 24, npm, Vite, the official React plugin for Vite, Dexie, Zod, the Vite PWA plugin, React reducer and context, browser Web APIs, Vitest, React Testing Library, user-event, Playwright, axe, ESLint, typescript-eslint, Prettier, GitHub Actions, and GitHub Pages.

The test tools shown in the attached screenshot remain. They protect different layers: Vitest covers deterministic timer and validation logic, React Testing Library covers accessible component behavior, and Playwright covers real-browser storage, refresh recovery, offline behavior, permissions, and responsive flows. Removing one would leave an important risk untested.

A rejected-tools audit now explains why First Light will not use full-stack React frameworks, extra state libraries, client routing, utility CSS, generic component kits, large chart libraries, network and date wrappers, direct Workbox configuration, backend and authentication platforms, analytics services, or desktop wrappers. Rejection is scoped to First Light and includes a clear condition for reconsideration.

### 2026-08-15: Light and dark logos approved

| Conversation details | Value |
| --- | --- |
| Conversation date | August 15, 2026 |
| Conversation timestamp | Exact send time was not retained |
| Entry recorded | August 15, 2026 at 11:41:35 PM EDT |
| ISO 8601 entry timestamp | `2026-08-15T23:41:35-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | 1 minute |

The project owner asked to begin Pomorise’s visual identity with coordinated light-mode and dark-mode logos and requested an ASCII explanation before creation. The proposed mark combines a segmented timer ring, a sunrise crossing a horizon, and a subtle lowercase `p`. The lowercase wordmark includes the tagline “rise one session at a time.”

After reviewing both renders, the project owner described the direction as perfect and approved it. The opaque variants were promoted to `assets/logos/light_mode.png` and `assets/logos/dark_mode.png`. Original concept renders remain in `assets/brand/concepts/` for provenance.

### 2026-08-16: Seven-phase implementation planning activated

| Conversation details | Value |
| --- | --- |
| Conversation date | August 16, 2026 |
| Conversation timestamp | Exact send time was not retained |
| Entry recorded | August 16, 2026 at 2:17:29 AM EDT |
| ISO 8601 entry timestamp | `2026-08-16T02:17:29-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | 1 minute |

The project owner first left a private reminder to create an implementation plan, decide the number of phases, and require detailed beginner-friendly comments without changing any files. They then activated the first three tasks and confirmed that commenting every code line is mandatory rather than an open question.

Development is now organized into seven phases: foundation and guardrails, design system and application shell, reliable timer engine, complete focus loop, local data and privacy controls, offline experience and quality hardening, and release verification and publication.

The project-specific commenting rule applies to every human-authored code line. Comment lines and blank lines do not require recursive comments. Formats that cannot legally or meaningfully contain comments must use companion Markdown annotations so the underlying decisions remain readable without corrupting the files.

### 2026-08-16: Screenshot-backed test reporting required

| Conversation details | Value |
| --- | --- |
| Conversation date | August 16, 2026 |
| Conversation timestamp | Exact send time was not retained |
| Entry recorded | August 16, 2026 at 2:27:38 AM EDT |
| ISO 8601 entry timestamp | `2026-08-16T02:27:38-04:00` |
| Metadata clarification recorded | August 16, 2026 at 2:31:45 AM EDT |
| ISO 8601 metadata clarification | `2026-08-16T02:31:45-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | 1 minute |

The project owner asked whether the implementation plan contained a checklist that would be checked after every phase. The earlier plan contained validation lists and a completion protocol, but not a formal Markdown checkbox system. Every phase now has checkable validation items, and a mandatory closeout checklist prevents an exit gate from passing without linked evidence.

The project owner also required a very detailed report after every meaningful phase or test run. Each report will live at `testreports/<phase_or_run_or_step>/test_report.md` with raw logs, case-by-case results, failures, retests, risks, and locally stored screenshots. A navigation README and reusable report template establish the format before implementation begins.

The project owner then clarified that test reports, and every Markdown document, must include a date and timestamp plus an estimated reading time. The documentation metadata standard now makes human-readable timestamps, timezone, ISO 8601 timestamps where exact values are known, and estimated reading time explicit.

### 2026-08-16: Beginner-focused development documents required

| Conversation details | Value |
| --- | --- |
| Conversation date | August 16, 2026 |
| Conversation timestamp | Exact send time was not retained |
| Entry recorded | August 16, 2026 at 2:41:40 AM EDT |
| ISO 8601 entry timestamp | `2026-08-16T02:41:40-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | 1 minute |

The project owner requested a new `development_docs/` document set for beginners and new programmers. Each narrative will live at `development_docs/<phase_or_run_or_step>/doc.md` and explain what development happened in the related step or commit.

The requested depth goes beyond a changed-file summary. Each document records the design method, system design, architecture, design decisions, assumptions, requirements, constraints, runtime and data flows, state, components, file responsibilities, accessibility, privacy, storage, errors, performance, dependencies, deployment impact, rejected alternatives, limitations, and a guided beginner learning path.

Development documents and test reports will use the same identifier when they describe the same unit of work. The development document explains intent and implementation, while the report provides observable evidence. Both remain connected to the changelog, project direction, implementation phase, and conversation record.

### 2026-08-20: Final testing consolidated

| Conversation details | Value |
| --- | --- |
| Conversation date | August 20, 2026 |
| Conversation timestamp | Exact send time was not retained |
| Entry recorded | August 20, 2026 at 1:21:33 PM EDT |
| ISO 8601 entry timestamp | `2026-08-20T13:21:33-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | 1 minute |

The project owner proposed replacing a complete test run at the end of every phase with one comprehensive test suite after implementation is finished. They confirmed the approach and asked for every Markdown document to be synchronized.

Phases 1 through 6 now close on implementation readiness, authored test coverage, documented manual checks, and lightweight diagnostics only when needed to unblock work. Phase 7 runs the complete static, unit, component, browser, accessibility, privacy, storage, offline, responsive, performance, build, deployment, and public-site verification suite. One report at `testreports/final-comprehensive-suite/test_report.md` preserves the integrated evidence. Earlier discussion entries remain unchanged as history, but this decision supersedes their per-phase report policy.

### 2026-08-20: Phase 1 implementation completed

| Conversation details | Value |
| --- | --- |
| Conversation date | August 20, 2026 |
| Conversation timestamp | Exact send time was not retained |
| Entry recorded | August 20, 2026 at 1:45:43 PM EDT |
| ISO 8601 entry timestamp | `2026-08-20T13:45:43-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | 1 minute |

The project owner requested that Phase 1 begin and specifically asked for unnecessary local files to be covered appropriately by `.gitignore`.

Phase 1 created the exact React, TypeScript, and Vite dependency foundation, strict quality commands, source boundaries, the minimal approved-logo shell, test layers, a runtime network-boundary check, browser and performance targets, dependency and JSON annotations, and an expanded line-by-line-commented Pages workflow. The ignore policy excludes dependencies, builds, generated browser artifacts, local environment variants, logs, caches, editor state, and operating-system noise while retaining the lockfile and future curated final-suite evidence.

Targeted diagnostics corrected Vitest discovering a Playwright specification. Clean installation, formatting, linting, strict types, three Vitest assertions, production building, and two Chromium checks then completed. The browser checks required explicit localhost permission because the managed workspace sandbox rejected loopback connections; the unchanged test passed after permission. These diagnostics establish implementation readiness but do not replace the Phase 7 comprehensive report.

### 2026-08-20: Phase 2 implementation completed

| Conversation details | Value |
| --- | --- |
| Conversation date | August 20, 2026 |
| Conversation timestamp | Exact send time was not retained |
| Entry recorded | August 20, 2026 at 2:10:50 PM EDT |
| ISO 8601 entry timestamp | `2026-08-20T14:10:50-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Entry reading time | 1 minute |

The project owner asked to begin Phase 2. The implementation converted the approved identity into semantic light and dark tokens, system and explicit local appearance preference, project-owned accessible primitives, a responsive timer-first shell, mobile navigation, empty and disabled states, permission guidance, reduced-motion behavior, and Phase 7 acceptance mappings.

During visual review, the project owner clarified that em dashes must not appear on the website or anywhere in source code. The visible instance was replaced immediately, a Unicode code-point unit guard was added without placing the character in the test source, and the requirement was carried into the Phase 7 mapping.

Real-browser inspection exposed and corrected a 320 pixel overflow caused by a root minimum width and a pointer hit-target problem in styled native radio inputs. Formatting, strict types, linting, two unit cases, three component cases, production building, and four Chromium cases completed successfully as targeted implementation diagnostics. The comprehensive release conclusion remains Phase 7 work.

## Confirmed decisions

These are the firm foundations beneath Pomorise:

- **Product:** Pomodoro website
- **Hosting target:** GitHub Pages
- **Process:** Features first, design second, implementation afterward
- **Documentation:** Maintain a discussion record, detailed changelog, and project plan
- **Writing style:** Clear, engaging, and free of em dashes
- **Commit records:** Capture context, tradeoffs, risks, agent lessons, user lessons, and related references
- **Commit synchronization:** Prepare entries before committing, then resolve pending hashes with the next meaningful change
- **Quality ambition:** Aim to make Pomorise the best Pomodoro website through usefulness, reliability, accessibility, and delight
- **Application foundation:** React, TypeScript, and Vite
- **Deployment output:** Build with GitHub Actions and publish only the generated `dist` directory
- **Product model:** Public-facing, local-first, and usable without an account
- **Privacy boundary:** No application analytics, telemetry, behavioral logs, advertising trackers, or server-side user data
- **Local persistence:** Browser storage with user-controlled export, import, and deletion
- **Documentation quality:** Fact-check and sanity-check every populated Markdown document using current primary sources
- **Documentation support:** Maintain a glossary, embedded source links, and a **Further reading** section
- **Planning visuals:** Use ASCII interface sketches to clarify information hierarchy before final design
- **Tool documentation:** Keep frameworks, libraries, browser APIs, tests, and delivery tools in a linked table with explicit selection reasons
- **Data-flow documentation:** Trace personal data and application assets through every meaningful product operation
- **First public release:** Pomorise 1.0: First Light
- **Development baseline:** The complete First Light tool table is confirmed with no remaining `Planned` status
- **Tool rejection:** Excluded tools require a documented reason, confirmed replacement, and reconsideration condition
- **Logo direction:** Segmented timer ring, rising sun, and subtle lowercase `p`, with coordinated approved light and dark variants
- **Implementation sequence:** Seven phases with an observable exit gate for each phase
- **Code readability:** Every human-authored code line requires an adjacent beginner-friendly explanation, with companion annotations for non-commentable formats
- **Phase checklists:** Phases 1 through 6 use implementation-readiness checklists; Phase 7 uses the comprehensive evidence-based release checklist
- **Test reporting:** One detailed report at `testreports/final-comprehensive-suite/test_report.md` records the complete Phase 7 suite with raw logs and embedded screenshots
- **Document metadata:** Every Markdown document requires dated human-readable timestamps, timezone, and estimated reading time, plus ISO 8601 timestamps where exact values are known
- **Development documentation:** Every meaningful implementation phase, run, step, or commit requires an in-depth beginner-focused narrative under `development_docs/`
- **Explanation and evidence pairing:** Phase and step development documents keep individual identifiers and cross-link to the shared comprehensive final report
- **Current implementation state:** Phases 1 through 4 are implementation-ready; Phase 5 is the next eligible phase

## Open decisions

The heart of the product is still taking shape. These questions will guide the next conversations:

- Which timer modes and durations feel right?
- Which controls should always be within reach?
- Should sessions advance automatically?
- Should completion alerts use sound, browser notifications, or both?
- How much task detail belongs in the deliberately small task layer?
- Should it celebrate progress, history, or streaks?
- Which settings and personal touches would genuinely help?
- Which exact accessibility and offline behaviors will define the strong baseline?
- Which optional details should be deferred without weakening the approved focus loop?

## Documentation verification standard

Every populated Markdown document must pass four checks:

1. **Factual check:** Technical and privacy claims agree with current primary documentation.
2. **Sanity check:** The proposal is internally consistent, compatible with GitHub Pages, and honest about limitations.
3. **Traceability check:** Important claims link to supporting sources, and the conversation or commit that introduced them remains identifiable.
4. **Reader check:** Specialized language is explained in a glossary, with further reading available for deeper understanding.

Official sources are preferred in this order: standards and browser documentation, platform documentation, framework documentation, and library documentation. Competitor websites may support feature research, but they do not establish browser or privacy facts.

## Glossary

- **ASCII interface:** A text-character sketch that communicates layout and hierarchy without final visual styling.
- **Companion annotation:** A separate Markdown explanation for a required file format that cannot contain comments safely.
- **Development document:** The in-depth beginner-focused explanation of one implementation unit’s design, architecture, decisions, assumptions, files, flows, and learning path.
- **Fact-check:** Verification that a claim agrees with an authoritative and current source.
- **First Light:** The name of Pomorise 1.0 and its first complete public release.
- **ISO 8601:** A standard timestamp format that includes an unambiguous date, time, and UTC offset.
- **Local-first:** A product model in which personal data stays on the user’s device by default.
- **Logo lockup:** The arrangement of a symbol, wordmark, and optional tagline as one brand asset.
- **Primary source:** Official documentation, a technical standard, or an original product source rather than a secondary summary.
- **Rejected tools audit:** A record of intentionally excluded technologies, the reason for exclusion, the selected replacement, and the condition that could justify reconsideration.
- **Test report:** A permanent record connecting a test scope to its environment, cases, commands, logs, screenshots, failures, retests, and conclusion.
- **Sanity check:** A practical review for contradictions, impossible promises, missing constraints, and mismatched scope.
- **Telemetry:** Usage, performance, or behavioral data transmitted from an application to its operator.

## Further reading

- [Project plan](project_plan.md)
- [Implementation plan](implementation_plan.md)
- [Development documentation index](development_docs/README.md)
- [Test report index](testreports/README.md)
- [Commit changelog](changelog.md)
- [MDN: Client-side storage](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_APIs/Client-side_storage)
- [MDN: Storage quotas and eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- [MDN: Progressive web apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/What_is_a_progressive_web_app)
- [GitHub Pages documentation](https://docs.github.com/en/pages)
- [GitHub General Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)
- [React documentation](https://react.dev/learn)
- [Vite documentation](https://vite.dev/guide/)
- [TypeScript documentation](https://www.typescriptlang.org/docs/)
- [Dexie API reference](https://dexie.org/docs/API-Reference)
- [Zod documentation](https://zod.dev/)
- [Vite PWA plugin guide](https://vite-pwa-org.netlify.app/guide/)
- [Vitest guide](https://vitest.dev/guide/)
- [Playwright documentation](https://playwright.dev/docs/intro)

## Maintenance rules

When this file is updated:

1. Add dated discussion entries rather than silently replacing history.
2. Clearly distinguish proposals from approved decisions.
3. Move items into **Confirmed decisions** only after approval.
4. Keep **Open decisions** current.
5. Record major reversals and explain what changed at a project level.
6. Refresh the **Last updated** timestamp and reading-time estimate whenever this document changes substantially.
7. Keep the table of contents aligned with the document’s headings.
8. Keep the prose engaging and do not use em dashes.
9. Give every discussion entry its own date, timestamp, timezone, and estimated reading time.
10. Include an ISO 8601 timestamp for new conversations when the exact time is available.
11. Never invent a historical timestamp. Clearly mark unavailable times and record when the entry itself was added.
12. Update the changelog and discussion record together before each commit when both contain relevant project history.
13. Fact-check and sanity-check consequential claims against current primary sources.
14. Keep the glossary and **Further reading** section current.
15. Embed source links near important external claims whenever it helps the reader verify them.
16. Keep intended tools in a table with their role, selection reason, status, privacy impact, and official source.
17. Keep the project plan’s data flow aligned with approved storage and network boundaries.
