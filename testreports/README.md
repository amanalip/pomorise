# Pomorise Test Report Index

| Document information | Value |
| --- | --- |
| Created | August 16, 2026 at 2:28 AM EDT |
| Last updated | August 16, 2026 at 2:50:30 AM EDT |
| ISO 8601 last updated | `2026-08-16T02:50:30-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Estimated reading time | 8 minutes |
| Verification status | Fact-checked and sanity-checked against the implementation plan and linked primary testing documentation |

This directory is the permanent evidence library for Pomorise testing. Every meaningful phase, test run, or independently verified step receives its own folder, detailed Markdown report, raw logs, screenshots, and supporting artifacts.

## Table of contents

- [Report navigation](#report-navigation)
- [Required directory structure](#required-directory-structure)
- [Identifier rules](#identifier-rules)
- [When a report is required](#when-a-report-is-required)
- [Required evidence](#required-evidence)
- [Paired development documents](#paired-development-documents)
- [Screenshot rules](#screenshot-rules)
- [Logging rules](#logging-rules)
- [Report lifecycle](#report-lifecycle)
- [Navigation maintenance](#navigation-maintenance)
- [Privacy and security](#privacy-and-security)
- [Glossary](#glossary)
- [Further reading](#further-reading)
- [Maintenance rules](#maintenance-rules)

## Report navigation

No implementation test run has been completed yet. Add every future report to the top of this table when its directory is created.

| Date | Identifier | Scope | Environment | Result | Screenshots | Development narrative | Report |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Not run | `_template` | Reusable report structure only | Not applicable | Template | Instructions only | [`development_docs/_template/doc.md`](../development_docs/_template/doc.md) | [`_template/test_report.md`](_template/test_report.md) |

Result values are `Passed`, `Failed`, `Blocked`, `Incomplete`, or `Template`. A report that includes any unexplained failure, missing required screenshot, missing command log, or unchecked closeout item cannot be marked `Passed`.

## Required directory structure

Every report must use the structure requested for the project:

```text
testreports/<phase_or_run_or_step>/test_report.md
```

Supporting evidence stays inside that same report directory:

```text
testreports/<phase_or_run_or_step>/
|-- test_report.md
|-- screenshots/
|   |-- 001-initial-state.png
|   |-- 002-tested-result.png
|   `-- 003-runner-summary.png
|-- logs/
|   |-- 001-install.txt
|   |-- 002-tests.txt
|   `-- 003-build.txt
`-- artifacts/
    |-- results.json
    `-- trace.zip
