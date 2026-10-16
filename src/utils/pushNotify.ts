import webpush from "web-push";
import moment from "moment-timezone";
import prisma from "@/db/db";

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:admin@example.com";

if (vapidPublicKey && vapidPrivateKey) {
    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

interface TodayEvent {
    name: string;
    type: "birthday" | "deathday";
}

const getCurrentIndiaDate = () =>
    new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

async function getTodayEventsByAuthId(authIds: number[]): Promise<Map<number, TodayEvent[]>> {
    const today = getCurrentIndiaDate();
    const month = today.getMonth() + 1;
    const date = today.getDate();

    const members = await prisma.member.findMany({
        where: {
            authId: { in: authIds },
            verified: true,
            OR: [
                { birthMonth: month, birthDate: date },
                { deathMonth: month, deathDate: date },
            ],
        },
        select: { authId: true, name: true, birthMonth: true, birthDate: true, deathMonth: true, deathDate: true },
    });

    const eventsByAuth = new Map<number, TodayEvent[]>();
    for (const member of members) {
        const events: TodayEvent[] = [];
        if (member.birthMonth === month && member.birthDate === date) {
            events.push({ name: member.name, type: "birthday" });
        }
        if (member.deathMonth === month && member.deathDate === date) {
            events.push({ name: member.name, type: "deathday" });
        }
        const existing = eventsByAuth.get(member.authId) || [];
        eventsByAuth.set(member.authId, [...existing, ...events]);
    }
    return eventsByAuth;
}

const describeEvent = (event: TodayEvent) =>
    `${event.name} (${event.type === "birthday" ? "\u{1F382} Birthday" : "Remembrance \u{1F490}"})`;

// Sends one web push notification per family (Auth) that has a birthday or
// deathday today, to every device that family has subscribed from. Removes
// subscriptions the push service reports as gone (404/410 — uninstalled app,
// revoked permission, etc).
export async function sendTodayEventNotifications(): Promise<{ authsNotified: number; devicesNotified: number; subscriptionsRemoved: number }> {
    if (!vapidPublicKey || !vapidPrivateKey) {
        console.error("[push] VAPID keys are not configured; skipping notification run.");
        return { authsNotified: 0, devicesNotified: 0, subscriptionsRemoved: 0 };
    }

    const subscriptions = await prisma.pushSubscription.findMany();
    if (subscriptions.length === 0) {
        return { authsNotified: 0, devicesNotified: 0, subscriptionsRemoved: 0 };
    }

    const authIds = [...new Set(subscriptions.map(s => s.authId))];
    const eventsByAuth = await getTodayEventsByAuthId(authIds);

    let authsNotified = 0;
    let devicesNotified = 0;
    const deadSubscriptionIds: number[] = [];

    for (const [authId, events] of eventsByAuth) {
        if (events.length === 0) continue;
        authsNotified += 1;

        const title = events.length === 1 ? "Family Calendar Reminder" : "Family Calendar Reminders";
        const body = events.map(describeEvent).join(", ");
        const payload = JSON.stringify({
            title,
            body: `Today: ${body}`,
            url: "/",
        });

        const subsForAuth = subscriptions.filter(s => s.authId === authId);
        await Promise.all(
            subsForAuth.map(async sub => {
                try {
                    await webpush.sendNotification(
                        {
                            endpoint: sub.endpoint,
                            keys: { p256dh: sub.p256dh, auth: sub.authKey },
                        },
                        payload
                    );
                    devicesNotified += 1;
                } catch (err: any) {
                    if (err?.statusCode === 404 || err?.statusCode === 410) {
                        deadSubscriptionIds.push(sub.id);
                    } else {
                        console.error(`[push] Failed to send to subscription ${sub.id}:`, err?.message || err);
                    }
                }
            })
        );
    }

    if (deadSubscriptionIds.length > 0) {
        await prisma.pushSubscription.deleteMany({ where: { id: { in: deadSubscriptionIds } } });
    }

    return { authsNotified, devicesNotified, subscriptionsRemoved: deadSubscriptionIds.length };
}

// --- In-process daily scheduler ---------------------------------------
// This app runs as a standalone, long-lived Node server (next.config.mjs
// `output: "standalone"`), so it can schedule its own daily job instead of
// requiring an external cron to be wired up. Time defaults to 8:00 AM IST,
// overridable via NOTIFICATION_HOUR / NOTIFICATION_MINUTE. The GET
// /api/cron/notifications route remains available for deployments (e.g.
// multi-instance/serverless) where an external scheduler is preferred.

const NOTIFICATION_HOUR = Number(process.env.NOTIFICATION_HOUR ?? 8);
const NOTIFICATION_MINUTE = Number(process.env.NOTIFICATION_MINUTE ?? 0);

function msUntilNextRun(): number {
    const now = moment.tz("Asia/Kolkata");
    const next = now.clone().set({ hour: NOTIFICATION_HOUR, minute: NOTIFICATION_MINUTE, second: 0, millisecond: 0 });
    if (next.isSameOrBefore(now)) next.add(1, "day");
    return next.diff(now);
}

declare const globalThis: { pushSchedulerStarted?: boolean } & typeof global;

export function startDailyNotificationScheduler() {
    if (globalThis.pushSchedulerStarted) return;
    globalThis.pushSchedulerStarted = true;

    const runAndReschedule = async () => {
        try {
            const result = await sendTodayEventNotifications();
            console.log("[push] Daily notification run:", result);
        } catch (err) {
            console.error("[push] Daily notification run failed:", err);
        }
        setTimeout(runAndReschedule, 24 * 60 * 60 * 1000);
    };

    const delay = msUntilNextRun();
    setTimeout(runAndReschedule, delay);
    console.log(`[push] Daily notification scheduler started; next run in ${Math.round(delay / 60000)} min.`);
}
