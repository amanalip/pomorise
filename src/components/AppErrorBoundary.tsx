import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button, Notice } from "./ui";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  failed: boolean;
}

// Protect local work with a recoverable screen when an unexpected render failure reaches the root.
export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  override state: AppErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { failed: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep diagnostics on this device; Pomorise has no telemetry or error-reporting endpoint.
    console.error("Pomorise recovered from an application error.", error, info.componentStack);
  }

  override render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main className="recovery-screen">
        <Notice role="alert" tone="error">
          <h1>Pomorise hit an unexpected problem.</h1>
          <p>
            Your saved tasks and history have not been deleted. Try the page again, or reload to
            restore the last usable local state.
          </p>
          <div className="recovery-screen__actions">
            <Button onClick={() => this.setState({ failed: false })}>Try again</Button>
            <Button onClick={() => window.location.reload()} variant="secondary">
              Reload Pomorise
            </Button>
          </div>
        </Notice>
      </main>
    );
  }
}
