# Phase 6: Offline experience and quality hardening

| Document information   | Value                                                                                  |
| ---------------------- | -------------------------------------------------------------------------------------- |
| Created                | August 20, 2026 at 6:00 PM EDT                                                         |
| Last updated           | August 20, 2026 at 6:00 PM EDT                                                         |
| ISO 8601 last updated  | `2026-08-20T18:00:00-04:00`                                                            |
| Timezone               | America/Toronto (UTC−04:00)                                                            |
| Estimated reading time | 7 minutes                                                                              |
| Verification status    | Phase 6 implementation complete; comprehensive release verification remains in Phase 7 |

## Learning outcome

After reading this document, a contributor should understand how Pomorise installs, opens offline, requests update consent, excludes personal data from caches, recovers from failures, and stays inside its performance and accessibility guardrails.

## Executive overview

Pomorise now builds as an installable progressive web application. A generated service worker precaches only versioned application files. It has no runtime caching routes, API routes, analytics, or remote dependencies, so IndexedDB and localStorage personal records never enter Cache Storage. A completed online visit prepares the app for a later offline launch.

Updates are prompt-based. A waiting worker cannot replace an active page until the visitor chooses **Update and reload**. Offline, ready, and update states use restrained status notices that do not become part of the timer's live countdown region. Root render failures and IndexedDB hydration failures now have explicit recovery actions that do not clear saved data.

## Requirements traceability

| Phase 6 requirement                | Implementation                                                                          | Targeted evidence                                      |
| ---------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Manifest and identity              | `vite.config.ts`, `index.html`, `public/icons/`                                         | Manifest browser assertion and production build        |
| Versioned app assets only          | Workbox precache with an empty `runtimeCaching` list                                    | Generated `dist/sw.js` and cache-content browser test  |
| Consentful updates                 | `src/components/PwaStatus.tsx`                                                          | Update copy and `registerType: "prompt"` configuration |
| Offline explanation                | `PwaStatus` plus Settings explanation                                                   | Real offline reload browser test                       |
| Denied permissions                 | Guarded notification request and fallback                                               | Denied-notification browser test                       |
| Responsive and accessible behavior | Existing semantic primitives and reduced-motion styles plus Phase 6 status/recovery CSS | Axe and 320/768/1440 viewport browser cases            |
| Recoverable failures               | `AppErrorBoundary` and local-data retry                                                 | Component boundary test and visible storage retry      |
| Performance and network boundary   | Optimized header derivatives and local-only runtime                                     | Build sizes and same-origin browser observer           |

## Solution architecture

```text
Vite production build
  -> hashed JS, CSS, and approved local images
  -> manifest.webmanifest
  -> Workbox precache manifest -> sw.js -> Cache Storage (application files only)

React application
  -> IndexedDB (tasks, sessions, reflections, distractions)
  -> localStorage (timer and appearance preferences)
  -> PwaStatus (offline/install/update state)
  -> AppErrorBoundary (last-resort recoverable UI)
```

Cache Storage and personal-data storage are separate boundaries. The service worker sees navigation and static asset requests. Personal values are written directly by browser storage APIs and are never encoded into URLs, requests, or cached responses.

## Offline and update design

The service worker uses `generateSW` because Pomorise needs a conventional application-shell cache and no custom request handling. `globPatterns` admits built HTML, JavaScript, CSS, manifest, and approved image formats. `runtimeCaching` is deliberately empty. Old precaches are cleaned only after a new version installs.

The first visit still requires a network connection because no worker exists yet. Once installation completes, the interface says the app is ready offline. Later navigations can fall back to the precached `index.html`. A new worker waits while the current one remains active; only the explicit update action sends the skip-waiting request and reloads.

## Accessibility and resilient interaction

- Offline and update messages are semantic status content, but the second-by-second timer remains outside a live region.
- Update and dismissal actions are native buttons with project focus styles and touch-sized geometry.
- The root fallback uses an alert, heading, plain recovery consequences, and keyboard-operable actions.
- Reduced-motion behavior continues to disable smooth scrolling and nonessential transitions.
- Sound and notifications remain off by default. A denied, failed, or unsupported notification request leaves the timer fully usable.
- Responsive tests cover 320, 768, and 1440 pixel widths. The existing compact breakpoint also stacks status controls under enlarged text pressure.

Automated axe analysis reports no serious or critical WCAG A/AA findings. Full assistive-technology, 200 percent browser zoom, contrast-tool, and supported-browser manual matrices remain comprehensive Phase 7 evidence rather than claims inferred from Chromium automation.

## Error handling and recovery

The root error boundary catches unexpected descendant render errors and offers **Try again** or **Reload Pomorise**. Neither action deletes IndexedDB. Storage hydration failures show an inline retry while keeping the timer available. Notification failures are caught and converted into a non-blocking local explanation. Service-worker registration failures leave normal online use intact and transmit no diagnostic data.

## Performance and privacy

The original 1,352-pixel header sources were much larger than their approximately 62-pixel rendered use. Phase 6 adds approved 676 by 236 derivatives. The production result measured:

- Initial JavaScript: approximately 122.86 KiB gzip, below the 175 KiB budget.
- Complete generated precache: approximately 895.18 KiB, below the 1.25 MiB first-visit resource budget.
- No runtime third-party requests in the Playwright same-origin observer.
- No synthetic personal marker in any Cache Storage response body.

LCP, INP, CLS, and a mobile Lighthouse score require the documented device and throttling profile and therefore remain Phase 7 measurements.

## Testing and evidence

The following development checks passed after the implementation:

- `npm run format`
- `npm run typecheck`
- `npm run lint`
- `npm test`: 26 tests passed across 9 files
- `npm run build`
- `npm run test:browser`: 10 Chromium production-style browser tests passed

The browser suite covers offline reload, manifest identity, cache privacy, denied notifications, same-origin runtime requests, axe analysis, session refresh recovery, and representative viewport overflow. Phase 7 performance profiling found that immediate service-worker precaching competed with the timer's first paint. Registration now begins 1.5 seconds after mount, preserving offline installation while allowing the first screen to win startup bandwidth. The final report retains comprehensive logs, screenshots, exact browser versions, performance profiles, and deployed GitHub Pages evidence.

## Decisions, limitations, and follow-up

- A generated worker was chosen over a hand-written worker because no custom runtime route is justified.
- Updates do not auto-reload, even when no timer is running, because one predictable consent rule is calmer and safer.
- Service-worker errors are non-blocking because online timer functionality is still useful; a future diagnostics view may expose local registration state if support needs justify it.
- The manifest scope and start URL intentionally match the confirmed `/pomorise/` GitHub Pages repository path.
- Phase 7 must run the complete browser and assistive-technology matrix, performance profiles, production artifact audit, and deployed offline/update scenarios before release.

## Further reading

- [Implementation plan](../../implementation_plan.md)
- [Quality baseline](../../quality_baseline.md)
- [Phase 5 local data and privacy controls](../phase-05-local-data-and-privacy-controls/doc.md)
