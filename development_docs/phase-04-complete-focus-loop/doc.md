# Phase 4: Complete focus loop

| Document information   | Value                                                                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Created                | August 20, 2026 at 5:03:48 PM EDT                                                                                                        |
| Last updated           | August 20, 2026 at 7:04:00 PM EDT                                                                                                        |
| ISO 8601 last updated  | `2026-08-20T19:04:00-04:00`                                                                                                              |
| Timezone               | America/Toronto (UTC−04:00)                                                                                                              |
| Estimated reading time | 5 minutes                                                                                                                                |
| Verification status    | Complete; focus-loop implementation and comprehensive Phase 7 acceptance evidence passed |

## Current status

Phase 4 is implementation-complete. Visitors can move from optional intention and a deliberately small task plan into focus, capture distractions without stopping the timer, review those thoughts, reflect or skip, choose a quiet or guided break, and see private daily and weekly progress derived from completed sessions.

## Architecture

| Boundary                                | Responsibility                                                                                     |
| --------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `src/focus/planning.ts`                 | Pure planning types, bounds, initial state, and legal intention and task transitions               |
| `src/focus/journey.ts`                  | Pure distraction, session, reflection, summary, and break-guide boundaries                         |
| `src/app/App.tsx`                       | Controlled intention field, native task form, current-task presentation, selection, and completion |
| `src/styles/global.css`                 | Calm nested task surfaces, responsive controls, completion state, and corrected logo masking       |
| `src/tests/unit/focus-planning.test.ts` | Deterministic task validation, capacity, selection, and completion checks                          |
| `src/tests/unit/focus-journey.test.ts`  | Deterministic capture, review, reflection, idempotence, and summary calculations                   |
| `src/tests/component/App.test.tsx`      | Visitor journey from intention and task entry through completion                                   |

Planning is kept separate from the timer engine. Updating or completing a task cannot change a timestamp, timer phase, or remaining duration. The first task becomes current automatically to remove an unnecessary choice, while each later selection is explicit.

The timer completion timestamp is the unique session-record identity. A React effect can safely request the same record more than once because the pure reducer ignores duplicate completion boundaries. Automatic transitions pause after focus so distraction review and optional reflection remain reachable. After save or skip, an enabled automatic-flow preference starts the break immediately. Completed breaks may still return to focus automatically.

## Scope boundaries

The task list is deliberately capped at five entries. Session estimates use a fixed one-to-eight range because the feature is a focus aid, not a scheduling system. Every visitor-authored title is rendered through normal React text interpolation, which preserves it as text rather than executable markup.

The current planning state is transient. This is explicit in the interface because Phase 5 owns Dexie stores, Zod trust boundaries, migrations, export, import, and deletion. Introducing ad hoc persistence in Phase 4 would weaken that later data contract.

## Complete journey

- Intention is optional, bounded, and editable before a session.
- Up to five tasks support one-to-eight-session estimates, current selection, completion, and idempotent carry-forward credit.
- Quick capture is available during running, paused, and overtime focus states and never sends a timer event.
- Post-session distraction review offers convert to task, keep for later, and dismiss outcomes.
- Reflection shows completed minutes and keeps next step, rating, and notes optional, with an explicit skip action.
- Breaks default to quiet and offer local breathing, stretching, hydration, eye-rest, and movement guidance.
- Daily sessions, daily minutes, and trailing-seven-day sessions derive from transient records.
- The visual rise uses a decorative sunrise paired with a complete semantic definition list.
- First-level navigation moves focus to Timer, Tasks, or Progress without introducing a trapping wizard.

## Header correction

The tightly cropped approved PNG still contains its original small tagline. The earlier readable text overlay began too low, allowing the upper parts of the raster letters to show behind it. A theme-aware positioned mask now covers the complete baked-in tagline only beneath the wordmark. The logo symbol and its descending stem remain visible, and the replacement tagline is painted once above the mask.

After that correction, compact review showed that the left symbol still emphasized the sunrise ring more than the intended lowercase `p`. Coordinated light and dark header variants now make the plum or pale bowl and connected descending stem the dominant silhouette, while keeping the segmented timer and sunrise as inset details. The source-approved palette, wordmark, and tagline remain consistent.

## Verification completed

- `npm run format:check`: passed.
- `npm run lint`: passed with zero warnings.
- `npm run build`: strict TypeScript and the Vite production build passed.
- `npm test`: 22 unit and component tests passed.
- `npm run test:browser`: five Chromium cases passed, including same-origin privacy, automated accessibility, timer recovery, theme persistence, and 320-pixel reflow.
- Manual Playwright inspection: desktop and 390-pixel mobile screenshots showed one clean tagline and no planning-control overflow.
- Visitor-generated task titles remained plain rendered text in the component journey.

## Next phase boundary

Phase 5 should replace transient arrays with versioned Dexie records, Zod validation, migrations, export, import, and deletion. It should preserve the Phase 4 reducer semantics rather than changing the completed focus journey.

## Further reading

- [Implementation plan](../../implementation_plan.md)
- [Product plan](../../project_plan.md)
- [Phase 3 reliable timer engine](../phase-03-reliable-timer-engine/doc.md)

## Final evidence

The integrated focus-loop evidence passed in the [Phase 7 final comprehensive report](../../testreports/final-comprehensive-suite/test_report.md).
