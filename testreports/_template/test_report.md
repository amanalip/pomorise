# Pomorise Test Report: Replace with Phase, Run, or Step Name

| Document information | Value |
| --- | --- |
| Report identifier | `_template` |
| Report status | Template, replace with `Passed`, `Failed`, `Blocked`, or `Incomplete` in a copied report |
| Created | August 16, 2026 at 2:28:00 AM EDT |
| Last updated | August 16, 2026 at 2:50:30 AM EDT |
| ISO 8601 created | `2026-08-16T02:28:00-04:00` |
| ISO 8601 last updated | `2026-08-16T02:50:30-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Estimated reading time | 15 minutes for this blank template; recalculate after completing a copied report |
| Prepared by | Replace with name or agent |
| Verification status | Template only, no test run recorded |

This template becomes the permanent evidence record for one Pomorise phase, run, or independently verified step. Copy the `_template` directory to `testreports/<phase_or_run_or_step>/`, then replace every instruction and placeholder with observed evidence.

## Table of contents

- [Executive result](#executive-result)
- [Scope and acceptance criteria](#scope-and-acceptance-criteria)
- [Change under test](#change-under-test)
- [Paired development document](#paired-development-document)
- [Test environment](#test-environment)
- [Synthetic test data](#synthetic-test-data)
- [Tools and versions](#tools-and-versions)
- [Command log](#command-log)
- [Automated test results](#automated-test-results)
- [Manual test results](#manual-test-results)
- [Accessibility results](#accessibility-results)
- [Responsive and theme results](#responsive-and-theme-results)
- [Privacy, network, and storage results](#privacy-network-and-storage-results)
- [Offline and update results](#offline-and-update-results)
- [Performance results](#performance-results)
- [Comment coverage audit](#comment-coverage-audit)
- [Failures, defects, and retests](#failures-defects-and-retests)
- [Screenshot index](#screenshot-index)
- [Logs and artifacts](#logs-and-artifacts)
- [Known limitations and residual risks](#known-limitations-and-residual-risks)
- [Mandatory closeout checklist](#mandatory-closeout-checklist)
- [Conclusion](#conclusion)
- [Glossary](#glossary)
- [Further reading](#further-reading)
- [Report maintenance rules](#report-maintenance-rules)

## Executive result

| Result summary | Value |
| --- | --- |
| Overall result | Replace with `Passed`, `Failed`, `Blocked`, or `Incomplete` |
| Started | YYYY-MM-DD HH:MM:SS EDT |
| Finished | YYYY-MM-DD HH:MM:SS EDT |
| ISO 8601 started | `YYYY-MM-DDTHH:MM:SS-04:00` |
| ISO 8601 finished | `YYYY-MM-DDTHH:MM:SS-04:00` |
| Total duration | Replace with measured duration |
| Automated cases | Total: 0, Passed: 0, Failed: 0, Blocked: 0, Skipped: 0, Flaky: 0 |
| Manual cases | Total: 0, Passed: 0, Failed: 0, Blocked: 0, Skipped: 0 |
| Defects opened | Replace with count and links |
| Retests performed | Replace with count |
| Required screenshots | Replace with count |
| Screenshots retained | Replace with count |
| Phase exit gate | Not applicable, unchecked, or passed with evidence |

Write a plain-language summary of what was tested, what passed, what failed, what remains uncertain, and whether the evidence supports the stated result. Never declare success solely because one command returned exit code zero.

## Scope and acceptance criteria

### Included scope

- Replace with each behavior, file group, requirement, or risk included in this report.

### Excluded scope

- Replace with deliberate exclusions and explain why they are outside this run.

### Source requirements

- [`implementation_plan.md`](../../implementation_plan.md): link the phase or requirement being verified.
- [`project_plan.md`](../../project_plan.md): link the product behavior or quality promise being verified.
- Replace with related issue, commit, decision record, or specification links.

### Acceptance criteria

- [ ] Replace with one observable acceptance criterion per checkbox.
- [ ] Connect every criterion to one or more test-case IDs and evidence paths.

## Change under test

| Change information | Value |
| --- | --- |
| Commit hash | Replace with full commit hash |
| Short commit | Replace with short hash |
| Branch | Replace with exact branch name |
| Dirty worktree | Replace with `No` or list intentional uncommitted files |
| Pull request | Replace with link or `None` |
| Build mode | Development, preview, production, or deployed |
| Application URL | Replace with exact local or public URL |
| Previous comparison point | Replace with commit, report, or `None` |

Summarize the implementation change in enough detail that another contributor understands what result is expected without reading the entire diff first.

## Paired development document

Use the same identifier for this report and its technical narrative. Link the real file after it exists:

```text
development_docs/<same-identifier>/doc.md
```

Confirm that the development document explains the implemented design, architecture, decisions, assumptions, files, and limitations reflected by this test run. If evidence changes the design understanding, update the development document without erasing the earlier assumption or decision.

## Test environment

| Environment information | Value |
| --- | --- |
| Operating system | Replace with name and version |
| Architecture | Replace with architecture |
| Node.js | Replace with exact version |
| npm | Replace with exact version |
| Browser engine and version | Replace for every tested browser |
| Viewports | Replace with width by height values |
| Device emulation | Replace with configuration or `None` |
| Color themes | Light, dark, system, or tested subset |
| Reduced motion | Replace with tested values |
| Locale | Replace with locale |
| Test timezone | Replace with timezone |
| Network mode | Online, offline, throttled, or tested set |
| Storage state | Fresh, seeded, migrated, restored, or other |
| Notification permission | Default, granted, denied, unsupported, or tested set |
| Persistent-storage result | Granted, denied, unsupported, not requested, or not applicable |

Record any environment difference that could affect the result. Do not describe the machine vaguely when exact values are available.

## Synthetic test data

| Data set | Purpose | Records | Sensitive-data review | Cleanup result |
| --- | --- | --- | --- | --- |
| Replace with identifier | Explain what behavior it exercises | Replace with counts and representative values | Confirm synthetic only | Explain cleanup |

State explicitly that no real visitor tasks, reflections, history, identifiers, secrets, or browser-profile data were used. List any randomized seed so the data can be reproduced.

## Tools and versions

| Tool | Exact version | Purpose in this run | Configuration path |
| --- | --- | --- | --- |
| Replace with tool | Replace with version | Explain what it verified | Link the configuration |

Record browser binaries separately when their versions differ from the framework package version.

## Command log

| Command ID | Started | Finished | Duration | Exact command | Exit code | Result | Raw log |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CMD-001 | HH:MM:SS | HH:MM:SS | Replace | Replace without secrets | Replace | Passed, Failed, or Blocked | Replace with a link to `logs/001-command-output.txt` after the file exists |

For every command:

1. Explain why it was run.
2. Summarize warnings and errors without hiding them.
3. Preserve its raw output under `logs/`.
4. Record every retry as a new command row.
5. Link failures to the defect and retest sections.

## Automated test results

| Case ID | Layer | Requirement | Preconditions | Steps or command | Expected | Actual | Result | Duration | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AUTO-001 | Unit, component, browser, accessibility, build, or other | Link requirement | Describe setup | Provide reproducible action | Describe observable success | Record observed result | Passed, Failed, Blocked, Skipped, or Flaky | Replace | Link log, screenshot, trace, or artifact |

Add one row for every meaningful case. Grouping is allowed only when individual test names and results remain available in a linked machine report.

### Automated totals

| Status | Count | Case IDs | Explanation |
| --- | --- | --- | --- |
| Passed | 0 | None | Replace |
| Failed | 0 | None | Replace |
| Blocked | 0 | None | Replace |
| Skipped | 0 | None | Replace |
| Flaky | 0 | None | Replace |

## Manual test results

| Case ID | Requirement | Preconditions | Numbered actions | Expected | Actual | Result | Tester | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MAN-001 | Link requirement | Describe setup | List exact reproducible actions | Describe success | Record observation | Passed, Failed, Blocked, or Skipped | Replace | Link screenshots and notes |

Manual checks must record observable behavior rather than “looks good.” Include keyboard keys, pointer actions, touch actions, screen-reader commands, browser settings, and recovery steps when relevant.

## Accessibility results

| Check | Method and tool | Environment | Expected | Actual | Result | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| Keyboard order | Replace | Replace | Logical order with visible focus | Replace | Replace | Link screenshot or notes |
| Accessible names | Replace | Replace | Every control has an accurate name | Replace | Replace | Link output |
| Automated scan | axe with Playwright | Replace | No unreviewed serious or critical findings | Replace | Replace | Link artifact |
| Zoom and reflow | Manual at required zoom | Replace | Content remains usable | Replace | Replace | Link screenshots |
| Reduced motion | Manual and browser emulation | Replace | No required meaning depends on motion | Replace | Replace | Link screenshots |
| Screen reader | Replace reader and browser | Replace | Primary flow is understandable | Replace | Replace | Link detailed notes |

List every accessibility finding, including accepted limitations. Automated tools supplement manual review and do not replace it.

## Responsive and theme results

| Case ID | Viewport | Theme | Input method | Expected | Actual | Result | Screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| VIEW-001 | Replace width by height | Light or dark | Keyboard, pointer, or touch | Describe layout | Describe observation | Replace | Link image |

Include representative mobile, tablet, and desktop widths when the scope can affect them. Capture both light and dark modes when colors, icons, focus states, shadows, or assets changed.

## Privacy, network, and storage results

### Network requests

| Request ID | Method | URL or origin | Initiator | Purpose | Personal data present | Approved | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| NET-001 | Replace | Replace | Replace | Explain | Must be `No` | Yes or No | Link log or trace |

### Storage observations

| Store | Before | Action | After | Expected | Actual | Result | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Replace | Describe keys or synthetic counts | Describe action | Describe keys or counts | Describe expected boundary | Record observation | Replace | Link artifact or screenshot |

Confirm whether tasks, sessions, reflections, settings, diagnostics, and imported values stayed on the device. Confirm whether service-worker caches contained only approved application assets when relevant.

## Offline and update results

| Case ID | Starting state | Network or version change | Expected recovery | Actual recovery | Result | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| OFF-001 | Replace | Replace | Describe | Record | Replace | Link screenshot, trace, and log |

Write `Not applicable` with a reason when the tested change cannot affect offline or update behavior.

## Performance results

| Measurement | Environment | Budget | Observed | Result | Evidence |
| --- | --- | --- | --- | --- | --- |
| Replace | Replace | Replace approved budget | Replace | Passed, Failed, or Not applicable | Link output |

Record the measurement method and repeat count. Do not compare values from meaningfully different environments as if they were equivalent.

## Comment coverage audit

| File | Human-authored code lines | Explained lines | Missing or stale comments | Companion annotation | Result |
| --- | --- | --- | --- | --- | --- |
| Replace with path | Replace | Replace | List lines or `None` | Link or `Not required` | Passed or Failed |

Confirm that comments explain intent accurately and remain synchronized with behavior. Comment lines and blank lines are not counted recursively.

## Failures, defects, and retests

### Failure record template

#### DEF-001: Replace with concise title

| Failure information | Value |
| --- | --- |
| First observed | Timestamp and case ID |
| Severity | Critical, high, medium, or low with rationale |
| Environment | Link or concise environment difference |
| Symptom | Exact observed behavior |
| Expected | Exact expected behavior |
| Reproduction | Numbered reliable steps |
| Evidence | Logs, screenshots, traces, or videos |
| Suspected cause | Evidence-based explanation or `Unknown` |
| Decision | Fixed, deferred, accepted limitation, or blocked |
| Owner | Replace |

##### Retest history

| Retest | Timestamp | Commit | Environment | Steps | Result | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| RETEST-001 | Replace | Replace | Replace | Repeat or link steps | Passed or Failed | Link evidence |

Never delete the original failure after a passing retest.

## Screenshot index

| Screenshot | Captured | Case ID | Viewport | Theme | Expected state | Observed state | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `screenshots/001-initial-state.png` | Timestamp | Replace | Replace | Replace | Replace | Replace | Replace |

Embed each real screenshot below the table using a relative path and meaningful alternative text. Replace this code example rather than leaving it in a completed report:

```markdown
![Pomorise light theme showing the passed timer start state](screenshots/001-timer-start-light.png)
```

### Screenshot 001: Replace with descriptive caption

Explain what the image proves, what it does not prove, which case produced it, and any visual detail the reviewer should inspect.

## Logs and artifacts

| Artifact | Type | Produced by | Purpose | Sensitive-data review | Retention decision |
| --- | --- | --- | --- | --- | --- |
| Replace with relative link | Log, JSON, HTML, trace, video, coverage, or other | Command ID or case ID | Explain | Passed or redacted with note | Keep or explain removal |

Every linked file must exist. Explain why a normally expected artifact is unavailable.

## Known limitations and residual risks

| ID | Limitation or risk | Evidence | User impact | Current control | Follow-up | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| RISK-001 | Replace | Link | Explain | Explain | Define next action | Replace |

Write `None observed` only after reviewing the complete evidence.

## Mandatory closeout checklist

- [ ] The approved scope and every deviation are documented.
- [ ] The paired development document uses the same identifier and matches the implementation under test.
- [ ] Every required validation item is checked and linked to evidence.
- [ ] Every human-authored code line satisfies the commenting standard.
- [ ] Required companion annotations are complete.
- [ ] Every automated command has timestamps, exit code, result, and raw log.
- [ ] Every manual check has reproducible steps and an observed result.
- [ ] Every failure, retry, skipped case, flaky result, and blocked check is explained.
- [ ] Accessibility checks required by the scope are recorded.
- [ ] Responsive and theme checks required by the scope are recorded.
- [ ] Privacy, network, and storage checks required by the scope are recorded.
- [ ] Offline, update, and performance checks are recorded or marked not applicable with reasons.
- [ ] Screenshots exist, are embedded, and connect to test cases.
- [ ] Screenshots and artifacts passed the sensitive-data review.
- [ ] Raw logs and available machine-readable artifacts are linked.
- [ ] Known limitations and residual risks are explicit.
- [ ] The conclusion matches the evidence and totals.
- [ ] `testreports/README.md` links to this report.
- [ ] Related project documents and the changelog are synchronized.
- [ ] The phase exit gate is checked only if every blocking item passed.

## Conclusion

State exactly one final result: `Passed`, `Failed`, `Blocked`, or `Incomplete`.

Explain the evidence supporting that result, the behaviors that are safe to rely on, the behaviors that remain uncertain, and the next required action. A phase report may state `Passed` only when its exit gate, required validation checkboxes, screenshots, logs, and mandatory closeout checklist are complete.

## Glossary

- **Artifact:** A retained machine-generated output such as a JSON result, browser trace, video, coverage file, or HTML report.
- **Blocked:** Testing cannot proceed because a stated dependency or environment condition is unavailable.
- **Exit gate:** The complete evidence requirements that must pass before a phase closes.
- **Development document:** The technical narrative explaining what was built and why, paired with this evidence report.
- **Flaky:** A case produced inconsistent results without an intentional change that explains the difference.
- **Residual risk:** A known risk remaining after the tested controls.
- **Synthetic data:** Invented test information containing no real visitor or contributor data.
- **Trace:** A browser-test artifact used to inspect actions, network events, console output, timing, and page state.

## Further reading

- [Pomorise test report index](../README.md)
- [Pomorise implementation plan](../../implementation_plan.md)
- [Pomorise development documentation index](../../development_docs/README.md)
- [Playwright screenshots](https://playwright.dev/docs/screenshots)
- [Playwright reporters](https://playwright.dev/docs/test-reporters)
- [Playwright trace viewer](https://playwright.dev/docs/trace-viewer-intro)
- [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots)
- [Vitest reporters](https://vitest.dev/guide/reporters)

## Report maintenance rules

1. Replace every placeholder before calling a report complete.
2. Preserve original failures and add retest evidence afterward.
3. Store screenshots, logs, and artifacts inside the report directory.
4. Use relative links and meaningful screenshot alternative text.
5. Use synthetic data only and review every artifact for sensitive information.
6. Keep result totals consistent across the executive summary and detailed tables.
7. Update timestamps, reading time, table of contents, glossary, and sources whenever the report changes substantially.
8. Keep the writing factual, detailed, beginner-friendly, and free of em dashes.
9. Keep the paired development document synchronized with findings, failures, corrections, and changed assumptions.
