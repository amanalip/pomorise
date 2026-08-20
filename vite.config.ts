// Import the official React plugin so Vite can transform JSX and provide Fast Refresh locally.
import react from "@vitejs/plugin-react";
// Import the PWA integration so production builds receive a manifest and versioned app-shell cache.
import { VitePWA } from "vite-plugin-pwa";
// Import Vitest's Vite-compatible helper so build and typed test options share one configuration.
import { defineConfig } from "vitest/config";

// Export the one build configuration used by local development and GitHub Actions.
export default defineConfig({
  // Serve every production asset beneath the repository path required by GitHub Pages.
  base: "/pomorise/",
  // Enable React's JSX transform without adding any browser-time remote dependency.
  plugins: [
    react(),
    VitePWA({
      // Never replace a running application automatically; the interface owns update consent.
      registerType: "prompt",
      // Keep development free from service-worker cache surprises.
      devOptions: { enabled: false },
      // Cache only hashed build output and the small static identity files listed by the build.
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico,webmanifest}"],
        cleanupOutdatedCaches: true,
        navigateFallback: "index.html",
        // Do not add runtime routes: personal IndexedDB and localStorage records never enter Cache Storage.
        runtimeCaching: [],
      },
      manifest: {
        name: "Pomorise",
        short_name: "Pomorise",
        description: "A calm, private focus timer that works one session at a time.",
        start_url: "/pomorise/",
        scope: "/pomorise/",
        display: "standalone",
        background_color: "#fbf5ec",
        theme_color: "#321b3b",
        icons: [
          { src: "icons/pomorise-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/pomorise-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icons/pomorise-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
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
