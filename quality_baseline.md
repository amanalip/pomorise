# Pomorise Quality Baseline

Phase 1 establishes measurable targets that Phase 6 will harden and Phase 7 will verify comprehensively.

## Browser support target

Pomorise targets the current and previous stable major versions of Chrome, Edge, Firefox, and Safari at release verification time, plus the current and previous major iOS Safari versions. Core focus timing, data ownership, and recovery must degrade explicitly when an optional Web API such as Notifications is unavailable. Phase 7 records the exact versions actually tested rather than allowing this rolling policy to imply unobserved coverage.

The Phase 1 browser harness starts with desktop Chromium because it provides the fastest deterministic foundation diagnostic. Firefox, WebKit, mobile viewports, and the manual assistive-technology matrix are added with their owning implementation phases before comprehensive verification.

## Production performance budgets

| Measure                                   |                                            Release budget | Reason                                                                           |
| ----------------------------------------- | --------------------------------------------------------: | -------------------------------------------------------------------------------- |
| Largest Contentful Paint                  | At most 2.5 seconds at the documented mobile test profile | Keeps the primary focus action responsive on ordinary devices                    |
| Interaction to Next Paint                 |                                  At most 200 milliseconds | Prevents timer controls from feeling delayed                                     |
| Cumulative Layout Shift                   |                                               At most 0.1 | Keeps controls from moving while a visitor is acting                             |
| Lighthouse performance score              |              At least 90 on the documented mobile profile | Provides a repeatable broad regression signal                                    |
| Initial transferred application resources |                At most 1.25 MiB compressed on first visit | Accommodates one approved logo while guarding against uncontrolled bundle growth |
| Initial JavaScript                        |                                At most 175 KiB compressed | Keeps the local-first interactive foundation modest                              |

Phase 6 may reduce these ceilings after approved image optimization and real feature measurements, but may not weaken one without a documented project-owner decision. Phase 7 records the device, browser, throttling profile, commands, raw output, and observed values.
