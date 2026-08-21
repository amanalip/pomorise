// Import user-event so component tests exercise realistic pointer and keyboard sequences.
import userEvent from "@testing-library/user-event";
// Import accessible render and query helpers that avoid React implementation details.
import { render, screen, waitFor } from "@testing-library/react";
// Import Vitest's grouping, assertion, and test functions for shell behavior.
import { describe, expect, it, vi } from "vitest";
// Import the real Phase 2 shell so tests protect visitor-visible product behavior.
import { App } from "../../app/App";
// Import the shared provider so component tests use the production theme boundary.
import { ThemeProvider } from "../../components/ThemeProvider";
// Import pure timer transitions and storage so completed-state journeys can start deterministically.
import { createTimerState, timerReducer } from "../../timer/engine";
import { saveTimerState } from "../../timer/storage";

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
    // Protect the crisp live product name that replaced the fragile raster wordmark.
    expect(screen.getByText("pomorise")).toBeVisible();
    // Protect the optional intention field through its visible accessible label.
    expect(screen.getByRole("textbox", { name: "What will you move forward?" })).toBeVisible();
    // Protect the plain-language empty task state used before Phase 4 adds stored tasks.
    expect(screen.getByText("No task is selected. That is completely fine.")).toBeVisible();
    // Keep ownership and help destinations available at the bottom of the application.
    expect(screen.getByText("© 2026 Aman Ali Pogaku")).toBeVisible();
    expect(screen.getByRole("link", { name: "FAQs" })).toHaveAttribute(
      "href",
      "/pomorise/FAQs.html",
    );
    expect(screen.getByRole("link", { name: "GitHub repository" })).toHaveAttribute(
      "href",
      "https://github.com/amanalip/pomorise",
    );
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
    // Capture one distraction without sending pause, skip, or reset to the timer.
    await user.type(screen.getByRole("textbox", { name: "Quick capture" }), "Send a note");
    await user.click(screen.getByRole("button", { name: "Capture and continue" }));
    // Protect the one-step confirmation and continued running state.
    expect(screen.getByText("Distraction captured. Your timer kept running.")).toBeVisible();
    expect(screen.getByRole("button", { name: "Pause" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Pause" }));
    expect(screen.getByRole("button", { name: "Resume" })).toBeEnabled();
  });

  // Verify focus completion reaches skippable reflection and both break experiences.
  it("continues from completed focus through reflection into a guided break", async () => {
    // Create a realistic visitor interaction controller for the post-session journey.
    const user = userEvent.setup();
    // Build one deterministic completed focus session without waiting for wall time.
    const started = timerReducer(createTimerState("focus", 60), { type: "START", now: 0 });
    // Complete the exact one-minute boundary through the public pure timer engine.
    const completed = timerReducer(started, { type: "TICK", now: 60_000 });
    // Persist the valid terminal state so the production hook restores it on mount.
    saveTimerState(completed);
    // Render the same completed boundary a returning visitor would see.
    renderApp();
    // Protect the optional reflection boundary and its explicit skip path.
    expect(screen.getByRole("heading", { name: "Close this session gently" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Skip reflection" }));
    // The timer cycle advances to a quiet break by default.
    expect(screen.getByRole("heading", { name: "How would you like to pause?" })).toBeVisible();
    expect(
      screen.getByText("Step away if you can. Nothing needs your attention here."),
    ).toBeVisible();
    // Choose guided support and one non-default local prompt.
    await user.click(screen.getByRole("radio", { name: "Guided" }));
    await user.click(screen.getByRole("button", { name: "Hydration" }));
    // Protect the selected guide's calm instruction without requiring network content.
    expect(screen.getByText("Take a few unhurried sips of water.")).toBeVisible();
    // Close the complete flow case after focus, reflection, and break behavior.
  });

  // Verify the first Phase 4 planning slice connects optional intention and small tasks to the timer.
  it("adds, selects, and completes a small focus task", async () => {
    // Create a realistic interaction controller for native input and form behavior.
    const user = userEvent.setup();
    // Render a fresh transient plan inside the production theme boundary.
    renderApp();
    // Identify the planning field whose enabled state now signals completed startup hydration.
    const intentionField = screen.getByRole("textbox", { name: "What will you move forward?" });
    // Wait for the same readiness boundary a real visitor receives before editing local data.
    await waitFor(() => expect(intentionField).toBeEnabled());
    // Enter an optional intention without making timer start depend on it.
    await user.type(intentionField, "Shape the project brief");
    // Enter one concise task into the bounded planning form.
    await user.type(screen.getByRole("textbox", { name: "Add a small task" }), "Outline goals");
    // Give the task three sessions so the timer heading reflects task progress instead of a fixed cycle.
    await user.selectOptions(screen.getByRole("combobox", { name: "Estimated sessions" }), "3");
    // Submit the task through its native form action.
    await user.click(screen.getByRole("button", { name: "Add task" }));
    // The first task becomes current without an extra selection step.
    expect(screen.getAllByText("Outline goals")).toHaveLength(2);
    expect(screen.getByText("1 selected")).toBeVisible();
    expect(screen.getByText("Session 1 of 3")).toBeVisible();
    // Complete the current task and return to the calm optional empty state.
    await user.click(screen.getByRole("button", { name: "Mark complete" }));
    expect(screen.getByText("No task is selected. That is completely fine.")).toBeVisible();
    // Keep completed work in a dedicated, expandable audit trail.
    expect(screen.getByText("1 completed")).toBeVisible();
    await user.click(screen.getByText("Task history"));
    expect(screen.getByRole("list", { name: "Completed task history" })).toBeVisible();
    expect(screen.getByText("0 completed of 3 estimated focus sessions")).toBeVisible();
    // Keep the intention available because task completion is an independent planning action.
    expect(screen.getByRole("textbox", { name: "What will you move forward?" })).toHaveValue(
      "Shape the project brief",
    );
    // Close the Phase 4 component case after its add, selection, and completion journey.
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
    // Verify the decorative approved symbol switches to its locally bundled dark asset.
    expect(document.querySelector(".app-header__mark img")).toHaveAttribute(
      "src",
      expect.stringContaining("dark_mode_phase6.png"),
    );
    // Require an explicit browser confirmation before local completion sound becomes active.
    const confirmSound = vi.spyOn(window, "confirm").mockReturnValue(true);
    await user.click(screen.getByRole("checkbox", { name: /Play a local completion sound/ }));
    expect(confirmSound).toHaveBeenCalledOnce();
    expect(screen.getByRole("checkbox", { name: /Play a local completion sound/ })).toBeChecked();
    confirmSound.mockRestore();
    // Close settings through the dialog's explicit completion control.
    await user.click(screen.getByRole("button", { name: "Done" }));
    // Verify dismissal removes the modal from role-based navigation.
    expect(screen.queryByRole("dialog", { name: "Settings" })).not.toBeInTheDocument();
    // Close the theme persistence test after checking selection, storage, logo, and dismissal.
  });
  // Close the application test group after shell, boundary, and theme coverage are defined.
});
