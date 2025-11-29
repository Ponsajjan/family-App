interface CalendarMonthlyEvent {
    id: string;
    name: string;
    date: Date;
    type: 'birthday' | 'deathday';
    hasDate: boolean;
    age: number | string;
}

// Function to send push notification
export const sendNotification = (events: CalendarMonthlyEvent[]) => {
    if (typeof window === 'undefined') return;

    if ('Notification' in window) {
        const sendNotifications = (permission: NotificationPermission) => {
            if (permission === 'granted') {
                events.forEach(event => {
                    const eventName = `${event.name} (${(event.type === 'birthday' ? '\u{1F382} Birthday' : 'Remembrance \u{1F490}')})`;
                    new Notification('Family Calendar Reminder', {
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