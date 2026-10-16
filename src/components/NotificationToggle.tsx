'use client';

import { useEffect, useState } from 'react';
import ToggleSwitch from './ToggleSwitch';
import { Notification as NotificationIcon } from '@/utils/Icons';
import { useToast } from './Toast';
import {
    getPushNotificationStatus,
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    type PushNotificationStatus,
} from '@/utils/notificationUtils';

export default function NotificationToggle() {
    const toast = useToast();
    const [status, setStatus] = useState<PushNotificationStatus | 'loading'>('loading');
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        getPushNotificationStatus().then(setStatus);
    }, []);

    const handleToggle = async () => {
        if (busy || status === 'loading' || status === 'unsupported') return;

        if (status === 'denied') {
            toast?.show('Notifications are blocked for this site. Enable them in your browser settings to turn this on.', 'warning', 4000);
            return;
        }

        setBusy(true);
        try {
            if (status === 'subscribed') {
                const ok = await unsubscribeFromPushNotifications();
                setStatus(ok ? 'unsubscribed' : await getPushNotificationStatus());
            } else {
                const ok = await subscribeToPushNotifications();
                if (ok) {
                    setStatus('subscribed');
                } else {
                    setStatus(await getPushNotificationStatus());
                    toast?.show('Could not enable notifications. Please try again.', 'error', 3000);
                }
            }
        } finally {
            setBusy(false);
        }
    };

    if (status === 'unsupported') return null;

    return (
        <div className="bg-field_color shadow-md border border-border_color rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl flex items-center font-medium md:font-semibold">
                    Event Notifications
                </h2>
                <ToggleSwitch
                    isActive={status === 'subscribed'}
                    onChange={handleToggle}
                    label="Toggle event notifications"
                    className={busy || status === 'loading' ? 'opacity-55 cursor-wait' : ''}
                />
            </div>
            <p className="mt-2 opacity-65 text-sm">
                Receive push notifications for birthdays and remembrances on their respective dates.
            </p>
        </div>
    );
}
