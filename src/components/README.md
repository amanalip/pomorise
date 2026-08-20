# Shared component source boundary

Phase 2 established the accessible project-owned interface primitives in this directory. `ThemeProvider.tsx` coordinates system, light, and dark appearance state. `ui.tsx` owns buttons, cards, fields, segmented controls, notices, and the native dialog surface. `DataControls.tsx` owns Phase 5 backup and local-data actions. `PwaStatus.tsx` owns Phase 6 offline and consentful-update messaging, while `AppErrorBoundary.tsx` supplies the root recovery path. Feature components should compose the shared primitives instead of creating unrelated control styles.
