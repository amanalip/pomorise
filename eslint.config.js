// Import browser globals so ESLint recognizes standards-based APIs used by the React client.
import globals from "globals";
// Import TypeScript-aware ESLint presets so unsafe typed code can be rejected before release.
import tseslint from "typescript-eslint";

// Export the flat ESLint configuration consumed by the repository lint command.
export default tseslint.config(
  // Ignore generated and dependency directories because their code is not authored here.
  {
    // Exclude generated paths and JavaScript config modules that TypeScript does not compile.
    ignores: [
      // Ignore Vite's generated release output because source checks already cover its inputs.
      "dist/**",
      // Ignore installed third-party packages because their maintainers own their lint decisions.
      "node_modules/**",
      // Ignore generated coverage evidence because Vitest owns its file format.
      "coverage/**",
      // Ignore Playwright's generated browser report because it is not authored source.
      "playwright-report/**",
      // Ignore Playwright's transient results because browser runs recreate them.
      "test-results/**",
      // Ignore JavaScript configuration modules that remain formatting-checked and fully annotated.
      "*.config.js",
      // Close the ignored-path list after every generated or non-TypeScript boundary is explicit.
    ],
    // Close the global ignore configuration before enabling typed rules for compiled code.
  },
  // Apply the maintained recommended type-checked rules to human-authored source files.
  ...tseslint.configs.recommendedTypeChecked,
  // Add Pomorise-specific language and type-project settings.
  {
    // Limit typed linting to application, test, and configuration JavaScript or TypeScript files.
    files: ["**/*.{js,ts,tsx}"],
    // Configure the parser with the project's TypeScript graph and browser environment.
    languageOptions: {
      // Make browser APIs such as document explicit while retaining standard ECMAScript names.
      globals: globals.browser,
      // Ask typescript-eslint to locate the nearest project configuration automatically.
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
      // Close the language settings after defining globals and typed-project discovery.
    },
    // Close the Pomorise-specific ESLint override.
  },
  // Close the exported ESLint configuration sequence.
);
