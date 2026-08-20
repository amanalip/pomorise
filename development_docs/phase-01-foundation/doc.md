# Pomorise Development Document: Phase 1 Foundation and Guardrails

| Document information | Value |
| --- | --- |
| Started | August 20, 2026 at 1:35 PM EDT |
| Last updated | August 20, 2026 at 1:45:43 PM EDT |
| ISO 8601 last updated | `2026-08-20T13:45:43-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Estimated reading time | 14 minutes |
| Status | Implementation-ready for the Phase 7 comprehensive suite |

## Executive explanation

Phase 1 turned a documentation-only repository into a reproducible React application foundation. Pomorise now has an exact dependency graph, strict TypeScript and lint rules, deterministic formatting, unit and component test layers, a real-browser privacy and accessibility harness, a production build under `/pomorise/`, and the existing GitHub Pages deployment boundary.

The visible interface is intentionally small. It proves that React, TypeScript, local CSS, typed interaction, and both approved logos work together without taking design-system decisions away from Phase 2. It is a foundation screen, not the finished timer.

This phase is called **implementation-ready**, not **Passed**. The commands below were targeted diagnostics used to prove and correct the scaffold. The single evidence-bearing comprehensive suite remains scheduled for Phase 7.

## Identity and scope

| Field | Value |
| --- | --- |
| Identifier | `phase-01-foundation` |
| Phase | 1: Foundation and guardrails |
| Branch | Current working branch |
| Commit | Pending project-owner commit |
| Starting state | Documentation, approved logos, and a guarded GitHub Pages workflow; no package manifest or application source |
| Ending state | Reproducible application scaffold with quality commands and planned final-suite coverage |
| Comprehensive report | Not created; Phase 7 owns `testreports/final-comprehensive-suite/test_report.md` |

## Requirements implemented

| Phase 1 requirement | Implementation |
| --- | --- |
| React and TypeScript Vite scaffold | `index.html`, `src/main.tsx`, `src/app/App.tsx`, and `vite.config.ts` |
| GitHub Pages repository base | `base: "/pomorise/"` in `vite.config.ts` |
| Exact dependency versions | Exact versions in `package.json` and full integrity graph in `package-lock.json` |
| Strict TypeScript | `strict` plus indexed-access, optional-property, unused-code, casing, and switch protections in `tsconfig.json` |
| ESLint and Prettier | Typed ESLint flat configuration and deliberately scoped formatting commands |
| Test layers | Vitest, Testing Library, user-event, Playwright, and axe configuration plus first specifications |
| Source boundaries | Dedicated `app`, `components`, `timer`, `data`, `schemas`, `styles`, `assets`, and `tests` directories |
| Product-specific proof | Approved light and dark logos, semantic page copy, local styling, and an accessible disclosure interaction |
| Runtime network boundary | Playwright records every request and rejects origins outside the local application origin |
| Commenting review | Every authored code, style, configuration, test, and workflow line receives an adjacent beginner explanation; JSON has companion annotations |
| Ignore policy | `.gitignore` excludes dependencies, builds, generated reports, local secrets, caches, logs, editor settings, and operating-system noise |

## Design method

The phase used a risk-first scaffold method:

1. Preserve confirmed decisions instead of regenerating the repository blindly.
2. Resolve build and privacy boundaries before feature behavior.
3. Install only the approved toolset at exact versions.
4. Create the smallest product-specific vertical slice through HTML, React, CSS, assets, tests, build, and Pages routing.
5. Give each future risk area a named source boundary without prematurely implementing it.
6. Run targeted diagnostics to expose configuration mistakes while they are still cheap to correct.
7. Record remaining comprehensive checks for Phase 7 rather than converting diagnostics into a premature release claim.

This ordering made two integration risks observable immediately: the test runners initially overlapped, and the local browser server could not connect inside the restricted workspace sandbox. The runner overlap was a real configuration defect and was corrected. The sandbox restriction was an execution-environment boundary; the unchanged browser suite passed once localhost permission was granted.

## System design

### Build-time flow

```text
package.json + package-lock.json
             |
             v
          npm ci
             |
             v
TypeScript checks -> Vite build -> dist/
                              |
                              v
                 GitHub Pages artifact
```

`npm ci` recreates the reviewed dependency graph. `npm run build` first runs TypeScript without emitting loose JavaScript, then Vite transforms modules, fingerprints local assets, and writes only static files to `dist`. The existing workflow uploads only that directory.

### Browser flow

```text
/pomorise/index.html
         |
         v
  /src/main.tsx
         |
         v
    React <App />
      /       \
