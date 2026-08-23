import { useEffect, useRef, useState } from "react";
import { registerSW } from "virtual:pwa-register";
import { Button, Notice } from "./ui";

// Describe the small set of service-worker and connectivity messages that need visitor action.
type PwaMessage = "offline" | "update" | null;

// Describe the browser's deferred installation invitation without relying on DOM vendor types.
interface InstallInvitation extends Event {
  prompt: () => Promise<void>;
}

// Offer installation only while the browser itself is actively inviting it.
export function InstallPomorise() {
  // Hold the captured invitation so the visitor's own gesture can trigger the prompt.
  const [invitation, setInvitation] = useState<InstallInvitation | null>(null);

  // Capture the standard beforeinstallprompt event instead of letting browser UI compete.
  useEffect(() => {
    // Ignore already-installed sessions because standalone windows need no install option.
    if (window.matchMedia("(display-mode: standalone)").matches) return undefined;
    // Store the deferred invitation after suppressing the browser's automatic banner.
    const captureInvitation = (event: Event) => {
      event.preventDefault();
      setInvitation(event as InstallInvitation);
    };
    window.addEventListener("beforeinstallprompt", captureInvitation);
    return () => window.removeEventListener("beforeinstallprompt", captureInvitation);
  }, []);

  // Stay invisible whenever installation is unavailable, declined, or already complete.
  if (!invitation) return null;

  return (
    <div className="install-row">
      {/* Trigger the platform dialog from one explicit visitor gesture. */}
      <Button
        onClick={() => {
          void invitation.prompt();
          setInvitation(null);
        }}
        variant="secondary"
      >
        Install Pomorise
      </Button>
      {/* Explain the outcome honestly without promising offline behavior on first run. */}
      <span className="install-row__hint">Adds Pomorise to this device through your browser.</span>
      {/* Close the restrained installation offer after its single clear action. */}
    </div>
  );
}

// Register production offline support and keep every disruptive update behind explicit consent.
export function PwaStatus() {
  const [message, setMessage] = useState<PwaMessage>(() => (navigator.onLine ? null : "offline"));

  // Hold the generated update action without starting service-worker work during React render.
  const applyUpdateRef = useRef<(reloadPage?: boolean) => Promise<void>>(() => Promise.resolve());

  // The generated registration only precaches versioned app assets; it defines no data routes.
  useEffect(() => {
    // Let the timer paint before the offline shell begins fetching its complete precache graph.
    const registrationDelay = window.setTimeout(() => {
      // Register from the same generated module after first-screen bandwidth is no longer critical.
      applyUpdateRef.current = registerSW({
        immediate: true,
        onNeedRefresh: () => setMessage("update"),
        onOfflineReady: () => {
          // Settings already explains offline readiness, so installation needs no obstructive toast.
        },
        onRegisterError: () => {
          // Online use remains fully functional, so a failed install is intentionally non-blocking.
        },
      });
      // Close delayed registration after preserving every update and failure callback.
    }, 1_500);
    // Avoid registering after an application instance has already unmounted.
    return () => window.clearTimeout(registrationDelay);
  }, []);

  // Report real connectivity changes without implying that a first uncached visit can load offline.
  useEffect(() => {
    const handleOffline = () => setMessage("offline");
    const handleOnline = () => setMessage((current) => (current === "offline" ? null : current));
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!message) return null;

  return (
    <aside className="pwa-status" aria-label="Application status">
      <Notice role="status" tone={message === "offline" ? "warning" : "info"}>
        <div className="pwa-status__content">
          <span>
            {message === "update"
              ? "A Pomorise update is ready. Your current session will not reload unless you choose it."
              : "You are offline. Previously loaded Pomorise features and local data remain available."}
          </span>
          <div className="pwa-status__actions">
            {message === "update" && (
              <Button onClick={() => void applyUpdateRef.current(true)}>Update and reload</Button>
            )}
            <Button onClick={() => setMessage(null)} variant="quiet">
              {message === "update" ? "Later" : "Dismiss"}
            </Button>
          </div>
        </div>
      </Notice>
    </aside>
  );
}
