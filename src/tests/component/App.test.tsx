// Import user-event so component tests exercise realistic pointer and keyboard sequences.
import userEvent from "@testing-library/user-event";
// Import accessible render and query helpers that avoid React implementation details.
import { render, screen } from "@testing-library/react";
// Import Vitest's grouping, assertion, and test functions for shell behavior.
import { describe, expect, it } from "vitest";
// Import the real Phase 2 shell so tests protect visitor-visible product behavior.
import { App } from "../../app/App";
// Import the shared provider so component tests use the production theme boundary.
import { ThemeProvider } from "../../components/ThemeProvider";

// Render the shell inside the same appearance provider used by the browser entry.
function renderApp() {
  // Return Testing Library's utilities in case a future test needs the render container.
  return render(
    // Provide persistent theme state to every shell component under test.
    <ThemeProvider>
      {/* Render the complete application as the provider's only child. */}
      <App />
      {/* Close the production-equivalent theme boundary after the shell. */}
    </ThemeProvider>,
    // Close the component render call after building the production-equivalent tree.
  );
  // Close the shared render helper after returning Testing Library's result.
}

// Group Phase 2 identity, shell, theme, and honest-boundary behaviors under the public app name.
describe("App", () => {
  // Verify the approved identity and timer workspace hierarchy are present at first render.
  it("introduces the branded focus workspace with accessible empty states", () => {
    // Render the complete themed shell into the isolated jsdom document.
    renderApp();
    // Protect the single clear page heading that identifies the immediate focus purpose.
    expect(
      screen.getByRole("heading", { level: 1, name: "Make space for one thing." }),
    ).toBeVisible();
    // Protect the approved local logo's concise accessible product name.
    expect(screen.getByRole("img", { name: "Pomorise" })).toBeVisible();
    // Protect the optional intention field through its visible accessible label.
    expect(screen.getByRole("textbox", { name: "What will you move forward?" })).toBeVisible();
    // Protect the plain-language empty task state used before Phase 4 adds stored tasks.
    expect(screen.getByText("No task is selected. That is completely fine.")).toBeVisible();
    // Verify unavailable future transitions remain visible but cannot be activated.
    expect(screen.getByRole("button", { name: "Reset" })).toBeDisabled();
    // Close the branded shell test after checking identity, purpose, field, and empty state.
  });

  // Verify the primary action starts a real timestamp-based session with legal controls.
  it("starts and pauses a focus session through accessible timer controls", async () => {
    // Create a realistic interaction controller that waits for full browser event sequences.
    const user = userEvent.setup();
    // Render the shell before activating the future timer action.
    renderApp();
    // Activate the idle timer through its accessible action name.
    await user.click(screen.getByRole("button", { name: "Start focus" }));
    // Protect the meaningful live announcement without exposing second-by-second ticks.
    expect(screen.getByRole("status")).toHaveTextContent("Focus session started");
    expect(screen.getByRole("button", { name: "Pause" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Add 1 minute" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Pause" }));
    expect(screen.getByRole("button", { name: "Resume" })).toBeEnabled();
  });

  // Verify explicit theme choices update the palette, approved logo, and local preference.
  it("changes and persists appearance from the accessible settings dialog", async () => {
    // Create a realistic visitor interaction controller for dialog and radio behavior.
    const user = userEvent.setup();
    // Render the shell with the default system-following theme choice.
    renderApp();
    // Open the native settings dialog from its globally recognizable header action.
    await user.click(screen.getByRole("button", { name: "Settings" }));
    // Protect the native modal semantics and its visible accessible title.
    expect(screen.getByRole("dialog", { name: "Settings" })).toBeVisible();
    // Choose the explicit dark appearance through its native radio control.
    await user.click(screen.getByRole("radio", { name: "Dark" }));
    // Verify the document marker changes so CSS paints the approved dark token set.
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    // Verify only the non-sensitive explicit choice is written to local browser storage.
    expect(window.localStorage.getItem("pomorise.theme")).toBe("dark");
    // Verify the displayed identity switches to the approved locally bundled dark asset.
    expect(screen.getByRole("img", { name: "Pomorise" })).toHaveAttribute(
      "src",
      expect.stringContaining("dark_mode.png"),
    );
    // Close settings through the dialog's explicit completion control.
    await user.click(screen.getByRole("button", { name: "Done" }));
    // Verify dismissal removes the modal from role-based navigation.
    expect(screen.queryByRole("dialog", { name: "Settings" })).not.toBeInTheDocument();
    // Close the theme persistence test after checking selection, storage, logo, and dismissal.
  });
  // Close the application test group after shell, boundary, and theme coverage are defined.
});
