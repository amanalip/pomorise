# Pomorise Development Document: Phase 2 Design System and Application Shell

| Document information | Value |
| --- | --- |
| Document identifier | `phase-02-design-system-shell` |
| Document status | Current |
| Created | August 20, 2026 at 2:10:50 PM EDT |
| Last updated | August 20, 2026 at 7:04:00 PM EDT |
| ISO 8601 created | `2026-08-20T14:10:50-04:00` |
| ISO 8601 last updated | `2026-08-20T19:04:00-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Estimated reading time | 14 minutes |
| Intended audience | Beginners, contributors, reviewers, and the project owner |
| Verification status | Complete; comprehensive Phase 7 release evidence passed |

## Learning outcome

After reading this document, a beginner should be able to explain how Pomorise turns one appearance preference into a responsive themed interface, why the controls use native HTML semantics, which Phase 2 states are real, and why timer behavior remains outside this phase.

## Executive overview

Phase 2 replaces the minimal foundation proof with the first complete application shell. The page now has a compact branded header, a central timer workspace, supporting panels, mobile navigation, a settings dialog, light and dark design tokens, explicit theme persistence, reduced-motion behavior, and reusable project-owned controls.

This is a shell, not a working timer. The countdown remains at 25:00. Reset, skip, and task selection are disabled because their state models belong to later phases. Start focus returns an honest status message explaining that Phase 3 will supply timer controls. This boundary prevents placeholder interactions from becoming accidental product behavior.

The phase is implementation-ready for the final Phase 7 suite. Targeted checks were used during development to diagnose layout and interaction risks, but the permanent release conclusion will come from the single comprehensive report.

## Document and commit identity

| Identity information | Value |
| --- | --- |
| Phase | Phase 2, Design system and application shell |
| Branch | `main` |
| Starting commit | `cd5cbdefde128a9e457bde0e7741982b6e7016d0` |
| Starting commit title | Establish Phase 1 foundation and guardrails |
| Phase 2 commit | Pending owner commit |
| Pull request or issue | None |
| Comprehensive final report | Not created yet |
| Related plan | `implementation_plan.md`, Phase 2 |

## Problem and user value

Phase 1 proved that the project could build and display the approved identity. It did not define reusable component behavior, an explicit appearance setting, a final responsive layout, or the interaction states later features need.

The Phase 2 user story is:

```text
As a Pomorise visitor,
I want a calm interface that respects my appearance and motion preferences,
so that I can prepare to focus comfortably on desktop or mobile.
```

The contributor story is equally important. Later phases need consistent buttons, fields, cards, notices, grouped choices, and modal settings. Establishing those contracts once reduces visual drift and accessibility mistakes.

## Before and after

| Area | Before Phase 2 | After Phase 2 |
| --- | --- | --- |
| Page | Centered foundation proof | Responsive timer-first application shell |
| Theme | System media query in CSS | System, light, or dark preference with local persistence |
| Identity | Picture element chose a logo | Resolved theme chooses the matching approved logo |
| Components | One page-specific button | Project-owned semantic primitives |
| Responsive layout | Temporary centered column | Desktop workspace plus mobile reflow and navigation |
| States | One disclosure | Empty, disabled, informative, permission, and status patterns |
| Motion | No shared rule | Central motion tokens and reduced-motion override |

```text
BEFORE
Browser -> App -> temporary proof

AFTER
Browser
  |
  +-> ThemeProvider -> data-theme -> design tokens -> matching logo
  |
  `-> App shell
        +-> header and navigation
        +-> timer workspace
        +-> supporting panels
        `-> settings dialog -> theme preference -> localStorage
