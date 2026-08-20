# Shared component source boundary

Phase 2 established the accessible project-owned interface primitives in this directory. `ThemeProvider.tsx` coordinates system, light, and dark appearance state. `ui.tsx` owns buttons, cards, fields, segmented controls, notices, and the native dialog surface. Feature components should compose these primitives instead of creating unrelated control styles.
