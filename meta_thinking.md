# Pomorise Discussion and Decision Record

| Document information | Value |
| --- | --- |
| Created | August 15, 2026 at 10:36 PM EDT |
| Last updated | August 15, 2026 at 10:37 PM EDT |
| Timezone | America/Toronto (UTC−04:00) |
| Estimated reading time | 3 minutes |

This document preserves the important project discussions, user requests, decisions, and working agreements. It is a project memory—not a record of private internal reasoning.

## Table of contents

- [Project origin](#project-origin)
- [Working agreement](#working-agreement)
- [Discussion history](#discussion-history)
  - [Initial request](#2026-08-15--initial-request)
  - [Process correction](#2026-08-15--process-correction)
  - [First proposed feature group](#2026-08-15--first-proposed-feature-group)
  - [Project documentation requested](#2026-08-15--project-documentation-requested)
- [Confirmed decisions](#confirmed-decisions)
- [Open decisions](#open-decisions)
- [Maintenance rules](#maintenance-rules)

## Project origin

- Pomorise will be a Pomodoro website.
- The site will be hosted on GitHub Pages.
- Current tagline: **“Rise one session at a time.”**
- The repository already contains a GitHub Actions workflow that deploys static content to GitHub Pages.

## Working agreement

- Decide the product before implementation begins.
- Work step by step rather than planning or building everything at once.
- Discuss and approve the feature set first.
- Discuss and approve the design direction after the features are settled.
- Build only after the important decisions have been made.
- Do not assume that an early idea is approved simply because it was suggested.
- Keep this document updated when an important requirement, decision, constraint, or change in direction appears.

## Discussion history

### 2026-08-15 — Initial request

The project owner requested a Pomodoro website intended to run on GitHub Pages.

### 2026-08-15 — Process correction

An initial visual implementation was started before the feature set and design were agreed upon. The project owner clarified that the process should be incremental: decide the features and direction first, then build. The unapproved website files were removed, restoring the repository to its original state.

This established an important project rule: **discussion and approval come before implementation.**

### 2026-08-15 — First proposed feature group

The following core timer features were proposed for discussion but have **not yet been approved**:

- 25-minute focus session
- 5-minute short break
- 15-minute long break
- Start, pause, reset, and skip controls
- Automatic switching between focus and break sessions
- A sound notification when a session ends

These are proposals only. They must not be treated as final requirements until the project owner confirms or changes them.

### 2026-08-15 — Project documentation requested

The project owner requested three living documents:

- `meta_thinking.md` to preserve important discussion points
- `changelog.md` to preserve detailed information about every commit
- `project_plan.md` to preserve the project’s direction

### 2026-08-15 — Documentation structure revised

The project owner requested a table of contents in every populated Markdown document. They also requested that `project_plan.md` remain present but have no contents so its direction can be written collaboratively from scratch.

## Confirmed decisions

- Product: Pomodoro website
- Hosting target: GitHub Pages
- Process: features first, design second, implementation afterward
- Documentation: maintain a discussion record, detailed changelog, and project plan

## Open decisions

- Final timer modes and durations
- Which timer controls are required
- Whether sessions should advance automatically
- Whether sound, browser notifications, or both should be supported
- Task-management features, if any
- Progress and history features, if any
- Settings and customization options
- Visual direction
- Accessibility and offline expectations beyond a sensible baseline

## Maintenance rules

When this file is updated:

1. Add dated discussion entries rather than silently replacing history.
2. Clearly distinguish proposals from approved decisions.
3. Move items into **Confirmed decisions** only after approval.
4. Keep **Open decisions** current.
5. Record major reversals and explain what changed at a project level.
6. Refresh the **Last updated** timestamp and reading-time estimate whenever this document changes substantially.
7. Keep the table of contents aligned with the document’s headings.
