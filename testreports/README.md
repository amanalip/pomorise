# Pomorise Test Report Index

| Document information | Value |
| --- | --- |
| Created | August 16, 2026 at 2:28 AM EDT |
| Last updated | August 20, 2026 at 12:52:35 PM EDT |
| ISO 8601 last updated | `2026-08-20T12:52:35-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Estimated reading time | 8 minutes |
| Verification status | Fact-checked and sanity-checked against the implementation plan and linked primary testing documentation |

This directory will contain one comprehensive, permanent test report for Pomorise 1.0: First Light. Focused checks still run during Phases 1 through 6, but their concise results live in the relevant development documents. Phase 7 runs the complete suite and preserves its detailed logs, screenshots, failures, retests, and conclusion here.

## Table of contents

- [Report navigation](#report-navigation)
- [Two-level verification model](#two-level-verification-model)
- [Required directory structure](#required-directory-structure)
- [When the final report is created](#when-the-final-report-is-created)
- [Required final evidence](#required-final-evidence)
- [Development-document traceability](#development-document-traceability)
- [Screenshot rules](#screenshot-rules)
- [Logging rules](#logging-rules)
- [Final report lifecycle](#final-report-lifecycle)
- [Privacy and security](#privacy-and-security)
- [Fact-check and sanity-check record](#fact-check-and-sanity-check-record)
- [Glossary](#glossary)
- [Further reading](#further-reading)
- [Maintenance rules](#maintenance-rules)

## Report navigation

No implementation or final release test has run yet.

| Date | Identifier | Scope | Result | Screenshots | Development narratives | Report |
| --- | --- | --- | --- | --- | --- | --- |
| Not run | `_template` | Reusable final-suite structure | Template | Instructions only | Link during Phase 7 | [`_template/test_report.md`](_template/test_report.md) |
| Not run | `final-release-verification` | Complete First Light suite | Not run | Not captured | Not linked yet | Create during Phase 7 |

The final result must be `Passed`, `Failed`, `Blocked`, or `Incomplete`. Any unexplained failure, missing required evidence, or unchecked final closeout item prevents a `Passed` result.

## Two-level verification model

Pomorise uses two levels of testing:

| Level | Timing | Purpose | Record |
| --- | --- | --- | --- |
| Focused phase checks | During Phases 1 through 6 | Catch defects close to the code that introduced them | Concise command, outcome, failure, and correction notes in the related `development_docs/<identifier>/doc.md` |
| Comprehensive final suite | During Phase 7 | Test the integrated application and deployed release as one complete product | Detailed `testreports/final-release-verification/test_report.md` with logs, screenshots, artifacts, and conclusion |

Focused checks are not optional. They are deliberately smaller than the final suite. A phase cannot close with a known unresolved failure merely because the comprehensive suite is scheduled later.

## Required directory structure

The final evidence must use this stable structure:

```text
testreports/final-release-verification/
|-- test_report.md
|-- screenshots/
|   |-- 001-initial-state.png
|   |-- 002-complete-focus-loop.png
|   `-- 003-test-runner-summary.png
|-- logs/
|   |-- 001-clean-install.txt
|   |-- 002-complete-suite.txt
|   `-- 003-production-build.txt
`-- artifacts/
    |-- results.json
    `-- trace.zip
