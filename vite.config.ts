// Import the official React plugin so Vite can transform JSX and provide Fast Refresh locally.
import react from "@vitejs/plugin-react";
// Import Vitest's Vite-compatible helper so build and typed test options share one configuration.
import { defineConfig } from "vitest/config";

// Export the one build configuration used by local development and GitHub Actions.
export default defineConfig({
  // Serve every production asset beneath the repository path required by GitHub Pages.
  base: "/pomorise/",
  // Enable React's JSX transform without adding any browser-time remote dependency.
  plugins: [react()],
  // Configure tests beside the build so they resolve modules exactly as the application does.
  test: {
    // Limit Vitest to its unit and component layers so Playwright owns real-browser specifications.
    include: ["src/tests/unit/**/*.test.ts", "src/tests/component/**/*.test.tsx"],
    // Give component tests browser-like DOM APIs while keeping tests local and deterministic.
    environment: "jsdom",
    // Load shared matchers and cleanup behavior before each Vitest test file.
    setupFiles: ["./src/tests/setup.ts"],
    // Restore mocked functions automatically so one test cannot leak state into another.
    restoreMocks: true,
    // Close the shared Vitest configuration after defining its isolation rules.
  },
  // Close the Vite configuration after build and test behavior have been declared.
});
