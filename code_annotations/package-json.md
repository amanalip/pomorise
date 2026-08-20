# Line annotation: `package.json`

`package.json` is strict JSON and therefore cannot legally contain comments. This companion explains its human-maintained fields in source order.

- `{` opens the package manifest.
- `name` gives npm and development tools the stable local project identifier `pomorise`.
- `private` prevents an accidental `npm publish` of this application repository.
- `version` records the pre-release application scaffold version; it is not the public First Light release.
- `type` selects ECMAScript modules for Vite, ESLint, Playwright, and configuration files.
- `engines.node` limits development and automation to the confirmed Node.js 24 release line.
- `engines.npm` rejects older npm clients that may not preserve the same modern lockfile behavior.
- `scripts` opens the reproducible command interface used locally and in automation.
- `dev` starts Vite's local development server.
- `format` applies Prettier to the application scaffold, configuration, automation, and Phase 1 technical documents. Long-form planning history remains outside mechanical rewrites so implementation does not create unrelated documentation churn.
- `format:check` detects formatting drift across that same owned Phase 1 scope without changing files.
- `lint` checks all authored code and turns warnings into failures.
- `typecheck` runs strict TypeScript analysis without producing duplicate output.
- `test` runs all Vitest unit and component tests once.
- `test:unit` runs only deterministic logic specifications under `src/tests/unit`.
- `test:component` runs only React behavior specifications under `src/tests/component`.
- `test:browser` builds first and then runs real-browser Playwright specifications against `dist`.
- `build` requires strict types to pass before Vite creates the production `dist` directory.
- `preview` serves the generated production directory for local and Playwright inspection.
- `dependencies` opens the exact packages approved to enter a future browser bundle.
- `dexie` locks the local IndexedDB wrapper reviewed for Phase 5.
- `react` locks the approved interface and built-in state framework.
- `react-dom` locks the browser mounting layer matching React's version.
- `zod` locks the local runtime validator reviewed for Phase 5.
- `devDependencies` opens the exact build-only and test-only tool declarations.
- `@axe-core/playwright` locks the Playwright accessibility adapter.
- `@playwright/test` locks the real-browser runner and fixtures.
- `@testing-library/jest-dom` locks user-visible DOM assertion matchers.
- `@testing-library/react` locks accessible React rendering and queries.
- `@testing-library/user-event` locks realistic component interaction sequences.
- `@types/node` locks types for Node APIs used by configuration files.
- `@types/react` locks React's TypeScript declarations.
- `@types/react-dom` locks React DOM's TypeScript declarations.
- `@vitejs/plugin-react` locks the official Vite React transform.
- `eslint` locks static source analysis.
- `globals` locks explicit browser-global definitions for ESLint.
- `jsdom` locks the browser-like component-test environment.
- `prettier` locks deterministic source formatting.
- `typescript` locks the strict language analyzer.
- `typescript-eslint` locks TypeScript-aware ESLint parsing and rules.
- `vite` locks the local server and static production bundler.
- `vite-plugin-pwa` locks the approved Phase 6 manifest and service-worker integration tool without activating it early.
- `vitest` locks the unit and component test runner.
- The final `}` closes the package manifest.

`npm install --save-exact` generated and updates `package-lock.json`. That generated file records the complete transitive dependency graph and integrity hashes; npm owns its field layout, while `dependency_review.md` records the human dependency decision.
