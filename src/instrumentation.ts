export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { startDailyNotificationScheduler } = await import("@/utils/pushNotify");
        startDailyNotificationScheduler();
    }
}
