// Import user-event so component tests exercise the same interaction sequence as a visitor.
import userEvent from "@testing-library/user-event";
// Import accessible render and query helpers that avoid testing React's private internals.
import { render, screen } from "@testing-library/react";
// Import Vitest's grouping, assertion, and test functions for the application shell.
import { describe, expect, it } from "vitest";
// Import the real Phase 1 shell so the test protects user-visible product behavior.
import { App } from "../../app/App";

// Group the minimal application behaviors under the component's public name.
describe("App", () => {
  // Verify the approved identity and page purpose are present at first render.
  it("introduces Pomorise with its approved local identity", () => {
    // Render the component into the isolated jsdom document created for this test.
    render(<App />);
    // Protect the single clear page heading that identifies the focus experience.
    expect(screen.getByRole("heading", { level: 1, name: "Rise into focus." })).toBeVisible();
    // Protect the approved logo's accessible product name rather than its file path.
    expect(screen.getByRole("img", { name: "Pomorise" })).toBeVisible();
    // Close the identity test after both user-visible assertions.
  });

  // Verify a visitor can reveal foundation context using the accessible button.
  it("reveals foundation details on request", async () => {
    // Create a realistic interaction controller that waits for browser event sequences.
    const user = userEvent.setup();
    // Render the product shell before locating and activating its disclosure control.
    render(<App />);
    // Activate the button through its accessible role and initial visible label.
    await user.click(screen.getByRole("button", { name: "Show foundation details" }));
    // Protect the polite status text revealed by the visitor's explicit action.
    expect(screen.getByRole("status")).toHaveTextContent(
      "Phase 1 establishes the dependable foundation",
    );
    // Close the interaction test after proving the requested content appeared.
  });
  // Close the App test group after identity and interaction coverage are defined.
});
