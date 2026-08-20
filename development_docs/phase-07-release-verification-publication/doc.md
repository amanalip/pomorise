# Phase 7: Release Verification and Publication

| Document information | Value |
| --- | --- |
| Phase | 7 of 7 |
| Created | August 20, 2026 at 6:53 PM EDT |
| Last updated | August 20, 2026 at 7:04 PM EDT |
| ISO 8601 last updated | `2026-08-20T19:04:00-04:00` |
| Timezone | America/Toronto (UTC-04:00) |
| Estimated reading time | 9 minutes |
| Release | Pomorise 1.0: First Light |
| Verification status | Complete; comprehensive report passed |

## Table of contents

- [Purpose and result](#purpose-and-result)
- [Scope](#scope)
- [Release architecture](#release-architecture)
- [Verification method](#verification-method)
- [UX and UI review](#ux-and-ui-review)
- [Performance work](#performance-work)
- [Production backup defect](#production-backup-defect)
- [Deployment](#deployment)
- [Privacy and accessibility](#privacy-and-accessibility)
- [Files and commits](#files-and-commits)
- [Decisions and tradeoffs](#decisions-and-tradeoffs)
- [Limitations](#limitations)
- [Beginner learning path](#beginner-learning-path)
- [Final evidence](#final-evidence)

## Purpose and result

Phase 7 turns an implementation-ready application into an evidence-backed public release. Its job is not to add a broad new feature set. Its job is to prove that the integrated product works from a clean install, in real production browsers, in the generated static build, through the deployment workflow, and at the public URL.

The phase passed. Pomorise 1.0 is published at [amanalip.github.io/pomorise](https://amanalip.github.io/pomorise/). The final report records 70 passed automated cases, 16 passed manual cases, one explicit automated skip for WebKit, and one explicit manual skip for a dedicated screen reader. Every application defect found during the suite was fixed and retested.

## Scope

The phase verified the complete First Light promise:

- A visitor can set an intention and begin a focus session quickly.
- The timer derives remaining time from timestamps and recovers after reload.
- Tasks, captures, sessions, reflections, and preferences remain local.
- Compatible older data migrates without losing visitor wording.
- Backup, restore, scoped deletion, and preference reset behave exactly as described.
- The application installs, reopens offline, and waits for consent before applying updates.
- The interface remains usable across representative mobile and desktop sizes and in light and dark themes.
- The production artifact remains inside its performance and size budgets.
- GitHub Actions blocks publication unless formatting, linting, tests, browsers, and the build pass.

## Release architecture

The browser receives a static Vite application from GitHub Pages under the `/pomorise/` base path. React owns visible state, while small boundary modules own timer persistence, structured IndexedDB records, validation, and backup formatting. A generated service worker precaches only application assets. Personal data does not enter that cache or any runtime request.

Startup follows this sequence:

1. The static HTML, core CSS, and main React bundle render the timer shell.
2. Timer state recovers from local storage using timestamps rather than decrement history.
3. Structured planning data hydrates from IndexedDB after a short startup delay.
4. Planning inputs become available only after hydration, preventing a late load from overwriting immediate input.
5. Local data controls load only when settings needs them.
6. Service-worker registration begins after the primary screen has had time to paint.

This separation keeps the timer responsive while preserving local durability and offline readiness.

## Verification method

The release used one permanent evidence suite rather than several disconnected pass claims. The sequence was:

1. Install the exact lockfile from a clean dependency state.
2. Check formatting, linting, strict types, unit tests, component tests, and the production build.
3. Run production-style browser cases in Chromium and Firefox.
4. Inspect IndexedDB migration, import validation, destructive scopes, caches, network requests, permissions, and offline recovery.
5. Profile mobile performance three times and use the median.
6. Inspect mobile and desktop layouts in light and dark themes.
7. Publish only through the gated GitHub Pages workflow.
8. Repeat critical focus, refresh, theme, network, offline, backup, restore, and deletion checks against the public URL.
9. Keep original failures beside passing retests.

The workflow itself is part of the release control. A successful local build alone cannot publish the site.

## UX and UI review

The final review found that the original mobile first screen asked a visitor to scroll before reaching the main action. It also found that a non-actionable offline-ready toast could cover controls. The release candidate therefore:

- Shortened the first-screen introduction.
- Tightened timer spacing without making the interface feel crowded.
- Kept Focus, Short break, and Long break in one clear horizontal group on mobile.
- Preserved a large, high-contrast Start focus action above the sticky navigation.
- Removed the non-actionable ready toast while preserving offline and update guidance where action is meaningful.
- Kept destructive data actions behind exact-scope confirmations.
- Used a scrollable settings dialog with a persistent Done action so long ownership content stays recoverable at constrained heights.

Final screenshots at 390 by 844 and 1440 by 900 show the intended hierarchy in both themes. The deployed running state keeps pause, reset, add-minute, skip, and quick capture understandable without turning the screen into a control panel.

## Performance work

The initial three-run mobile profile missed the 2.5-second LCP budget with a median near 2.75 seconds. Inspection showed that the first screen was competing with code and network work that was not needed to start a timer.

The phase separated `DataControls`, Dexie, and Zod into lazy chunks, delayed structured-data hydration by 300 milliseconds, and delayed service-worker registration by 1.5 seconds. These are bounded scheduling choices, not arbitrary sleeps inside the timer. The core timer still recovers immediately from local storage.

The final median was:

- Lighthouse performance score: 97.
- Largest Contentful Paint: 2.453 seconds.
- Cumulative Layout Shift: 0.
- Total Blocking Time: 75 milliseconds.
- Initial JavaScript: 89.23 KiB gzip.
- Complete production directory: 936,393 bytes.

## Production backup defect

The public smoke test found the last application defect. A valid backup was parsed and the preview state was prepared, but the handler then tried to clear `event.currentTarget` after an asynchronous file read. React no longer guaranteed that event target at that point, so the production console reported a null-target error.

The fix retains the native input element before `await file.text()`, then clears that stable element in `finally`. The browser regression now asserts that the file input value is empty after selection. This matters because clearing the value lets a visitor select the same backup again and avoids leaving a stale native file reference in the control.

The correction passed 10 data cases across Chromium and Firefox, the complete GitHub workflow, and the public restore preview. Public replacement and delete-everything also completed, leaving all structured counts at zero.

## Deployment

The release workflow checks out the exact commit, uses Node 24, installs the lockfile, checks source quality, runs unit and component tests, installs Chromium and Firefox, runs the production-browser suite, builds `dist`, uploads only that directory, and deploys it with GitHub Pages.

The final deployment run is [GitHub Actions run 32425974118](https://github.com/amanalip/pomorise/actions/runs/32425974118). It published commit `303bcca934489c53b279fb6dc63e493992553d99` successfully.

## Privacy and accessibility

Runtime performance entries on the public release contained only the `https://amanalip.github.io` origin. Cache inspection found application assets rather than visitor wording. Backup files were created locally, and restore used a local file input without upload.

Accessibility checks combined semantic component tests, Playwright role snapshots, keyboard review, visible state review, reduced-motion behavior, responsive reflow, and axe analysis in Chromium and Firefox. No serious or critical automated finding remained. A dedicated screen-reader application and native WebKit were unavailable, so those are documented residual risks instead of implied coverage.

## Files and commits

| Commit | Purpose |
| --- | --- |
| `8fdd646` | Completed local migration, reset, browser coverage, workflow gates, and first UX corrections |
| `fb59b1c` | Protected planning inputs during IndexedDB hydration |
| `cc48c40` | Aligned component evidence with hydration readiness |
| `7e10f77` | Split startup work and met performance budgets |
| `700ee3a` | Set package and visible release identity to `1.0.0` |
| `303bcca` | Fixed and tested the deployed backup-preview input reset |

Evidence, report navigation, release notes, and gate status are completed by the Phase 7 closeout commit that follows those tested application commits.

## Decisions and tradeoffs

### Two supported automation engines for release

Chromium and Firefox run locally and in CI. WebKit was not forced into the CachyOS environment because its required Ubuntu libraries need administrator installation and an unlaunchable browser would create false confidence. Reconsider when a compatible WebKit or macOS runner is available.

### Lazy ownership controls

Local data controls are important, but they do not belong in the first interaction path. Loading them when settings opens reduces startup work. The tradeoff is a small first-open delay inside settings, which the loading state communicates.

### Consentful service-worker updates

The application never reloads an active timer automatically to activate an update. A waiting update remains visitor-controlled. This slightly delays new code adoption but protects the current focus session.

### Release passes with explicit assistive-technology limitations

The available semantic and automated evidence is strong enough to release, while the missing native screen-reader and WebKit checks stay visible. A future release should add them when the correct host environments are available.

## Limitations

- Native Safari/WebKit behavior remains unverified.
- A dedicated NVDA, VoiceOver, or Orca walkthrough remains unverified.
- GitHub's official Pages actions currently emit a Node 20 deprecation annotation while GitHub forces them onto Node 24. The workflow still succeeds.
- A transitive `glob@11.1.0` package emits a deprecation warning. `npm audit` reports zero known vulnerabilities.
- Lighthouse is lab evidence and cannot predict every visitor device or network.

## Beginner learning path

A new contributor should follow the release from outside inward:

1. Read `project_plan.md` to understand the product promise.
2. Read `implementation_plan.md` to understand the seven gates.
3. Read `src/app/App.tsx` to see visible state and feature composition.
4. Read `src/timer/` for timestamp recovery.
5. Read `src/data/database.ts` and `src/data/backup.ts` for local ownership boundaries.
6. Read `.github/workflows/static.yml` to see what blocks deployment.
7. Read the final report to connect each claim to commands, cases, screenshots, failures, and retests.

The most important release lesson is that public smoke testing can find defects that broad local automation misses. A release is complete only after the deployed artifact, not merely the source tree, proves its critical flows.

## Final evidence

The permanent evidence record is [the First Light final comprehensive report](../../testreports/final-comprehensive-suite/test_report.md). Its result is **Passed**.
