// Import DOM-specific matchers so component assertions describe visible accessible behavior.
import "@testing-library/jest-dom/vitest";
// Import automatic cleanup so each component test begins with an empty document.
import { cleanup } from "@testing-library/react";
// Import Vitest's lifecycle hook that runs after every isolated test case.
import { afterEach, vi } from "vitest";

// Provide the browser media-query API used by system-theme detection in the jsdom environment.
Object.defineProperty(window, "matchMedia", {
  // Allow an individual test to replace this default when it needs a dark-system scenario.
  configurable: true,
  // Return the complete modern media-query shape without matching dark mode by default.
  value: (query: string): MediaQueryList => ({
    // Model the default test operating system as a light appearance.
    matches: false,
    // Preserve the requested media expression for diagnostics and assertions.
    media: query,
    // Provide the legacy callback property required by the browser interface.
    onchange: null,
    // Preserve the deprecated subscription method for interface completeness.
    addListener: vi.fn(),
    // Preserve the deprecated unsubscription method for interface completeness.
    removeListener: vi.fn(),
    // Provide the modern subscription method used by the theme provider.
    addEventListener: vi.fn(),
    // Provide the modern cleanup method used when the theme provider unmounts.
    removeEventListener: vi.fn(),
    // Provide event dispatch behavior required by the MediaQueryList interface.
    dispatchEvent: vi.fn(),
    // Close the browser-like media-query object after every required field.
  }),
  // Close the matchMedia property definition after installing its deterministic test value.
});

// Implement native modal opening because jsdom does not yet paint or manage dialog modality.
HTMLDialogElement.prototype.showModal = function showModal() {
  // Reflect the browser's open state so role queries and component behavior remain realistic.
  this.setAttribute("open", "");
  // Close the jsdom showModal helper after exposing the dialog.
};

// Implement native dialog closing for the same isolated component environment.
HTMLDialogElement.prototype.close = function close() {
  // Remove the open state just as a browser would after explicit dismissal.
  this.removeAttribute("open");
  // Close the jsdom close helper after hiding the dialog.
};

// Remove rendered React trees after each test so state cannot leak between cases.
afterEach(() => {
  // Ask Testing Library to unmount every container created during the completed test.
  cleanup();
  // Remove non-sensitive appearance state so one theme test cannot affect another.
  window.localStorage.clear();
  // Restore the document palette marker to the default state between theme scenarios.
  delete document.documentElement.dataset.theme;
  // Close the cleanup hook after registering its one isolation action.
});
