// Focus an existing Pomorise window when its completion notification is selected.
self.addEventListener("notificationclick", (event) => {
  // Dismiss the alert immediately because its single job is returning to the timer.
  event.notification.close();
  // Keep the worker alive until one window has been brought forward.
  event.waitUntil(
    (async () => {
      // Include uncontrolled windows so a freshly opened tab can still be focused.
      const windowClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      // Focus the first existing window instead of stacking duplicate timers.
      for (const client of windowClients) {
        if ("focus" in client) return client.focus();
      }
      // Open the application shell when no window exists, such as after a restart.
      if (self.clients.openWindow) return self.clients.openWindow("/pomorise/");
    })(),
  );
});