```

## Goals, non-goals, and constraints

### Goals

- Derive light and dark colors from the approved ivory, plum, coral, apricot, and midnight logo directions.
- Define typography, spacing, radius, border, shadow, motion, focus, and layer tokens.
- Provide semantic project-owned controls for common later feature needs.
- Reflow without horizontal page scrolling at the supported mobile width.
- Persist explicit theme preference without creating a network request.
- Respect reduced-motion preference and preserve full interaction without animation.
- Establish honest empty, disabled, status, and permission-explanation patterns.

### Non-goals

- Timer transitions and countdown accuracy belong to Phase 3.
- Tasks, intention persistence, distraction capture, and progress calculations belong to Phase 4.
- Structured local records, migrations, backup, and deletion belong to Phase 5.
- Final icons, offline installation, broad browser hardening, and release publication belong to Phases 6 and 7.

### Fixed constraints

The shell uses no remote font, component library, icon service, analytics, or application API. Every human-authored code line retains an adjacent beginner-focused comment. The approved PNG logos remain the identity source assets. Website source and code contain no em dash characters.

## Requirements traceability

| Requirement | Implementation | Queued or targeted check |
| --- | --- | --- |
| Light and dark tokens | `src/styles/global.css` semantic custom properties | Axe case plus manual palette review |
| Responsive shell | CSS grid and two compact breakpoints | 320 pixel browser overflow case |
| Keyboard controls | Native buttons, input, radios, dialog, and skip link | Browser and component interaction cases |
| Theme persistence | `ThemeProvider.tsx` and `pomorise.theme` | Component storage case and browser reload case |
| Matching logos | Resolved theme selects local imported asset | Component logo assertion and visual review |
| Reduced motion | `prefers-reduced-motion` override | Phase 7 manual and browser coverage |
| Accessible components | `ui.tsx` primitives | Axe and role-based component queries |
| No em dashes | Source copy correction and Unicode code-point guard | `writing-style.test.ts` |

## Design method

The work followed a requirement-first sequence:

1. Read the approved project and implementation plans.
2. Inspected the logo artwork and extracted its approved color character.
3. Kept the timer as the strongest visual object from the conceptual workspace sketch.
4. Identified shared interaction contracts before composing the page.
5. Implemented theme state separately from visual tokens.
6. Used native HTML behavior for buttons, fields, radio groups, and dialogs.
7. Added narrow tests for state, persistence, network boundaries, axe, and overflow.
8. Rendered the built page in a real browser at desktop and 320 pixel widths.
9. Used the visual result to fix one root minimum-width overflow and one radio hit-target issue.
10. Added the project owner's no-em-dash rule as an automated source guard.

This sequence matters because the browser exposed issues that type checking and component tests could not observe.

## Solution architecture

### Theme provider

`ThemeProvider.tsx` owns two inputs:

- `preference` is the visitor's stored choice: system, light, or dark.
- `systemUsesDark` is the current browser media-query result.

`resolveTheme` combines those inputs into light or dark. An effect writes the concrete result to `document.documentElement.dataset.theme`. CSS then changes semantic color tokens under `:root[data-theme="dark"]`.

The provider subscribes to operating-system changes through `matchMedia`. Explicit light or dark choices ignore system changes. System mode follows them.

### Visual token layer

The stylesheet names colors by purpose instead of by appearance. For example, components use `--color-ink`, `--color-surface`, and `--color-focus`. They do not hard-code a light plum or dark lavender value. Theme switching therefore replaces meaning-consistent values without rewriting component selectors.

Geometry and motion tokens remain the same across themes. This keeps spacing, shape, and interaction rhythm stable while colors change.

### Component layer

`ui.tsx` supplies:

- `Button` for primary, secondary, and quiet actions.
- `Card` for semantic content sections.
- `Field` for a visible label, native input, and linked hint.
- `SegmentedControl` for styled native radio buttons inside a fieldset and legend.
- `Notice` for reusable explanation and status surfaces.
- `Dialog` for a labeled native modal surface with a forwarded element reference.

Each primitive forwards native attributes. A caller can add an accessible name, disabled state, live-region role, or event handler without the primitive inventing another private API.

### Application layer

`App.tsx` composes the primitives into the user-visible shell. It owns only short-lived shell state:

- The active navigation label.
- A quiet status message.
- A reference to the settings dialog.

No tasks, sessions, intentions, or progress records are stored. That keeps later state architecture decisions in their planned phases.

## Runtime and data flow

Theme startup follows this sequence:

1. React mounts `ThemeProvider`.
2. The provider safely reads `pomorise.theme` from localStorage.
3. It asks `matchMedia` whether the system currently prefers dark colors.
4. `resolveTheme` selects the concrete palette.
5. The provider writes `data-theme` to the root HTML element.
6. CSS variables repaint every component.
7. `App` selects the approved logo matching the resolved theme.

Theme selection follows this sequence:

1. The visitor opens Settings.
2. The native dialog receives modal focus behavior.
3. The visitor selects a native radio option.
4. React updates `preference`.
5. The provider updates root theme data and localStorage.
6. The page and logo update without a reload or network request.

Storage failure is recoverable. Both reads and writes use `try` blocks. If localStorage is disabled, the current in-memory appearance still works and the application continues in system mode on the next visit.

## Interface and interaction design

The page uses one large timer surface and a narrower supporting column on wide screens. At 58rem and below, those regions become one document column and compact navigation appears at the bottom. At 36rem and below, padding tightens, theme choices stack, action rows may wrap, and large timer digits scale to the available width.

The central visual hierarchy is:

1. Focus session context.
2. One page heading.
3. Optional intention field.
4. Large stable countdown.
5. Primary and unavailable actions.
6. Quiet live status.

Supporting panels use encouraging empty language. Zero sessions is called a gentle start. No selected task is explicitly described as acceptable. Permission guidance explains that prompts will appear only after a visitor chooses the related capability.

## Accessibility design

The shell includes one page heading, a skip link, named navigation landmarks, a main landmark, a labeled support aside, and heading-labeled section regions.

All controls retain native keyboard behavior. The segmented appearance selector uses real radio inputs, not button elements pretending to be radios. Each transparent radio covers its complete visible segment, making the full target reliable for pointer and touch use. The settings surface is a native dialog opened with `showModal`, which supplies browser-owned modality and Escape dismissal.

Focus uses a three-pixel semantic ring with separation from the component edge. Hover, current, active, and disabled states do not rely on motion alone. Disabled controls keep readable labels and visible shapes. The mobile controls meet or exceed a 44 pixel target height.

The status region announces only a meaningful action response. It does not announce the idle clock repeatedly. Phase 3 will define restrained timer announcements.

## Privacy and security design

The only persisted Phase 2 value is one of three appearance strings. It contains no task, session, identity, or reflection information. Theme selection does not call fetch, load a remote font, or request an external asset.

The same-origin browser case observes every page request and fails if one leaves the trusted preview origin. Approved logos, JavaScript, CSS, and the temporary icon are bundled locally by Vite.

Text is rendered through React. No raw HTML injection API is used.

## Error handling and recovery

| Failure | Behavior |
| --- | --- |
| Stored theme is unknown | Validation falls back to system |
| localStorage read throws | Shell follows system appearance |
| localStorage write throws | Current in-memory theme continues |
| Provider is missing | `useTheme` throws a precise developer error |
| Future control has no model | Control is disabled or explains the phase boundary |
| Text zoom tightens layout | Grids, wrapping actions, and stacked segments reflow |
| Reduced motion is requested | Smooth scrolling and transitions become immediate |

## Performance, dependencies, and deployment

Phase 2 adds no dependency. The system font stack avoids a font download. CSS provides presentation without a runtime styling library. React context is sufficient for one small coordinated preference.

The production build retains the `/pomorise/` base path. The approved logos remain the largest assets. Image optimization and final favicon geometry remain release-hardening work because the approved PNGs must not be destructively altered without an approved brand asset decision.

## File-by-file guide

| File | Responsibility in Phase 2 |
| --- | --- |
| `src/components/ThemeProvider.tsx` | Theme validation, resolution, system detection, persistence, and context |
| `src/components/ui.tsx` | Semantic reusable interface primitives |
| `src/app/App.tsx` | Responsive shell composition and honest shell-only interactions |
| `src/styles/global.css` | Tokens, themes, responsive layout, states, motion, focus, and layers |
| `src/main.tsx` | Application-level theme boundary |
| `src/tests/setup.ts` | Browser API shims needed only by jsdom |
| `src/tests/component/App.test.tsx` | Identity, empty states, boundary feedback, and theme behavior |
| `src/tests/browser/network-boundary.spec.ts` | Same-origin, axe, persistence, and mobile reflow cases |
| `src/tests/unit/writing-style.test.ts` | Project-owned source guard for forbidden punctuation |
| `index.html` | Temporary local browser icon and unchanged React mount point |

## Testing and evidence

Targeted diagnostics completed during implementation:

- `npm run format`
- `npm run typecheck`
- `npm run lint`
- `npm run test:unit`: two files and two cases passed.
- `npm run test:component`: one file and three cases passed.
- `npm run build`: production output generated successfully.
- `npm run test:browser`: four Chromium cases passed.

The browser cases cover same-origin loading, serious and critical axe findings, explicit dark-theme persistence after reload, and 320 pixel page overflow. Manual browser rendering covered desktop hierarchy, the compact layout, the settings dialog, and the full native radio hit target.

These results are implementation diagnostics. The final comprehensive suite in Phase 7 will own the permanent release evidence and conclusion.

## Rejected alternatives

- A component library was rejected because it would add a generic visual abstraction and dependency.
- A remote display font was rejected because it would weaken the no-third-party-runtime boundary.
- Buttons with custom ARIA radio behavior were rejected in favor of native radio inputs.
- A custom modal and focus trap were rejected in favor of the native dialog element.
- Persisting the resolved theme was rejected because system mode must continue following future operating-system changes.
- Hiding incomplete controls was rejected where visible disabled states establish a useful future hierarchy.
- Implementing a fake countdown was rejected because Phase 3 owns time correctness.

## Known limitations and follow-up work

- The timer does not run. Phase 3 supplies timestamp-based transitions and recovery.
- Navigation selection does not replace workspace content. Feature destinations arrive later.
- Intention text is not stored. Phase 4 defines its product journey and Phase 5 defines persistence.
- The approved logo files are large PNGs. Phase 6 will harden icons and application assets.
- Manual contrast evidence and 200 percent zoom screenshots belong to the comprehensive Phase 7 report.
- The source guard scans project code, configuration, website documents, annotations, and Markdown while excluding dependencies, generated output, Git internals, and temporary browser evidence.

## Beginner walkthrough

Start with `src/main.tsx` to see where React and the theme boundary enter. Read `ThemeProvider.tsx` next and trace `preference` into `resolvedTheme`. Then inspect the two root token blocks in `global.css`. Finally, read `App.tsx` from the page landmarks inward and open `ui.tsx` whenever a primitive appears.

A useful exercise is to add a temporary warning notice in a local branch. Use `Notice` with `tone="warning"`, then inspect how the same semantic component changes in light and dark themes without receiving color values from React.

## Common mistakes and debugging guide

- If the page stays in one theme, inspect the root `data-theme` attribute before changing CSS.
- If a radio label looks clickable but does not activate, confirm the native input covers the complete label target.
- If mobile content scrolls horizontally, compare `documentElement.scrollWidth` and `clientWidth`, then inspect elements whose bounding rectangles exceed the client width.
- If a component test cannot open the dialog, confirm the jsdom `showModal` shim is active.
- If a new source file fails the writing guard, replace the forbidden punctuation with a period, comma, colon, semicolon, or parentheses according to the sentence.

## Documentation completion checklist

- [x] User-visible outcome and phase boundary documented.
- [x] Theme, state, runtime, responsive, privacy, and accessibility flows documented.
- [x] Files and reusable components mapped.
- [x] Decisions, rejected alternatives, limitations, and follow-up recorded.
- [x] Targeted checks recorded without replacing Phase 7 evidence.
- [x] Code-commenting and no-em-dash rules preserved.

## Glossary

- **Concrete theme:** The actual light or dark palette painted after resolving system preference.
- **Design token:** A named reusable value for color, space, shape, motion, or layering.
- **Native semantics:** Meaning and behavior supplied by standard HTML elements.
- **Resolved theme:** The concrete theme calculated from explicit and operating-system choices.
- **Same-origin:** A request whose scheme, host, and port match the application page.

## Further reading

- [React context](https://react.dev/learn/passing-data-deeply-with-context)
- [MDN: Window matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)
- [MDN: Dialog element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [WAI: Developing a keyboard interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)

## Document maintenance history

| Date | Change |
| --- | --- |
| August 20, 2026 | Created the Phase 2 implementation-ready narrative and acceptance mapping. |

## Maintenance rules

Update this document if theme contracts, primitive APIs, responsive breakpoints, shell hierarchy, or Phase 2 acceptance mappings change. Preserve failed assumptions and defect discoveries instead of rewriting history as if the first design were final.

## Final evidence

The integrated design-system evidence passed in the [Phase 7 final comprehensive report](../../testreports/final-comprehensive-suite/test_report.md).
