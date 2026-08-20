// Import StrictMode so React reports unsafe lifecycle behavior during development.
import { StrictMode } from "react";
// Import the modern root API that mounts Pomorise into its single document container.
import { createRoot } from "react-dom/client";
// Import the product shell that composes the Phase 2 responsive workspace.
import { App } from "./app/App";
// Import the theme provider so every shell surface shares one persisted appearance preference.
import { ThemeProvider } from "./components/ThemeProvider";
// Import the local stylesheet so the first shell never depends on a remote font or style host.
import "./styles/global.css";

// Find the HTML mounting element that index.html reserves exclusively for React.
const rootElement = document.getElementById("root");

// Stop immediately with a useful developer error if the required HTML contract is broken.
if (!rootElement) {
  // Throwing here prevents React from silently rendering into an invalid or missing container.
  throw new Error("Pomorise could not find its application root.");
  // Close the mount-point guard after proving the element exists.
}

// Create the React root only after TypeScript knows the mounting element is present.
const root = createRoot(rootElement);

// Render the themed product shell inside development checks supplied by StrictMode.
root.render(
  // Enable additional React diagnostics without changing the production interface contract.
  <StrictMode>
    {/* Share resolved light and dark appearance state across the complete interface. */}
    <ThemeProvider>
      {/* Render the Pomorise application as the only owner of the page interface. */}
      <App />
      {/* Close the theme boundary after the complete application shell. */}
    </ThemeProvider>
    {/* Close StrictMode after wrapping the complete application tree. */}
  </StrictMode>,
  // Close the render call after providing the application element.
);