local CSS   bundled approved logo
```

The production base path is part of the build configuration, not manually repeated throughout application code. Vite rewrites imported assets to fingerprinted `/pomorise/assets/...` addresses. The browser receives no remote font, script, image, API, analytics, or telemetry request from Pomorise.

### Test ownership

| Layer | Directory | Runner | Initial responsibility |
| --- | --- | --- | --- |
| Unit | `src/tests/unit` | Vitest | Prove deterministic typed logic executes correctly |
| Component | `src/tests/component` | Vitest and Testing Library | Prove semantic identity and realistic interaction behavior |
| Browser | `src/tests/browser` | Playwright | Prove the built repository path renders and protects runtime network and accessibility boundaries |

Vitest has explicit include patterns. This matters because Playwright also exports a function named `test`, but that function must run only inside Playwright's own process and fixture lifecycle.

## Important file responsibilities

### Application files

- `index.html` declares the accessible English document, viewport, React root, and local module entry.
- `src/main.tsx` validates the root contract and mounts the application under React StrictMode.
- `src/app/App.tsx` renders the minimal semantic shell, approved system-theme logo, and typed disclosure interaction.
- `src/styles/global.css` provides only enough local styling for a readable proof. Final tokens and components remain Phase 2 work.
- Boundary README files explain what later phases may place under `components`, `timer`, `data`, `schemas`, and `assets`.

### Tooling files

- `package.json` defines exact direct dependencies, Node/npm engines, and the stable development command interface.
- `package-lock.json` is npm-generated and records transitive versions plus integrity hashes.
- `vite.config.ts` owns the Pages base path, React transform, and Vitest separation.
- `tsconfig.json` owns strict language analysis; `code_annotations/tsconfig-json.md` explains its non-commentable JSON.
- `eslint.config.js` applies type-aware recommended rules to compiled TypeScript while ignoring generated outputs.
- `prettier.config.js` and `.prettierignore` make formatting deterministic without mechanically rewriting the established planning-history documents.
- `playwright.config.ts` owns the built-site browser profile, local preview lifecycle, retries, and traces.
- `.github/workflows/static.yml` retains its existing guarded Pages design and now explains every automation line.
- `.gitignore` prevents unnecessary or sensitive local artifacts from being uploaded.

### Review files

- `dependency_review.md` records direct versions, licenses, roles, runtime compatibility, and the zero-vulnerability registry result observed during scaffolding.
- `quality_baseline.md` defines the rolling browser-support policy and measurable release performance budgets.
- `code_annotations/package-json.md` explains every meaningful strict-JSON manifest field and the generated lockfile boundary.

## Dependency decisions

The exact direct package graph is recorded in `dependency_review.md`. Runtime code is limited to React, React DOM, Dexie, and Zod. Dexie and Zod are installed now because the approved Phase 1 scope requires a reviewed lockfile for the confirmed stack, but they are not pulled into the initial browser bundle because their owning local-data phase has not begun.

The Vite PWA plugin is likewise installed but not activated. Activating a service worker changes caching and update behavior, so Phase 6 retains ownership of that product and privacy decision.

The dependency audit reported no known vulnerabilities. npm emitted a deprecation warning for a transitive `glob` package during clean installation. Pomorise does not declare that package directly. It is a residual supply-chain warning to recheck before Phase 7 rather than a reason to replace the approved test toolchain without evidence.

## Privacy, accessibility, and performance boundaries

### Privacy

- The app requires no `.env` value, secret, account, endpoint, or backend.
- Runtime dependencies are locally bundled.
- The browser test fails when a request crosses the local application origin.
- The workflow uploads only `dist`.
- Local environment variants are ignored, with a future safe `.env.example` exception.

### Accessibility

- The document declares English and contains one semantic main landmark and one top-level heading.
- The approved logo has concise alternative text.
- The disclosure is a native button with a state-dependent label.
- Revealed content uses a polite status role.
- Keyboard focus is visibly outlined in both system color schemes.
- The targeted axe diagnostic found no serious or critical violation.

### Performance

The generated JavaScript was approximately 60.30 kB gzip, below the 175 KiB initial JavaScript budget. The build contains both approved source logos, but the `<picture>` element lets the browser choose the system-theme source. Phase 6 must measure actual transferred resources under the documented profile and may optimize image delivery without changing the approved artwork.

## Targeted diagnostics and corrections

| Diagnostic | Outcome | Meaning |
| --- | --- | --- |
| `npm ci` | Completed from the lockfile | The exact graph can be recreated in the current environment |
| `npm run format:check` | Completed | Phase 1-owned files match Prettier |
| `npm run lint` | Completed with zero warnings | Typed source satisfies the configured static rules |
| `npm run typecheck` | Completed | Strict TypeScript accepted application, tests, and typed configuration |
| `npm run test` | 2 files and 3 tests completed | Unit and component harnesses execute separately from browser specs |
| `npm run build` | Created `dist` | Vite produced fingerprinted static files under the Pages base configuration |
| `npm run test:browser` | 2 Chromium tests completed | Built app rendered, stayed same-origin, and had no serious or critical axe finding |
| `npm audit` during install | Zero known vulnerabilities | Registry metadata found no known issue in the installed graph at that time |

The first combined Vitest run found the Playwright specification because Vitest's default discovery was too broad. `vite.config.ts` now includes only unit and component patterns. This is the expected value of a targeted scaffold diagnostic: it corrected test ownership before later coverage multiplied.

The first Playwright attempt could start Vite but the managed sandbox rejected its localhost connection with `EPERM`. The same command passed after explicit localhost permission. No application or test logic changed to work around the sandbox.

## Phase 7 acceptance mapping

| Final-suite criterion | Coverage prepared now | Phase 7 action still required |
| --- | --- | --- |
| Clean `npm ci` | Exact lockfile and engine constraints | Run in the clean recorded release environment |
| Format, lint, and TypeScript | Stable scripts and strict configurations | Preserve complete final logs |
| First unit and component tests | Three initial assertions | Run inside the integrated suite |
| Production `dist` | Build script and Pages base | Inspect complete release artifact |
| `/pomorise/` behavior | Playwright base URL and render assertion | Verify all release routes and deployed site |
| Actions parity | Workflow uses `npm ci` and `npm run build` | Capture GitHub Actions evidence |
| No secrets | No runtime environment contract exists | Inspect release workflow and built requests |

## Manual checks queued for Phase 7

- Navigate the deployed shell entirely by keyboard and inspect focus order and focus contrast.
- Review the shell with supported screen readers and at 200 and 400 percent zoom.
- Inspect compact mobile widths, landscape, wide desktop, and supported browser engines.
- Inspect the browser Network panel after load and interaction for unexpected requests.
- Inspect the deployed artifact and source maps according to the release privacy checklist.
- Confirm no notification, storage, or other permission prompt occurs during foundation startup.
- Record exact browser versions, device profiles, throttling, screenshots, logs, and public Pages URL.

## Known limitations and deferred work

- The screen is a foundation proof, not the final application shell or timer.
- Only Chromium runs in the Phase 1 browser diagnostic; the complete matrix is deferred intentionally.
- System theme selects the proof logo, but explicit persisted theme choice belongs to Phase 2.
- Dexie, Zod, and the PWA plugin are installed but unused until their owning phases.
- No service worker or manifest is generated yet.
- Approved logos are large source PNGs and deserve measured delivery optimization later.
- The public GitHub Pages deployment has not been verified; that is a Phase 7 release gate.
- A transitive `glob` deprecation warning remains visible during install and must be re-audited before release.

## Alternatives rejected

- A stock Vite demo was rejected because it would not prove the approved Pomorise identity or privacy boundary.
- Replacing the existing Pages workflow was rejected because its guarded artifact design already matched the approved architecture.
- Enabling the PWA immediately was rejected because caching behavior belongs to Phase 6 hardening.
- Adding React Router, a state library, remote fonts, or a CSS framework was rejected because the approved single-workspace foundation does not require them.
- Running every browser and release check now was rejected because the approved policy reserves the comprehensive evidence suite for Phase 7.
- Ignoring every Markdown file in Prettier was rejected. The formatter covers new technical documents while established long-form history stays outside mechanical churn.

## Beginner learning path

Read the foundation in this order:

1. `package.json` and `code_annotations/package-json.md` to understand the command and dependency contract.
2. `index.html`, then `src/main.tsx`, then `src/app/App.tsx` to follow browser startup.
3. `src/styles/global.css` to see why local CSS cannot cause a remote font request.
4. `vite.config.ts` and `tsconfig.json` to understand build paths and strict types.
5. The three test directories to understand why unit, component, and browser responsibilities differ.
6. `.github/workflows/static.yml` to follow `npm ci` through the `dist` artifact to Pages.

## Phase closeout checklist

- [x] The approved Phase 1 scope is implemented without a material product or privacy deviation.
- [x] Every Phase 1 final-suite criterion has automated coverage or a documented Phase 7 check.
- [x] Every human-authored code line received adjacent beginner-focused review comments.
- [x] Companion annotations cover `package.json` and `tsconfig.json`; the generated lockfile boundary is explained.
- [x] Unit, component, browser, accessibility, and network-boundary tests are ready for the final suite.
- [x] Manual keyboard, accessibility, responsive, permission, privacy, network, and deployment checks are listed.
- [x] Targeted diagnostics and the one corrected runner-overlap defect are recorded.
- [x] Known limitations, the sandbox condition, image weight, and transitive package warning are explicit.
- [x] This document explains the method, design, decisions, assumptions, files, flows, tradeoffs, and learning path.
- [x] The Phase 1 acceptance criteria are mapped to their Phase 7 coverage.
- [x] `development_docs/README.md` links this document.
- [x] Project status, implementation tracking, conversation history, and changelog are synchronized.
- [x] The Phase 1 implementation gate is ready to be checked while final evidence remains deferred to Phase 7.

## Conclusion

Phase 1 is implementation-ready for comprehensive verification in Phase 7. The foundation is reproducible, strict, locally bundled, same-origin by test, Pages-path aware, and separated into clear future source boundaries. Phase 2 may begin after this closeout is accepted.

