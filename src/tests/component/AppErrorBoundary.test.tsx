import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppErrorBoundary } from "../../components/AppErrorBoundary";

function BrokenView(): never {
  throw new Error("synthetic render failure");
}

describe("AppErrorBoundary", () => {
  it("preserves a recoverable path after an unexpected render failure", async () => {
    const user = userEvent.setup();
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(
      <AppErrorBoundary>
        <BrokenView />
      </AppErrorBoundary>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Your saved tasks and history have not been deleted",
    );
    expect(screen.getByRole("button", { name: "Reload Pomorise" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(screen.getByRole("alert")).toBeVisible();
    expect(consoleError).toHaveBeenCalled();
  });
});
