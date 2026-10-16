import { appFetch } from "./appFetch";

// Converts the VAPID public key (base64url) into the Uint8Array format
// PushManager.subscribe expects as applicationServerKey.
const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
};

// Resolves an active ServiceWorkerRegistration, or null if one never becomes
// ready. Registers /sw.js directly instead of relying on next-pwa's
// auto-registration script, since that script isn't injected at all under
// `next dev --turbopack` (next-pwa's build pipeline only runs for the
// webpack build) — the static /sw.js file is still served either way. Races
// against a timeout so callers never hang forever if a worker genuinely
// never activates.
const getActiveRegistration = async (timeoutMs = 8000): Promise<ServiceWorkerRegistration | null> => {
    if (!("serviceWorker" in navigator)) return null;

    try {
        await navigator.serviceWorker.register("/sw.js");
    } catch (error) {
        console.error("[push] Service worker registration failed:", error);
    }

    const timeout = new Promise<null>(resolve => setTimeout(() => resolve(null), timeoutMs));
    return Promise.race([navigator.serviceWorker.ready, timeout]);
};

// Subscribes this device to Web Push and registers the subscription with the
// server, so it can receive a push notification whenever there's a birthday
// or deathday today — even when the app isn't open. Safe to call on every
// load: returns the existing subscription if already subscribed.
export const subscribeToPushNotifications = async (): Promise<boolean> => {
    if (typeof window === "undefined") return false;
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return false;
    if (Notification.permission === "denied") return false;

    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) return false;

    try {
        let permission: NotificationPermission = Notification.permission;
        if (permission === "default") {
            permission = await Notification.requestPermission();
        }
        if (permission !== "granted") return false;

        const registration = await getActiveRegistration();
        if (!registration) return false;

        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey),
            });
        }

        await appFetch("/api/notifications/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subscription.toJSON()),
        });

        return true;
    } catch (error) {
        console.error("[push] Failed to subscribe:", error);
        return false;
    }
};

// Unsubscribes this device from Web Push, both locally and on the server.
export const unsubscribeFromPushNotifications = async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return false;

    try {
        const registration = await getActiveRegistration();
        if (!registration) return true;

        const subscription = await registration.pushManager.getSubscription();
        if (!subscription) return true;

        const endpoint = subscription.endpoint;
        await subscription.unsubscribe();

        await appFetch("/api/notifications/unsubscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint }),
        });

        return true;
    } catch (error) {
        console.error("[push] Failed to unsubscribe:", error);
        return false;
    }
};

export type PushNotificationStatus = "subscribed" | "unsubscribed" | "denied" | "unsupported";

// Reports whether this device is currently subscribed, without prompting for
// permission — used to set the initial state of the settings toggle.
export const getPushNotificationStatus = async (): Promise<PushNotificationStatus> => {
    if (typeof window === "undefined") return "unsupported";
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return "unsupported";
    if (Notification.permission === "denied") return "denied";

    try {
        const registration = await getActiveRegistration();
        if (!registration) return "unsubscribed";

        const subscription = await registration.pushManager.getSubscription();
        return subscription ? "subscribed" : "unsubscribed";
    } catch {
        return "unsubscribed";
    }
};
