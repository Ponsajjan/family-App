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

const requestAndSend = (send: () => void) => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
        send();
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(p => { if (p === 'granted') send(); });
    }
};

// Function to send push notification for today's events
export const sendNotification = (events: CalendarMonthlyEvent[]) => {
    if (typeof window === 'undefined') return;
    requestAndSend(() => {
        events.forEach(event => {
            const eventName = `${event.name} (${(event.type === 'birthday' ? '\u{1F382} Birthday' : 'Remembrance \u{1F490}')})`;
            showNotification('Family Calendar Reminder', {
                body: `Today: ${eventName}`,
                icon: '/web-app-manifest-192x192.png',
                badge: '/web-app-manifest-192x192.png'
            });
        });
    });
};

// Send notifications for upcoming events (next 7 days)
const sendUpcomingNotifications = (events: CalendarMonthlyEvent[]) => {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    events.forEach(event => {
        const eventDate = new Date(event.date);
        const diffMs = eventDate.getTime() - now.getTime();
        const daysUntil = Math.round(diffMs / (1000 * 60 * 60 * 24));
        if (daysUntil <= 0 || daysUntil > 7) return;
        const label = event.type === 'birthday' ? '\u{1F382} Birthday' : 'Remembrance \u{1F490}';
        const dayText = daysUntil === 1 ? 'tomorrow' : `in ${daysUntil} days`;
        showNotification('Upcoming Family Event', {
            body: `${event.name}'s ${label} is ${dayText}`,
            icon: '/web-app-manifest-192x192.png',
            badge: '/web-app-manifest-192x192.png'
        });
    });
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
                return true;
            }
        }
        return false;
    };

    const checkAndSendUpcomingNotifications = (
        tomorrowEvents: CalendarMonthlyEvent[],
        thisWeekEvents: CalendarMonthlyEvent[]
    ) => {
        const upcomingEvents = [...tomorrowEvents, ...thisWeekEvents];
        if (upcomingEvents.length === 0) return false;

        const today = new Date().toDateString();
        const lastUpcomingDate = localStorage.getItem('lastUpcomingNotificationDate');
        if (lastUpcomingDate === today) return false;

        if (typeof window === 'undefined') return false;
        requestAndSend(() => sendUpcomingNotifications(upcomingEvents));
        localStorage.setItem('lastUpcomingNotificationDate', today);
        return true;
    };

    return {
        checkAndSendNotifications,
        checkAndSendUpcomingNotifications,
    };
};