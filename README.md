# Pomorise

Rise one session at a time.

| Document information | Value |
| --- | --- |
| Last updated | August 15, 2026 at 11:16 PM EDT |
| Timezone | America/Toronto (UTC−04:00) |
| Estimated reading time | 2 minutes |
| Verification status | Fact-checked and sanity-checked against the linked primary documentation |

## Table of contents

- [Overview](#overview)
- [Project status](#project-status)
- [Privacy direction](#privacy-direction)
- [Glossary](#glossary)
- [Further reading](#further-reading)

## Overview

Pomorise is a Pomodoro website planned for deployment on GitHub Pages.

The goal is simple: make it easier to choose one meaningful task, give it your full attention, and return refreshed after a well-timed break. The feature set and design will be shaped carefully before development begins.

## Project status

Pomorise is in product planning. The approved foundation is React, TypeScript, and Vite, producing a static website for [GitHub Pages](https://docs.github.com/en/pages). The current product direction lives in [`project_plan.md`](project_plan.md).

## Privacy direction

Pomorise will work without sign-in, application analytics, advertising trackers, or server-side user data. Tasks, sessions, reflections, and preferences will stay in the visitor’s browser unless they choose to export them.

Browser storage is device-local and can be cleared or evicted, so Pomorise will provide transparent backup and deletion controls. See [MDN’s client-side storage guide](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_APIs/Client-side_storage) for the underlying browser model.

## Glossary

- **GitHub Pages:** Static website hosting provided by GitHub.
- **Local-first:** A product approach that keeps personal information on the user’s device by default.
- **Pomodoro:** A focus interval followed by a restorative break, traditionally using 25-minute focus sessions.
- **Progressive web app (PWA):** A website enhanced with installable and offline-capable behavior.
- **Vite:** The development and build tool selected to produce Pomorise’s static website files.

## Further reading

- [Project plan](project_plan.md)
- [Discussion and decision record](meta_thinking.md)
- [Detailed commit changelog](changelog.md)
- [GitHub Pages documentation](https://docs.github.com/en/pages)
- [React: Adding interactivity](https://react.dev/learn/adding-interactivity)
- [Vite: Deploying a static site](https://vite.dev/guide/static-deploy.html)
- [MDN: What is a progressive web app?](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/What_is_a_progressive_web_app)
