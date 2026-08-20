# Pomorise Development Documentation Index

| Document information | Value |
| --- | --- |
| Created | August 16, 2026 at 2:42:00 AM EDT |
| Last updated | August 20, 2026 at 12:52:35 PM EDT |
| ISO 8601 last updated | `2026-08-20T12:52:35-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Estimated reading time | 11 minutes |
| Verification status | Fact-checked and sanity-checked against the implementation plan, documentation system, and linked primary references |

This directory explains Pomorise development in the order it happens. Each document is a beginner-friendly technical narrative for one phase, run, step, or meaningful implementation commit. It records what changed, why it changed, how the system works, which alternatives were rejected, what assumptions were made, and what a new programmer should understand before continuing.

## Table of contents

- [Development document navigation](#development-document-navigation)
- [Purpose](#purpose)
- [Relationship to other project documents](#relationship-to-other-project-documents)
- [Required path](#required-path)
- [Identifier rules](#identifier-rules)
- [When a development document is required](#when-a-development-document-is-required)
- [Required depth](#required-depth)
- [Beginner-first writing standard](#beginner-first-writing-standard)
- [Design and architecture evidence](#design-and-architecture-evidence)
- [Commit and file traceability](#commit-and-file-traceability)
- [Relationship to test reports](#relationship-to-test-reports)
- [Document lifecycle](#document-lifecycle)
- [Privacy and safety](#privacy-and-safety)
- [Fact-check and sanity-check record](#fact-check-and-sanity-check-record)
- [Glossary](#glossary)
- [Further reading](#further-reading)
- [Maintenance rules](#maintenance-rules)

## Development document navigation

No application development step has been completed yet. Add each future development document to the top of this table.

| Date | Identifier | Phase or step | Commit | Main change | Test evidence | Development document |
| --- | --- | --- | --- | --- | --- | --- |
| Not run | `_template` | Reusable structure only | Not applicable | Template instructions | Not applicable | [`_template/doc.md`](_template/doc.md) |

## Purpose

A source diff tells a reader which lines changed, but it does not reliably teach why the change exists or how it fits the system. This document set fills that gap.

Every completed development document should let a beginner answer:

- What problem did this step solve?
- What did the system look like before and after the change?
- Which requirements and constraints shaped the solution?
- Which design method was used?
- Which design and architecture decisions were made?
- Which assumptions were accepted, validated, rejected, or deferred?
- How does data and control move through the changed system?
- Which components, modules, states, schemas, and browser APIs are involved?
- Why was each important file added or changed?
- What could go wrong, and how does the design recover?
- How are privacy, accessibility, performance, and offline behavior protected?
- Which alternatives were considered, and why were they not selected?
- How was the work tested, and where is the evidence?
- What should the next contributor read or do next?

## Relationship to other project documents

Each document type has a separate job:

| Document | Primary question it answers | Typical depth |
| --- | --- | --- |
| `project_plan.md` | What product are we building and why? | Product-wide direction |
| `implementation_plan.md` | In which order will we build it, and what gates must pass? | Seven-phase execution plan |
| `development_docs/<identifier>/doc.md` | What was built in this step, how was it designed, and how does it work? | Deep technical and educational narrative |
| `testreports/final-release-verification/test_report.md` | What evidence shows the complete release works or fails? | Detailed final validation with logs and screenshots |
| `changelog.md` | What did each commit change in the repository history? | Detailed chronological summary |
| `meta_thinking.md` | Which user requests and confirmed decisions shaped the work? | Conversation and decision history |

Development documents record focused checks during Phases 1 through 6. The single Phase 7 final report links all relevant development narratives and preserves complete release evidence.

## Required path

Every development document must use the requested structure:

```text
development_docs/<phase_or_run_or_step>/doc.md
```

Examples:

```text
development_docs/phase-01-foundation/doc.md
development_docs/step-timer-state-machine/doc.md
development_docs/run-2026-08-16-storage-migration/doc.md
```

Focused-check results stay inside the development document. The comprehensive evidence uses one final path:

```text
testreports/final-release-verification/test_report.md
```

## Identifier rules

The `<phase_or_run_or_step>` identifier must be lowercase, stable, descriptive, and safe in links.

- Use `phase-01-foundation` for a full phase narrative.
- Use `step-timer-state-machine` for a bounded implementation step.
- Use `run-2026-08-16-storage-migration` when a run changes the implementation, architecture understanding, or accepted assumptions.
- Do not include personal names, secrets, branch punctuation, spaces, or result words such as `passed`.
- Do not rename an identifier after it is committed unless every inbound link is updated and the rename is recorded.

## When a development document is required

Create or update a development document for:

- Every implementation phase.
- Every meaningful implementation commit.
- Every bounded development step that introduces behavior, architecture, data, styling systems, configuration, or tests.
- Every refactor that changes how a new contributor should understand the system.
- Every migration or data-model change.
- Every accessibility, privacy, security, offline, performance, or deployment change.
- Every test run that causes an implementation change, new architectural knowledge, or a changed assumption.
- Every defect fix whose cause and prevention teach something important about the system.

A documentation-only formatting correction does not need a new development document unless it changes the documented design or learning path. It remains recorded in `changelog.md`.

## Required depth

Every real `doc.md` must include, when relevant:

- Human-readable creation and update timestamps, ISO 8601 timestamps, timezone, and estimated reading time.
- Exact phase, step, run, branch, and commit identity.
- A beginner-friendly executive explanation.
- Before-and-after system behavior.
- Goals, non-goals, constraints, dependencies, and acceptance boundaries.
- The design method and the sequence used to reach the solution.
- System context, module structure, runtime flow, data flow, state flow, and deployment impact.
- Design decisions with context, options, chosen solution, reasoning, tradeoffs, consequences, and reconsideration conditions.
- An assumption register with evidence, status, risk, and validation plan.
- File-by-file and component-by-component walkthroughs.
- Important types, interfaces, schemas, state machines, events, browser APIs, and configuration.
- Interface, content, responsive, theme, motion, keyboard, and accessibility reasoning.
- Privacy, security, data ownership, network, storage, cache, and deletion boundaries.
- Error states, failure modes, recovery paths, and defensive checks.
- Performance choices and measurable budgets where applicable.
- Dependencies introduced, retained, rejected, or removed.
- The line-by-line comment strategy and companion annotations used for non-commentable files.
- Focused-check strategy, commands, outcomes, and a link to the final report after Phase 7.
- Screenshots or diagrams when they materially improve understanding.
- Known limitations, technical debt, deferred work, and revisit triggers.
- A guided reading path and exercises for beginners.
- Glossary, further reading, and maintenance history.

Write `Not applicable` with a reason when a section genuinely does not apply. Do not delete the section silently.

## Beginner-first writing standard

The reader should not need to know the codebase before opening a development document.

- Introduce each technical term before relying on it.
- Explain both what the code does and why Pomorise needs it.
- Start with the user-visible outcome, then move inward toward architecture and code.
- Use small concrete examples with synthetic data.
- Connect file paths to responsibilities rather than presenting a raw file list.
- Explain state transitions and data transformations step by step.
- Identify common misconceptions and likely beginner mistakes.
- Distinguish browser behavior, React behavior, TypeScript behavior, and project-specific conventions.
- Link to authoritative introductory material rather than assuming hidden knowledge.
- Keep diagrams close to the prose that explains them.
- Preserve the project rule that all prose remains free of em dashes.

The line-by-line comments inside code teach the local meaning of individual lines. Development documents teach the wider design, architecture, and reasoning that line comments cannot express efficiently.

## Design and architecture evidence

The template borrows useful ideas from established documentation approaches without forcing a heavyweight methodology.

- System context, component, dynamic, and deployment views may use the vocabulary of the [C4 model](https://c4model.com/).
- Important choices use an architectural-decision format that records context, decision, rationale, tradeoffs, and consequences, consistent with the purpose of [Architectural Decision Records](https://adr.github.io/).
- Architecture coverage includes goals, constraints, context, solution strategy, building blocks, runtime behavior, deployment, crosscutting concerns, decisions, risks, and glossary concepts reflected by [arc42](https://arc42.org/overview/).
- Beginner learning material distinguishes explanation, procedure, reference, and tutorial needs using the ideas described by [Diátaxis](https://diataxis.fr/).

These references guide completeness. Pomorise retains one project-owned template written for this application.

## Commit and file traceability

Every document must identify:

- The full and short commit hashes it explains.
- Whether the worktree contained intentional uncommitted changes during development.
- The previous commit or starting point.
- Every created, modified, moved, or removed file.
- The responsibility of each file before and after the change.
- Important symbols, components, functions, schemas, tests, and configuration keys.
- Related issue, discussion, plan section, changelog entry, and test report.

When one development step spans multiple commits, list them chronologically and explain why the boundary was useful. Do not pretend an uncommitted working state already has a final hash.

## Relationship to test reports

The development document explains the intended system and records focused checks performed near the change. The single final report records comprehensive integrated and deployed evidence.

```text
development_docs/<identifier>/doc.md
testreports/final-release-verification/test_report.md
```

Before Phase 7, a development document may state that a focused check passed, but it must not claim that the whole release passed. After the final suite, each phase document links to the final report. If testing exposes a defect, changed assumption, or design correction, update the affected narrative and final report without erasing earlier reasoning or failure history.

## Document lifecycle

1. Copy `_template/doc.md` to the stable identifier before or during development.
2. Record the requirement, starting point, assumptions, constraints, and intended design.
3. Update the architecture, decisions, files, and flows as implementation becomes concrete.
4. Keep the document synchronized with code and line-by-line comments.
5. Record focused checks and link the final test report after Phase 7 creates it.
6. Incorporate defects, corrections, retests, and revised assumptions.
7. Complete the documentation checklist.
8. Add the document to this navigation table.
9. Update the changelog and decision record.

## Privacy and safety

Development documents are public repository artifacts.

- Use synthetic examples only.
- Never include tokens, credentials, private keys, cookies, personal browser information, or real visitor data.
- Do not paste private environment output without reviewing it.
- Redact sensitive material before committing and explain the redaction.
- Describe security and privacy boundaries without publishing exploitable secrets.
- Link final test screenshots from the release report rather than duplicating large evidence files unnecessarily.

## Fact-check and sanity-check record

| Verification information | Value |
| --- | --- |
| Last verified | August 20, 2026 at 12:52:35 PM EDT |
| Verification scope | Required development-document path, focused phase checks, final-suite traceability, design decisions, assumption tracking, architecture views, beginner learning needs, accessibility references, metadata, and document navigation |
| Primary sources | C4, ADR, arc42, Diátaxis, W3C, and the confirmed Pomorise project documents linked below |
| Result | The structure provides a coherent beginner-focused narrative without duplicating the separate roles of source code, test evidence, changelog history, or product planning |

The structure passed these sanity checks:

- **Purpose fit:** It explains what changed, why, and how rather than repeating a diff.
- **Learning fit:** It introduces prerequisites, examples, reading order, mistakes, exercises, and next learning.
- **Architecture fit:** It covers context, building blocks, runtime, data, state, deployment, decisions, risks, and glossary terms.
- **Evidence fit:** It records focused results without claiming full-release success and links the comprehensive final report after Phase 7.
- **Traceability fit:** Requirements connect to decisions, files, commits, tests, and reports.
- **Privacy fit:** Only synthetic examples and reviewed public-safe artifacts are allowed.

## Glossary

- **Architectural Decision Record (ADR):** A structured record of an important design choice, its context, rationale, tradeoffs, and consequences.
- **Assumption register:** A table of beliefs that influenced the design and the evidence or action needed to validate them.
- **Crosscutting concern:** A rule or behavior, such as privacy or accessibility, that affects many parts of the system.
- **Development document:** The deep technical and educational narrative for one Pomorise phase, run, step, or meaningful implementation commit.
- **Dynamic view:** A step-by-step explanation of how parts of the system collaborate during one runtime scenario.
- **Reconsideration condition:** Evidence or a requirement that would justify revisiting a previous decision.
- **System context:** The system, its users, and the external platforms or boundaries around it.
- **Technical debt:** A known compromise that creates future maintenance or correctness work.
- **Traceability:** The ability to connect requirements, decisions, files, tests, evidence, and commits.

## Further reading

- [Pomorise implementation plan](../implementation_plan.md)
- [Pomorise test report index](../testreports/README.md)
- [C4 model](https://c4model.com/)
- [Architectural Decision Records](https://adr.github.io/)
- [arc42 overview](https://arc42.org/overview/)
- [Diátaxis documentation framework](https://diataxis.fr/)
- [W3C Web Content Accessibility Guidelines overview](https://www.w3.org/WAI/standards-guidelines/wcag/)

## Maintenance rules

1. Add every real development document to the navigation table.
2. Record focused phase checks in each development document and link the one final report after it exists.
3. Preserve decisions, rejected alternatives, assumptions, and changed reasoning.
4. Keep file and commit references accurate.
5. Update the document alongside the implementation rather than reconstructing it later from memory.
6. Use synthetic examples and inspect every embedded artifact for sensitive information.
7. Include human-readable and ISO timestamps, timezone, and estimated reading time.
8. Keep the table of contents, glossary, further reading, and verification record current.
9. Keep the writing detailed, engaging, beginner-friendly, and free of em dashes.
10. Do not close a phase until its focused checks agree with the code, and do not call the release complete until the final report agrees with every relevant development document.
