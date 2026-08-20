# Pomorise

Rise one session at a time.

| Document information | Value |
| --- | --- |
| Created | August 15, 2026 at 10:14:39 PM EDT |
| Last updated | August 20, 2026 at 4:50:39 PM EDT |
| ISO 8601 last updated | `2026-08-20T16:50:39-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Estimated reading time | 3 minutes |
| Verification status | Fact-checked and sanity-checked against the linked primary documentation |

## Table of contents

- [Overview](#overview)
- [Project status](#project-status)
- [Development commands](#development-commands)
- [Privacy direction](#privacy-direction)
- [Glossary](#glossary)
- [Further reading](#further-reading)

## Overview

Pomorise is a Pomodoro website planned for deployment on GitHub Pages.

The goal is simple: make it easier to choose one meaningful task, give it your full attention, and return refreshed after a well-timed break. Development is organized into seven implementation phases so the product can grow without losing its reliability, accessibility, or privacy boundaries. One comprehensive suite verifies the integrated product at the end of Phase 7.

## Project status

Phases 1 through 3 are implementation-ready. Pomorise now has a reproducible React, TypeScript, and Vite foundation, a responsive light and dark application shell, and a timestamp-based focus timer with recovery, accessible controls, custom durations, optional automatic transitions, local sound, and contextual browser notifications. The first complete public release is named **Pomorise 1.0: First Light**. The product direction lives in [`project_plan.md`](project_plan.md), the seven-phase sequence lives in [`implementation_plan.md`](implementation_plan.md), and the latest technical narrative lives in [`development_docs/phase-03-reliable-timer-engine/doc.md`](development_docs/phase-03-reliable-timer-engine/doc.md).

After all implementation phases are ready, one comprehensive Phase 7 report will preserve commands, raw logs, screenshots, failures, retests, and the evidence-based release conclusion. It is indexed in [`testreports/README.md`](testreports/README.md).

Every meaningful development unit will also produce a beginner-focused technical narrative explaining its design method, system design, decisions, assumptions, architecture, files, flows, tradeoffs, and learning path. These documents are indexed in [`development_docs/README.md`](development_docs/README.md).

## Development commands

Use Node.js 24 and the committed npm lockfile.

| Command | Purpose |
| --- | --- |
| `npm ci` | Recreate the exact reviewed dependency graph |
| `npm run dev` | Start the local Vite development server |
| `npm run format:check` | Detect formatting drift in Phase 1-owned files |
| `npm run lint` | Run strict static analysis with zero warnings allowed |
| `npm run typecheck` | Run TypeScript without generating files |
| `npm run test:unit` | Run deterministic unit tests |
| `npm run test:component` | Run React behavior tests |
| `npm run test:browser` | Build and run Playwright against `/pomorise/` |
| `npm run build` | Type-check and generate the static `dist` directory |
| `npm run preview` | Serve the generated production site locally |

## Privacy direction

Pomorise will work without sign-in, application analytics, advertising trackers, or server-side user data. Tasks, sessions, reflections, and preferences will stay in the visitor’s browser unless they choose to export them.

Browser storage is device-local and can be cleared or evicted, so Pomorise will provide transparent backup and deletion controls. See [MDN’s client-side storage guide](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_APIs/Client-side_storage) for the underlying browser model.

## Glossary

- **GitHub Pages:** Static website hosting provided by GitHub.
- **First Light:** Pomorise 1.0 and the project’s first complete public release.
- **Exit gate:** The implementation-readiness conditions for Phases 1 through 6, or the passing comprehensive verification required to finish Phase 7.
- **Development document:** The detailed beginner-focused explanation of what was built in one phase, run, step, or commit and why it works that way.
- **Local-first:** A product approach that keeps personal information on the user’s device by default.
- **Pomodoro:** A focus interval followed by a restorative break, traditionally using 25-minute focus sessions.
- **Progressive web app (PWA):** A website enhanced with installable and offline-capable behavior.
- **Test report:** The permanent evidence record for the comprehensive Phase 7 verification suite.
- **Vite:** The development and build tool selected to produce Pomorise’s static website files.

## Further reading

- [Project plan](project_plan.md)
- [Implementation plan](implementation_plan.md)
- [Development documentation index](development_docs/README.md)
- [Test report index](testreports/README.md)
- [Discussion and decision record](meta_thinking.md)
- [Detailed commit changelog](changelog.md)
- [GitHub Pages documentation](https://docs.github.com/en/pages)
- [React: Adding interactivity](https://react.dev/learn/adding-interactivity)
- [Vite: Deploying a static site](https://vite.dev/guide/static-deploy.html)
- [MDN: What is a progressive web app?](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/What_is_a_progressive_web_app)
