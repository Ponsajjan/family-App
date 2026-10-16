// Custom service worker additions, merged into the generated PWA service
// worker by @ducanh2912/next-pwa (via importScripts). Handles incoming Web
// Push messages so family-event reminders show up even when the app isn't
// open — plain JS so Next's type-check doesn't try to apply the DOM lib
// (which has no ServiceWorker/Push types) to it.

const ICON = "/web-app-manifest-192x192.png";

self.addEventListener("push", (event) => {
    let payload = { title: "Family Calendar Reminder", body: "You have a new update.", url: "/" };
    if (event.data) {
        try {
            payload = { ...payload, ...event.data.json() };
        } catch {
            payload.body = event.data.text();
        }
    }

    event.waitUntil(
        self.registration.showNotification(payload.title, {
            body: payload.body,
            icon: ICON,
            badge: ICON,
            data: { url: payload.url || "/" },
        })
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const url = event.notification.data?.url || "/";

    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
            for (const client of windowClients) {
                if (client.url.includes(url) && "focus" in client) {
                    return client.focus();
                }
            }
            if (self.clients.openWindow) {
                return self.clients.openWindow(url);
            }
        })
    );
});
