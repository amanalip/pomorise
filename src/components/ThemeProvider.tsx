// Import React context tools so theme state can be shared without a third-party state library.
import { createContext, useContext, useEffect, useMemo, useState } from "react";
// Import the ReactNode type so the provider accepts any valid application subtree.
import type { ReactNode } from "react";

// Name the only theme choices visitors can store in this phase.
export type ThemePreference = "system" | "light" | "dark";

// Describe the resolved visual theme after the system preference has been considered.
type ResolvedTheme = Exclude<ThemePreference, "system">;

// Describe the theme values and action made available to every consumer.
interface ThemeContextValue {
  // Preserve the visitor's explicit preference, including the system-following option.
  preference: ThemePreference;
  // Expose the actual light or dark theme currently painted by the browser.
  resolvedTheme: ResolvedTheme;
  // Let settings controls update and persist the visitor's preference.
  setPreference: (preference: ThemePreference) => void;
  // Close the context contract after defining its complete public surface.
}

// Keep the preference in a small stable key that does not contain personal focus data.
const themeStorageKey = "pomorise.theme";
// Match the browser media feature that communicates the operating system's dark preference.
const darkThemeQuery = "(prefers-color-scheme: dark)";

// Create an initially unavailable context so missing providers fail with a useful message.
const ThemeContext = createContext<ThemeContextValue | null>(null);

// Check unknown storage values before allowing them into typed application state.
function isThemePreference(value: unknown): value is ThemePreference {
  // Accept only the three values displayed by the appearance control.
  return value === "system" || value === "light" || value === "dark";
  // Close the validation helper after returning its safe boolean result.
}

// Read the local preference safely because storage may be unavailable in restricted browsers.
function readStoredPreference(): ThemePreference {
  // Attempt the browser-owned read without allowing a storage error to block the application.
  try {
    // Read the non-sensitive appearance preference from this origin's local storage.
    const storedPreference = window.localStorage.getItem(themeStorageKey);
    // Return the stored value only after validating its allowed shape.
    return isThemePreference(storedPreference) ? storedPreference : "system";
    // Recover from disabled or inaccessible storage by following the operating system.
  } catch {
    // Keep theme selection usable even when persistence cannot be provided.
    return "system";
    // Close the guarded storage read after covering success and failure.
  }
  // Close the preference reader after producing a valid theme choice.
}

// Resolve system mode into the concrete palette that should be displayed now.
function resolveTheme(preference: ThemePreference, systemUsesDark: boolean): ResolvedTheme {
  // Follow the system media query only when the visitor has selected System.
  if (preference === "system") {
    // Convert the media-query result into one of the two concrete palette names.
    return systemUsesDark ? "dark" : "light";
    // Close the system branch after resolving it to a paintable theme.
  }
  // Preserve an explicit light or dark choice regardless of system changes.
  return preference;
  // Close the resolver after every preference produces a concrete theme.
}

// Provide persistent theme behavior to the complete Pomorise interface.
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize from local storage once so the first React render honors a previous choice.
  const [preference, setPreference] = useState<ThemePreference>(readStoredPreference);
  // Initialize system state from the browser without storing a derived value.
  const [systemUsesDark, setSystemUsesDark] = useState(
    () =>
      // Ask the browser whether the operating system currently requests a dark interface.
      window.matchMedia(darkThemeQuery).matches,
    // Close the state initializer after reading the current system preference.
  );
  // Resolve the current palette from explicit and system-level inputs.
  const resolvedTheme = resolveTheme(preference, systemUsesDark);

  // Keep system-following mode synchronized when the operating system changes at runtime.
  useEffect(() => {
    // Create one media-query object that can report subsequent preference changes.
    const mediaQuery = window.matchMedia(darkThemeQuery);
    // Update React state from the new browser preference exposed by the change event.
    const handleSystemThemeChange = (event: MediaQueryListEvent) =>
      setSystemUsesDark(event.matches);
    // Subscribe with the modern event API supported by current target browsers.
    mediaQuery.addEventListener("change", handleSystemThemeChange);
    // Remove the listener when the provider unmounts so no stale update remains.
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
    // Register the system listener only once for this provider instance.
  }, []);

  // Paint and persist each theme change from a single coordinated effect.
  useEffect(() => {
    // Expose the resolved theme to CSS tokens and native browser color handling.
    document.documentElement.dataset.theme = resolvedTheme;
    // Attempt to persist only the explicit preference selected by the visitor.
    try {
      // Store the non-sensitive appearance value locally without making any network request.
      window.localStorage.setItem(themeStorageKey, preference);
      // Allow the visible theme to continue working if browser storage is unavailable.
    } catch {
      // Intentionally leave persistence unavailable while preserving the in-memory selection.
      // Close the guarded storage write after both supported and restricted browser paths.
    }
    // Re-run whenever either the stored preference or resolved palette changes.
  }, [preference, resolvedTheme]);

  // Keep the shared object stable unless one of its meaningful values changes.
  const contextValue = useMemo<ThemeContextValue>(
    // Package theme state and its update action for descendant controls.
    () => ({ preference, resolvedTheme, setPreference }),
    // Recreate the context value only when visible or stored theme state changes.
    [preference, resolvedTheme],
    // Close the memoized context value after listing its dependencies.
  );

  // Make theme state available to the complete application subtree.
  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
  // Close the provider after returning its shared context boundary.
}

// Give components a typed theme API and guard against accidental provider omission.
export function useTheme() {
  // Read the closest theme provider from the React tree.
  const contextValue = useContext(ThemeContext);
  // Detect an invalid component tree before a consumer tries to read null state.
  if (!contextValue) {
    // Explain the exact structural contract a developer needs to restore.
    throw new Error("useTheme must be used within ThemeProvider.");
    // Close the missing-provider guard after protecting every theme consumer.
  }
  // Return the validated shared theme state and update action.
  return contextValue;
  // Close the theme hook after enforcing its provider contract.
}
