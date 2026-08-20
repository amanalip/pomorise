// Import recursive directory and file readers for a local source-style guard.
import { readdirSync, readFileSync } from "node:fs";
// Import path helpers so the guard works from the repository root on every platform.
import { extname, join } from "node:path";
// Import Vitest's test and assertion functions for the writing-style requirement.
import { describe, expect, it } from "vitest";

// List the project text formats that can contain website copy, code, configuration, or prose.
const guardedExtensions = new Set([
  // Guard local styles and their beginner-focused comments.
  ".css",
  // Guard browser documents that can display visitor-facing copy.
  ".html",
  // Guard JavaScript configuration and automation source.
  ".js",
  // Guard strict JSON configuration and generated dependency metadata.
  ".json",
  // Guard project documentation and companion code annotations.
  ".md",
  // Guard TypeScript application, configuration, and unit source.
  ".ts",
  // Guard React TypeScript source that can render website text.
  ".tsx",
  // Guard GitHub workflow and other YAML automation configuration.
  ".yaml",
  // Guard the shorter YAML extension used by the deployment workflow.
  ".yml",
  // Close the guarded extension set after every relevant project text format.
]);
// Exclude dependencies, generated output, Git internals, and transient local browser evidence.
const excludedDirectories = new Set([
  // Exclude installed third-party source that Pomorise does not author.
  "node_modules",
  // Exclude Vite output because source files already guard its authored inputs.
  "dist",
  // Exclude Git object storage and repository implementation details.
  ".git",
  // Exclude temporary Playwright CLI snapshots and browser diagnostics.
  ".playwright-cli",
  // Exclude Playwright's generated interactive HTML report.
  "playwright-report",
  // Exclude Playwright's transient screenshots, traces, and test attachments.
  "test-results",
  // Exclude Playwright's optional machine-generated blob reporter output.
  "blob-report",
  // Exclude generated unit-coverage evidence produced from guarded source.
  "coverage",
  // Close the excluded directory set after all non-authored boundaries.
]);
// Build the forbidden punctuation from its Unicode number so it never appears in source text.
const forbiddenEmDash = String.fromCodePoint(0x2014);

// Collect guarded source files recursively without inspecting generated build output.
function collectSourceFiles(directoryPath: string): string[] {
  // Read every immediate child with its file-type metadata for safe recursion.
  const directoryEntries = readdirSync(directoryPath, { withFileTypes: true });
  // Flatten nested directory results into one deterministic list of source paths.
  return directoryEntries.flatMap((directoryEntry) => {
    // Resolve the child path from the directory currently being inspected.
    const entryPath = join(directoryPath, directoryEntry.name);
    // Recurse when this entry contains more project-owned text and is not excluded output.
    if (directoryEntry.isDirectory()) {
      // Skip known generated or third-party boundaries before reading nested content.
      return excludedDirectories.has(directoryEntry.name) ? [] : collectSourceFiles(entryPath);
      // Close the directory branch after returning its nested source files.
    }
    // Keep only formats that can place text or comments into authored application code.
    return guardedExtensions.has(extname(directoryEntry.name)) ? [entryPath] : [];
    // Close the entry mapping after producing paths from files and nested directories.
  });
  // Close the recursive collector after returning all guarded paths.
}

// Group project-wide writing rules under a clear Phase 2 quality label.
describe("Phase 2 writing style", () => {
  // Prevent em dashes from entering website copy, source code, comments, or tests.
  it("contains no em dashes in project-owned source", () => {
    // Collect every guarded text file beneath the complete project root.
    const sourceFiles = collectSourceFiles(process.cwd());
    // Find any file whose complete source text includes the forbidden punctuation.
    const filesWithEmDashes = sourceFiles.filter(
      (sourceFile) =>
        // Read source as UTF-8 text before checking for the generated Unicode character.
        readFileSync(sourceFile, "utf8").includes(forbiddenEmDash),
      // Close the filtered violation list after checking every guarded source file.
    );
    // Report exact file paths if future website text or code reintroduces the character.
    expect(filesWithEmDashes).toEqual([]);
    // Close the writing-style test after protecting all authored application source.
  });
  // Close the Phase 2 writing-style group after defining its repository guard.
});
