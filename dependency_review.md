# Pomorise Phase 1 Dependency Review

| Review field             | Decision                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| Runtime                  | Node.js 24, matching the confirmed GitHub Actions workflow                                 |
| Package manager          | npm with exact direct versions and committed lockfile integrity hashes                     |
| Review date              | August 20, 2026                                                                            |
| Registry audit           | `npm audit` reported zero known vulnerabilities after installation                         |
| Runtime network boundary | No selected dependency requires analytics, remote assets, an account, or a product backend |

## Runtime dependencies

| Package   | Exact version | License    | Approved browser role                                     |
| --------- | ------------: | ---------- | --------------------------------------------------------- |
| Dexie     |         4.4.5 | Apache-2.0 | Local IndexedDB wrapper; implementation begins in Phase 5 |
| React     |        19.2.8 | MIT        | Component and local state model                           |
| React DOM |        19.2.8 | MIT        | Mount the React application in the static page            |
| Zod       |         4.4.3 | MIT        | Validate persisted and imported unknown values in Phase 5 |

## Development dependencies

| Package                     | Exact version | License    | Approved build or verification role                                                       |
| --------------------------- | ------------: | ---------- | ----------------------------------------------------------------------------------------- |
| @axe-core/playwright        |        4.13.0 | MPL-2.0    | Automated accessibility checks through Playwright                                         |
| @playwright/test            |        1.62.1 | Apache-2.0 | Real-browser verification                                                                 |
| @testing-library/jest-dom   |         7.0.1 | MIT        | User-visible DOM matchers                                                                 |
| @testing-library/react      |        16.3.2 | MIT        | Accessible React component tests                                                          |
| @testing-library/user-event |        14.6.5 | MIT        | Realistic component interaction sequences                                                 |
| @types/node                 |       24.13.3 | MIT        | Type Node 24 APIs used only by configuration files                                        |
| @types/react                |       19.2.18 | MIT        | React TypeScript declarations                                                             |
| @types/react-dom            |        19.2.4 | MIT        | React DOM TypeScript declarations                                                         |
| @vitejs/plugin-react        |         6.1.0 | MIT        | Official React JSX and Fast Refresh integration                                           |
| ESLint                      |        10.8.1 | MIT        | Static source analysis                                                                    |
| globals                     |       17.11.0 | MIT        | Explicit standard browser global definitions for ESLint                                   |
| jsdom                       |        30.0.1 | MIT        | Local browser-like component-test environment                                             |
| Prettier                    |         3.9.6 | MIT        | Deterministic formatting                                                                  |
| TypeScript                  |         6.0.3 | Apache-2.0 | Strict static type analysis                                                               |
| typescript-eslint           |        8.67.0 | MIT        | Type-aware TypeScript linting                                                             |
| Vite                        |         8.2.2 | MIT        | Local server and static production build                                                  |
| vite-plugin-pwa             |         1.3.0 | MIT        | Approved Phase 6 manifest and service-worker integration; installed but not activated yet |
| Vitest                      |        4.1.11 | MIT        | Unit and component test runner                                                            |

All declared engines accept the confirmed Node.js 24.18.1 environment used during scaffolding. Direct dependencies use permissive MIT or Apache-2.0 terms except the development-only axe adapter, whose MPL-2.0 file-level terms are compatible with using the unmodified package as a test tool.
