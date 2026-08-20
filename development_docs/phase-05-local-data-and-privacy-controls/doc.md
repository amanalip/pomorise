# Phase 5: Local data and privacy controls

| Document information | Value |
| --- | --- |
| Created | August 20, 2026 at 5:33:36 PM EDT |
| Last updated | August 20, 2026 at 6:15:50 PM EDT |
| ISO 8601 last updated | `2026-08-20T18:15:50-04:00` |
| Timezone | America/Toronto (UTC−04:00) |
| Estimated reading time | 6 minutes |
| Verification status | Phase 5 implementation-ready; comprehensive release evidence remains in Phase 7 |

## Current status

Phase 5 is implementation-ready. Pomorise now opens a versioned IndexedDB database, validates records at the storage boundary, restores durable planning and journey state into the existing reducers, and saves coherent snapshots in local transactions. Settings includes a dedicated Data & privacy destination with local counts, JSON backup, session CSV, import preview, storage-protection request, diagnostics, exact-scope deletion controls, and a preference-only reset.

The final implementation slice added a real version-one to version-two task migration and cross-engine browser cases for migration, page-instance restart, malformed and valid import, history-only deletion, focus-data deletion, preference reset, and declined persistent storage. Firefox exposed a queued-save race that could restore a task after deletion. The application now increments a persistence epoch before higher-priority storage mutations, preventing an older delayed snapshot from starting after import or deletion.

## User-visible design correction

The header identity was rebuilt because the previous implementation scaled a large raster wordmark and painted a CSS patch over its baked-in tagline. That approach was visually fragile and produced clipped or partial letters. The new lockup crops only the approved symbol and renders `pomorise` plus its promise as live text. The symbol, name, and tagline can now resize independently, and narrow phones can remove only the supporting tagline without damaging the identity.

The data experience uses two settings tabs. Everyday appearance and timer choices stay separate from higher-stakes ownership controls. Import is deliberately a two-step operation: choose and validate a file, inspect record counts, then confirm replacement. Deletion uses inline confirmation with exact scope instead of a generic browser prompt. A wider scrolling modal and sticky Done action keep this longer task understandable and escapable.

## Architecture

| Boundary | Responsibility |
| --- | --- |
| `src/data/database.ts` | Dexie schema, Zod record validation, transactional save, hydration, counts, and verified deletion |
| `src/data/backup.ts` | Versioned JSON validation, size limit, transactional replacement, and CSV serialization |
| `src/components/DataControls.tsx` | Backup, preview, restore, storage protection, diagnostics, and deletion interaction |
| `src/focus/planning.ts` | Accepts only a data-layer-validated restored planning snapshot |
| `src/focus/journey.ts` | Accepts only a data-layer-validated restored journey snapshot |
| `src/app/App.tsx` | Coordinates initial hydration, delayed coherent saves, settings navigation, and the new brand lockup |
| `src/styles/global.css` | Responsive identity crop, privacy hierarchy, modal ergonomics, and compact reflow |

IndexedDB stores tasks, sessions, distractions, reflections, and metadata separately. The React reducers remain the source of interaction semantics. On startup, the data layer reads and validates records, reconstructs the reducer shapes, and dispatches explicit restore actions. After hydration, a short delay groups related React changes before one transaction replaces the structured snapshot. An empty startup render is never allowed to overwrite IndexedDB before loading finishes.

## Trust and privacy boundaries

- Zod validates every task, session, reflection, distraction, and backup before use.
- Imports are capped at 5 MB before JSON parsing.
- Import replaces structured records inside one Dexie transaction, so failure cannot leave a partial restore.
- JSON and CSV are produced through browser Blob URLs and are not uploaded.
- Persistent storage is requested only after the visitor chooses the explanatory action.
- Diagnostics show versions and counts but transmit nothing.
- Clear history preserves tasks and preferences. Delete all focus data removes structured personal records and verifies zero counts before success.
- Private browsing, browser clearing, storage eviction, and the lack of cloud sync are explained plainly.

## Validation completed for this slice

- Strict TypeScript checking passed after the storage and UI integration.
- Pure unit coverage validates compatible backups, rejects malformed or future formats, and protects CSV escaping.
- The existing component suite was updated to protect the live-text brand lockup rather than the removed raster wordmark.
- Manual Playwright inspection covered the main desktop workspace and Data & privacy modal.
- A remaining global image constraint discovered during screenshot review was removed so the source artwork cannot be squeezed into the symbol crop.

These are targeted development checks, not the final Phase 5 acceptance claim.

## Final implementation diagnostics

- Formatting, strict TypeScript, and ESLint passed after the completed data-control slice.
- Ten production-path storage cases passed across Chromium and Firefox.
- The first cross-engine deletion run failed in Firefox because an older queued save could race with deletion. A persistence epoch invalidation boundary corrected the product defect, and the complete ten-case rerun passed.
- A WebKit launch was attempted but this local CachyOS host lacks Ubuntu compatibility libraries that require administrator installation. The Phase 7 report retains that limitation without implying Safari coverage.

## Remaining release work

- Run the complete clean-install Phase 7 suite and preserve logs, screenshots, performance measurements, and public deployment evidence.
- Record real Safari, iOS Safari, Edge, and assistive-technology observations only when those environments are actually available.
- Link this document to the final comprehensive report after it is created.

## Further reading

- [Implementation plan](../../implementation_plan.md)
- [Product plan](../../project_plan.md)
- [Phase 4 complete focus loop](../phase-04-complete-focus-loop/doc.md)
