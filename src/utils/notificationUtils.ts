interface CalendarMonthlyEvent {
    id: string;
    name: string;
    date: Date;
    type: 'birthday' | 'deathday';
    hasDate: boolean;
    age: number | string;
}

// Show a single notification, preferring the service worker so it works in
// installed PWA mode (background on Android, required on iOS 16.4+).
const showNotification = async (title: string, options: NotificationOptions) => {
    if ('serviceWorker' in navigator) {
        try {
            const reg = await navigator.serviceWorker.ready;
            // ServiceWorkerRegistration.showNotification is the correct API for PWAs.
            // new Notification() is silently dropped when the PWA is backgrounded
            // on Android Chrome and is entirely unsupported on iOS Safari.
            await reg.showNotification(title, options);
            return;
        } catch {
            // Service worker not controlling the page yet — fall through.
        }
    }
    // Fallback for browsers without service worker (rare desktop case).
    new Notification(title, options);
};

// Function to send push notification
export const sendNotification = (events: CalendarMonthlyEvent[]) => {
    if (typeof window === 'undefined') return;

    if ('Notification' in window) {
        const sendNotifications = (permission: NotificationPermission) => {
            if (permission === 'granted') {
                events.forEach(event => {
                    const eventName = `${event.name} (${(event.type === 'birthday' ? '\u{1F382} Birthday' : 'Remembrance \u{1F490}')})`;
                    showNotification('Family Calendar Reminder', {
                        body: `Today: ${eventName}`,
                        icon: '/web-app-manifest-192x192.png',
                        badge: '/web-app-manifest-192x192.png'
                    });
                });
            }
        };

        if (Notification.permission === 'granted') {
            sendNotifications('granted');
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(sendNotifications);
        }
    }
};

// Hook for managing daily notifications
export const useDailyNotifications = () => {
    const checkAndSendNotifications = (todayEvents: CalendarMonthlyEvent[]) => {
        if (todayEvents.length > 0) {
            const today = new Date().toDateString();
            const lastNotificationDate = localStorage.getItem('lastNotificationDate');

            if (lastNotificationDate !== today) {
                sendNotification(todayEvents);
                localStorage.setItem('lastNotificationDate', today);
                return true; // Notifications were sent
            }
        }
        return false; // No notifications sent
    };

    return {
        checkAndSendNotifications
    };
};