```

Only create evidence subdirectories that the run uses. The report itself and `screenshots/` evidence are mandatory for every real report. Command-only runs use a terminal or test-reporter screenshot.

## Identifier rules

The `<phase_or_run_or_step>` directory name must be lowercase, stable, readable, and safe in links.

Use one of these patterns:

- `phase-01-foundation`
- `phase-03-timer-engine`
- `run-2026-08-16-timer-recovery`
- `step-light-theme-keyboard-review`
- `step-import-validation-retest`

Do not use spaces, personal names, temporary numbers without meaning, or result words such as `passed` in the directory name. A later retest stays in the original report when it addresses the same run. A genuinely separate run receives a new identifier.

## When a report is required

Create a report for:

- Every one of the seven implementation phases.
- Every continuous-integration or release-candidate run used as completion evidence.
- Every focused browser, accessibility, privacy, storage, migration, offline, responsive, or performance run that informs a decision.
- Every failure investigation that changes implementation or acceptance status.
- Every retest that cannot be understood clearly inside the original report.
- Every deployed-site verification run.

Tiny exploratory commands that do not support a decision may be recorded inside the active report rather than receiving a separate directory. When uncertain, preserve the evidence.

## Required evidence

Every real `test_report.md` must contain:

- Human-readable document timestamps, matching ISO 8601 timestamps, timezone, and estimated reading time.
- Exact test start and finish timestamps with dates, timezone, and measured duration.
- Scope, exclusions, requirements, and acceptance criteria.
- Commit hash, branch, build mode, URL, operating system, browser, viewport, locale, timezone, and relevant dependency versions.
- Test-data description proving that only synthetic data was used.
- Every command with its start time, end time, duration, exit code, and raw log path.
- Every manual action in reproducible order.
- Individual case IDs, expected results, actual results, status, evidence, and notes.
- Complete pass, fail, blocked, skipped, and flaky totals.
- Failure symptoms, reproduction steps, suspected cause, decision, fix, and retest history.
- Accessibility, responsive, privacy, network, storage, offline, performance, and comment-coverage results when relevant.
- Embedded screenshots with captions and an index.
- Links to logs, traces, videos, coverage, JSON, HTML, and other artifacts that were retained.
- Known limitations, residual risks, deferred tests, and follow-up actions.
- The mandatory phase closeout checklist when the report closes a phase.
- An evidence-based final conclusion.

The reusable structure lives in [`_template/test_report.md`](_template/test_report.md).

## Paired development documents

The test report answers whether the work behaved correctly. The development document explains what was built, why it was designed that way, how the system works, and what a beginner should understand.

Use the same stable identifier for both:

```text
development_docs/<identifier>/doc.md
testreports/<identifier>/test_report.md
```

Each real test report must link its paired development document. Each development document must link back to the report. When testing changes a design decision or invalidates an assumption, update both records without removing the original failure or reasoning history.

## Screenshot rules

Screenshots are mandatory in every real report.

1. Store screenshots under the report’s own `screenshots/` directory.
2. Use ordered filenames such as `001-light-theme-desktop.png`.
3. Capture the relevant interface or terminal surface only.
4. Use synthetic tasks, notes, history, and settings.
5. Inspect every image for personal data, tokens, private tabs, notifications, usernames, unrelated applications, and sensitive paths.
6. Record the capture timestamp, case ID, viewport, theme, expected state, observed state, and result in the screenshot index.
7. Embed every screenshot with meaningful alternative text and a relative path.
8. Capture both the successful state and any important failure state.
9. For responsive or themed behavior, capture each representative viewport or theme needed to prove the claim.
10. For command-only testing, capture readable terminal or test-reporter output after the run completes.

A screenshot is supporting evidence, not proof by itself. The report must also retain the command output, assertions, and observed behavior that explain what the image means.

## Logging rules

Every test command and manual check must be traceable.

- Preserve raw command output under `logs/` when the command affects a reported conclusion.
- Record commands exactly without including secrets.
- Record nonzero exit codes even when a later retry passes.
- Append a retest entry instead of rewriting the original failure out of history.
- Preserve machine-readable reporter output under `artifacts/` when available.
- Link each log and artifact from the command table or test-case table.
- Explain warnings rather than treating a zero exit code as proof that every warning is acceptable.
- Mark skipped, blocked, timed-out, retried, and flaky cases explicitly.
- Record manual observations in the same detail as automated output.

## Report lifecycle

1. Copy `_template/` to the new stable identifier before testing starts.
2. Fill the scope, environment, acceptance criteria, and planned cases.
3. Create `screenshots/`, `logs/`, and `artifacts/` as evidence appears.
4. Record results during the run rather than reconstructing them from memory.
5. Preserve failures and add retests below them.
6. Complete the closeout checklist.
7. Set the final status from the evidence.
8. Add or update the navigation table in this README.
9. Confirm that the paired development document reflects the tested implementation and links back to the report.
10. Synchronize the development-document index, project plan, implementation plan, discussion record, and changelog.

## Navigation maintenance

The newest report appears directly below the template row. Each navigation row must link to its report and state whether screenshots are included. Never delete a failed report merely because a later run passes. Link the later run from the failure report and the failure report from the later run.

If reports become numerous, add phase subsections below the main table without removing the master chronological navigation.

## Privacy and security

Test evidence is committed to the repository, so it must be safe for public viewing.

- Use synthetic data only.
- Never record passwords, tokens, cookies, authorization headers, private keys, email addresses, real tasks, personal reflections, or browser-profile data.
- Avoid screenshots of the full desktop when the application or terminal window is enough.
- Remove or redact sensitive material before committing, while explaining the redaction in the report.
- Do not upload reports, logs, traces, or screenshots to an external reporting service.
- Keep application diagnostics local and user-controlled.

## Glossary

- **Artifact:** A retained machine-generated output such as a JSON result, browser trace, coverage file, or HTML report.
- **Closeout checklist:** The evidence list that must be completed before a phase is marked finished.
- **Development document:** The deep beginner-focused narrative explaining the design, architecture, decisions, assumptions, files, and learning path behind the tested work.
- **Flaky test:** A test that produces different results without an intentional code or environment change.
- **Raw log:** The unabridged output captured from a test or build command.
- **Residual risk:** A known risk that remains after current controls and testing.
- **Screenshot index:** The table connecting every image to its test case, environment, expected state, and observed state.
- **Synthetic data:** Invented test information that contains no real visitor or contributor data.
- **Test report:** The permanent evidence record for a phase, run, or independently verified step.
- **Trace:** A browser-test artifact that can preserve actions, timing, network information, console output, and page state for debugging.

## Further reading

- [Pomorise implementation plan](../implementation_plan.md)
- [Pomorise development documentation index](../development_docs/README.md)
- [Playwright screenshots](https://playwright.dev/docs/screenshots)
- [Playwright reporters](https://playwright.dev/docs/test-reporters)
- [Playwright trace viewer](https://playwright.dev/docs/trace-viewer-intro)
- [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots)
- [Vitest reporters](https://vitest.dev/guide/reporters)

## Maintenance rules

1. Add every real report to the navigation table.
2. Keep report identifiers stable after they are committed.
3. Preserve failed and superseded evidence for history.
4. Require screenshots and raw logs for every real report.
5. Use only synthetic data and inspect every retained artifact for sensitive information.
6. Keep paths relative so reports render on GitHub Pages and in repository viewers.
7. Update the timestamp, reading time, table of contents, glossary, and references whenever this README changes substantially.
8. Keep the writing precise, detailed, beginner-friendly, and free of em dashes.
9. Pair every real report with the matching development document identifier and maintain links in both directions.
