# Phase 3: Reliable timer engine

| Document information | Value |
| --- | --- |
| Created | August 20, 2026 at 4:50:39 PM EDT |
| Last updated | August 20, 2026 at 7:04:00 PM EDT |
| ISO 8601 last updated | `2026-08-20T19:04:00-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Estimated reading time | 7 minutes |
| Verification status | Complete; deterministic, browser recovery, responsive, accessibility, and Phase 7 release evidence passed |

## Purpose

Phase 3 turns the static 25-minute shell into Pomorise's dependable core. It supports focus, short-break, and long-break modes; idle, running, paused, completed, skipped, and overtime states; recovery after refresh or throttling; and visitor-controlled completion behavior.

## The accuracy rule

The 250-millisecond browser interval is only a request to repaint the display. It does not subtract 250 milliseconds and it does not count callbacks. Starting a session stores an absolute `targetEndAt` timestamp. Every visible value comes from `targetEndAt - Date.now()`.

This distinction protects the timer when a browser delays callbacks. Four callbacks do not automatically equal one second, and one delayed callback can account for several real seconds. The deterministic suite explicitly proves that 250 milliseconds advances one quarter-second and 1,000 milliseconds advances exactly one second. The browser suite also starts a real 25-minute timer, waits 1.15 seconds, observes `24:59`, reloads the page, and confirms that the running state survives.

## Architecture

| Boundary | Responsibility |
| --- | --- |
| `src/timer/engine.ts` | Pure types, legal events, state transitions, duration derivation, overtime, cycle selection, and formatting |
| `src/timer/storage.ts` | Zod validation, versioned local keys, safe restoration, and meaningful-transition persistence |
| `src/timer/useTimer.ts` | Display refresh, visibility recovery, wall-clock checks, announcements, sound, notifications, and optional automatic flow |
| `src/app/App.tsx` | Accessible mode selection, clock name, controls, recovery choice, and settings |

The engine has no browser clock hidden inside it. Every event receives an explicit `now` value, which makes boundary behavior deterministic and easy to test.

## States and transitions

- Idle can start, select a mode, or accept a custom duration.
- Running can pause, reset, skip, add time, complete, or recover from a clock change.
- Paused can resume, reset, skip, or add time.
- Completed can advance, reset, or enter overtime.
- Skipped can advance or reset.
- Overtime can advance, reset, or skip.

Invalid requests throw `InvalidTimerTransitionError`. Invalid duration and added-time values throw `RangeError`. Custom durations use a central 1-to-180-minute bound. Manual advancement is the safe default because exact automatic-transition behavior remained an open product decision; automatic flow is available as an explicit local setting.

## Recovery and persistence

Meaningful transitions are stored in `pomorise.timer.v1`. Display refreshes do not write to storage. On reload, Zod rejects malformed state. A running timer restores its target timestamp and either resumes accurately or enters completed state when the target has passed.

While the page is open, Pomorise compares wall-clock progress with `performance.now()`. A disagreement above five seconds is treated as a meaningful device-clock change. The interface stops normal refresh and asks whether to keep the previously shown remaining time or trust the changed clock. It does not silently invent session history.

## Completion paths

The visible clock is not a live region, so screen readers are not asked to read every second. A separate polite status announces starts, pauses, resumes, added time, completion, and recovery choices.

Sound is synthesized locally with Web Audio. Its audio context is prepared during a start or resume gesture so a later completion tone can work within browser autoplay rules. Notifications are off by default and permission is requested only after the visitor explicitly enables them. Denied or unsupported notifications leave every timer control usable.

## Header presentation correction

The approved source logos contain a large blank canvas and a tagline that becomes too small at header scale. Phase 3 adds derived, tightly cropped light and dark header assets without changing the approved mark. The interface also restates the tagline as theme-aware text over the tiny raster wording. Real-browser inspection covered desktop and 320-pixel mobile layouts, where the tagline remains visible without horizontal overflow.

## Verification completed

- `npm test`: 14 unit and component tests passed.
- `npm run lint`: zero warnings before final documentation synchronization.
- `npm run build`: strict TypeScript and the production Vite build passed.
- Playwright: five Chromium cases passed, including the exact one-second display check, reload recovery, same-origin privacy, axe analysis, and 320-pixel reflow.
- Manual browser inspection: light-theme desktop and 320-pixel mobile header and timer layouts were reviewed from screenshots.

The comprehensive Phase 7 suite will repeat and expand these checks with full evidence, hidden-tab recovery, permission variants, device sleep, and a simulated clock-change review.

## Decisions carried forward

- The familiar defaults remain 25, 5, and 15 minutes.
- Manual transitions remain the default; automatic transitions are opt-in.
- Custom duration bounds are centralized so the product owner can revise them without rewriting the state machine.
- Phase 4 can now build intention, tasks, distraction capture, guided breaks, and reflection on a deterministic timer boundary.

## Further reading

- [Implementation plan](../../../implementation_plan.md)
- [Product plan](../../../project_plan.md)
- [Phase 2 design system and shell](../../phase-02-design-system-shell/doc.md)
- [Timer source boundary](../../../src/timer/README.md)

## Final evidence

The integrated timer and recovery evidence passed in the [Phase 7 final comprehensive report](../../testreports/final-comprehensive-suite/test_report.md).
