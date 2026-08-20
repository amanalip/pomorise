// Import DOM-specific matchers so component assertions describe visible accessible behavior.
import "@testing-library/jest-dom/vitest";
// Import automatic cleanup so each component test begins with an empty document.
import { cleanup } from "@testing-library/react";
// Import Vitest's lifecycle hook that runs after every isolated test case.
import { afterEach } from "vitest";

// Remove rendered React trees after each test so state cannot leak between cases.
afterEach(() => {
  // Ask Testing Library to unmount every container created during the completed test.
  cleanup();
  // Close the cleanup hook after registering its one isolation action.
});