```

Only create artifact types that the final run produces. The report, screenshots, and applicable raw command logs are mandatory.

## When the final report is created

Create the final report only during Phase 7, after Phases 1 through 6 have completed their focused checks and development documentation.

The final report covers:

- Clean dependency installation.
- Formatting, linting, and strict TypeScript checks.
- The complete unit and component suites.
- Integration and regression behavior.
- End-to-end focus-loop behavior in real browsers.
- Timer accuracy, recovery, pause, reset, skip, completion, and overtime behavior.
- Local persistence, migration, import, export, and deletion.
- Keyboard, screen-reader, zoom, contrast, reduced-motion, and automated accessibility checks.
- Light, dark, mobile, tablet, and desktop presentation.
- Privacy, runtime network activity, browser storage, and cache boundaries.
- Offline loading, application updates, and service-worker behavior.
- Performance and production bundle budgets.
- Production build and GitHub Pages repository-path handling.
- Smoke verification on the deployed GitHub Pages URL.
- Line-by-line code-comment coverage and companion annotations.

## Required final evidence

The completed report must contain:

- Human-readable creation and update timestamps, ISO 8601 timestamps, timezone, and estimated reading time.
- Exact test start and finish times and measured duration.
- Full commit hash, branch, build mode, URL, operating system, browsers, viewport sizes, locale, timezone, and tool versions.
- Synthetic test-data description.
- Every command with start time, end time, duration, exit code, expected result, actual result, and raw log path.
- Every manual procedure in reproducible order.
- Individual case identifiers, expected results, actual results, status, and evidence.
- Pass, fail, blocked, skipped, and flaky totals.
- Failure symptoms, reproduction steps, likely cause, correction or deferral decision, and retest history.
- Accessibility, responsive, privacy, network, storage, offline, performance, deployment, and comment-coverage findings.
- Embedded screenshots with descriptive captions and a screenshot index.
- Links to retained logs, traces, videos, coverage, and machine-readable results.
- Known limitations, residual risks, deferred checks, and follow-up actions.
- A checked final release closeout list.
- An evidence-based conclusion.

## Development-document traceability

The final report must link the development documents that explain all seven phases. Each development document must link forward to the final report after it exists.

This relationship separates two questions:

- Development documents explain what changed, why it changed, how it was designed, and which focused checks ran.
- The final report proves how the integrated release behaved at the end.

The documents no longer require matching identifiers because many phase narratives lead into one final release report.

## Screenshot rules

Screenshots are mandatory in the final report.

1. Store them under `testreports/final-release-verification/screenshots/`.
2. Use ordered, descriptive filenames.
3. Capture only the relevant application, browser, terminal, or test-reporter surface.
4. Use synthetic tasks, notes, history, and settings.
5. Inspect every image for tokens, personal data, notifications, unrelated tabs, usernames, and sensitive paths.
6. Record the capture timestamp, case identifier, viewport, theme, expected state, observed state, and result.
7. Embed every retained screenshot with meaningful alternative text.
8. Capture successful primary states and diagnostically important failures.
9. Include representative light, dark, mobile, desktop, offline, and deployed states.
10. Include a readable command or test-runner summary.

A screenshot supports a conclusion but does not replace assertions, logs, or manual observations.

## Logging rules

- Preserve raw output for every final-suite command that affects the conclusion.
- Record commands exactly without exposing secrets.
- Preserve nonzero exit codes even when a later retry passes.
- Add retest entries instead of erasing earlier failures.
- Preserve machine-readable results when the tools provide them.
- Explain warnings, skipped cases, blocked cases, timeouts, retries, and flaky results.
- Keep focused phase results concise inside their development documents rather than creating extra report directories.

## Final report lifecycle

1. Finish focused checks and development documents for Phases 1 through 6.
2. Copy `_template/` to `final-release-verification/` at the start of Phase 7 verification.
3. Fill the environment, scope, acceptance criteria, and planned cases.
4. Run the complete suite and record evidence as it appears.
5. Preserve failures and append retests.
6. Deploy only the approved production artifact.
7. Run deployed-site smoke checks and add their evidence.
8. Complete the final closeout checklist and conclusion.
9. Add the report link to this index and every relevant development document.
10. Synchronize the plans, discussion record, changelog, and release notes.

## Privacy and security

All evidence is intended for a public repository.

- Use synthetic data only.
- Never record passwords, tokens, cookies, authorization headers, private keys, email addresses, real tasks, personal reflections, or browser-profile data.
- Do not upload evidence to an external reporting service.
- Capture the smallest relevant surface.
- Redact sensitive material before committing and explain any redaction.
- Keep application diagnostics local and user-controlled.

## Fact-check and sanity-check record

| Verification information | Value |
| --- | --- |
| Last verified | August 20, 2026 at 12:52:35 PM EDT |
| Verification scope | Seven-phase verification model, focused checks, final-suite coverage, report path, evidence, screenshots, privacy, and development-document traceability |
| Primary sources | Confirmed Pomorise plans plus Playwright and Vitest documentation linked below |
| Result | One final report reduces repeated documentation while focused phase checks preserve early defect detection |

The model passed these sanity checks:

- **Timing fit:** Small checks run near each change, and complete integration testing runs once at the end.
- **Evidence fit:** The final report retains detailed logs and screenshots without duplicating them seven times.
- **Debugging fit:** Phase documents retain enough focused results to locate where a defect first appeared.
- **Privacy fit:** Only synthetic and reviewed evidence enters the repository.
- **Traceability fit:** The final report links back to all phase narratives.

## Glossary

- **Artifact:** A retained machine-generated output such as a JSON result, browser trace, coverage file, or HTML report.
- **Comprehensive final suite:** The complete Phase 7 verification of the integrated local and deployed application.
- **Focused phase check:** A small test or review selected because it directly protects behavior changed in the current phase.
- **Regression test:** A repeated test that protects behavior known to work before a later change.
- **Residual risk:** A known uncertainty remaining after current controls and testing.
- **Synthetic data:** Invented test information containing no real visitor or contributor data.
- **Test report:** The permanent evidence record for the comprehensive final suite.
- **Trace:** A browser artifact that preserves actions and diagnostic state for debugging.

## Further reading

- [Pomorise implementation plan](../implementation_plan.md)
- [Pomorise development documentation index](../development_docs/README.md)
- [Playwright screenshots](https://playwright.dev/docs/screenshots)
- [Playwright reporters](https://playwright.dev/docs/test-reporters)
- [Playwright trace viewer](https://playwright.dev/docs/trace-viewer-intro)
- [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots)
- [Vitest reporters](https://vitest.dev/guide/reporters)

## Maintenance rules

1. Keep one detailed release report unless the project owner explicitly changes this policy.
2. Keep focused phase results in development documents.
3. Never defer a known phase failure solely because final testing happens later.
4. Preserve failed and superseded evidence in the final report.
5. Use synthetic data and inspect every retained artifact.
6. Keep paths relative so documents render in repository viewers.
7. Update timestamps, reading time, table of contents, glossary, references, and verification records after substantial changes.
8. Keep the writing detailed, engaging, beginner-friendly, and free of em dashes.
